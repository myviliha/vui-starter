import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Live examples of Vui Starter's React components — Button, Badge, Card, Input, Checkbox, Select, Avatar, Dropdown and the RecordView datatable.",
};

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
