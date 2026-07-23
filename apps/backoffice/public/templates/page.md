Add a page: <Title>

Page type:  <data table | record form | dashboard | settings | board>   # pick one
Route:      apps/backoffice/app/(app)/<route>/page.tsx
Nav:        add to nav-config.ts + mirror the color in route-meta.ts
             (sidebar + breadcrumbs + open-tabs all follow automatically).
             Pick the grouping shape:
               - titled Section  — a static band under a heading (always visible)
               - collapsible Group — a parent with `children` that hide/unhide
             (see docs /navigation). Default to an existing Section; only add a
             Group when nesting several related sub-pages.
Data:       <where rows/records come from — a mock module now, your API later>

# If it's a DATA TABLE / RECORD FORM, list the fields (become RecordField[]):
Fields:
  - <key>: <label> — <text | number | badge | select> (required? copyable?
            hideInTable? options=[…]?)
Add/Edit/View: <slide-over (default) | full-page route>
Info panel:    <per-field help text?  formDescription intro?>
Actions:       <row actions, bulk actions, import/export?>

Test scenarios (happy / unhappy) — generate the real cases from the fields /
actions above; this is only the shape:
  TC-1  Loads with data                 -> rows / sections render
  TC-2  Empty data                      -> empty state + primary action
  TC-3  Loading                         -> loading state
  TC-4  Fetch error                     -> error state, no crash
  TC-5  Primary action (+ Add / create) -> opens form / navigates
  TC-6  Create with valid input         -> saved, row appears
  TC-7  Create with invalid input       -> inline validation, blocked

Done when: follows the page frame, uses RecordView/RecordForm (never a
hand-rolled table or form), the scenarios above pass, tokens, light + dark,
a11y, lint + types + build pass.
