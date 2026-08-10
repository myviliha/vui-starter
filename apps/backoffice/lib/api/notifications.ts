// DATA LAYER (API) — the only place that talks to the "backend".
//
// Three-layer architecture (see AGENTS.md → "Architecture: three layers"):
//   data (this file)  →  controller (use-notifications.ts)  →  presentation.
// No React in here, and nothing above it touches raw data.
//
// In-memory mock today. To wire a real API, swap the function bodies for
// `fetch(url, { signal })`; the signatures do not change, so the bell, the
// popup and the page all keep working.

export type NotificationKind =
  | "mention"
  | "assignment"
  | "comment"
  | "system"
  | "billing";

export type Notification = {
  id: number;
  kind: NotificationKind;
  /** Who or what caused it. Rendered bold, ahead of the message. */
  actor: string;
  message: string;
  /** ISO timestamp. Formatted for display in the presentation layer. */
  at: string;
  read: boolean;
  /** Where clicking it should go, when there is somewhere to go. */
  href?: string;
  /** Secondary line: "3 comments", "Invoice #1043", and so on. */
  meta?: string;
};

const now = Date.now();
const minutes = (n: number) => new Date(now - n * 60_000).toISOString();

let rows: Notification[] = [
  {
    id: 1,
    kind: "mention",
    actor: "Priya Raman",
    message: "mentioned you in Acme Retail: can you confirm the billing address before we invoice?",
    at: minutes(4),
    read: false,
    href: "/organizations",
    meta: "Organizations · 2 replies",
  },
  {
    id: 2,
    kind: "assignment",
    actor: "Daniel Osei",
    message: "assigned you the ticket “Export fails for tenants with 10k+ rows”.",
    at: minutes(38),
    read: false,
    href: "/support",
    meta: "Support · High priority",
  },
  {
    id: 3,
    kind: "billing",
    actor: "Billing",
    message: "Invoice #1043 for the Growth plan was paid.",
    at: minutes(190),
    read: false,
    meta: "$149.00 · Visa ending 4242",
  },
  {
    id: 4,
    kind: "comment",
    actor: "Mei Lin",
    message: "commented on the Q3 pipeline review: “moving Northwind to closed-won today.”",
    at: minutes(430),
    read: true,
    href: "/crm/opportunities",
    meta: "Opportunities",
  },
  {
    id: 5,
    kind: "system",
    actor: "System",
    message: "Two new members joined the Platform team.",
    at: minutes(1_500),
    read: true,
    href: "/users",
    meta: "Users",
  },
  {
    id: 6,
    kind: "mention",
    actor: "Tomás Herrera",
    message: "mentioned you in Branches: the Lisbon office opening date moved to 14 September.",
    at: minutes(2_900),
    read: true,
    href: "/branches",
    meta: "Branches",
  },
  {
    id: 7,
    kind: "system",
    actor: "System",
    message: "Your export of 4,120 organizations finished and is ready to download.",
    at: minutes(4_400),
    read: true,
    meta: "Export · CSV",
  },
];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Subscribe to changes, so the bell and an open page agree on the count. */
export function subscribeNotifications(listener: () => void): () => void {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function listNotifications(): Promise<Notification[]> {
  await wait(180); // stand-in for the network, so loading states are visible
  return rows.map((r) => ({ ...r }));
}

export async function markRead(id: number): Promise<void> {
  rows = rows.map((r) => (r.id === id ? { ...r, read: true } : r));
  emit();
}

export async function markAllRead(): Promise<void> {
  rows = rows.map((r) => (r.read ? r : { ...r, read: true }));
  emit();
}

export function unreadCount(items: readonly Notification[]): number {
  return items.reduce((n, r) => n + (r.read ? 0 : 1), 0);
}
