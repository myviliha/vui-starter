import { describe, expect, it } from "vitest";

import { resolveCurrentId, type Organization } from "./org-switcher";

const orgs: Organization[] = [
  { id: "a", name: "Alpha" },
  { id: "b", name: "Beta" },
];

describe("resolveCurrentId", () => {
  it("keeps a choice that's still available", () => {
    expect(resolveCurrentId(orgs, "b")).toBe("b");
  });

  it("falls back to the first when the choice is gone", () => {
    // Access revoked, or the tenant was deleted while they were away.
    expect(resolveCurrentId(orgs, "gone")).toBe("a");
  });

  it("picks the first when nothing is chosen yet", () => {
    expect(resolveCurrentId(orgs, undefined)).toBe("a");
  });

  it("is undefined while the list is still loading", () => {
    expect(resolveCurrentId([], "a")).toBeUndefined();
    expect(resolveCurrentId([], undefined)).toBeUndefined();
  });
});
