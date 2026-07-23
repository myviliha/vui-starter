Implement a workflow: <name>

Steps (in order):
  1. <step> — route <…>, inputs <…>, validation <…>, primary action <…>
  2. <step> — …
Entry point:       <where the user starts>
Success end state: <where they land + what record(s) get created/updated>
Back / cancel:     <how each step handles going back and cancelling>
Errors:            <inline validation + failure handling per step>
Data model:        <the record(s) + fields the flow produces>
Building blocks:   <RecordForm | Dialog | AuthCard | a stepper (Steps) — per step>

Done when: each step has loading/error/success, validation (Zod), tokens,
light + dark, a11y, lint + types + build pass.
