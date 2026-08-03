import { describe, expect, it } from "vitest";

import { emptyStateLabel } from "./record-view";

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
