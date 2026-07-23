import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support",
  description: "A support desk demo — ticket list, detail, status/priority, replies.",
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
