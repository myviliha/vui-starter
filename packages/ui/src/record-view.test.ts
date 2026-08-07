import { describe, expect, it } from "vitest";

import {
  emptyStateLabel,
  fieldStacked,
  groupSlots,
  formatPhone,
  isAsyncLabeled,
  orderedGroups,
  showEditActions,
  validateField,
  type RecordField,
} from "./record-view";
import { type FormSlot } from "./config";

describe("validateField", () => {
  type Row = {
    id: number;
    name: string;
    code: string;
    age: string;
    hq: boolean;
  };
  const F = (over: Partial<RecordField<Row>>): RecordField<Row> =>
    ({
      key: "name",
      label: "Name",
      editable: true,
      ...over,
    }) as RecordField<Row>;
  const row = {} as Row;

  it("flags a required empty value, passes an optional empty one", () => {
    expect(validateField(F({ required: true }), "", row)).toMatch(/required/i);
    expect(validateField(F({}), "", row)).toBeUndefined();
  });

  it("enforces min/max as text length by default", () => {
    const f = F({ min: 3, max: 5 });
    expect(validateField(f, "ab", row)).toMatch(/at least 3/);
    expect(validateField(f, "abcdef", row)).toMatch(/at most 5/);
    expect(validateField(f, "abcd", row)).toBeUndefined();
  });

  it("enforces min/max as numeric value for input:number", () => {
    const f = F({
      key: "age",
      label: "Age",
      input: "number",
      min: 1,
      max: 120,
    });
    expect(validateField(f, "0", row)).toMatch(/at least 1/);
    expect(validateField(f, "130", row)).toMatch(/at most 120/);
    expect(validateField(f, "40", row)).toBeUndefined();
  });

  it("checks pattern, email and phone formats", () => {
    expect(
      validateField(
        F({ pattern: /^[A-Za-z0-9]+$/, patternMessage: "alnum" }),
        "a-b",
        row,
      ),
    ).toBe("alnum");
    expect(validateField(F({ format: "email" }), "nope", row)).toMatch(
      /email/i,
    );
    expect(
      validateField(F({ format: "email" }), "a@b.co", row),
    ).toBeUndefined();
    expect(validateField(F({ format: "phone" }), "(123) 456-789", row)).toMatch(
      /phone/i,
    );
    expect(
      validateField(F({ format: "phone" }), "(123) 456-7890", row),
    ).toBeUndefined();
  });

  it("trims before validating when trim is set", () => {
    // "  ab  " → "ab" (len 2) fails min 3; without trim the spaces would pass.
    expect(validateField(F({ trim: true, min: 3 }), "  ab  ", row)).toMatch(
      /at least 3/,
    );
  });

  it("runs a custom validate last", () => {
    const f = F({ validate: (v) => (v === "taken" ? "In use" : undefined) });
    expect(validateField(f, "taken", row)).toBe("In use");
    expect(validateField(f, "free", row)).toBeUndefined();
  });

  it("multiple: required means at least one; length rules don't apply", () => {
    // String([]) === "" → required fails; String(["a"]) === "a" → passes.
    const req = F({ multiple: true, required: true, min: 5 });
    expect(validateField(req, String([]), row)).toMatch(/required/i);
    expect(validateField(req, String(["a"]), row)).toBeUndefined();
    // Optional multi is always valid, and min/max never fire.
    expect(
      validateField(F({ multiple: true, min: 5 }), String([]), row),
    ).toBeUndefined();
  });
});

describe("formatPhone", () => {
  it("formats US phone digits progressively", () => {
    expect(formatPhone("12")).toBe("12");
    expect(formatPhone("1234")).toBe("(123) 4");
    expect(formatPhone("1234567")).toBe("(123) 456-7");
    expect(formatPhone("12345678901")).toBe("(123) 456-7890"); // capped at 10
    expect(formatPhone("(123) 456-7890")).toBe("(123) 456-7890"); // idempotent
  });
});

