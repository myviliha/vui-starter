"use client";

import {
  CodeIcon as Hash,
  TokensIcon as Banknote,
  TokensIcon as Coins,
} from "@radix-ui/react-icons";

import { RecordView, type RecordField } from "@viliha/vui-ui/record-view";
import { currencies, type Currency } from "@/lib/mock-data";
import { useClientFilter } from "@/lib/use-client-filter";

const fields: RecordField<Currency>[] = [
  { key: "name", label: "Name", editable: true, required: true, group: "General", hideInTable: true, filterable: true },
  { key: "code", label: "Code", icon: Hash, editable: true, group: "General", filterable: true },
  { key: "symbol", label: "Symbol", icon: Banknote, editable: true, group: "General", filterable: true },
];

export function CurrenciesTable() {
  const { rows, onFilter, onDataChange } = useClientFilter(currencies);
  return (
    <RecordView
      title="Currencies"
      singular="Currency"
      icon={Coins}
      fields={fields}
      initialData={rows}
      data={rows}
      onFilter={onFilter}
      onDataChange={onDataChange}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.code,
        initials: row.code.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({ id: Date.now(), name: "", code: "", symbol: "" })}
    />
  );
}
