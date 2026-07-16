"use client";

import {
  CodeIcon as Hash,
  TokensIcon as Banknote,
  TokensIcon as Coins,
} from "@radix-ui/react-icons";

import { RecordView, type RecordField } from "@myviliha/vui-ui/record-view";
import { currencies, type Currency } from "@/lib/mock-data";

const fields: RecordField<Currency>[] = [
  { key: "name", label: "Name", editable: true, required: true, group: "General", hideInTable: true },
  { key: "code", label: "Code", icon: Hash, editable: true, group: "General" },
  { key: "symbol", label: "Symbol", icon: Banknote, editable: true, group: "General" },
];

export function CurrenciesTable() {
  return (
    <RecordView
      title="Currencies"
      singular="Currency"
      icon={Coins}
      fields={fields}
      initialData={currencies}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.code,
        initials: row.code.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({ id: Date.now(), name: "", code: "", symbol: "" })}
    />
  );
}
