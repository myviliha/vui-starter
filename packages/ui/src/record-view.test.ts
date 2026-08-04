import { describe, expect, it } from "vitest";

import {
  emptyStateLabel,
  isAsyncLabeled,
  orderedGroups,
  type RecordField,
} from "./record-view";

describe("isAsyncLabeled", () => {
  const noop = async () => [];
  const resolve = async () => null;
  const f = (over: Partial<RecordField<{ id: number; k: string }>>) =>
    ({ key: "k", label: "K", ...over }) as RecordField<{ id: number; k: string }>;

  it("is true only with loadOptions + resolveOption and no static options", () => {
    expect(isAsyncLabeled(f({ loadOptions: noop, resolveOption: resolve }))).toBe(
      true,
    );
  });

  it("is false without resolveOption (can't resolve one value)", () => {
    expect(isAsyncLabeled(f({ loadOptions: noop }))).toBe(false);
  });

  it("is false when static options exist (label comes from them)", () => {
    expect(
      isAsyncLabeled(
        f({ loadOptions: noop, resolveOption: resolve, options: [] }),
      ),
    ).toBe(false);
  });

  it("is false for a plain field", () => {
    expect(isAsyncLabeled(f({}))).toBe(false);
  });
});

describe("orderedGroups", () => {
  type Row = { id: number; a: string; b: string; c: string; d: string };
  const f = (key: keyof Row, group?: string): RecordField<Row> =>
    ({ key, label: key, group }) as RecordField<Row>;

  it("lists groups in first-appearance order", () => {
    expect(
      orderedGroups([f("a", "Contact"), f("b", "Brand"), f("c", "Contact")]),
    ).toEqual(["Contact", "Brand"]);
  });

  it("buckets ungrouped fields under General", () => {
    expect(orderedGroups([f("a"), f("b", "Brand"), f("c")])).toEqual([
      "General",
      "Brand",
    ]);
  });

  it("is empty for no fields", () => {
    expect(orderedGroups<Row>([])).toEqual([]);
  });
});

describe("emptyStateLabel", () => {
  it("reads empty when nothing is filtered", () => {
    expect(emptyStateLabel("", {})).toBe("No records yet.");
  });

  it("names the keyword when a search is active", () => {
    expect(emptyStateLabel("acme", {})).toBe("No results for “acme”.");
  });

  it("reports a filtered empty result for an active per-field filter", () => {
    expect(emptyStateLabel("", { role: "admin" })).toBe("No matching records.");
    expect(emptyStateLabel("", { team: ["ops"] })).toBe("No matching records.");
  });

  it("ignores empty per-field values (no filter really set)", () => {
    expect(emptyStateLabel("", { role: "", team: [] })).toBe("No records yet.");
  });
});
