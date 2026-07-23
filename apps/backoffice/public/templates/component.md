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

Test scenarios (happy / unhappy) — generate the real cases from the props /
variants / states above; this is only the shape:
  TC-1  Renders with required props              -> matches design, tokens applied
  TC-2  Each variant / size                      -> correct styles
  TC-3  Interactive state (click / hover / focus) -> expected behaviour
  TC-4  Disabled (if applicable)                 -> no interaction, dimmed
  TC-5  Keyboard focus                           -> visible ring, operable
  TC-6  Loading / empty / error (if applicable)  -> correct state shown

Done when: typed (no `any`), tokenized, light + dark, accessible
(keyboard + visible focus + ARIA), the scenarios above pass, lint + types pass.
