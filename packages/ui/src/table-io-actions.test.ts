import { describe, expect, it } from "vitest";

import { type IoAction } from "./config";
import {
  defaultExportActions,
  defaultImportActions,
  resolveIoActions,
} from "./table-io-actions";

type Row = { id: number; name: string };
const ids = (list: IoAction<Row>[]) => list.map((a) => a.id);
const makeEmptyRow = () => ({ id: 0, name: "" });
let n = 1;
const nextId = () => n++;

describe("shipped import/export menus", () => {
  it("exports the four formats the browser can produce", () => {
    expect(ids(defaultExportActions<Row>())).toEqual([
      "csv",
      "excel",
      "json",
      "pdf",
    ]);
  });

  it("offers nothing to import into a read-only list", () => {
    // No row factory means there is nowhere to put imported rows.
    expect(defaultImportActions<Row>(undefined, nextId)).toEqual([]);
  });

  it("asks for a file, and says which kinds it reads", () => {
    const actions = defaultImportActions<Row>(makeEmptyRow, nextId);
    expect(ids(actions)).toEqual(["csv", "json", "excel"]);
    for (const action of actions) {
      expect(action.pickFile, action.id).toBe(true);
      expect(action.accept, action.id).toBeTruthy();
    }
  });
});

describe("resolveIoActions", () => {
  const defaults = defaultExportActions<Row>();
  const toApi: IoAction<Row> = {
    id: "api",
    label: "Send to accounting",
    onAct: () => {},
  };

  it("keeps the shipped menu when nothing is configured", () => {
    expect(ids(resolveIoActions(defaults, undefined))).toEqual(ids(defaults));
  });

  it("adds to the shipped menu through the function form", () => {
    expect(ids(resolveIoActions(defaults, (d) => [...d, toApi]))).toEqual([
      ...ids(defaults),
      "api",
    ]);
  });

  it("replaces it outright with an array, for an API-only export", () => {
    expect(ids(resolveIoActions(defaults, [toApi]))).toEqual(["api"]);
  });

  it("can empty the menu, which hides it", () => {
    expect(resolveIoActions(defaults, [])).toEqual([]);
  });
});
