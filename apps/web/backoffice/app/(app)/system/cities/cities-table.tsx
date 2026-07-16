"use client";

import {
  BookmarkIcon as Flag,
  HomeIcon as Landmark,
  SewingPinFilledIcon as MapPin,
} from "@radix-ui/react-icons";

import { RecordView, type RecordField } from "@viliha/vui-ui/record-view";
import { cities, type City } from "@/lib/mock-data";

const fields: RecordField<City>[] = [
  { key: "name", label: "Name", editable: true, required: true, group: "General", hideInTable: true },
  { key: "state", label: "State", icon: MapPin, editable: true, group: "General" },
  { key: "country", label: "Country", icon: Flag, editable: true, group: "General" },
];

export function CitiesTable() {
  return (
    <RecordView
      title="Cities"
      singular="City"
      icon={Landmark}
      fields={fields}
      initialData={cities}
      getPrimary={(row) => ({
        title: row.name,
        subtitle: row.country,
        initials: row.name.slice(0, 2).toUpperCase(),
      })}
      makeEmptyRow={() => ({ id: Date.now(), name: "", state: "", country: "" })}
    />
  );
}
