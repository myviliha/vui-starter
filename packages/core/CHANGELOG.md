# Changelog

All notable changes to `@viliha/vui-core` are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/), and the project uses
[semantic versioning](https://semver.org/).

## 1.0.0 — 2026-08-10

### Added

- **The logic under the design system, without the framework.** Three modules
  that were already framework-free inside the React package, compiled for
  everyone else: the runtime theming engine (`THEME_FIELDS`, `themeToCssVars`,
  `mergeThemes`, `applyTheme`, `parseTheme`, `readableOn`), table import and
  export (`rowsToCSV`, `parseCSV`, `rowsToTableHTML`, `downloadFile`,
  `printTable`), and `cn`.

  Nothing moved. The React package is unchanged and keeps its own copy, so a
  React consumer pays nothing for this. The build generates this package from
  `packages/ui/src`, which is why the two cannot drift, and it fails outright if
  one of those modules ever picks up a framework import.

  Pair it with `@viliha/vui-theme` and you have the look and the logic in any
  framework. What is still React-only is the components themselves.
