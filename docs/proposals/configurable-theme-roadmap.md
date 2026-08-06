# A theme that ships finished and stays configurable

**Status:** proposal, nothing built yet · **Written:** 2026-08-06 · **Updated:** 2026-08-06 after the
requirement was clarified: preconfigured is a starting point, not a locked mode · **Owner:** Suman
Bonakurthi

## The requirement, as I understand it

The theme ships finished, and nothing about it is locked.

**It ships finished.** Install it, run it, get a working admin app: sidebar, top bar, tabs,
breadcrumbs, five page types, add/edit forms, auth screens. All decided, all consistent, no config
written. That is what ships today and it must not get harder to use.

**Nothing about it is locked.** Starting from that finished app, everything can be changed: which
sections a form has, where its fields sit, what its footer buttons are called and what they do, how a
page frame is built, what a row click does. Piece by piece, without leaving the preconfigured theme
and without rebuilding a screen by hand to change one button.

These are not two products or two modes. Preconfigured is the starting point, not a walled garden.
The distinction that matters is only how far a given host chooses to go.

There are also two kinds of people doing the configuring, and both count:

- **The developer**, at build time, in TypeScript: screens, layouts, form composition, actions.
- **The person using the app**, at runtime, from inside it: density, what a row click does, which
  top-bar affordances they want, saved per browser. The Settings page already does exactly this for
  the seven top-bar features. That mechanism should reach the rest of the theme, for the keys where a
  user preference makes sense.

## The principle that makes this one system

**The preconfigured theme is a config.** Not a different component, not a special case in the code: a
config object that ships with the package and is applied by default.

```
package default  ←  shipped preset  ←  app config  ←  user preferences  ←  per-instance prop
   (fallback)       (the finished     (developer,     (runtime, saved     (one screen,
                     theme)            build time)     per browser)        wins outright)
```

Everything the preset does, a host can do, because the preset uses the same API a host uses. That is
the only honest way to promise "configure everything": if the shipped behaviour can't be expressed in
the config, the config surface is incomplete, and that is a bug rather than a reason to reach past it.

Three consequences worth stating plainly:

1. **The finished theme and a hand-tuned one are the same code path.** No `<ConfigurableRecordForm>`
   beside `<RecordForm>`. One component, reading resolved config.
2. **Overriding is piecemeal.** Change a form's footer without touching its body; change one screen's
   behaviour without adopting a config file for the whole app. Nothing is all-or-nothing.
3. **Config is TypeScript, checked at compile time.** No JSON schema runtime, no visual builder. You
   get autocomplete and a red squiggle when a field key is wrong.

**The user-preference layer** is narrower on purpose. A key is user-editable only when the app opts it
in (`userConfigurable`), because "the end user can move the Save button" is chaos, while "the end user
prefers compact rows" is a feature. For an opted-in key the user's choice beats the app default, which
is how `ChromeConfigProvider` already behaves. A per-instance prop still wins over everything: a screen
that genuinely needs one layout says so and is not overridden by a preference.

## This pattern already exists here, twice

Worth noticing before inventing anything:

- **Scaffold time.** `init --prebuilt` gives you the shell and demo pages; `init --theme-only` gives
  you the wiring and leaves the pages to you. Same idea at install: start finished, or start bare.
- **Runtime.** The seven top-bar affordances resolve `per-instance → localStorage override →
NEXT_PUBLIC_* install default → package default` through `CHROME_DEFAULTS` and
  `ChromeConfigProvider`. That is already the resolution chain above, for one small surface.

So this roadmap extends a pattern the repo already uses rather than introducing a new one. Navigation
(`nav-config.ts`) and the visual layer (`theme.css` tokens) are likewise already data-driven. The gap
is everything between the tokens and the nav: screens, layouts, forms, and behaviour.

---

## The surface, screen by screen

What "all the layouts and screens" covers, and where each stands today.

