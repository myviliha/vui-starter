Implement: <feature name>

Goal:        <the outcome, in one sentence>
Where:       <route(s) / component(s) / a provider in app/_components>
Reuse first: <which existing VUI pieces — RecordView, Dialog, Menu,
              CommandPalette, ChartContainer — build on these, don't reinvent>
Behavior:    <the rules — triggers, inputs, outputs, edge cases>
States:      loading / empty / success / error  (all required)
Data:        <local state | a store | sessionStorage | your API>
Out of scope: <what NOT to build, so it stays focused>

Done when: reuses existing components (no duplicate UI), tokens, a11y,
every state handled, lint + types + build pass.
