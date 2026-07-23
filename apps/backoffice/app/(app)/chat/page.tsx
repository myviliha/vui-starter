"use client";

import * as React from "react";
import {
  ChatBubbleIcon,
  Cross2Icon,
  FileIcon,
  PaperPlaneIcon,
  Pencil1Icon,
  PlusIcon,
} from "@radix-ui/react-icons";

import { cn } from "@viliha/vui-ui/utils";
import { Button } from "@viliha/vui-ui/button";
import { Breadcrumbs } from "@/app/_components/breadcrumbs";
import { SetPageTitle } from "@/app/_components/set-page-title";

type Attachment = { id: number; name: string; size: number; url: string; isImage: boolean };
type Msg = { id: number; role: "user" | "assistant"; text: string; attachments: Attachment[] };
type Chat = { id: number; title: string; messages: Msg[] };

const WELCOME: Msg = {
  id: 0,
  role: "assistant",
  text: "Hi! I'm your assistant. Ask me anything, or attach an image or file and I'll take a look.",
  attachments: [],
};

const FIRST_CHAT: Chat = { id: 1, title: "New chat", messages: [WELCOME] };
const SEED: Chat[] = [FIRST_CHAT];

const humanSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

let uid = 100;
const nextId = () => ++uid;

export default function ChatPage() {
  const [chats, setChats] = React.useState<Chat[]>(SEED);
  const [activeId, setActiveId] = React.useState(FIRST_CHAT.id);
  const [draft, setDraft] = React.useState("");
  const [pending, setPending] = React.useState<Attachment[]>([]);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const taRef = React.useRef<HTMLTextAreaElement>(null);

  const active = chats.find((c) => c.id === activeId) ?? FIRST_CHAT;

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [active.messages.length, activeId]);

  // Auto-grow the composer up to a few lines.
  React.useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [draft]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: Attachment[] = Array.from(files).map((f) => ({
      id: nextId(),
      name: f.name,
      size: f.size,
      url: URL.createObjectURL(f), // ponytail: object URL for demo preview; swap for an upload URL
      isImage: f.type.startsWith("image/"),
    }));
    setPending((prev) => [...prev, ...next]);
  };
  const removePending = (id: number) =>
    setPending((prev) => prev.filter((a) => a.id !== id));

  const newChat = () => {
    const chat: Chat = { id: nextId(), title: "New chat", messages: [WELCOME] };
    setChats((prev) => [chat, ...prev]);
    setActiveId(chat.id);
    setDraft("");
    setPending([]);
  };

  const send = () => {
    const text = draft.trim();
    if (!text && pending.length === 0) return;
    const userMsg: Msg = { id: nextId(), role: "user", text, attachments: pending };
    const reply: Msg = {
      id: nextId(),
      role: "assistant",
      // ponytail: canned echo so the UI feels live; replace with a Claude API call.
      text: pending.length
        ? `Got your ${pending.length} attachment${pending.length > 1 ? "s" : ""}. This is a demo response — wire this to the Claude API to make it real.`
        : "This is a demo response — wire this composer to the Claude API to make it real.",
      attachments: [],
    };
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              title: c.title === "New chat" && text ? text.slice(0, 40) : c.title,
              messages: [...c.messages, userMsg, reply],
            }
          : c,
      ),
    );
    setDraft("");
    setPending([]);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <SetPageTitle title="Chat" icon={ChatBubbleIcon} />
      <div className="flex h-12 shrink-0 items-center border-b border-border px-4">
        <Breadcrumbs />
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Conversation history */}
        <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-muted/20">
          <div className="p-3">
            <Button className="w-full justify-start" onClick={newChat}>
              <Pencil1Icon className="size-4" />
              New chat
            </Button>
          </div>
          <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-2">
            {chats.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "flex w-full items-center gap-2 truncate rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-accent/60",
                  c.id === activeId && "bg-accent",
                )}
              >
                <ChatBubbleIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{c.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Conversation */}
        <section className="flex min-w-0 flex-1 flex-col">
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-6">
              {active.messages.map((m) => (
                <MessageRow key={m.id} msg={m} />
              ))}
            </div>
          </div>

          {/* Composer */}
          <div className="shrink-0 px-4 pb-4">
            <div className="mx-auto max-w-3xl">
              <div className="rounded-2xl border border-border bg-card shadow-sm focus-within:border-[var(--button-primary)]">
                {pending.length > 0 && (
                  <div className="flex flex-wrap gap-2 border-b border-border p-2.5">
                    {pending.map((a) => (
                      <AttachmentChip key={a.id} a={a} onRemove={() => removePending(a.id)} />
                    ))}
                  </div>
                )}
                <textarea
                  ref={taRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder="Message the assistant…"
                  aria-label="Message"
                  className="block max-h-40 w-full resize-none bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none"
                />
                <div className="flex items-center justify-between p-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    aria-label="Attach files"
                    title="Attach images or files"
                    className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <PlusIcon className="size-5" />
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
                    className="hidden"
                    onChange={(e) => {
                      addFiles(e.target.files);
                      e.target.value = ""; // allow re-selecting the same file
                    }}
                  />
                  <Button
                    variant="primary"
                    size="icon"
                    onClick={send}
                    disabled={!draft.trim() && pending.length === 0}
                    aria-label="Send"
                  >
                    <PaperPlaneIcon className="size-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Demo interface — responses are canned. Attachments stay in your
                browser.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MessageRow({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <div className="flex gap-3">
      <span
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold",
          isUser
            ? "bg-[var(--button-primary)] text-[var(--button-primary-foreground)]"
            : "bg-muted text-foreground",
        )}
      >
        {isUser ? "You" : "AI"}
      </span>
      <div className="min-w-0 flex-1 pt-1">
        <div className="mb-1 text-xs font-medium text-muted-foreground">
          {isUser ? "You" : "Assistant"}
        </div>
        {msg.attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {msg.attachments.map((a) =>
              a.isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={a.id}
                  src={a.url}
                  alt={a.name}
                  className="size-28 rounded-lg border border-border object-cover"
                />
              ) : (
                <a
                  key={a.id}
                  href={a.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:bg-accent/40"
                >
                  <FileIcon className="size-4 text-muted-foreground" />
                  <span className="max-w-48 truncate">{a.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {humanSize(a.size)}
                  </span>
                </a>
              ),
            )}
          </div>
        )}
        {msg.text && (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
        )}
      </div>
    </div>
  );
}

function AttachmentChip({ a, onRemove }: { a: Attachment; onRemove: () => void }) {
  return (
    <span className="group relative flex items-center gap-2 rounded-lg border border-border bg-background py-1.5 pl-1.5 pr-7 text-sm">
      {a.isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.url} alt={a.name} className="size-8 rounded object-cover" />
      ) : (
        <span className="grid size-8 place-items-center rounded bg-muted">
          <FileIcon className="size-4 text-muted-foreground" />
        </span>
      )}
      <span className="flex flex-col">
        <span className="max-w-40 truncate text-xs font-medium">{a.name}</span>
        <span className="text-[11px] text-muted-foreground">{humanSize(a.size)}</span>
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${a.name}`}
        className="absolute right-1.5 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <Cross2Icon className="size-3.5" />
      </button>
    </span>
  );
}