| Surface                                                              | Today                                     | Needs                                                                 |
| -------------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| Tokens: color, radius, spacing, dark mode                            | `theme.css`                               | done                                                                  |
| Navigation: sidebar sections, groups, order                          | `nav-config.ts` + `route-meta.ts`         | done                                                                  |
| Top bar affordances                                                  | `CHROME_*` + provider                     | done                                                                  |
| Open tabs strip                                                      | env flags (`MAX_TABS`, `KEEP_ALIVE_TABS`) | slots (what renders in a tab label), behaviour keys                   |
| App shell frame: header, sidebar, content, footer                    | fixed composition                         | slots: brand area, header extras, sidebar header/footer, page actions |
| Auth shell                                                           | `AuthHeader` + `SiteFooter`               | slots: above/below the form, footer replacement                       |
| Page type 1, data table                                              | `RecordView` props                        | toolbar composition, row actions, empty/loading slots                 |
| Page type 2, record form                                             | `RecordForm`, 3 variants                  | **footer actions (slice 1)**, **body composition (slice 2)**          |
| Page type 3, dashboard                                               | hand-built frame                          | a declared frame: widget grid, spans, slots                           |
| Page type 4, settings                                                | hand-built frame                          | section list config, footer actions (shares slice 1)                  |
| Page type 5, board                                                   | hand-built frame                          | column config, card slot                                              |
| Page frame itself: breadcrumb bar, title, actions row                | fixed                                     | slots + order                                                         |
| Behaviour: row click, confirm on discard, close on save, validate-on | hard-wired                                | **provider (slice 4)**                                                |

Dashboard, settings and board are "hand-built frames" today: the docs show the markup and each page
copies it. Copied markup is configurable only by editing it, which is exactly what a host should not
have to do to change one thing. They need a declared frame before they can be configured, which is
why they sit in slice 3 rather than slice 1.

---

## Slice 0 — The config spine

Everything else hangs off this, and it is small.

```tsx
// packages/ui/src/config.ts
export type VuiConfig = {
  form?: FormConfig; // slices 1 and 2
  table?: TableConfig;
  page?: PageConfig; // slice 3
  shell?: ShellConfig; // slice 3
  behaviour?: BehaviourConfig; // slice 4
};

export const vuiPreset: VuiConfig; // the finished theme, as a value
export function defineConfig(c: VuiConfig): VuiConfig; // typed helper
export function mergeConfig(...c: VuiConfig[]): VuiConfig; // deep merge, later wins
```

```tsx
// Out of the box — nothing to write; the provider is optional and the preset is the default.
<VuiProvider>{children}</VuiProvider>

// Changing part of it — start from the preset and override what you need.
// Everything you don't mention keeps the shipped behaviour.
<VuiProvider config={mergeConfig(vuiPreset, {
  form: { actions: (d) => [...d, saveAndNew] },
  behaviour: { rowClick: "edit" },
})}>
```

Resolution order, fixed and never negotiable: **per-instance prop → user preference (opted-in keys
only) → app config → preset → package default.** A prop always wins, so a one-off screen never has to
fight the app config, and a user preference only reaches keys the app marked `userConfigurable`.

The user-preference store is the same shape `ChromeConfigProvider` already uses: a small JSON blob in
`localStorage`, edited from the Settings page, merged over the app config. Slice 0 generalises it
from the seven chrome flags to any opted-in key.

**Risk:** low. **Size:** about a day. Nothing changes for anyone until a slice below uses it.

---

## Slice 1 — Form footer and actions

**Problem.** `RecordForm` renders Cancel + Save. Labels fixed, order fixed, no Save & New, no Delete,
no conditional Save. A host that needs any of it rebuilds the form by hand, which is how a screen
ends up off-design.

