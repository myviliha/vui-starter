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

Test scenarios (happy / unhappy) — generate the real cases from the steps
above; this is only the shape:
  TC-1  Complete all steps with valid input -> success end state reached
  TC-2  Step N invalid input                -> inline validation, blocked
  TC-3  Back from step N                     -> previous step, input preserved
  TC-4  Cancel mid-flow                      -> returns to entry, nothing created
  TC-5  API failure at submit                -> error shown, can retry
  TC-6  Refresh mid-flow (if persisted)      -> progress restored

Done when: each step has loading/error/success, validation (Zod), the scenarios
above pass, tokens, light + dark, a11y, lint + types + build pass.
