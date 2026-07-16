"use client";

import {
  CardStackIcon as CreditCard,
  CodeIcon as Hash,
  DotFilledIcon as CircleDot,
  EnvelopeClosedIcon as Mail,
  TokensIcon as Banknote,
} from "@radix-ui/react-icons";

import { Badge } from "@repo/ui/badge";
import { RecordView, type RecordField } from "@repo/ui/record-view";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const data: Payment[] = [
  { id: "p_001", amount: 199, status: "success", email: "ava@example.com" },
  { id: "p_002", amount: 49, status: "pending", email: "haruto@example.com" },
  { id: "p_003", amount: 899, status: "processing", email: "lena@example.com" },
  { id: "p_004", amount: 1299, status: "success", email: "chidi@example.com" },
  { id: "p_005", amount: 12, status: "failed", email: "mia@example.com" },
];

const statusVariant: Record<
  Payment["status"],
  "success" | "warning" | "secondary" | "destructive"
> = {
  success: "success",
  processing: "secondary",
  pending: "warning",
  failed: "destructive",
};

const fields: RecordField<Payment>[] = [
  { key: "email", label: "Email", icon: Mail, editable: true, required: true, copyable: true, width: 240, group: "General", hideInTable: true },
  {
    key: "id",
    label: "Payment ID",
    icon: Hash,
    group: "General",
    render: (row) => <span className="font-mono">{row.id}</span>,
  },
  {
    key: "status",
    label: "Status",
    icon: CircleDot,
    group: "General",
    render: (row) => (
      <Badge variant={statusVariant[row.status]} className="capitalize">
        {row.status}
      </Badge>
    ),
  },
  {
    key: "amount",
    label: "Amount",
    icon: Banknote,
    align: "right",
    group: "System",
    render: (row) => (
      <span className="tabular-nums">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(row.amount)}
      </span>
    ),
  },
];

export function UsersTable() {
  return (
    <RecordView
      title="Payments"
      singular="Payment"
      icon={CreditCard}
      fields={fields}
      initialData={data}
      getPrimary={(row) => ({
        title: row.email,
        subtitle: row.id,
        initials: row.email.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={(): Payment => ({
        id: `p_${Date.now()}`,
        amount: 0,
        status: "pending",
        email: "",
      })}
    />
  );
}
