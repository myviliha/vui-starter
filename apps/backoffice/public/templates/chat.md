Build a page: Chat (ChatGPT-style assistant)

Route:        /chat  (client page — metadata in a sibling layout.tsx)
Nav:          add to nav-config.ts under the "shadcn/ui" section.
Page frame:   flex h-full flex-col -> action header with <Breadcrumbs/> ->
              content min-h-0 flex-1 (two-pane).

Layout (clean, enterprise, ChatGPT-like):
  - Left (w-64, bg-muted): "New chat" button + scrollable conversation history.
  - Main: a centered (max-w-3xl) scrolling column of messages, then a composer.

Messages:     avatar (You / AI) + role label + text; assistant vs user differ by
              avatar color only. No colored bubbles — keep it clean.
Composer:     rounded-2xl bordered box holding an auto-growing <textarea>
              (Enter sends, Shift+Enter = newline), an attach (+) button (left),
              and a primary send icon button (right). focus-within highlights it.

Attachments (images + files):
  - Hidden <input type="file" multiple accept="image/*,.pdf,..."> triggered by +.
  - Pending attachments show as chips above the textarea (image -> thumbnail,
    else file icon + name + size) each with a remove (x).
  - On send, attachments attach to the user message: images render as
    thumbnails, files as downloadable chips.
  - Use URL.createObjectURL for previews (demo). ponytail: swap for real uploads.

Data model:
  Attachment { id, name, size, url, isImage }
  Msg        { id, role: "user" | "assistant", text, attachments: Attachment[] }
  Chat       { id, title, messages: Msg[] }   // title from first user message

Responses:    canned assistant echo so the UI feels live. ponytail: replace with
              a Claude API call (claude-opus-4-8 / claude-sonnet-5).
Building blocks:  Button, cn, Breadcrumbs, SetPageTitle. Radix icons only
                  (PlusIcon attach, PaperPlaneIcon send, Pencil1Icon new chat,
                  FileIcon, Cross2Icon). No chat/upload dependency.

Test scenarios (happy / unhappy):
  TC-1  Type + Enter                 -> user message + assistant reply appended, scrolls down
  TC-2  Shift+Enter                  -> newline, does NOT send
  TC-3  Attach an image              -> thumbnail chip in composer, then in the sent message
  TC-4  Attach a file, remove it     -> chip disappears, not sent
  TC-5  Send empty with no files     -> Send disabled, nothing added
  TC-6  New chat                     -> fresh conversation, prior one kept in history

Done when: centered thread, auto-grow composer, image + file attachments with
preview/remove, New chat history, canned reply, the scenarios above pass,
tokens, light + dark, a11y, lint + types + build pass.
