import type { Metadata } from "next";

import {
  CodeBlock,
  DocPager,
  H2,
  H3,
  InlineCode,
  Note,
  P,
  PageTitle,
  Ul,
} from "@/components/doc";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/chat/" },
  title: "Chat",
  description:
    "A two-pane messaging page — conversation list, message thread, and composer — composed entirely from Input, Button and cn. A shadcn/ui-style feature built on VUI tokens.",
};

export default function ChatDocPage() {
  return (
    <article>
      <PageTitle
        eyebrow="Guides"
        title="Chat"
        lead="A messaging demo at /chat: a searchable conversation list on the left, a message thread with sent/received bubbles on the right, and a composer that pins the thread to the newest message. No chat library — just Input, Button, cn and a little state."
      />

      <H2>See it live</H2>
      <P>
        Open <a href="/chat" className="font-medium text-foreground underline">/chat</a>{" "}
        (sidebar → shadcn/ui → Chat). Pick a conversation, type a message, press
        Enter or Send.
      </P>

      <H2>Anatomy</H2>
      <Ul>
        <li>
          <strong>Conversation list</strong> — a search <InlineCode>Input</InlineCode>{" "}
          plus one button per conversation (avatar initials, name, last message,
          time). The active row is tinted with <InlineCode>bg-accent</InlineCode>.
        </li>
        <li>
          <strong>Thread</strong> — a header with the contact, then a scrolling
          column of bubbles. Sent messages use the primary token and align right;
          received ones use a bordered card and align left.
        </li>
        <li>
          <strong>Composer</strong> — an <InlineCode>Input</InlineCode> +{" "}
          primary Send. Enter sends; empty messages are blocked.
        </li>
      </Ul>

      <H2>Data</H2>
      <CodeBlock title="model">{`type Msg = { id: number; from: "me" | "them"; text: string; time: string };
type Convo = {
  id: number;
  name: string;
  role: string;
  color: string;   // avatar bg (static Tailwind class)
  messages: Msg[];
};`}</CodeBlock>

      <H3>Auto-scroll</H3>
      <P>
        A <InlineCode>ref</InlineCode> on the thread + an effect keyed on the
        message count keeps it pinned to the latest bubble.
      </P>
      <CodeBlock title="auto-scroll">{`React.useEffect(() => {
  const el = scrollRef.current;
  if (el) el.scrollTop = el.scrollHeight;
}, [active.messages.length, activeId]);`}</CodeBlock>

      <Note title="Swap the demo state for your API">
        Conversations and messages are local state here. Point{" "}
        <InlineCode>setConvos</InlineCode> at your backend (or a socket) and the
        UI is unchanged. Avatar colors follow the same static-Tailwind convention
        as the tab and calendar color labels.
      </Note>

      <DocPager
        prev={{ label: "Using shadcn/ui", href: "/docs/shadcn-ui" }}
        next={{ label: "Support & ticketing", href: "/docs/support" }}
      />
    </article>
  );
}
