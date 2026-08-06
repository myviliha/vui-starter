# Changelog

All notable changes to `@viliha/vui-ui` are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/), and the project uses
[semantic versioning](https://semver.org/): **patch** for fixes, **minor** for
backward-compatible features, **major** for breaking changes.

To upgrade, see [Upgrading](./AGENT.md#upgrading) in the agent guide.

## Upgrading from 1.44 to 1.53

**Short version: upgrade, restart, change nothing.** Everything from 1.50 on is
additive, and the behaviour changes before it all point the same way, which is to
stop showing the user something meaningless. Read this page once, act on the
one item that applies to you, and skip the rest.

### Do I have to change any code?

Only in one case, and only if you used `BrandAsset` directly:

| If you… | Then | Version |
| --- | --- | --- |
| render `<BrandAsset value onChange />` yourself | add `inline` (demo, base64) or `onPick` (real upload). Without either, the control now says it has no uploader instead of quietly storing a 2.7 MB data URI | 1.45.0 |
| use `organizationProfileFields` | nothing. It keeps `inline`, so it behaves exactly as before | 1.45.0 |
| pass `onDataChange` alongside `fetcher` | it now actually fires (it never did before). Return a promise from it so the reload waits for your write | 1.49.0 |
| have a bulk "Set {field}" on a field you never marked `editable` | add `editable: true` to keep it. Bulk writes now follow the same rule as the form | 1.53.0 |

Everything else is a default that improved on its own.

### What changed without you asking

These need no code, but you will see them, so here is what and why:

1. **A read-only table lost its Edit pencil** (1.46.0). If no field is
   `editable`, the row Edit button and the view panel's Edit button are gone,
   because they opened a form with nothing in it and a Save that wrote nothing.
   Want it back on a table that has no editable fields? `showEdit`. Want it gone
   on one that does? `showEdit={false}`.
2. **Async labels shimmer instead of showing the id** (1.47.0, 1.48.0). A cell
   backed by `loadOptions` + `resolveOption` used to paint `Region 1` and swap
   to the label when its fetch landed. It now shows a skeleton, and a reference
   that resolves to nothing reads `—` rather than sitting on the id forever.
   Pickers do the same. Nothing to configure.
3. **Saving in server mode waits for your write** (1.49.0). `fetcher` mode used
   to invalidate and refetch immediately, racing your POST, so a saved record
   could appear to revert. Return a promise from `onDataChange` and the reload
   happens after it settles. Return nothing and you get the old, immediate
   reload.
4. **Long chat messages wrap** (1.44.1). One unbroken string no longer pushes a
   horizontal scrollbar across the conversation.

### What you can do now, if you want to

Nothing here is required. The theme still ships finished, and `vuiPreset` is
that finished behaviour as a plain value, so anything you don't configure keeps
working exactly as it does today.

**Step 1: nothing.** Upgrade and restart. You are done unless a row in the
first table applies to you.

**Step 2: change something app-wide,** when you want to. Mount the provider
once, and set only the keys you care about:

```tsx
// app/(app)/layout.tsx
import { VuiProvider } from "@viliha/vui-ui/config";

<VuiProvider config={{ behaviour: { rowClick: "edit" } }}>{children}</VuiProvider>;
```

**Step 3: change one screen** with a prop, which always beats the provider:

```tsx
<RecordView behaviour={{ confirmDelete: false }} … />
```

**Step 4: let the people using the app change some of it.** Name the keys you
are willing to hand over; those are saved per browser, and anything you don't
list is ignored:

```tsx
<VuiProvider userConfigurable={{ behaviour: ["rowClick", "flashMs", "confirmDelete"] }}>
```

Build the settings UI from `useVuiPreferences()`. The demo's Settings page has a
*Data tables* section doing exactly this.

**Step 5: add a footer button** without rebuilding the form:

```tsx
<RecordView
  formActions={(defaults) => [...defaults, { id: "archive", label: "Archive", … }]}
/>
```

**Step 6: put your own content between fields** with `formSlots`, and give a
field the whole row with `fullWidth`.

**Step 7: add "Save & New"** if you enter records in runs, with
`{ id: "save-new", label: "Save & New", variant: "primary", after: "new" }`.

### What did not change, and will not

Colors, radius, spacing and typography stay in `theme.css`. `fields` stays the
data contract that drives the table, the filter panel, import/export and the
form together, which is why slots are a separate prop rather than entries in it.
No component was renamed, no export was removed, and no prop was made required.

## 1.53.0 — 2026-08-06

### Added

- **"Save & New" in one line: `after` on a form action.** A saving action can
  now say what the form does next: `"close"` (the default, what Save does),
  `"stay"` on the record just saved, or `"new"` to hand the form a blank record
  so a run of entries never goes back to the table in between.

  ```tsx
  formActions={(defaults) => [
    ...defaults,
    { id: "save-new", label: "Save & New", variant: "primary", after: "new" },
  ]}
  ```

  `after: "new"` needs `makeEmptyRow` on the table and falls back to `"stay"`
  without it. Staying open no longer plays the slide-out animation, which used
  to send the panel away and straight back in.

### Fixed

- **A bulk "Set {field}" no longer writes to a field the form won't edit.** The
  bulk actions were built from any field with static `options`, ignoring
  `editable`, so a read-only choice column could be changed for every selected
  row at once. It now needs `editable` as well, matching what the form allows.
  If a table lost a bulk action here, the field it wrote to was never meant to
  be editable: mark it `editable: true` to get it back.
- **A per-table `behaviour` prop now reaches the form, not just the rows.**
  `confirmDiscardWhenDirty` and `closeOnSave` set on one `RecordView` were read
  from the provider only, so a per-table override was ignored inside the
  add/edit panel.

## 1.52.0 — 2026-08-06

### Added

- **`formSlots` — your own content between a form's fields.** A callout, a
  preview, a pair of custom controls: each slot renders as a full-width row
  inside its section, inheriting the card, the separators and the padding rather
  than floating beside them. `after` places one under a named field, in that
  field's own section; `group` names a section and puts it at the end. `render`
  receives the live draft, so a slot can react to what is being typed.

  Slots are a prop on the form rather than entries in `fields`, on purpose:
  `fields` is the data contract that drives the table, the filter panel and
  import/export as well as the form, so arbitrary markup in it would leak layout
  into all four.
- **`fullWidth` on a `RecordField`** — the field takes the whole form row, with
  its label above a full-width control instead of beside it. For a long
  textarea, an address block, or a `renderInput` that needs the space.

## 1.51.0 — 2026-08-06

### Added

- **Behaviour is configurable: `behaviour` on `RecordView` and the provider.**
  Five things that were hard-coded are now keys, each with a real consumer:
  `rowClick` (`"view" | "edit" | "none"`, what clicking a record's name does),
  `closeOnSave` (keep the form open for the next record), `flashMs` (the
  saved-row highlight, `0` turns it off), `confirmDelete`, and
  `confirmDiscardWhenDirty` (ask before throwing away unsaved edits, off by
  default because that is how Cancel has always behaved). The shipped values
  live in `vuiPreset`, so the components no longer keep private copies of their
  own defaults.
- **A user-preference layer: `userConfigurable` + `useVuiPreferences()`.** The
  preconfigured theme stays changeable by the person using the app, not only by
  the developer who installed it. List the keys an app is willing to hand over
  (`userConfigurable={{ behaviour: ["rowClick", "flashMs"] }}`) and those become
  the user's, saved per browser and merged over the app's config. Anything not
  listed is ignored on write, so a stale stored value can't leak back in. This
  generalises what the top-bar chrome toggles already did for seven flags.
  `useVuiPreferences()` returns `preferences`, `userConfigurable`,
  `setPreference` and `reset` for building the settings UI.

## 1.50.0 — 2026-08-06

### Added

- **A config spine: `@viliha/vui-ui/config`.** The preconfigured theme is now
  itself a config. `vuiPreset` is a plain value the package applies by default,
  built from the same API a host uses, so there is no "configurable" variant of
  a component sitting beside an opinionated one. Values resolve
  **per-instance prop → `<VuiProvider config>` → `vuiPreset` → package
  default**, and a layer overrides only the keys it mentions, so changing one
  thing never means adopting a config file for everything. Ships
  `VuiProvider`, `useVuiConfig`, `defineConfig` and `mergeConfig`. The provider
  is optional: without it you get the theme exactly as before.
- **Configurable form footer: `formActions`.** Cancel + Save (Close + Edit while
  viewing) are ordinary actions now, so you change them with the API that builds
  them. Pass a function to start from the shipped list
  (`formActions={(d) => [...d, archive]}`) or an array to replace it. An action
  takes `label`, `variant`, `icon`, `align` (`start` pins it left, where
  destructive actions belong), `confirm`, and `visible` / `disabled` predicates
  reading the live form. Its `onAct` gets `mode`, `row` (the draft), `dirty`,
  `valid`, `errors`, `close`, `reset` and `edit`, and may be async, with the
  footer disabled while it settles.

  One rule governs the outcome: an action closes the form when it finishes
  unless it returns `false`, and an action that validates commits the draft
  through `onSave` on the way out. Validation defaults on for
  `variant: "primary"` and off otherwise, which is why Save validates and Cancel
  doesn't; `requiresValid` overrides it either way.
- **`renderFooter(ctx)`** — replace the form footer outright, for the rare case
  the action array can't express what a screen needs.

### Changed

- The form footer renders through the new action list rather than hard-coded
  buttons. Nothing moves: the same pair, the same blue Save, the same
  separators, since the shipped actions are what the preset describes.

## 1.49.0 — 2026-08-06

### Fixed

- **A save in server mode no longer races the reload.** In `fetcher` mode a
  mutation invalidated the cache and refetched straight away, before the host's
  POST/PATCH had landed, so the server answered with pre-write rows and the
  saved record appeared to revert. Add was the worst of it: the new row showed
  for a moment and then vanished. `onDataChange` may now return a promise, and
  RecordView waits for it before reloading. If it rejects, the error goes to
  `onError` and the table reloads anyway rather than sitting on a row that was
  never stored.

### Changed

- **`onDataChange` now fires in `manual` and `fetcher` mode too**, not only with
  controlled `data`. It is the write hook for server-backed tables: return a
  promise and the reload waits for it. In `manual` mode (where the host owns the
  fetch) returning a promise also re-emits the current query through
  `onQueryChange` once the write settles, so the page reloads itself after a
  save. Returning nothing keeps the previous behaviour everywhere.

## 1.48.0 — 2026-08-06

### Fixed

- **The raw-id rule now covers every component, not just read cells.** A
  `Combobox` or `Select` whose selection hadn't resolved yet fell back to its
  placeholder, so a set value read as "nothing selected"; the trigger now
  shimmers until the label lands. `MultiCombobox` chips listed the stored ids
  and now shimmer too. Same rule everywhere: a skeleton while resolving, never
  an identifier.
- **An unresolvable reference reads `—` instead of `Unknown`.** It is missing
  data, so it now looks like every other missing value rather than a special
  case, and the id is no longer carried in a tooltip.

### Added

- **`resolveOptions` batches single-value reads.** The batch resolver, until now
  used only by `multiple` fields, works for ordinary async fields as well: every
  cell of a column painted in the same tick is collected and resolved in one
  call, so a 50-row Employees page asks for its Department ids once instead of
  50 times. With only `resolveOption`, identical ids already in flight are
  shared, which still removes the repeats.
- **`displayValue(row)` on `RecordField`** — skip resolution entirely. When your
  payload already carries the label next to the id (`{ countryId, country }`),
  return it and the read display paints instantly with zero requests. Unlike
  `render` it supplies only the text, so the cell keeps its alignment,
  truncation and copy button, and the edit control is untouched.

## 1.47.0 — 2026-08-06

### Fixed

- **Async fields no longer paint the raw id before the label arrives.** A read
  cell, detail panel or profile row backed by `loadOptions` + `resolveOption`
  used to render the stored value first, so a page opened as
  `Region 1 · Country 1 · Timezone 27` and swapped to real labels as each fetch
  landed. On a throttled connection those integers sat there for seconds. Read
  displays now show a skeleton until the label resolves.
- **A reference that can't be resolved reads `Unknown`, not its id.** If
  `resolveOption` fails or returns nothing, the cell said `Currency 142` forever
  with no sign anything had gone wrong. It now reads `Unknown` with the id in
  the tooltip, so a dangling foreign key looks like an error and stays
  debuggable. Applies to `multiple` fields too.
- **Identical resolves in flight at the same time are shared.** Every rendered
  value used to fetch on its own, so a table of 50 rows on the same country id
  fired 50 requests. They now collapse into one. The entry is dropped as soon as
  it settles, so nothing is held long enough to go stale.

### Added

- **`useAsyncOptions` returns `resolving`** — true while a set value's label is
  being resolved (distinct from `loading`, which covers the dropdown's own list
  fetch). Use it to show a skeleton instead of a value your reader can't read.

## 1.46.0 — 2026-08-06

### Fixed

- **A read-only table no longer offers a row Edit button.** The pencil rendered
  on every row whenever you weren't in Trash, without ever looking at the
  fields. On a list where nothing is `editable` (a catalog mirror, a
  subscribe-only list, the demo Users table) it opened a form with no body and a
  Save that committed nothing. Edit now follows the fields: no editable field,
  no pencil and no Edit button on the view panel.

### Added

- **`showEdit`** — the row Edit toggle, alongside `showAdd` / `showFilter` /
  `showSort` and the rest. It's the one that doesn't default to `true`: left
  unset it follows the fields, as above. Pass `showEdit={false}` to drop Edit
  from a table that does have editable fields, or `showEdit` to force it on.
  `onEdit` still redirects the action rather than removing it.

## 1.45.0 — 2026-08-06

### Added

- **`BrandAsset` hands you the `File` instead of a base64 string.** Pass
  `onPick(file)`, upload it wherever you keep assets, and return the URL to show
  (`{ url }` or a plain string, or nothing if you drive `value` yourself). The
  control awaits the promise, shows its own "Uploading…" state, and surfaces a
  rejection as an inline error. Nothing is uploaded or fetched by the package.
- **`BrandAsset` props: `onRemove`, `meta`, `accept`, `maxBytes`, `busy`,
  `inline`.** `meta` prints a details line under the preview (name · format ·
  dimensions · size · date; dimensions are read off the rendered image when you
  don't supply them). `accept` now defaults to every image type instead of a
  fixed PNG/JPEG/SVG list. `maxBytes` rejects an oversized file before `onPick`
  is called. `busy` lets a host drive the uploading state during a save.
- **`orgProfileFields(options)`** — the organization profile preset with your
  uploader wired into the Logo and Favicon fields:
  `orgProfileFields({ logo: { onPick }, favicon: { onPick } })`. Every other
  field is untouched, so a profile screen no longer needs a local replacement
  control just to store an image properly.

### Changed

- **`BrandAsset` no longer writes a base64 data URI by default.** Storing the
  image inline meant a 2 MB logo became a ~2.7 MB field value: too long for a
  normal column, invisible to a CDN, and impossible to cache or transform. The
  data-URI path is still there for demos with no backend, but you now ask for it
  with `inline`. A control with neither `onPick` nor `inline` says so instead of
  quietly producing a value that cannot be saved.
  `organizationProfileFields` (the prebuilt demo preset) keeps `inline`, so the
  bundled Organization Profile page behaves as before.

## 1.44.1 — 2026-08-06

### Fixed

- **Chat: long messages now wrap instead of overflowing.** A message made of one
  unbroken string (a long URL, a pasted token, keyboard mashing) stretched its
  row and pushed a horizontal scrollbar onto the whole conversation. The message
  text now breaks mid-word, so the chat column stays inside its width at any
  message length.

## 1.44.0 — 2026-08-05

### Added

- **`@viliha/vui-ui/multi-combobox` — `MultiCombobox`.** A searchable multi-select
  (the multi companion to `Combobox`): holds a `string[]`, renders the selection
  as removable chips, and picking an option toggles it while the popover stays
  open. Static `options` or an async `source` (fetch on open, debounced search,
  and **batch** label-resolve of the selected values).
- **Multi-select `RecordField` (many-to-many form fields).** Set `multiple: true`
  on a choice field and its value becomes a `string[]`: the Add/Edit form renders
  the multi-select with chips, and the read cell shows up to `maxChipsInCell`
  (default 3) labels then "+N" with the full list in a tooltip. Async fields add
  a batch `resolveOptions(values)` (the plural companion to `resolveOption`).
  `required` means at least one selected (blocks Save). Reuses the existing
  `loadOptions` / `dependsOn` contract; nothing loads on mount. Demo: Markets →
  Post Codes.
- **`AsyncOptionSource.resolveOptions`** — `useAsyncOptions` now batch-resolves
  set values in one call when a source provides it (falls back to per-value
  `resolveOption`).

## 1.43.0 — 2026-08-05

### Added

- **Trash mode — view soft-deleted rows and restore them.** Set `showTrash` to
  add a **Trash** toggle in the header (left of Filter) that switches the same
  table between live and soft-deleted rows. RecordView is display-only: the host
  supplies the trashed rows (`trashedData` in client mode, or the new
  `trash: true` flag on `ServerQuery` for `manual`/`fetcher` mode) and persists
  restores via **`onRestore(rows)`**. Restore mirrors delete: a per-row Restore
  icon and a bulk **"Restore N selected"** via the selection checkbox, each with
  a confirm dialog; on restore RecordView clears the selection and refetches
  (manual) / expects the host to drop the rows from `trashedData` (client). In
  Trash the Add button is hidden and row Delete becomes Restore. Demo: the
  Branches table.

## 1.42.1 — 2026-08-05

### Changed

- **A built-in `input:"checkbox"` now coexists with `render`.** Like a custom
  `renderInput`, a field can pair a `render` (the read view — e.g. a status
  badge in the table) with `input:"checkbox"` (the edit control): the form shows
  the badge while viewing and the checkbox while editing. The Branches HQ column
  uses this — badge in the list, checkbox in the Add/Edit form.

## 1.42.0 — 2026-08-05

### Added

- **Field-level validation in the Add/Edit form (slide-over and full-page).** A
  `RecordField` now takes declarative rules: `min`/`max` (character length, or
  numeric value for `input:"number"`), `pattern` (regex + `patternMessage`),
  `format: "email" | "phone"`, a custom `validate(value, draft)`, and `trim`.
  Rules run on blur and before Save, **block Save** while any field is invalid,
  and show the message **inline under the field**. `"phone"` also auto-formats
  the value as `(123) 456-7890` while typing. Previously the form enforced only
  `required` (and Save wasn't blocked beyond that).
- **`input: "checkbox"`** — a boolean field renders a real checkbox in the form
  and shows Yes/No in read/view and table cells.

## 1.41.1 — 2026-08-05

### Fixed

- **Async choice fields now show their label in read/view mode, not the raw id.**
  A `RecordField` with `loadOptions`/`resolveOption` (its value is an id) rendered
  the id (`"5"`) in read mode while edit mode showed the correct title. The read
  display now resolves the label via `resolveOption` (one record, never the whole
  list) everywhere a value is shown — form read rows, detail panels and table
  cells — falling back to the id while it resolves. Static-`options` fields already
  mapped to their label; this brings async fields in line. The picker itself was
  never affected.

## 1.41.0 — 2026-08-04

### Added

- **`NEXT_PUBLIC_PASSWORD_MASK` — app-wide default for `PasswordInput`'s mask.**
  Set it to `native` to make every password field use the browser's bullet-dot
  `type="password"` (so password managers and autofill work), or leave it
  `asterisk` (default) for the `*` overlay. The per-field `mask` prop still
  overrides it. Declare the var in `turbo.json` `globalEnv` if you read
  `NEXT_PUBLIC_*` inside `packages/ui`. Documented on the Configuration docs page.

## 1.40.0 — 2026-08-04

### Added

- **`@viliha/vui-ui/profile-form` — `ProfileForm`.** A pre-designed profile page
  you import, like `Steps`. Feed it `fields` (grouped into sections via each
  field's `group`) and `data`, and it renders the whole thing: a read-only view,
  an **Edit** button that opens the standard **Cancel + Save** footer, revert on
  Cancel, the About info panel, and a loading skeleton. No page boilerplate.

  ```tsx
  import { ProfileForm } from "@viliha/vui-ui/profile-form";
  import { organizationProfileFields, getOrgPrimary } from "@viliha/vui-ui/organization-profile";

  <ProfileForm data={org} fields={organizationProfileFields}
    getPrimary={getOrgPrimary} onSave={save} title="Organization" />
  ```

- **`@viliha/vui-ui/organization-profile` — organization preset.** Ready-made
  field definitions for a company profile: `organizationProfileFields` (Org
  information, Brand assets, Contact & address, Localization), the `OrgProfile`
  type, `getOrgPrimary`, `ORGANIZATION_PROFILE_DESCRIPTION`, and the reusable
  `BrandAsset` logo/favicon control. Spread or override the fields to fit your
  schema. The backoffice `/organization/profile` page is now a thin consumer of
  both.

## 1.39.0 — 2026-08-04

### Added

- **Form sections take any title.** A `RecordField`'s `group` accepts any string
  now, not just the four built-in names, and `RecordForm` renders one section per
  group in the order the groups first appear. So a form can read
  "Organization information", "Brand assets", "Contact & address" instead of
  "General"/"Work". Ungrouped fields still fall under "General"; existing forms
  are unchanged.

### Changed

- **A field can have both a custom view and a custom edit control.** When a field
  sets both `render` (read-only view) and `renderInput` (edit control),
  `RecordForm` now shows `render` while viewing and `renderInput` while editing —
  so a cell like a logo preview or a status badge stays editable in Edit mode.
  Before, `render` always won and the edit control never appeared. Fields with
  only one of the two behave exactly as before.

## 1.38.0 — 2026-08-04

### Added

- **User-resizable columns are on by default.** `RecordView`'s `resizableColumns`
  now defaults to the `NEXT_PUBLIC_RESIZABLE_COLUMNS` env var, which is on unless
  you set it to `0` or `false`. Drag a column's right edge to widen it, so a long
  value in a narrow column is always reachable. Pass `resizableColumns={false}`
  on a single view to opt out. Declare the new var in `turbo.json` `globalEnv` if
  you read `NEXT_PUBLIC_*` inside `packages/ui`.

### Fixed

- **Custom-rendered cells no longer overflow into the next column.** A cell with
  a `render` function (for example a long status badge like
  `PARTIALLY_REFUNDED`) clipped to its own column now, matching how plain text
  cells already truncate. Before, the badge could spill across the column border
  and cover the neighbouring value. Widen the column by dragging its edge or set
  the field's `width`.

## 1.37.1 — 2026-08-03

### Fixed

- **`RecordView` server (`manual`) mode now reflects writes and filters without a
  manual reload.** When a host drives the table server-side and feeds each page
  through `initialData` (rather than the controlled `data` prop), RecordView
  seeded its rows once and never reconciled them. So after a create, edit, or
  delete, the list kept showing the old rows, and typing a Filter value left the
  full catalog on screen. RecordView now re-syncs its internal rows whenever that
  seed changes, so a post-mutation refetch or a narrowed filter shows up right
  away. The controlled `data` path and client-managed tables are unchanged.
- **Filtered-empty tables read correctly.** With an active per-field filter and
  no keyword, an empty result now says "No matching records." instead of the
  first-run "No records yet."

## 1.37.0 — 2026-07-31

### Added

- **`PasswordInput` `mask` prop (`"asterisk" | "native"`, default `"asterisk"`).**
  `"asterisk"` keeps the `*` overlay; `"native"` renders a real
  `type="password"` (bullet dots) that the eye toggle flips to `type="text"`, so
  browser and password-manager autofill work normally. Pick per usage.

## 1.36.0 — 2026-07-31

### Added

- **`@viliha/vui-ui/password-input` — `PasswordInput`.** A password field that
  masks with **`*`** (not the browser's bullet dots) and adds an **eye toggle**
  to reveal the value. Drop-in for `Input` inside a `Field`: spread `bind(...)`
  and pass `error` for inline validation, and it owns its right edge so the
  reveal button and the error icon never collide. It keeps the real value in a
  text input (native typing/paste/caret) with a monospace asterisk overlay, so
  browser password-manager autofill won't recognise it — use a plain
  `<Input type="password" />` when native autofill matters more than the
  asterisk look. Props: `error`, `maskChar` (default `"*"`), plus all `<input>`
  props.

### Changed

- **Auth screens use `PasswordInput`** for every password field (sign in, reset
  password): asterisk mask + show/hide, wired to `useFormFields`.

## 1.35.1 — 2026-07-31

### Fixed

- **`use-form-fields`** — memoize the internal `run` helper so `bind` and
  `validate` satisfy `react-hooks/exhaustive-deps` (the package lints with
  `--max-warnings 0`, so the warning failed CI). No behaviour change.

## 1.35.0 — 2026-07-31

### Added

- **`@viliha/vui-ui/use-form-fields` — inline field validation as a feature.**
  `useFormFields(rules)` validates text `Input` / `Textarea` fields on **blur
  and on submit**, surfacing every error through a single channel: the field's
  own inline error. Spread `bind(key)` onto the control, read `errors[key]`,
  call `validate()` on submit, and set `noValidate` on the `<form>` so the
  browser's native bubble can't compete. Rules receive all field values for
  cross-field checks (e.g. confirm-password). Returns `values`, `errors`,
  `bind`, `setValue`, `setError`, `validate`, `reset`.

### Changed

- **`Field` (`@viliha/vui-ui/field-grid`) now renders the inline validation
  error itself** — red border via the control's `aria-invalid`, an
  alert-triangle tooltip, no layout shift, auto-clear on edit, re-check on
  blur/submit. Works for `Input` and `Textarea` (`multiline` puts the icon at
  the top). The reference app's auth `Field` now re-exports this one.

### Fixed

- **Auth screens: no more double validation.** Sign in / up and forgot / reset
  password set `noValidate` and validate through `useFormFields`, so the
  browser's native "Please include an '@'…" bubble no longer fires on top of the
  theme's inline error. Email now validates the moment you leave the field.

## 1.34.3 — 2026-07-31

### Changed

- **Filter panel** — tighten the gap between a field's label and its control.
  `FilterGrid`'s label column was `minmax(4.5rem, max-content)`, so short labels
  like "Name" or "Code" were padded out to 4.5rem and left a wide gap before the
  input. The column is now plain `max-content`, so it sizes to the label and the
  control sits right beside it. Labels still align across rows.

## 1.34.2 — 2026-07-29

### Changed

- **README + npm metadata** — humanize pass and SEO. Rewrote the opening and
  `package.json` `description` around real search terms (React component
  library, admin dashboard template, Next.js, Tailwind CSS v4, shadcn/ui,
  datatable), expanded `keywords`, and removed every em dash per the new
  humanize rule. Mirrors the repo README. Docs/metadata-only.

## 1.34.1 — 2026-07-29

### Changed

- **README** — rewrote the Sponsor section in a plainer, human voice: dropped
  the stacked superlatives and marketing phrasing, kept the ask (free under MIT,
  real effort, even $1 helps, sponsors wall). Mirrors the repo README. Docs-only.

## 1.34.0 — 2026-07-29

### Added

- **`@viliha/vui-ui/wizard` — a multi-step wizard layout scaffold.** `Wizard`
  renders the stepper (from `steps` + `current`), a scrolling body for the
  active step, and a Back/Next footer; `WizardSection` is a bordered
  title/icon section. You own the step index, field state, and all logic and
  drop any components inside — it's layout only, not a data-driven form.
- **`@viliha/vui-ui/field-grid` — `FieldGrid` + `Field`.** The form design
  standard: **two columns, `Label *` │ control on one row**, labels
  left-aligned and sized to `max-content` (no dead space) and aligned across
  rows. Supports `required` and `hint`. Used by the wizard sections and any
  form that wants the standard two-column layout.

### Changed

- **Reference `/steps` page** rebuilt on `Wizard` / `WizardSection` /
  `FieldGrid`: fixes the oversized label→control gap (was a fixed 140px label
  column) and demonstrates one step with multiple sections.

## 1.33.1 — 2026-07-29

### Changed

- **README** — lead with a prominent **Sponsor** section at the very top: Vui is
  a free, enterprise-grade theme that would normally sit behind a paywall, built
  with significant personal effort, and sponsorship is what keeps it free and
  maintained. Mirrors the repo README. Docs-only.

## 1.33.0 — 2026-07-29

### Added

- **`@viliha/vui-ui/cascading-combobox` — `CascadingCombobox`.** A cascading
  picker for **fixed, named levels** (Region → Country → State → City): one
  searchable `Combobox` per level, where picking a level narrows the next from
  the selected node's `children` and clears everything downstream. A level is
  disabled until its parent is chosen. Data-driven — pass a `CascadeNode[]` tree
  of any depth (3, 4, N levels). Exported types: `CascadeNode`, `CascadeLevel`.
- **`Combobox` `disabled` prop** — inert trigger, popover can't open (used per
  level by `CascadingCombobox`).

## 1.32.0 — 2026-07-29

### Added

- **`@viliha/vui-ui/filter-field` — composable filter layout primitives.**
  `FilterGrid` + `FilterField` render the theme's enforced filter layout — **two
  columns: label │ control, one row per field, labels aligned across rows**.
  Anyone can add a labelled control to a filter panel with them, and the design
  can't be styled away.
- **`RecordView` `filterExtras` prop** — inject your own `FilterField` rows into
  the Filter panel (below the `filterable` fields, in the same grid). The panel
  now opens when there are `filterable` fields **or** `filterExtras`.

### Changed

- **`RecordView` Filter panel is now two-column by default** (label │ control on
  one row), replacing the stacked label-above-control layout. Built on the new
  `FilterGrid`/`FilterField`, so the layout is consistent and enforced whether
  fields come from `filterable` config or `filterExtras`. Panel widened to fit.

## 1.31.0 — 2026-07-29

### Added

- **`@viliha/vui-ui/auth-context` — a provider-agnostic auth contract.**
  Exports `AuthProvider`, `useAuth()`, and the `AuthContract` / `AuthUser` /
  `Credentials` / `SignUpInput` types. Auth screens now depend on this small
  interface rather than any provider SDK, so wiring a real backend
  (NextAuth, Clerk, Better Auth, Supabase, …) is a single adapter with no
  screen changes. `useAuth()` throws when no `AuthProvider` is mounted, so a
  missing adapter fails loudly instead of silently no-op'ing.

### Changed

- **Reference app** — auth screens (`signin`, `signup`) and sign-out are wired
  to `useAuth()`; the app mounts a **Better Auth** adapter
  (`app/_components/auth-provider.tsx`) that activates when
  `NEXT_PUBLIC_AUTH_BASE_URL` is set and otherwise falls back to an in-memory
  mock so the static demo works with no backend. Docs at `/docs/auth`.

## 1.30.2 — 2026-07-29

### Changed

- **README** — republish so the "Support VUI" sponsor section, badge, and
  acknowledgments actually reach npmjs (they were bundled with a version already
  on the registry). No component changes.

## 1.30.1 — 2026-07-29

### Changed

- **README** — add a GitHub Sponsors badge/link, a "Support VUI" section, an
  acknowledgments section (inspired by / thanks to shadcn/ui + React), and
  emphasize the live demo app. Docs-only; no component changes.

## 1.30.0 — 2026-07-29

### Added

- **shadcn/ui components, batch 4 — completes the set.** Ported into the package
  (Radix-based, VUI tokens): `aspect-ratio`, `breadcrumb`, `calendar`, `command`,
  `form`, `progress`, `scroll-area`, `sonner`. New deps: `cmdk` (command),
  `react-day-picker` (calendar), `react-hook-form` (form), `sonner`.
  Adaptations to fit VUI: `command` ships the cmdk primitives **without**
  `CommandDialog` (VUI's `command-palette` is the modal ⌘K menu); `sonner`'s
  `Toaster` reads the `.dark` class directly instead of `next-themes`;
  `calendar` uses VUI's `Button`/`buttonVariants`; `theme.css` already carried
  the tokens these need.

## 1.29.0 — 2026-07-29

### Added

- **shadcn/ui components, batch 3 (form controls).** Ported into the package
  (Radix-based, VUI tokens): `textarea`, `radio-group`, `slider`, `toggle`,
  `toggle-group`, `input-otp`. New dep: `input-otp` (for the OTP field);
  `theme.css` now ships the `caret-blink` keyframe so the OTP caret animates
  without `tw-animate-css`.

## 1.28.0 — 2026-07-29

### Added

- **shadcn/ui components, batch 2 (overlays).** Ported into the package
  (Radix-based, VUI tokens): `alert`, `alert-dialog`, `collapsible`,
  `hover-card`, `popover`, `sheet`. No new dependencies (all use the existing
  `radix-ui` / `class-variance-authority` / `lucide-react`). `AlertDialogAction`
  / `AlertDialogCancel` style the Radix element with VUI's `buttonVariants`
  (VUI's `Button` has no `asChild`), so they still accept Button `variant`/`size`.

## 1.27.0 — 2026-07-29

### Added

- **shadcn/ui components, batch 1 — now in the package.** Ported (Radix-based,
  restyled to VUI tokens, zero token duplication) so consumers import from
  `@viliha/vui-ui/<name>` instead of running `shadcn add`:
  `accordion`, `label`, `separator`, `skeleton`, `switch`, `tabs`.
  New runtime deps: `radix-ui`, `class-variance-authority`, `lucide-react`.
  `theme.css` now ships the `accordion-down`/`accordion-up` keyframes so the
  Accordion animates without `tw-animate-css`. More components in later batches.

## 1.26.2 — 2026-07-29

### Changed

- **Scaffolded auth screens** (shipped in `template/`, from the reference app):
  sign-in and sign-up now lead with the email/password form and place the
  Google / passkey / SSO options **below** an "or" divider, for a consistent
  layout. All auth titles, buttons, labels, and copy are **Title Case**. Fields
  render label-beside-input in a two-column `FieldGrid`, and validation errors
  show as a red border + tooltip that auto-clears on edit (no layout shift).
  No component API change — `src/` is unchanged.

## 1.26.1 — 2026-07-29

### Fixed

- **README blank on npmjs.com** — resolved by republishing. The registry had
  the README correct all along (top-level packument `readme` field, which npm
  populates on its own); the blank page was an npmjs.com **re-index delay**.
  Publishing a new version makes npmjs re-render it. No source or tooling change
  is needed for this. (This release also briefly added a manifest `readme`
  injection to `publish.mjs`; it had no effect and was removed the same day —
  the per-version `readme` field is stripped by the registry for every package.)

## 1.26.0 — 2026-07-29

### Added

- **`RecordView` toolbar feature toggles.** New boolean props let a page choose
  which toolbar controls appear — each defaults to **on**, so existing tables
  are unchanged: `showFilter`, `showSort`, `showPagination` (the standard set),
  `showImport`, `showExport` (turn off per page — they "depend on the user"),
  `showAdd`, and `showSelection`. `showPagination={false}` renders all rows (no
  page slicing) in client mode; `showSelection={false}` removes the checkbox
  column, bulk actions, and Clear selection (and, since they share the leading
  column, drag-to-reorder).

### Fixed

- **README missing on npmjs.** npmjs.com renders the README from the
  per-version `readme` field in the publish request, which `pnpm publish` (and
  yarn-classic / bun) do **not** send — only `npm publish` does. Publishing now
  goes through `scripts/publish.mjs` (run it with `pnpm release` or
  `node scripts/publish.mjs`, from any package manager): it strips the internal
  `workspace:*` devDeps to keep the manifest spec-valid, then uploads via
  `npm publish`, so the README shows again. A `prepublishOnly` guard blocks a
  bare `<pm> publish` and points at the script.

## 1.25.2 — 2026-07-29

### Added

- **`Input` invalid state** — an `<Input>` with `aria-invalid` now paints its
  border and focus ring in the `destructive` color, so form validation can show
  an error without a layout-shifting message line (pair it with a tooltip for
  the message). The `[aria-invalid]` selector out-specifies the base border, so
  no `!important` is needed.

### Fixed

- **`Toaster` hydration mismatch** — the portal was gated on
  `typeof document === "undefined"`, which is `false` during client hydration,
  so the toast region rendered on the client but not the server. Now gated on a
  mounted flag, so the first client render matches the server (`null`) and the
  portal mounts in an effect.

## 1.25.1 — 2026-07-28

### Added

- **Revalidate stale keep-alive tabs (`useRefetchOnActive`)** — a scaffolded
  hook (`lib/use-refetch-on-active.ts`) that re-runs a controller's `refetch`
  when its tab becomes active again or the window regains focus, so a kept-alive
  page no longer shows data frozen at open time after another user edits a
  record. The reference wiring (`use-organizations.ts` + the data layer's
  `syncOrganizations(since)`) revalidates with a **delta** (`?since=cursor` →
  only changed rows + deleted ids, merged by `id`), not a full reload. Documented
  in `AGENT.md` (Open tabs) and docs `/layout`.

## 1.25.0 — 2026-07-27

### Added

- **Async option loading for pickers (`loadOptions` / `resolveOption`)** — a
  reusable primitive so `Combobox`, `Select`, and `RecordView` choice/filter
  fields fetch their options **on demand** instead of receiving a fully-loaded
  static `options` array. Browsing a table now fetches **zero** reference data;
  a picker loads its list only when opened, and an already-set value shows its
  label from a **single-record** `resolveOption` (never the whole list). Powered
  by the exported `useAsyncOptions` hook.
  - **`Combobox` / `Select`** accept a `source` (`{ loadOptions, resolveOption }`)
    in place of `options`, plus `resetKey` for cascade invalidation. Combobox
    debounces server search (250 ms, aborts superseded requests); both surface
    loading / empty / error (retry) states inside the dropdown.
  - **`RecordField` / `FieldFilter`** gain `loadOptions({ search, signal, values })`,
    `resolveOption(value)`, and `dependsOn` — so form **and** filter comboboxes
    lazy-load, with `values` giving the current draft / filter values and
    `dependsOn` clearing the cache + selection when a cascade parent changes.
    Works where `onFormOpen` (1.24.0) couldn't reach: filters and standalone
    pickers.
  - Exported types: `AsyncOptionSource`, `AsyncOption`.

## 1.24.0 — 2026-07-27

### Added

- **`onFormOpen?(mode, row?)`** on `RecordView` — fires when the Add / View / Edit
  form opens (`mode` is `"create" | "edit" | "view"`), so you can **lazily load
  field data only when a form actually opens** instead of on every table mount.
  The intended use is FK / combobox option catalogs (e.g. Region → Country → State
  cascades): browsing the list fires nothing, opening a form triggers the fetch.
  It's a pure notification — unlike `onCreate` / `onView` / `onEdit` (which
  redirect and suppress the panel), `onFormOpen` does **not** suppress anything.
  In panel mode `row` is the record opened (the fresh draft for `"create"`); in
  page mode it fires alongside the redirect for symmetry.

## 1.23.2 — 2026-07-27

### Changed

- **Publish with `pnpm publish` (now enforced).** The published manifest used to
  ship internal dev tooling as literal `workspace:*` (an invalid npm manifest,
  left there by `npm publish`). `pnpm publish` rewrites those to spec-valid
  versions, so a `prepublishOnly` guard now blocks any non-pnpm publish. Run
  `cd packages/ui && pnpm publish`.

### Note

- This does **not** change the npmjs "no README" display — that's a registry-side
  render issue (the README is present and valid in every tarball regardless of
  publish client); it needs an npm support ticket, not a republish. Corrects the
  1.21.2 / 1.23.1 notes that wrongly attributed it to the publish client.

## 1.23.1 — 2026-07-27

### Fixed

- README still not rendering on npmjs. Confirmed the published tarball contains a
  valid `README.md` and npmjs renders from the **publish payload**, which
  `pnpm publish` leaves empty (the registry's `readme` field was frozen at a
  stale, older copy while the tarball was current). **Publish this version with
  `npm publish` from `packages/ui`** (not `pnpm publish`, not a workspace filter)
  so the README is in the payload. No code change.

## 1.23.0 — 2026-07-27

### Added

- **Env-driven page size for server-paginated tables.** `RecordView` now reads
  `NEXT_PUBLIC_DEFAULT_PAGE_SIZE` (initial rows per page) and
  `NEXT_PUBLIC_MAX_PAGE_SIZE` (the ceiling the page-size selector won't exceed),
  both overridable per table via the new **`defaultPageSize`** / **`maxPageSize`**
  props. In `fetcher`/`manual` mode the data layer must clamp its returned page
  to the max too — the client's requested size isn't trusted.
- **`users` demo — server-side pagination over a large table.** A new reference
  showing the correct pattern for a table with far more rows than you'd send to
  the browser: `lib/api/users.ts` returns one page at a time (search / sort /
  filter / paginate on the server, page size clamped to the max), and the view
  wires it with `RecordView`'s `fetcher`. Only one page is ever in memory.

### Changed

- **`initialData` and `makeEmptyRow` are now optional.** Omit them for a
  `fetcher`-backed or read-only list; the "+ New" button (and CSV/JSON import)
  is hidden when a table has no way to create rows. Client-managed tables are
  unaffected (they still pass both).

## 1.22.0 — 2026-07-27

### Added

- **Three-layer architecture for data-backed pages** (Data → Controller →
  Presentation), demonstrated end-to-end on the scaffolded `organizations` page
  and documented in `AGENT.md` and the docs site. Data access lives in
  `lib/api/<entity>.ts` (async, no React — the real-API seam), a controller hook
  `use-<entity>.ts` owns `{ data, loading, error }` and loads *after mount*, and
  the presentation renders `RecordView` with no data processing of its own.
- **UI-first navigation.** The presentation now paints its shell first: a thin
  `*-table.tsx` `next/dynamic`-loads the datatable view behind a `TableSkeleton`,
  and the controller starts `loading: true` with no rows — so the skeleton shows
  the instant you click a menu item, instead of waiting for the datatable chunk
  to parse and the data to arrive. Fixes the perceptible lag before the loading
  animation on record-heavy pages.

_App/template change (no component API change); `template/` regenerates from the
demo app on publish._

## 1.21.2 — 2026-07-27

### Fixed

- README now renders on npmjs. Root cause: `pnpm publish` packs `README.md` into
  the tarball but doesn't set the registry `readme` field the website renders (it
  was empty for 1.21.0/1.21.1). Publish the package with **`npm publish`** (from
  `packages/ui`), not `pnpm publish`. No code change.

## 1.21.1 — 2026-07-27

### Fixed

- List `README.md` in the package `files` so npm reliably renders the README on
  the package page (npmjs was showing a stale/empty README — the registry's
  readme field wasn't refreshing on publish). No code change.

## 1.21.0 — 2026-07-27

### Added

- **`Toaster` + `toast()`** (`@viliha/vui-ui/toast`) — global notifications for
  errors and events, matching the shadcn toast design (title, description, an
  action button like "Undo", close, and `success`/`error`/`warning` variants).
  It's a module store, so `toast(...)` works from anywhere — event handlers,
  `catch` blocks — with no provider; mount `<Toaster />` once in the root layout
  (the scaffold now does). Dependency-free (portal + fixed positioning, like
  `Tooltip`), bottom-right stack with a rise-and-fade entrance.

  **For agents:** use `toast.error(...)` / `toast(...)` for errors and
  notifications; don't hand-roll a banner or add a toast library. Demo:
  `/docs/components` (Toast). `<Toaster />` is already in the scaffold layout.

## 1.20.0 — 2026-07-27

### Added

- **`identityColumn` prop — position (or hide) the identity column.** The leading
  Name/Title column was hard-forced first; it can now go anywhere among the field
  columns: `"first"` (default), `"last"`, `"hidden"`, or a number = how many field
  columns precede it (e.g. `1` → Region, Title, Code). Lets reference/data-grid
  tables order columns freely (Country → State → City → Title). The header,
  loading skeleton, and body rows all render from one shared ordered column list,
  so they stay in sync. Default `"first"` keeps existing tables unchanged.

  **For agents:** set `identityColumn` to place the Name/Title column (or
  `"hidden"` when a field already shows it). Demo: `system/cities` (`"last"`).
  Docs: `/docs/data-table`.

## 1.19.0 — 2026-07-27

### Added

- **Sortable identity column header.** The leading Name/Title column (driven by
  `nameLabel` + `getPrimary`) was a static header — you could only sort it from
  the Sort dropdown. It now toggles sort on click and shows the same
  CaretSort/CaretUp/CaretDown affordance as other columns. It sorts by
  `nameSortKey`, or auto-detects the first `hideInTable` field marked `sortable`
  (the one driving `getPrimary`). No opt-in beyond marking that field `sortable`;
  if none is sortable, the header stays static (unchanged).

  **For agents:** to make the identity column sortable, mark its `hideInTable`
  name/title field `sortable: true` (that also lists it in the Sort dropdown), or
  pass `nameSortKey`. Docs: `/docs/data-table` (Sorting).

## 1.18.0 — 2026-07-27

### Changed

- **`Tooltip` now matches the shadcn design** (dark `bg-primary` bubble + arrow)
  and takes a **`side`** prop: `"top" | "bottom" | "auto"` (default `"auto"`).
  Auto prefers **bottom** and flips to **top** only when there isn't room below —
  so datatable cell tooltips drop below a column but flip up for the last rows
  near the footer, never clipped. Still dependency-free (portal + fixed
  positioning). RecordView's truncated-cell tooltips get this automatically.

## 1.17.0 — 2026-07-27

### Added

- **`nameLabel` prop on `RecordView`** — the leading identity-column header was
  hardcoded to "Name". Set `nameLabel="Title"` (etc.) for tables whose identity
  is a title field (regions, countries, languages, roles, …). Default stays
  "Name", fully backward compatible.

## 1.16.0 — 2026-07-27

### Added

- **Configurable page-form breadcrumb.** `RecordForm` (page layout) takes a
  `crumbs` prop that fully replaces the default `Home › {title} › Create/Update
  {singular}` trail — add parents (e.g. an "Access" section), rename the last
  crumb ("New Role"), or reshape it per route. Each crumb is `{ label, onClick? }`;
  the last is the current page. The `Crumb` type is re-exported from
  `@viliha/vui-ui/record-view` (also in `@viliha/vui-ui/breadcrumbs`).

### Changed

- **Choice-field cells show the option label, not the raw value.** A field with
  `options` now renders its matching label in the table (e.g. `SYSTEM` →
  "System") while staying editable — no need for a read-only `render` just to map
  an enum to a friendly label. Falls back to the raw value when unmatched.

  **For agents:** use `options` labels for enum columns (not `render`), and pass
  `crumbs` to `RecordForm` to shape a route's breadcrumb. Docs: `/docs/data-table`.

## 1.15.0 — 2026-07-27

### Added

- **Cell truncation in `RecordView` — long text stays on one line.** A cell
  longer than `maxCellChars` is clipped with an ellipsis (…) and shows the full
  value in a **styled hover tooltip**, so a sentence never wraps to a second row.
  The limit defaults to `NEXT_PUBLIC_MAX_CELL_CHARS` (or 25) and is overridable
  per view (`maxCellChars` prop) or per column (a field's `maxChars`; `0` = never
  truncate). Applies to the identity/Name cell and every value column.
- **`Tooltip`** (`@viliha/vui-ui/tooltip`) — a lightweight, dependency-free themed
  tooltip (portal + fixed positioning, hover/focus, auto-flip). Used by the cell
  truncation above; reusable anywhere.

  **For agents:** rely on cell truncation instead of adding `truncate`/`title`
  to cells yourself; set `maxChars` on a field to widen/disable a specific column.
  For your own tooltips use `Tooltip`, not native `title`. Env:
  `NEXT_PUBLIC_MAX_CELL_CHARS`. Docs: `/docs/data-table`, `/docs/configuration`.

## 1.14.2 — 2026-07-26

### Changed

- **Consistent loading feedback in `fetcher` mode.** A cache hit is served from
  the in-memory cache (no server round-trip), but the loading shimmer now stays
  up for a short minimum (300ms) so a cached load looks the same as a real
  fetch — no confusing "loading but blank" flash on tab switch. Real fetches
  longer than the minimum are unaffected; background (post-mutation) refetches
  stay silent.

  Note: the `fetcher` cache (added in 1.14.0) stores each page's data in a
  module-scoped `Map` in JS memory, so switching tabs serves from memory and does
  **not** re-hit the server. If you still see a refetch, you're on a build older
  than 1.14.0 (the demo before that had no cache).

## 1.14.1 — 2026-07-26

### Fixed

- **Per-field Filter panel layout.** The header ("Filter") and the footer
  (Clear / Search) are now static — only the fields scroll — so the actions stay
  in view on a long filter form. The footer's top border spans the full panel
  width, and the action buttons are compact (`size="sm"`).

## 1.14.0 — 2026-07-26

### Added

- **Built-in server data source for `RecordView`: `fetcher` + query cache.** Pass
  `fetcher={(query, signal) => Promise<{ rows, total }>}` and RecordView owns the
  whole read path — it fetches on every query change, manages `data` / `rowCount`
  / `loading`, aborts superseded requests via the `signal`, and (with `cacheKey`)
  caches responses so returning to a tab is instant with no refetch. Combine with
  `persistKey` to restore page/sort/filters on remount and hit the cache. New
  props: `fetcher`, `cacheKey`, `cache` (`{ max, ttlMs }` LRU), `onError`.
  Mutations are optimistic → invalidate → background refetch. This replaces the
  hand-wired `data`/`onQueryChange`/`loading` + `Map` boilerplate (still supported
  as the lower-level API). The Data Table demo now uses it.
- **Changelog on the docs site** at `/docs/changelog`, rendered straight from this
  file at build time (single source, never drifts). Linked in the docs nav.

  **For agents:** for a server-backed table, prefer `fetcher` + `cacheKey` +
  `persistKey` over wiring `onQueryChange`/`data`/`loading` + a cache yourself.
  Docs: `/docs/data-table` (Server-side data → "Let RecordView own the fetch").

## 1.13.2 — 2026-07-26

### Fixed

- **Data Table demo no longer reloads on tab switch.** Keep-alive keeps a page
  mounted, but under the App Router an async (server-fetching) page can still
  remount on tab switch and re-run its fetch. The demo now caches fetched pages
  in a module-scoped `Map` keyed by the query (served synchronously, no shimmer)
  and passes `persistKey`, so returning to the tab restores the exact page/sort/
  filters and shows the data instantly — no round-trip.

  **For agents:** for a server-backed table, cache responses (module `Map` or
  your data layer) and use `persistKey`; don't rely on keep-alive alone to avoid
  refetches. Docs: `/docs/data-table` (Persisting across tab switches).

## 1.13.1 — 2026-07-26

### Fixed

- **Keep-alive tabs now truly preserve a page's live state across tab switches**
  (within `NEXT_PUBLIC_MAX_TABS`). The scaffold's `KeepAliveTabs` was overwriting
  a route's cached element with Next's fresh `children` on every re-activation,
  which remounted the page and threw away its state — so a server-backed table
  (e.g. the Data Table demo) refetched every time you returned to its tab. It now
  caches each route's element once and reuses it, so switching away and back keeps
  the loaded data, scroll, and form state with no reload. Query-param routes
  (`/organizations/edit?id=…`) still update via their own `useSearchParams`.

## 1.13.0 — 2026-07-26

### Added

- **Server-side ("manual") mode for `RecordView`.** Set `manual` and RecordView
  stops filtering/sorting/paginating `data` — it renders it as the current page
  verbatim and reports the query via `onQueryChange({ page, pageSize, sort,
  search, filters })` so your backend does the work. Pair with `rowCount` (drives
  the footer + page count) and `loading`. Fires once on mount for the initial
  load; per-field filters fire it on the Filter panel's Search/Clear. New exported
  types: `SortState`, `ServerQuery<T>`. Default off — everything stays client-side.
- **Data Table demo page** in the scaffold (shadcn/ui section) — a full
  server-side table against a simulated backend (pagination, sort, keyword +
  per-field filter, loading shimmer, out-of-order-response guard).

### Changed

- The loading skeleton now **shimmers left → right** (a `vui-shimmer` sweep in
  `theme.css`) instead of a pulse — a clearer "records are loading" cue.

  **For agents:** for a server-backed table use `manual` + `rowCount` +
  `onQueryChange` (fetch → set `data`/`rowCount`/`loading`); guard stale
  responses with a request-id ref. Don't reimplement pagination/sort. Demo:
  the Data Table page. Docs: `/docs/data-table` (Server-side data).

## 1.12.0 — 2026-07-26

### Added

- **`RecordView` `loading` prop** — while `true`, the table body renders animated
  skeleton rows (matched to the columns) instead of an empty-state flash, for
  slow server loads (initial fetch or refetch). The toolbar stays usable; clear
  `loading` when the data arrives.

  **For agents:** wrap your fetch with `loading` (`setLoading(true)` → fetch →
  `finally(() => setLoading(false))`); don't hand-roll a spinner overlay. Demo:
  `markets` simulates a load on first visit. Docs: `/docs/data-table`.

## 1.11.1 — 2026-07-26

### Changed

- **Sort indicators are now carets, and every sortable column shows one.** A
  sortable column header shows a muted up/down caret (`CaretSort`) by default —
  so sortability is discoverable — and a solid caret for the active direction:
  `CaretUp` = ascending, `CaretDown` = descending (all Radix icons). The Sort
  dropdown matches. Non-sortable columns (`sortable: false`) show no indicator.

## 1.11.0 — 2026-07-26

### Added

- **Dependent (cascading) options in `RecordView`** — a choice field&apos;s
  options can now depend on another field&apos;s current value, in both the
  Add/Edit form and the Filter panel. Opt-in, backward compatible.
  - Form: `RecordField.options` may be a **function of the draft** —
    `((draft) => { value, label }[])` — recomputed as the draft changes.
  - Filter: `FieldFilter.options` may be a **function of the current filter
    values** — `((values) => { value, label }[])`. `FieldFilter` is now generic
    (`FieldFilter<T>`).
  - **Auto-clear:** when the parent changes and the child&apos;s value is no
    longer a valid option, RecordView clears it (form and filter). Static-array
    options are unchanged; the bulk "Set {label}" action only lists static-option
    fields (no single draft to resolve a function against).

  **For agents:** for a dependent picker (e.g. Country → State) pass a function
  to `options` / `filterable.options`; don&apos;t manually reset the child. If a
  field uses a function `options` *and* `renderInput`, guard with
  `Array.isArray(field.options)` before mapping. Demo: `system/cities`
  (Country → State) in both form and filter. Docs: `/docs/data-table`.

## 1.10.0 — 2026-07-26

### Added

- **`Combobox`** (`@viliha/vui-ui/combobox`) — a searchable single-select. Same
  API as `Select` (drop-in) but the popover leads with a type-to-filter input, so
  it scales to long option lists (an FK / country picker). Keyboard: type to
  filter, ↑/↓ to move, Enter to pick, Esc to close.
- **`RecordView` choice fields can use the Combobox.** In the Add/Edit form set
  `input: "combobox"` on an `options` field for a searchable control (default
  stays `Select`). In the Filter panel, `control: "combobox"` now renders the
  real searchable Combobox (previously it fell back to a plain Select).
- **`RecordField.renderInput`** — an escape hatch to render **any** Add/Edit
  control (checkbox, radio group, slider, date-range, a custom widget). It
  overrides the default control and receives `{ value, onChange, field, invalid }`;
  the field still owns the label, required mark, and Save validation. The
  Organizations form demonstrates it (Status as a radio group).

  **For agents:** for a long choice list use `input: "combobox"`; for a control
  the built-ins don't cover use `renderInput` — never hand-build a `<form>`.
  New demo: Organizations Status (radio via `renderInput`); Combobox is also in
  the components gallery. Docs: `/docs/components`, `/docs/data-table`.

## 1.9.0 — 2026-07-26

### Added

- **`sortable` field flag in `RecordView`** — decouples sorting from column
  visibility. By default a field is sortable iff it's a visible column
  (`!hideInTable`), unchanged. Now:
  - `sortable: true` sorts a field with **no column** (e.g. a `hideInTable` name
    shown via `getPrimary`) — it appears in the Sort dropdown.
  - `sortable: false` keeps a **visible column unsortable** (its header stops
    being a sort toggle).

  Affects both the Sort dropdown and the column-header click. Fully backward
  compatible — omit the flag for today's behavior.

  **For agents:** to make a non-column field sortable (or lock a column), set
  `sortable` on the `RecordField`; don't rewire the Sort dropdown or headers.
  Demo: `system/regions` sorts by Name (which has no column).

## 1.8.0 — 2026-07-26

### Added

- **Per-field filtering in `RecordView`** (opt-in, backward compatible). Mark a
  field `filterable` and the Filter panel switches from the single keyword box to
  a labeled control per field plus **Search / Clear**. The control is dynamic so
  the front end can compose a different filter form per request:
  - `filterable: true` → a text input.
  - `filterable: { control, label, placeholder, options }` → pick the control:
    `"text" | "number" | "date" | "select" | "combobox" | "checkbox"` (unknown or
    omitted → text). `options` falls back to the field's own `options`.
  - New exported types: `FilterControl`, `FieldFilter`, `FilterValues<T>`.
  - The panel **gathers values only** — it does not match rows in per-field mode.
    Wire matching through the new `RecordView` prop `onFilter(values)` (Search and
    Clear both call it), typically a server query or your own client filter. The
    single-keyword box (and its built-in row matching) is unchanged when no field
    is `filterable`.

  **For agents:** to add per-field filters, only set `filterable` on the relevant
  `RecordField`s and handle `onFilter` — never hand-roll a filter form. Extend
  `FilterControl` when a new control kind is needed. Demo: `system/regions`
  (Name + Code). Docs: `/docs/data-table`.

## 1.7.0 — 2026-07-25

### Added

- **Configurable favicon** via the runtime brand system. `BrandProvider` gains a
  `faviconUrl` field (alongside `logoUrl`): set `NEXT_PUBLIC_FAVICON_URL` for a
  build-time default, return `faviconUrl` from your `NEXT_PUBLIC_BRAND_URL` JSON
  (or call `useBrand().setBrand({ faviconUrl })`) to change the browser-tab icon
  live per tenant, no rebuild. The static `app/icon.*` files remain the fallback.

## 1.6.3 — 2026-07-25

### Fixed

- `RecordForm` no longer loses in-progress input when switching tabs **in dev**.
  The draft persistence (`persistKey`) used a first-write flag that React
  StrictMode's effect double-invoke defeated: the second pass wrote the empty
  initial value over the draft the restore effect was about to bring back. The
  writer now skips the untouched seed by identity, so it never clobbers a stored
  draft. (Production builds, which don't run StrictMode's double-invoke, were
  unaffected.)

## 1.6.2 — 2026-07-25

### Fixed

- The scaffolded `next.config.ts` now pins `turbopack.root` to the app dir, so
  Next.js no longer infers the workspace root from a stray lockfile higher up the
  tree (a home-dir `bun.lock`, or an outer monorepo) and emits the "inferred your
  workspace root, but it may not be correct" warning.

## 1.6.1 — 2026-07-25

### Added

- `NEXT_PUBLIC_APP_URL` sets the deploy origin (`SITE.url`), so `metadataBase`,
  canonical URLs, and Open Graph URLs resolve against your domain instead of the
  hard-coded demo host. Falls back to the demo URL when unset. Completes the
  env-driven brand set (`APP_NAME` / `APP_TAGLINE` / `APP_DESCRIPTION` / `APP_URL`).

## 1.6.0 — 2026-07-25

### Changed

- Documentation polish: package-manager commands in the docs now use tabs
  (npm / pnpm / yarn / bun), and the prose across the README, `AGENT.md`, and the
  docs site was cleaned of em-dashes for a more natural read.

### Added

- **Runtime branding via `BrandProvider` / `useBrand()`** (in the scaffold) — for
  white-label / multi-tenant apps that get their branding from an API. Env vars
  are the defaults; override them live from a `NEXT_PUBLIC_BRAND_URL` JSON
  endpoint, a `<BrandProvider initial={…}>` seed, or `useBrand().setBrand(…)`.
  The name, tagline, description, logo, and the browser-tab title all update at
  runtime — no rebuild. Also routes the last hard-coded name spots (onboarding /
  register-business headers, the signin aside) through the runtime brand.

## 1.5.4 — 2026-07-24

### Added

- `NEXT_PUBLIC_APP_NAME` renames the app — the sidebar, wordmark, auth screens,
  and browser-tab metadata read from one place (`SITE.name`) instead of a
  hard-coded "Vui Starter". `NEXT_PUBLIC_APP_TAGLINE` and
  `NEXT_PUBLIC_APP_DESCRIPTION` complete the tab-title/meta rebrand.

### Fixed

- `ChartContainer` no longer triggers Recharts' "width(0) and height(0) … should
  be greater than 0" warning when it renders inside a hidden container (e.g. a
  kept-alive inactive tab). It waits for a measured size before mounting the
  `ResponsiveContainer`.

## 1.5.3 — 2026-07-24

### Added

- The changelog and the **[Upgrading](./AGENT.md#upgrading)** guide now ship in
  the npm package. (They were authored for 1.5.2 but missed that tarball, which
  was published a moment before.)

## 1.5.2 — 2026-07-24

### Changed

- **Turborepo guidance throughout.** `init`'s monorepo note now walks you through
  `cd`-ing into the target app (e.g. `apps/web`), installing deps in that app (or
  via a workspace filter), checking workspace globs, and running with a filter —
  and states clearly that turbo mode does not auto-install.
- **Fuller `AGENT.md`.** Added an "Inside a Turborepo / monorepo" section and
  end-to-end walkthroughs for new-standalone, new-in-monorepo, and existing apps.

## 1.5.1 — 2026-07-24

### Changed

- Rewrote the README and `AGENT.md` prose to a clearer, more natural voice. No
  API changes.

## 1.5.0 — 2026-07-24

### Added

- **`init` installs dependencies for you**, using the package manager it detects
  from your lockfile (npm, pnpm, yarn, or bun). It prompts first; `--yes` skips
  the prompt and `--no-install` opts out. This ends the "Module not found"
  cascade from running `dev` before installing peers.

## 1.4.3 — 2026-07-24

### Fixed

- The scaffolded `globals.css` no longer imports `tw-animate-css`, so the theme
  is self-contained and needs no extra CSS dependency (VUI's own animations live
  in `theme.css`).

## 1.4.1 — 2026-07-24

### Added

- **Turborepo support in `init`** (`--turbo` + `--dir`) — scaffolds into a target
  app directory.
- A `tsconfig.json` in the scaffold (`@/*` → `./*`) so the shell's imports
  resolve, and a TypeScript `next.config.ts` (so a fresh scaffold overwrites
  create-next-app's config instead of leaving two).

### Fixed

- Scaffolding into a fresh Next.js app now works end to end.
- Pinned a patched `postcss` (`^8.5.12`) via pnpm overrides to clear a
  high-severity advisory (GHSA-6g55-p6wh-862q).

> 1.4.1 shipped `next.config.mjs` and 1.4.2 was an interim republish; use **1.4.3
> or later**, which ship `next.config.ts` and the self-contained theme.

## 1.4.0 — 2026-07-24

### Added

- **`init` decision tree**: fresh vs. existing project, and pre-built (shell +
  demo) vs. theme-only (`--fresh`/`--existing`, `--prebuilt`/`--theme-only`).

## 1.3.0 — 2026-07-24

### Added

- **`RecordFormPanel`** — the standard Add/Edit/View slide-over as a standalone
  export, for use outside a table (e.g. a Kanban board).
- `RecordField` gains an `input` type (`number`/`date`) and renders a `Select`
  for `options` fields in the Add/Edit form.

## 1.2.0 — 2026-07-23

### Added

- **`npx @viliha/vui-ui init`** — a scaffolder that copies the app shell (layout,
  sidebar, open tabs, command palette, nav config, logo) and demo pages into your
  repo. Ships a `bin` and a bundled `template/` regenerated from the reference app
  on publish.
- Navigation & open-tabs documentation.

## 1.1.8 — 2026-07-23

### Fixed

- The slide-over record form auto-sizes its width to the content, so long field
  labels no longer wrap or overflow.

## 1.1.7 — 2026-07-23

Baseline release.