describe("isAsyncLabeled", () => {
  const noop = async () => [];
  const resolve = async () => null;
  const f = (over: Partial<RecordField<{ id: number; k: string }>>) =>
    ({ key: "k", label: "K", ...over }) as RecordField<{
      id: number;
      k: string;
    }>;

  it("is true only with loadOptions + resolveOption and no static options", () => {
    expect(
      isAsyncLabeled(f({ loadOptions: noop, resolveOption: resolve })),
    ).toBe(true);
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

describe("showEditActions", () => {
  type Row = { id: number; name: string };
  const read: RecordField<Row>[] = [
    { key: "name", label: "Name" },
    { key: "id", label: "Id", editable: false },
  ];

  it("hides Edit when no field is editable", () => {
    expect(showEditActions(read)).toBe(false);
  });

  it("shows Edit as soon as one field is editable", () => {
    expect(
      showEditActions([
        ...read,
        { key: "name", label: "Name", editable: true },
      ]),
    ).toBe(true);
  });

  it("lets the host override either way", () => {
    expect(showEditActions(read, true)).toBe(true);
    expect(
      showEditActions([{ key: "name", label: "Name", editable: true }], false),
    ).toBe(false);
  });
});

describe("groupSlots", () => {
  type Row = { id: number; name: string; email: string; note: string };
  const fields: RecordField<Row>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "note", label: "Note", group: "Extra" },
  ];
  const slot = (over: Partial<FormSlot<Row>>): FormSlot<Row> => ({
    id: "s",
    render: () => null,
    ...over,
  });
  const ids = (m: Map<string, FormSlot<Row>[]>) =>
    Object.fromEntries([...m].map(([k, v]) => [k, v.map((s) => s.id)]));

  it("follows the named field, in that field's own section", () => {
    const s = slot({ id: "hint", after: "email" });
    expect(ids(groupSlots(fields, [s], "General"))).toEqual({ email: ["hint"] });
    expect(ids(groupSlots(fields, [s], "Extra"))).toEqual({});
  });

  it("uses the field's group, not the default one", () => {
    const s = slot({ id: "hint", after: "note" });
    expect(ids(groupSlots(fields, [s], "Extra"))).toEqual({ note: ["hint"] });
    expect(ids(groupSlots(fields, [s], "General"))).toEqual({});
  });

  it("closes out the section when there is nothing to follow", () => {
    expect(ids(groupSlots(fields, [slot({ id: "end" })], "General"))).toEqual({
      "": ["end"],
    });
  });

  it("takes an explicit group, and falls to the end when the field isn't in it", () => {
    const s = slot({ id: "banner", group: "Extra", after: "email" });
    expect(ids(groupSlots(fields, [s], "Extra"))).toEqual({ "": ["banner"] });
  });

  it("keeps several slots on one field in order", () => {
    const list = [slot({ id: "a", after: "name" }), slot({ id: "b", after: "name" })];
    expect(ids(groupSlots(fields, list, "General"))).toEqual({ name: ["a", "b"] });
  });
});

describe("fieldStacked", () => {
  type Row = { id: number; name: string };
  const F = (over: Partial<RecordField<Row>> = {}): RecordField<Row> => ({
    key: "name",
    label: "Name",
    ...over,
  });

  it("follows the form's choice when the field says nothing", () => {
    expect(fieldStacked(F(), false)).toBe(false);
    expect(fieldStacked(F(), true)).toBe(true);
  });

  it("lets one field differ from the rest of the form", () => {
    expect(fieldStacked(F({ layout: "stacked" }), false)).toBe(true);
    expect(fieldStacked(F({ layout: "inline" }), true)).toBe(false);
  });

  it("stacks a full-width field whatever anyone asked for", () => {
    // A label beside a control that fills the row leaves it nowhere to go.
    expect(fieldStacked(F({ fullWidth: true }), false)).toBe(true);
    expect(fieldStacked(F({ fullWidth: true, layout: "inline" }), false)).toBe(
      true,
    );
  });
});
