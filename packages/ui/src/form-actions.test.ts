import { describe, expect, it } from "vitest";

import {
  filterUserPreferences,
  mergeConfig,
  vuiPreset,
  type FormAction,
} from "./config";
import {
  actionRequiresValid,
  defaultFormActions,
  resolveFormActions,
} from "./form-actions";

type Row = { id: number; name: string };
const ids = (actions: FormAction<Row>[]) => actions.map((a) => a.id);

describe("defaultFormActions", () => {
  it("edits with Cancel + Save", () => {
    expect(ids(defaultFormActions({ readOnly: false, canEdit: true }))).toEqual([
      "cancel",
      "save",
    ]);
  });

  it("views with Close, and adds Edit only when editing is allowed", () => {
    expect(ids(defaultFormActions({ readOnly: true, canEdit: true }))).toEqual([
      "close",
      "edit",
    ]);
    expect(ids(defaultFormActions({ readOnly: true, canEdit: false }))).toEqual([
      "close",
    ]);
  });
});

describe("resolveFormActions", () => {
  const defaults = defaultFormActions<Row>({ readOnly: false, canEdit: true });
  const saveNew: FormAction<Row> = {
    id: "save-new",
    label: "Save & New",
    onAct: () => false,
  };

  it("keeps the shipped pair when nothing is configured", () => {
    expect(ids(resolveFormActions(defaults, undefined))).toEqual([
      "cancel",
      "save",
    ]);
  });

  it("extends the defaults through the function form", () => {
    expect(ids(resolveFormActions(defaults, (d) => [...d, saveNew]))).toEqual([
      "cancel",
      "save",
      "save-new",
    ]);
  });

  it("replaces them outright when given an array", () => {
    expect(ids(resolveFormActions(defaults, [saveNew]))).toEqual(["save-new"]);
  });
});

describe("actionRequiresValid", () => {
  it("validates the primary action and nothing else by default", () => {
    const [cancel, save] = defaultFormActions<Row>({
      readOnly: false,
      canEdit: true,
    });
    expect(actionRequiresValid(save!)).toBe(true);
    expect(actionRequiresValid(cancel!)).toBe(false);
  });

  it("lets an action say so explicitly either way", () => {
    const a: FormAction<Row> = {
      id: "a",
      label: "A",
      variant: "primary",
      requiresValid: false,
      onAct: () => {},
    };
    expect(actionRequiresValid(a)).toBe(false);
    expect(actionRequiresValid({ ...a, requiresValid: true })).toBe(true);
  });
});

describe("mergeConfig", () => {
  it("overrides only the keys a later config sets", () => {
    const merged = mergeConfig(
      { form: { actions: [] } },
      { form: {} }, // mentions the section but not the key
    );
    expect(merged.form?.actions).toEqual([]);
  });

  it("ignores undefined layers", () => {
    expect(mergeConfig(undefined, { form: { actions: [] } }, undefined)).toEqual({
      form: { actions: [] },
    });
  });
});

describe("filterUserPreferences", () => {
  it("keeps only the keys the app opened up", () => {
    const kept = filterUserPreferences(
      { behaviour: { rowClick: "edit", closeOnSave: false } },
      { behaviour: ["rowClick"] },
    );
    expect(kept).toEqual({ behaviour: { rowClick: "edit" } });
  });

  it("drops a whole section the app never opened", () => {
    expect(
      filterUserPreferences({ behaviour: { rowClick: "edit" } }, {}),
    ).toEqual({});
  });

  it("layers under the app config: preset, then app, then the user", () => {
    const resolved = mergeConfig(
      vuiPreset,
      { behaviour: { rowClick: "edit", flashMs: 500 } },
      filterUserPreferences(
        { behaviour: { rowClick: "none", flashMs: 0 } },
        { behaviour: ["flashMs"] }, // only the highlight is theirs to change
      ),
    );
    expect(resolved.behaviour).toMatchObject({
      rowClick: "edit", // app's choice stands; the user may not touch it
      flashMs: 0, // the user's choice wins on a key they own
      confirmDelete: true, // untouched preset default
    });
  });
});
