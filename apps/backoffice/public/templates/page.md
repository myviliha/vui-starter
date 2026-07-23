Add a page: <Title>

Page type:  <data table | record form | dashboard | settings | board>   # pick one
Route:      apps/backoffice/app/(app)/<route>/page.tsx
Nav:        add to nav-config.ts under section "<Section>" with icon <Icon>
             (sidebar + breadcrumbs follow automatically)
Data:       <where rows/records come from — a mock module now, your API later>

# If it's a DATA TABLE / RECORD FORM, list the fields (become RecordField[]):
Fields:
  - <key>: <label> — <text | number | badge | select> (required? copyable?
            hideInTable? options=[…]?)
Add/Edit/View: <slide-over (default) | full-page route>
Info panel:    <per-field help text?  formDescription intro?>
Actions:       <row actions, bulk actions, import/export?>

Done when: follows the page frame, uses RecordView/RecordForm (never a
hand-rolled table or form), tokens, light + dark, a11y, lint + types + build pass.
