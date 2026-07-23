Build a reusable component: <Name>

Purpose:    <one line — what it renders / does>
Location:   packages/ui/src/<name>.tsx  (auto-exported as @viliha/vui-ui/<name>)
Props:      # the public API
  - <prop>: <type> — <meaning> (required? default?)
Variants:   <e.g. primary | secondary — or "none">
Sizes:      <sm | md | lg — or "none">
States:     <hover, focus, disabled, loading, empty, error — whichever apply>
Rendering:  <Server Component by default; "use client" only if it needs
             hooks / events / browser APIs — keep the boundary on the leaf>
Design:     theme tokens only (no hard-coded color / spacing / radius);
             match the look of the existing components.

Done when: typed (no `any`), tokenized, light + dark, accessible
(keyboard + visible focus + ARIA), lint + types pass.
