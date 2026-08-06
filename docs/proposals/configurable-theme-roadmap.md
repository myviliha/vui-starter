# Making the theme configurable: a roadmap

**Status:** slices 0 and 1 shipped in 1.50.0; slices 2 to 4 still proposals · **Written:** 2026-08-06 · **Owner:** Suman Bonakurthi

The ask: a host should be able to change and configure everything, including behaviour. A form
should take any component and any layout, and Save/Cancel should be the host's to define.

This is three separate problems wearing one coat. Each has a different API shape, a different blast
radius, and a different risk of turning `RecordForm` into a framework nobody can read. They are
written here in the order I would build them: each slice is useful on its own, and each one is
shaped so the next one doesn't have to undo it.

## The rule that keeps this from becoming a build-your-own-form kit

Every slice below adds an escape hatch, never a requirement. A `fields` array with no extra config
must keep rendering exactly what it renders today, with the same spacing, the same blue Save, the
same separators. The moment a host has to opt in to get the standard look, the design system has
lost. So each addition is a prop that defaults to current behaviour, and the defaults stay
opinionated.

Two things stay closed on purpose: the token layer (colors, radius, spacing come from `theme.css`,
not per-component props) and the field primitives (a field is still described, not hand-built).
Those are what make twelve screens look like one product.

---

## Slice 1 — The form footer and its actions

**Problem today.** `RecordForm` renders Cancel + Save. The labels are fixed, the order is fixed,
there is no way to add "Save & New" or a Delete, and no way to make Save do something conditional.
A host that needs any of that stops using the component and rebuilds the form, which is how a screen
ends up off-design.

**Shape.** An actions array, plus a footer render escape hatch for the rare case the array can't
express.

```tsx
type FormAction<T> = {
  id: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  /** Runs before close. Return false to keep the form open. */
  onAct: (row: T, ctx: FormActionContext<T>) => boolean | void | Promise<boolean | void>;
  /** Hide or disable per row/mode without removing it from the array. */
  visible?: (ctx: FormActionContext<T>) => boolean;
  disabled?: (ctx: FormActionContext<T>) => boolean;
  /** Blocked by field validation. Default true for the primary action only. */
  requiresValid?: boolean;
  confirm?: { title: string; body?: string };
  align?: "start" | "end"; // Delete on the left, Save on the right
};

type FormActionContext<T> = {
  mode: "create" | "edit" | "view";
  dirty: boolean;
  valid: boolean;
  errors: Map<string, string>;
  close: () => void;
  reset: () => void;
};
```

On `RecordView` / `RecordForm`: `formActions?: FormAction<T>[] | ((defaults: FormAction<T>[]) => FormAction<T>[])`.
The function form is the important one. It hands you the defaults so you can append, reorder or
replace one without restating the pair:

```tsx
formActions={(defaults) => [
  ...defaults,
  { id: "save-new", label: "Save & New", onAct: async (row) => { await save(row); return false; } },
]}
```

`renderFooter?: (ctx) => ReactNode` exists for the case the array genuinely can't express, and it
replaces the footer wholesale. Expect that to be rare; if it isn't, the array is wrong and should be
fixed rather than papered over.

**Risk:** low. Nothing existing changes. Roughly a day, plus docs.

**Done when:** a host adds Save & New, a destructive Delete on the left, and a view-mode-only Close,
without writing any footer markup and with the standard styling intact.

---

## Slice 2 — Form body composition

**Problem today.** The body is `fields` in `group` order, one control per row. A host cannot put a
banner between two fields, span a field across both columns, or split a long form into tabs. `render`
and `renderInput` cover one field's control, not the space around it.

**Shape.** Three additions, smallest first, because the first two probably cover most of it:

1. **Field span and per-field width.** `span?: 1 | 2 | "full"` on `RecordField`, honoured by the
   two-column page layout. This is the most requested thing and it is nearly free.
2. **Content between fields.** Allow a `RecordField[]` entry to be a slot:
   `{ kind: "slot", id, render: (ctx) => ReactNode, span? }`. It flows in field order, inside the
   section, with the same padding as a field row. A discriminated union keeps existing arrays valid.
3. **Section shape.** Today `group` is a string and sections render stacked. Add
   `sections?: FormSection[]` where a section can declare `layout: "stack" | "tabs" | "accordion"`,
   `columns`, `description`, and its own `slot`. `group` keeps working and maps to a default section.

```tsx
type FormSection = {
  id: string;
  title?: string;
  description?: string;
  columns?: 1 | 2;
  collapsible?: boolean;
  fields: string[];           // field keys, in order
  render?: (ctx) => ReactNode; // whole-section takeover
};
```

**Risk:** medium. This touches the render path every form uses, and tabs bring their own questions
(does validation focus a field in a hidden tab? yes, and it must switch to that tab). Two to three
days, and the tab/validation interaction needs its own tests.

**Done when:** a long form splits into tabs, a field spans both columns, and an alert sits between
two fields, all from config, with validation still able to reach a field in a closed tab.

---

## Slice 3 — Behaviour, configured once per app

**Problem today.** Behaviour is hard-wired per component: what Save does, whether Cancel confirms
when dirty, whether a row click opens View, how long the saved-row flash lasts, whether delete
confirms. A host that wants a different convention changes it per screen, or not at all.

**Shape.** A provider holding defaults, with per-instance props still winning:

```tsx
<VuiConfigProvider value={{
  recordView: { rowClick: "view" | "edit" | "none", confirmDelete: true, flashMs: 1600 },
  form: { confirmDiscardWhenDirty: true, closeOnSave: true, validateOn: "blur" | "change" | "submit" },
  table: { density: "comfortable" | "compact", resizableColumns: true },
}}>
```

Resolution order, and it must stay this order: explicit prop → provider value → package default.

The temptation here is a giant config object that becomes its own language. The guard: a key only
earns its place when a real screen needs it and the alternative is the host forking the component.
Start with the handful above, add on demand, and never add a key that only reformats something the
tokens already own.

**Risk:** medium, mostly through scope creep rather than code. The mechanism is small; the
discipline about what goes in it is the work. Two days for the provider plus the first keys.

---

## What I'd need from you before building

1. **Slice 1's action list**, concretely: which actions do your screens actually need beyond Save and
   Cancel? The array's shape should come from real cases, not from what I can imagine.
2. **Slice 2's layouts**, same question: tabs, accordion, spans, or something else? If it is only
   spans and a slot, that halves the work and I would skip the section object entirely for now.
3. **Whether Slice 3 lands before or after Slice 2.** It is independent of both.

## What this deliberately does not include

- A visual form builder or a JSON schema runtime. Config in TypeScript, checked at compile time.
- Per-component style props. Colors, radius and spacing stay in `theme.css`, which is what keeps the
  screens looking like one app.
- Replacing the `fields` array with children. Fields describe data, and that description is what
  drives the table, the filter panel, import/export and the form at once. Hand-built children would
  break all four.
