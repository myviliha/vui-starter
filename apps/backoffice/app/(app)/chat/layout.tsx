import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat",
  description: "A two-pane messaging demo — conversation list, thread, composer.",
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
