import { describe, expect, it } from "vitest";

import { batch, share } from "./use-async-options";

describe("share", () => {
  const opts = [{ value: "1", label: "One" }];

  it("collapses concurrent calls for the same key into one request", async () => {
    const resolveOption = () => {};
    let calls = 0;
    const run = () => {
      calls++;
      return Promise.resolve(opts);
    };

    const a = share(resolveOption, "1", run);
    const b = share(resolveOption, "1", run);
    expect(a).toBe(b);
    expect(await Promise.all([a, b])).toEqual([opts, opts]);
    expect(calls).toBe(1);
  });

  it("keeps different keys and different sources apart", async () => {
    let calls = 0;
    const run = () => {
      calls++;
      return Promise.resolve(opts);
    };
    const one = () => {};
    const two = () => {};

    await Promise.all([
      share(one, "1", run),
      share(one, "2", run), // same source, other value
      share(two, "1", run), // other source, same value
    ]);
    expect(calls).toBe(3);
  });

  it("drops the entry once it settles, so later reads are fresh", async () => {
    const resolveOption = () => {};
    let calls = 0;
    const run = () => {
      calls++;
      return Promise.resolve(opts);
    };

    await share(resolveOption, "1", run);
    await share(resolveOption, "1", run);
    expect(calls).toBe(2);
  });
});

describe("batch", () => {
  it("resolves every id asked for in one tick with a single call", async () => {
    const calls: string[][] = [];
    const resolveOptions = (ids: string[]) => {
      calls.push(ids);
      return Promise.resolve(ids.map((v) => ({ value: v, label: `L${v}` })));
    };

    // What a 4-row table does: each cell asks for its own id in the same commit.
    const rows = await Promise.all([
      batch(resolveOptions, ["a"]),
      batch(resolveOptions, ["b"]),
      batch(resolveOptions, ["a"]),
      batch(resolveOptions, ["c"]),
    ]);

    expect(calls).toEqual([["a", "b", "c"]]); // one request, ids deduped
    expect(rows.map((r) => r.map((o) => o.label))).toEqual([
      ["La"],
      ["Lb"],
      ["La"],
      ["Lc"],
    ]);
  });

  it("starts a new call for the next tick", async () => {
    let calls = 0;
    const resolveOptions = (ids: string[]) => {
      calls++;
      return Promise.resolve(ids.map((v) => ({ value: v, label: v })));
    };

    await batch(resolveOptions, ["a"]);
    await batch(resolveOptions, ["a"]);
    expect(calls).toBe(2);
  });

  it("gives every caller an empty result when the source fails", async () => {
    const resolveOptions = () => Promise.reject(new Error("500"));
    const [a, b] = await Promise.all([
      batch(resolveOptions, ["a"]),
      batch(resolveOptions, ["b"]),
    ]);
    expect([a, b]).toEqual([[], []]);
  });
});
