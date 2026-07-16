import { describe, expect, it } from "vitest";

import { parseCSV, rowsToCSV, type IoColumn } from "./table-io";

const cols: IoColumn[] = [
  { key: "name", label: "Name" },
  { key: "note", label: "Note" },
];

describe("rowsToCSV", () => {
  it("emits a header row + escapes values with commas/quotes/newlines", () => {
    const csv = rowsToCSV(cols, [
      { name: "Ada", note: "hi, there" },
      { name: 'Say "hi"', note: "line\nbreak" },
    ]);
    const [header, ...body] = csv.split("\n");
    expect(header).toBe("Name,Note");
    // value with a comma is quoted
    expect(body[0]).toContain('"hi, there"');
    // embedded quotes are doubled
    expect(csv).toContain('"Say ""hi"""');
  });

  it("renders empty/nullish cells as empty strings", () => {
    const csv = rowsToCSV(cols, [{ name: "X", note: undefined }]);
    expect(csv.split("\n")[1]).toBe("X,");
  });
});

describe("parseCSV", () => {
  it("round-trips a simple table back to row objects (keyed by header label)", () => {
    const rows = [{ name: "Ada", note: "engineer" }];
    const parsed = parseCSV(rowsToCSV(cols, rows));
    expect(parsed).toEqual([{ Name: "Ada", Note: "engineer" }]);
  });
});
