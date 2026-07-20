# Contributing to VUI Starter

Thank you for contributing to **VUI Starter**.

VUI is an **enterprise-first design system**, not simply a component library. Every contribution should improve the system without increasing complexity, inconsistency, or maintenance cost.

As a contributor, your responsibility is to preserve the design language, architecture, and developer experience.

> **Working with an AI agent?** This file is the *why* (philosophy + PR flow).
> The machine-checkable *what* — exact file locations, hard rules, and the
> verify commands agents must pass — lives in [`AGENTS.md`](./AGENTS.md), which
> agent tools auto-load. Read both.

---

# Core Philosophy

When contributing to VUI, always prioritize:

1. Consistency over creativity.
2. Reuse over duplication.
3. Composition over configuration.
4. Simplicity over abstraction.
5. Accessibility by default.
6. Performance by default.
7. Backward compatibility.
8. Enterprise UX.

A contribution should feel like it has always belonged in VUI.

---

# Contributor Mindset

Before writing code, ask yourself:

## 1. Delete First

Can this problem be solved by:

- removing code
- simplifying code
- reusing an existing component
- extending an existing component

Deleting or reusing code is always preferred over creating something new.

---

## 2. Extend Before Create

Never create a new component simply because it is easier.

Instead ask:

- Can an existing component be extended?
- Can this become a variant?
- Can composition solve this?
- Can an existing primitive be reused?

New components should be the last option.

---

## 3. Blueprint Test

Every new component should be good enough that it could be copied hundreds of times throughout the codebase.

If it feels overly specific, simplify it.

---

# Repository Structure

VUI uses a Turborepo monorepo.

Follow package boundaries strictly.

## packages/ui

Contains:

- reusable UI primitives
- enterprise components
- design tokens
- theme.css

Never place application-specific logic here.

---

## apps/backoffice

Contains:

- application pages
- business logic
- demo implementations
- example integrations
- **the documentation site** — routes under `app/docs`, served at `/docs`

This is the only app; it demonstrates the design system **and** hosts the docs
(there is no separate `apps/docs` package). Every public component should be
documented under `app/docs`.

---

# Design System Rules

## Tokens

Everything must come from:

```css
@import "@viliha/vui-ui/theme.css";
```

Never hardcode:

- colors
- spacing
- radius
- shadows
- typography
- z-index

Always use semantic tokens.

---

## Components

Components should be:

- reusable
- composable
- predictable
- focused
- stateless whenever possible

Avoid components with large configuration APIs.

Prefer composition.

---

## Accessibility

Every public component must support:

- keyboard navigation
- visible focus
- screen readers
- ARIA attributes
- WCAG AA contrast

Accessibility is mandatory.

---

## Dark Mode

Every component must work in:

- Light Mode
- Dark Mode

Never create component-specific color overrides.

Use design tokens.

---

## Responsiveness

Design mobile first.

Components should work across:

- Mobile
- Tablet
- Desktop

Avoid horizontal scrolling whenever possible.

---

# Code Standards

Before creating anything:

- Search for existing components.
- Search for existing hooks.
- Search for existing utilities.
- Search for existing patterns.

Never duplicate code.

Never duplicate variants.

Never duplicate utilities.

---

# Public APIs

Public APIs are contracts.

Avoid:

- renaming props
- changing variants
- removing exports
- breaking existing behavior

Prefer extending APIs instead of replacing them.

---

# Documentation

Every new public component should include:

- Purpose
- Props
- Usage example
- Accessibility notes

Update documentation whenever public behavior changes.

---

# Validation

Before opening a Pull Request, verify:

```bash
pnpm lint
pnpm check-types
pnpm build
```

The project must produce:

- zero lint warnings
- zero TypeScript errors
- zero unused imports
- zero dead code

---

# Pull Request Checklist

Every Pull Request should:

- Follow existing design patterns.
- Use design tokens.
- Support dark mode.
- Support accessibility.
- Be responsive.
- Include loading, empty, and error states where applicable.
- Avoid duplicated logic.
- Avoid duplicated styling.
- Preserve backward compatibility.
- Update documentation when necessary.

---

# Definition of Done

A contribution is complete only when:

- It follows existing VUI architecture.
- It introduces no unnecessary abstractions.
- It introduces no duplicated code.
- It introduces no duplicated styling.
- It preserves API compatibility.
- It uses semantic design tokens.
- It supports light and dark mode.
- It passes accessibility requirements.
- It is responsive.
- It passes all validation checks.
- It is fully documented.
- It is production ready.

---

# One Final Rule

When in doubt:

**Build the solution that makes VUI simpler, not larger.**

Every contribution should reduce future maintenance, improve consistency, and strengthen the design system for everyone.
