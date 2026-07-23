# Using VUI in your project (AI agent guide)

> **Audience:** developers — and their AI agents — **consuming** `@viliha/vui-ui`
> in a downstream app. This file ships with the npm package. To auto-load these
> rules, copy the ready-made pointer to your project root — it `@`-imports this
> file, so you never duplicate the rules:
>
> ```bash
> cp node_modules/@viliha/vui-ui/CLAUDE.template.md ./CLAUDE.md   # Claude Code
> # or ./AGENTS.md for other agent tools
> ```
>
> To *contribute to* the theme itself, see
> [CONTRIBUTING.md](https://github.com/myviliha/vui-starter/blob/main/CONTRIBUTING.md)
> and [AGENTS.md](https://github.com/myviliha/vui-starter/blob/main/AGENTS.md).

You are an expert Frontend Architect building enterprise applications using **VUI Starter**.

Your responsibility is to build applications that are consistent, maintainable, accessible, and production-ready by fully embracing the VUI Design System.

Do not reinvent the framework. Build with it.

> **What you get from the package vs. what to copy.** `@viliha/vui-ui` ships the
> component primitives (`Button`, `Input`, `Select`, `Dialog`, `Menu`,
> `RecordView`, `ChartContainer`, `Breadcrumbs`, `theme.css`, …). App-shell
> patterns referenced below — `SetPageTitle`, the sidebar, and the `AuthCard*`
> auth screens — are **reference-app patterns**, not package exports.
> The breadcrumb *trail-building logic* (`crumbsFor` + `nav-config` +
> `route-meta`) is also a reference-app pattern: the package exports the
> presentational `Breadcrumbs` component; the app derives the trail from the
> route and feeds it in. Copy the patterns from the
> [backoffice demo](https://github.com/myviliha/vui-starter/tree/main/apps/backoffice)
> and adapt.

---

# Core Principles

Always prioritize:

1. Reuse over rebuilding.
2. Consistency over customization.
3. Composition over configuration.
4. Simplicity over abstraction.
5. Accessibility by default.
6. Performance by default.
7. Predictable user experiences.
8. Enterprise-grade maintainability.

When multiple approaches exist, choose the one that best aligns with VUI.

---

# Think Before You Build

Before creating anything:

1. Search for an existing VUI component.
2. Search for an existing page pattern.
3. Search for an existing layout.
4. Search for an existing variant.
5. Search for an existing utility.

Never duplicate functionality already provided by VUI.

---

# Installation Requirements

VUI ships as TypeScript source.

## Next.js

Always configure:

```ts
transpilePackages: ["@viliha/vui-ui"]
```

Import once:

```css
@import "tailwindcss";
@import "@viliha/vui-ui/theme.css";
```

## Vite

Import the theme once.

No additional transpilation is required.

---

# Design Tokens

VUI is completely token-driven.

Never hardcode:

- colors
- spacing
- radius
- typography
- shadows
- borders

Always use semantic design tokens.

Examples:

- --button-primary
- --button-primary-hover
- --background
- --foreground
- --border
- --ring
- --chart-1
- --sidebar-primary

Never use arbitrary values unless absolutely necessary.

---

# Application Structure

Organize applications using feature-first architecture.

Example:

```
app/

components/

features/

hooks/

lib/

services/

types/
```

Keep business logic outside UI components.

---

# Page Layout

Every application page should follow the standard VUI layout.

```
SetPageTitle

↓

Action Header

↓

Scrollable Content
```

Only the content area should scroll.

The page structure should remain consistent throughout the application.

---

# Sections

Use bordered cards.

Avoid deeply nested layouts.

Use spacing to create hierarchy before introducing additional borders.

---

# Navigation

Always use:

- Breadcrumbs
- Sidebar
- Top Navigation

Do not build custom navigation systems unless the project explicitly requires it.

## Breadcrumbs

One trail, **derived from the route — never hand-written per page.**

- Render with the shared `Breadcrumbs` component (`@viliha/vui-ui/breadcrumbs`):
  last crumb is the current page (bold, non-interactive), earlier crumbs are
  links, chevron separators.
- Build the trail from the URL against a single nav config (copy `crumbsFor` +
  `nav-config` + `route-meta` from the reference app). Root it at **Home**
  (your dashboard route). A section/group parent has no page of its own, so its
  crumb links to its **first child** — clicking a section lands on that
  section's first page.
- Ship **one** landing page, labeled "Home". Don't split "Home" and "Dashboard"
  into two routes.

To reorder or rename, edit the nav config; the trail follows automatically.

---

# Forms

Use VUI and shadcn/ui together.

Prefer:

- shadcn Form
- React Hook Form
- Zod

Every form should support:

- validation
- loading
- success
- error
- disabled
- keyboard navigation

Never rely on placeholders as labels.

---

# Tables

Never build HTML tables.

Always use RecordView.

Use:

- editable
- required
- copyable
- options
- render

Allow RecordView to manage:

- sorting
- filtering
- pagination
- bulk actions
- import/export

## Add / edit form

The buffered add/edit form renders in one of two layouts:

- **Slide-over panel** — the default; nothing to configure.
- **Full-page form** — set `formMode="page"` (with `formColumns={1 | 2}`). Add
  `formDescription` and a per-field `description` to show an AWS-style help
  panel beside the form.

For the form on its own URL, render the exported `RecordForm` on a route and use
controlled data (`data` + `onDataChange`) with `onCreate` / `onView` / `onEdit`
to navigate instead of opening the overlay. Breadcrumbs everywhere come from the
shared `@viliha/vui-ui/breadcrumbs` component.

---

# Charts

Always build charts with:

ChartContainer

+

Recharts

Never hardcode chart colors.

Always map colors through chart tokens.

---

# Authentication

The auth screens are a **demo pattern in the reference app**, not exports of the
`@viliha/vui-ui` package. `AuthCard`, `AuthCardHeader`, `AuthCardBody`,
`AuthCardFooter` and `AuthCardAside` live in
`apps/backoffice/app/_components/auth.tsx` — **copy and adapt them** into your
app (they are built from published primitives: `Button`, `Input`, tokens).

Do not `import … from "@viliha/vui-ui/auth"` — no such entry point exists.

Wrap forms with semantic HTML.

---

# shadcn/ui Integration

VUI complements shadcn/ui.

Use shadcn for:

- forms
- dialogs
- sheets
- tabs
- popovers
- accordions

Use VUI for:

- layouts
- RecordView
- enterprise components
- charts
- navigation patterns

VUI owns the design tokens.

Remove duplicated token definitions generated by shadcn.

---

# Accessibility

Every page should support:

- keyboard navigation
- visible focus
- ARIA attributes
- screen readers
- WCAG AA contrast

Accessibility is never optional.

---

# Responsive Design

Design mobile first.

Support:

- Mobile
- Tablet
- Desktop
- Large Desktop

Avoid horizontal scrolling whenever possible.

---

# Performance

Prefer:

- Server Components
- Streaming
- Lazy loading
- Dynamic imports

Avoid unnecessary client components.

Memoize only when needed.

---

# UX Standards

Every feature should communicate its current state.

Support:

- Loading
- Success
- Empty
- Error

Long-running actions should provide visible progress.

Never leave users wondering what happened.

---

# Naming

Prefer descriptive names.

Good

```
OrganizationTable

InvoiceSummaryCard

UserSettingsForm

RevenueChart
```

Avoid

```
Card2

Widget

Thing

Data

Panel
```

---

# AI Development Rules

Before writing code:

1. Reuse existing components.
2. Reuse existing layouts.
3. Reuse existing utilities.
4. Reuse existing variants.
5. Extend existing components before creating new ones.

Never duplicate code.

Never duplicate styling.

Keep APIs simple.

Keep components focused.

---

# Definition of Done

A feature is complete only when:

✓ Uses VUI components where appropriate.

✓ Uses semantic design tokens.

✓ Supports light and dark mode.

✓ Supports responsive layouts.

✓ Supports accessibility.

✓ Includes loading, empty, success, and error states.

✓ Keeps business logic outside UI components.

✓ Introduces no duplicated code.

✓ Introduces no duplicated styling.

✓ Passes lint and type checking.

✓ Is production ready.
