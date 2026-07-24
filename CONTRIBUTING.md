# Contributing to VUI Starter

Thanks for contributing to **VUI Starter**.

VUI is an enterprise-first design system, not just a component library. A good
contribution improves the system without adding complexity, inconsistency, or
maintenance cost — and part of your job as a contributor is to protect the design
language, the architecture, and the developer experience that are already here.

> **Working with an AI agent?** This file is the *why* (philosophy + PR flow).
> The machine-checkable *what* — exact file locations, hard rules, and the
> verify commands agents must pass — lives in [`AGENTS.md`](./AGENTS.md), which
> agent tools auto-load. Read both.

---

# Core Philosophy

When you contribute to VUI, keep these priorities in order:

1. Consistency over creativity.
2. Reuse over duplication.
3. Composition over configuration.
4. Simplicity over abstraction.
5. Accessibility by default.
6. Performance by default.
7. Backward compatibility.
8. Enterprise UX.

The goal is for your work to feel like it has always belonged in VUI.

---

# Contributor Mindset

Before you write any code, ask yourself a few questions.

## 1. Delete First

Can you solve the problem by removing code, simplifying what's there, or reusing
or extending an existing component? Deleting or reusing almost always beats
writing something new.

---

## 2. Extend Before Create

Don't reach for a new component just because it's the easy path. First ask
whether you can extend an existing component, add a variant, compose the behavior
from parts you already have, or reuse an existing primitive. A brand-new component
should be your last resort.

---

## 3. Blueprint Test

A new component should be solid enough to be copied hundreds of times across the
codebase. If it feels too specific to the case in front of you, simplify it until
it isn't.

---

# Repository Structure

VUI is a Turborepo monorepo, and its package boundaries are strict — respect them.

## packages/ui

This package holds the reusable UI primitives, the enterprise components, the
design tokens, and `theme.css`. Application-specific logic never belongs here.

---

## apps/backoffice

This is where the application pages, business logic, demo implementations, and
example integrations live — plus **the documentation site**, whose routes sit
under `app/docs` and are served at `/docs`.

It's the only app in the repo: it both demonstrates the design system and hosts
the docs, so there is no separate `apps/docs` package. Document every public
component under `app/docs`.

---

# Design System Rules

## Tokens

Every design value comes from one place:

```css
@import "@viliha/vui-ui/theme.css";
```

Never hardcode colors, spacing, radius, shadows, typography, or z-index. Reach for
the semantic token instead, every time.

---

## Components

Aim for components that are reusable, composable, predictable, focused, and
stateless wherever you can manage it. Steer away from large configuration APIs and
let composition do the work instead.

---

## Accessibility

Accessibility is mandatory, not a nice-to-have. Every public component must support
keyboard navigation, visible focus, screen readers, and the right ARIA attributes,
and must meet WCAG AA contrast.

---

## Dark Mode

Every component has to work in both light and dark mode. Get there through the
design tokens — never with component-specific color overrides.

---

## Responsiveness

Design mobile first, and make sure components hold up across mobile, tablet, and
desktop. Avoid horizontal scrolling wherever you can.

---

# Code Standards

Before you create anything, search the codebase for an existing component, hook,
utility, or pattern that already does the job. Don't duplicate code, variants, or
utilities.

---

# Public APIs

Treat public APIs as contracts. Don't rename props, change variants, remove
exports, or break existing behavior. When an API needs to grow, extend it rather
than replace it.

---

# Documentation

Document every new public component with its purpose, its props, a usage example,
and its accessibility notes. Whenever public behavior changes, update the docs to
match.

---

# Validation

Before you open a pull request, run:

```bash
pnpm lint
pnpm check-types
pnpm build
```

The project must come back clean: zero lint warnings, zero TypeScript errors, no
unused imports, and no dead code.

---

# Changelog & docs are mandatory (never skip)

Every feature, change, fix, or removal **must** update the docs in the same PR —
this applies to everyone, humans and AI agents alike, no exceptions:

- **`packages/ui/CHANGELOG.md`** — add an entry under the target version
  (Added / Changed / Fixed / Removed). If the change ships in the npm package,
  bump `packages/ui/package.json` per semver.
- **Every doc that describes it** — keep them in sync: `packages/ui/README.md`,
  `packages/ui/AGENT.md`, the docs site under `apps/backoffice/app/docs/**` (plus
  the nav in `components/docs-shell.tsx` if you add a page), and the requirement
  templates when a page/feature pattern changes.

A change that touches code but not the changelog and docs is **incomplete** and
will not be merged.

# Pull Request Checklist

Every Pull Request should:

- **Update `CHANGELOG.md`** (and bump the `packages/ui` version if it ships in the package) — mandatory.
- **Update all affected docs** (README, `AGENT.md`, `/docs`, templates) — mandatory.
- Follow existing design patterns.
- Use design tokens.
- Support dark mode.
- Support accessibility.
- Be responsive.
- Include loading, empty, and error states where applicable.
- Avoid duplicated logic.
- Avoid duplicated styling.
- Preserve backward compatibility.

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
- It is fully documented, and the **`CHANGELOG.md` entry is added** (with a version bump if it ships in the package).
- It is production ready.

---

# One Final Rule

When in doubt, **build the solution that makes VUI simpler, not larger.** Every
contribution should cut future maintenance, sharpen consistency, and leave the
design system stronger for everyone who builds on it.
