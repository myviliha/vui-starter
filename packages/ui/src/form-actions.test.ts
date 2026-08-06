import { describe, expect, it } from "vitest";

import { mergeConfig, type FormAction } from "./config";
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
