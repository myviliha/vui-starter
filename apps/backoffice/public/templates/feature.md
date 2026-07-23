Implement: <feature name>

Goal:        <the outcome, in one sentence>
Where:       <route(s) / component(s) / a provider in app/_components>
Reuse first: <which existing VUI pieces — RecordView, Dialog, Menu,
              CommandPalette, ChartContainer — build on these, don't reinvent>
Behavior:    <the rules — triggers, inputs, outputs, edge cases>
States:      loading / empty / success / error  (all required)
Data:        <local state | a store | sessionStorage | your API>
Out of scope: <what NOT to build, so it stays focused>

Test scenarios (happy / unhappy) — generate the real cases from the behavior /
states above; this is only the shape:
  TC-1  Trigger with valid input      -> expected outcome
  TC-2  Empty / no data               -> empty state
  TC-3  Failure (API / error)         -> error surfaced, no crash
  TC-4  Edge case <…>                 -> handled gracefully
  TC-5  Re-trigger / idempotency      -> no duplicate side effects

Done when: reuses existing components (no duplicate UI), tokens, a11y,
every state handled, the scenarios above pass, lint + types + build pass.