```tsx
type FormAction<T> = {
  id: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  align?: "start" | "end"; // Delete left, Save right
  /** Return false to keep the form open. */
  onAct: (
    row: T,
    ctx: FormActionContext<T>,
  ) => boolean | void | Promise<boolean | void>;
  visible?: (ctx: FormActionContext<T>) => boolean;
  disabled?: (ctx: FormActionContext<T>) => boolean;
  requiresValid?: boolean; // default true for the primary action
  confirm?: { title: string; body?: string };
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

Config or prop: `actions?: FormAction<T>[] | ((defaults: FormAction<T>[]) => FormAction<T>[])`. The
function form matters most, because it hands you the preset's own actions to extend:

```tsx
actions={(defaults) => [
  ...defaults,
  { id: "save-new", label: "Save & New", onAct: async (row) => { await save(row); return false; } },
]}
```

`renderFooter?: (ctx) => ReactNode` covers what the array can't express and replaces the footer
wholesale. If hosts reach for it often, the array is wrong and gets fixed.

**Risk:** low, purely additive. **Size:** a day plus docs. Settings pages get this for free, since
their Save footer is the same component.

---

## Slice 2 — Form body composition

**Problem.** The body is `fields` in `group` order, one control per row. No banner between fields, no
field spanning two columns, no tabs for a long form. `render` / `renderInput` cover one control, not
the space around it.

Three additions, smallest first, because the first two probably cover most real cases:

1. **`span?: 1 | 2 | "full"` on `RecordField`** — honoured by the two-column layout. Nearly free, and
   the most asked-for.
2. **Slots in the field array** — `{ kind: "slot", id, render: (ctx) => ReactNode, span? }`, flowing
   in field order with a field row's padding. A discriminated union, so every existing array stays
   valid.
3. **Declared sections** — `sections?: FormSection[]` with `layout: "stack" | "tabs" | "accordion"`,
   `columns`, `description`, and a section-level `render`. `group` keeps working and maps onto a
   default section.

```tsx
type FormSection = {
  id: string;
  title?: string;
  description?: string;
  columns?: 1 | 2;
  layout?: "stack" | "tabs" | "accordion";
  collapsible?: boolean;
  fields: string[]; // field keys, in order
  render?: (ctx) => ReactNode; // whole-section takeover
};
```

**Risk:** medium. This is the render path every form uses, and tabs raise a real question: validation
must be able to reach a field in a hidden tab, which means switching to that tab and focusing it. That
interaction needs its own tests. **Size:** two to three days.

---

## Slice 3 — Page frames and the shell

The slice that turns "five page types you copy from the docs" into five you configure. It is the
biggest, and it is why dashboard/settings/board can't be done earlier.

- **Page frame**: the standard `flex h-full flex-col` → action header with breadcrumbs → scrolling
  `p-4` content becomes `<Page>` with slots (`breadcrumbs`, `title`, `actions`, `content`, `footer`)
  and config for order and padding. Every page type composes from it, so a change lands once.
- **Dashboard**: a declared widget grid. `widgets: { id, span, render }[]` with responsive spans,
  replacing today's copied `StatCard` grid markup.
- **Settings**: a section list, sharing slice 1's footer actions.
- **Board**: column config (`columns: { id, title, accept, render }[]`) plus a card slot.
- **Shell**: named slots in the app shell (brand, header extras, sidebar header/footer, page actions)
  and in the auth shell (above/below form, footer). The preset fills them all, and a host swaps any
  one of them without touching the rest.

**Risk:** medium to high, because it touches every screen. Mitigated by the preset: if the shipped
preset drives the demo app and the demo app still looks identical, the abstraction is honest. That is
the acceptance test for this slice. **Size:** a week, best split per page type.

---

## Slice 4 — Behaviour

```tsx
behaviour: {
  rowClick: "view" | "edit" | "none",
  confirmDelete: true,
  confirmDiscardWhenDirty: true,
  closeOnSave: true,
  validateOn: "blur" | "change" | "submit",
  flashMs: 1600,
}
```

Mechanism is small; the discipline is the work. A key earns its place when a real screen needs it and
the alternative is forking the component. It never earns its place by restyling something the tokens
already own.

Behaviour keys are also the first real customers for the user-preference layer. `rowClick`,
`flashMs` and table density are exactly the sort of thing a person using the app every day should be
able to set for themselves, so slice 4 ships the `userConfigurable` flag and the Settings section
that edits it, generalising what the top-bar toggles already do.

**Risk:** medium, through scope creep rather than code. **Size:** two days for the provider plus the
first keys, one more for the user-preference layer and its Settings section.

---

## Order, and why

1. **Slice 0**, the spine. Everything else needs it.
2. **Slice 1**, footer actions. Highest value per day, zero risk, unblocks forms and settings at once.
3. **Slice 4**, behaviour. Independent, small, and it removes a whole class of "can I change what
   Save does" questions.
4. **Slice 2**, form body. Medium risk, contained to one component.
5. **Slice 3**, page frames and shell. Biggest, and it benefits from the config conventions the
   earlier slices settle.

Slices 1 and 4 can ship in the same release. Slice 3 should be split per page type and shipped one at
a time.

## What stays closed, on purpose

- **Tokens stay in `theme.css`.** No per-component color or spacing props. This is what keeps twelve
  screens looking like one product, and it is not a limitation: change the token.
- **Fields stay described, not hand-built.** One `fields` array drives the table, the filter panel,
  import/export and the form together. Replacing it with children breaks all four. Slots and sections
  give the layout freedom without giving that up.
- **No visual builder, no JSON schema runtime.** Config is typed TypeScript.

If a real requirement can't be met inside those three, that is worth reopening, with the case.

## What I need from you to start

1. **Approve the order**, or reorder it. I'd start with slice 0 plus slice 1 in one change.
2. **The action list for slice 1**: which buttons do your screens actually need beyond Save and
   Cancel? The array's shape should come from real cases.
3. **For slice 3, which page type first?** Dashboard and settings are the usual answers; board is the
   least used.
