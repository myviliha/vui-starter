import { describe, expect, it } from "vitest";

import { share } from "./use-async-options";

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
