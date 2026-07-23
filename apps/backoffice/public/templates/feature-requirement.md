# `<Entity>` — Feature Requirement

> **How to use.** Copy this file, rename it to your entity/feature, and fill every
> `<…>` placeholder. This one file is the complete brief an agent needs to
> **design the UI/UX** (using the VUI page types) **and implement the feature**
> (API + UI). Delete rows/sections that don't apply. If you keep a separate API
> contract, keep this reconciled with it — otherwise this file is the source of
> truth.

## 1 · Resource Information

| Property | Value |
|----------|-------|
| Base Path | `/api/v1/<entities>` |
| Archetype | `<A reference/global-catalog · B org-scoped · C child-of-parent · D other>` |
| ID Type | `<INT (positive) · UUID>` — invalid `{id}` → **400** |
| Org-scoped | `<No — global · Yes — requires x-organization-id header>` |
| Soft Delete / Restore | `<No — hard-delete (guarded if children linked → 409) · Yes — soft-delete + restore>` |
| Bulk API | `<Yes — 1–100 items/request, all-or-nothing · No>` |
| Import / Export | `<Yes · No>` |
| RBAC | `<Enforced · Contract-level 403 only (not enforced yet — don't assert in tests)>` |

## 2 · Screens & Breadcrumb

**Sidebar IA (drives breadcrumbs — add to `nav-config.ts`):** `<Home > Section > Group > Entities>`
**Screens:** List, Create, Edit `<, View?>`.

- **Page type — pick one per screen (see the docs "Page types" catalog):**
  - **List → Data table** (`RecordView` + a `fields` array). Search, pagination, row selection, bulk actions in the header.
  - **Create / Edit → Record form** (`RecordForm`, same fields both times; Edit pre-fills):
    `<slide-over overlay (default) · full-page route (long forms / own URL)>`.
  - **Multi-step?** Use the **Steps** wizard (`@viliha/vui-ui/steps`).
  - Overview screen → **Dashboard**; settings-style form → **Settings**; pipeline → **Board**.
- **Empty state:** `<"No <Entities> found" + one line of guidance + the primary "+ Add <Entity>" action>`.
- **Search:** across `<which fields>`. **Bulk:** `<select-all + bulk delete/edit; note any guard behaviour>`.
- **Create/Edit behaviour:** one form; unsaved-changes confirm on leave; the side **info panel auto-generates from each field's `description`** (no extra design). All spacing/color from theme tokens — never hand-style fields.

### Fields (Create/Edit) → becomes a `RecordField[]`

| Field | Required | Type | Notes (validation · unique · readonly · options · copyable · hideInTable) |
|-------|:--------:|------|---------------------------------------------------------------------------|
| `<Name>` | Yes | `<text · number · select · badge>` | `<e.g. unique (case-insensitive); shown as typed>` |
| `<Code>` | Yes | text | `<unique; auto-capitalized on save>` |
| `<Derived>` | — | number | `<read-only, compute-on-read; not entered by hand>` |

## 3 · API Contract

| Operation | Method | Endpoint | Success | Error status |
|-----------|--------|----------|--------:|--------------|
| Get Many | GET | `/api/v1/<entities>` | 200 | 400, 401, 403 |
| Create One | POST | `/api/v1/<entities>` | 201 | 400, 401, 403, 409 |
| Get One | GET | `/api/v1/<entities>/{id}` | 200 | 400, 401, 403, 404 |
| Update One | PATCH | `/api/v1/<entities>/{id}` | 200 | 400, 401, 403, 404, 409 |
| Delete One | DELETE | `/api/v1/<entities>/{id}` | 204 | 400, 401, 403, 404, 409† |
| Create Many | POST | `/api/v1/<entities>/bulk` | 201 | 400, 401, 403, 409 |
| Update Many | PATCH | `/api/v1/<entities>/bulk` | 200 | 400, 401, 403, 404, 409 |
| Delete Many | DELETE | `/api/v1/<entities>/bulk` | 204 | 400, 401, 403, 404, 409† |
| Export | GET | `/api/v1/<entities>/export` | 200 | 400, 401, 403 |
| Import | POST | `/api/v1/<entities>/import` | 202 | 400, 401, 403, 409 |

`† 409 = <in-use guard, e.g. linked children block delete>`. Bulk bodies: create `{ items }` ·
update `{ ids, data }` · delete `{ ids }`; all-or-nothing. Async ops return `202` + job id → poll.
Error body: `{ statusCode, code, message, details? }`.

## 4 · API Test Matrix

| Scenario | Get One | Get Many | Create | Update | Delete | Bulk |
|----------|:-------:|:--------:|:------:|:------:|:------:|:----:|
| Success | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Invalid path id → 400 | ✓ | – | – | ✓ | ✓ | ✓ |
| Not found → 404 | ✓ | – | – | ✓ | ✓ | ✓ |
| Permission → 403 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Validation → 400 | – | – | ✓ | ✓ | – | ✓ |
| Duplicate → 409 | – | – | ✓ | ✓ | – | ✓ |
| In use → 409 | – | – | – | – | ✓ | ✓ |

## 5 · Business Rules

| Rule | Description | Client message | Endpoint |
|------|-------------|----------------|----------|
| BR-1 | `<e.g. <Field> is required>` | `"<Field> is required."` | POST, PATCH |
| BR-2 | `<e.g. Code auto-capitalized on save>` | — | POST, PATCH |
| BR-3 | `<e.g. <Field> unique (case-insensitive)>` | `"<Field> must be unique."` | POST, PATCH |
| BR-… | `<e.g. cannot delete while children linked>` | `"<message>"` | DELETE |

- **Derived values** are compute-on-read, never stored/entered.
- **Concurrency:** `<last-save-wins · optimistic lock>`.
- Client messages here must match the form's validation/error text.

### Test Scenarios (Happy / Unhappy Path)

> Illustrative example only — the actual scenarios must be generated from the real operations,
> fields, and business rules above (§ 3–5), not copied verbatim from this example.

#### Create

##### Happy Path

| ID | Scenario | Expected |
|----|----------|----------|
| TC-CRT-001 | Create with valid payload | 201 Created |

##### Unhappy Path

| ID | Scenario | Expected |
|----|----------|----------|
| TC-CRT-002 | Missing required field | 400 Bad Request |
| TC-CRT-003 | Duplicate unique value | 409 Conflict |
| TC-CRT-004 | Invalid foreign key | 409 Conflict |

## 6 · Definition of Done

- **UI**: correct page type(s); the form is a `RecordForm` built from the fields table (required `*`,
  centered label/icon/control, colors from tokens — no per-field styling); breadcrumbs derive from
  `nav-config.ts`; light + dark; a11y (keyboard, focus, ARIA).
- **States**: loading, empty, success, error all handled; validation/error text matches § 5.
- **API**: wired (or mocked) per § 3, incl. bulk / import-export if specified; error body shape honoured.
- **Verify**: `check-types`, `lint`, `build` pass; tests for the matrix in § 4 where logic is testable.
