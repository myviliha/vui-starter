Build a form: <Add Order>

Record:     <what one row is — an Order, a Customer, a Claim>
Route:      apps/backoffice/app/(app)/<route>/
Opens as:   <slide-over (default) | full-page route>
Data:       <where records come from — a mock module now, your API later>

Layout:     # the form is rows; each row says which sections sit side by side.
            # Three to a row is the most that stays readable.
  Row 1:  <Customer>, <Delivery>
  Row 2:  <Items>, <Payment>, <Notes>
  Row 3:  <Terms>                      # one section on a row fills the row

            Inside every card it is always two columns, one field per row:
            [i] Label *  |  [ control ].  Nothing to decide there.

Sections:   # optional: a line under a card's title. Order and width come from
            # the rows above, so there is nothing else to set here.
  - <Customer>: <what this card is for>

Fields:     # each becomes one row in its card
  - <key>: <Label> — <group> — <text | number | date | select | checkbox | combobox>
      required?   <yes | no>
      tooltip:    <what to type here, in one line — becomes the [i] on the label>
      options:    <for select/combobox: the list, or the API that supplies it>
      validation: <min/max, pattern, email, phone — or "none">

Footer:     <Cancel + Save (default) | name any extra buttons and say what each
             does, whether it validates, and whether it closes the form>
Behaviour:  <defaults unless stated: Save closes the form, delete confirms,
             the saved row flashes, a failing field gets a red border with its
             message on the tooltip>

Test scenarios (happy / unhappy) — generate the real cases from the fields
above; this is only the shape:
  TC-1  Open the form                    -> sections render, first field focused
  TC-2  Save with valid input            -> record saved, form closes, row appears
  TC-3  Save with a required field empty -> inline error, Save blocked, form open
  TC-4  Invalid value (bad email, etc.)  -> inline error naming the problem
  TC-5  Cancel with unsaved edits        -> nothing saved
  TC-6  Save fails on the server         -> error shown, typed values kept
  TC-7  Narrow window                    -> cards collapse to one column

Done when: built from a `fields` array through RecordView/RecordForm (no
hand-rolled <form>), layout set by `formRows` only, every field with help text
has a tooltip, the scenarios above pass, and lint, types and build are clean.
