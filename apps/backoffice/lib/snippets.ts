// Copy-paste markup for people with no component package: plain HTML, Blade,
// Twig, ERB, anything that emits tags.
//
// The classes are read from `@viliha/vui-core`, the same source the React and
// Vue components render, so a snippet on the docs site cannot drift from the
// components. Change a button's hover state once and every snippet follows.

import {
  BADGE_BASE,
  BADGE_VARIANTS,
  BUTTON_BASE,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  CHECKBOX,
  DIALOG_BODY,
  DIALOG_FOOTER,
  DIALOG_HEADER,
  DIALOG_OVERLAY,
  DIALOG_PANEL,
  DIALOG_TITLE,
  DROPDOWN_ITEM,
  SELECT_TRIGGER,
  cn,
} from "@viliha/vui-core";

export type Snippet = {
  id: string;
  title: string;
  /** What it is for, and anything a copy-paste user needs to know. */
  note: string;
  html: string;
  /** The same thing as a Blade component, for Laravel. */
  blade?: { path: string; body: string; usage: string };
};

const INPUT =
  "flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50";

const CARD = "rounded-lg border border-border bg-card text-card-foreground";

export const SNIPPETS: Snippet[] = [
  {
    id: "button",
    title: "Button",
    note: "Every variant is the same base plus one variant class and one size class.",
    html: `<button type="button" class="${cn(BUTTON_BASE, BUTTON_VARIANTS.primary, BUTTON_SIZES.default)}">
  Save
</button>

<button type="button" class="${cn(BUTTON_BASE, BUTTON_VARIANTS.default, BUTTON_SIZES.default)}">
  Cancel
</button>`,
    blade: {
      path: "resources/views/components/vui/button.blade.php",
      body: `@props(['variant' => 'default', 'size' => 'default'])

@php
    $base = '${BUTTON_BASE}';
    $variants = [
        'default' => '${BUTTON_VARIANTS.default}',
        'primary' => '${BUTTON_VARIANTS.primary}',
        'ghost' => '${BUTTON_VARIANTS.ghost}',
        'destructive' => '${BUTTON_VARIANTS.destructive}',
    ];
    $sizes = [
        'default' => '${BUTTON_SIZES.default}',
        'sm' => '${BUTTON_SIZES.sm}',
        'lg' => '${BUTTON_SIZES.lg}',
        'icon' => '${BUTTON_SIZES.icon}',
    ];
@endphp

<button {{ $attributes->merge(['type' => 'button', 'class' => $base.' '.$variants[$variant].' '.$sizes[$size]]) }}>
    {{ $slot }}
</button>`,
      usage: `<x-vui.button variant="primary">Save</x-vui.button>`,
    },
  },
  {
    id: "badge",
    title: "Badge",
    note: "Status pills. The success and warning variants already carry their dark-mode colours.",
    html: `<span class="${cn(BADGE_BASE, BADGE_VARIANTS.success)}">Active</span>
<span class="${cn(BADGE_BASE, BADGE_VARIANTS.muted)}">Draft</span>
<span class="${cn(BADGE_BASE, BADGE_VARIANTS.destructive)}">Overdue</span>`,
    blade: {
      path: "resources/views/components/vui/badge.blade.php",
      body: `@props(['variant' => 'default'])

@php
    $variants = [
        'default' => '${BADGE_VARIANTS.default}',
        'muted' => '${BADGE_VARIANTS.muted}',
        'success' => '${BADGE_VARIANTS.success}',
        'warning' => '${BADGE_VARIANTS.warning}',
        'destructive' => '${BADGE_VARIANTS.destructive}',
    ];
@endphp

<span {{ $attributes->merge(['class' => '${BADGE_BASE} '.$variants[$variant]]) }}>{{ $slot }}</span>`,
      usage: `<x-vui.badge variant="success">Active</x-vui.badge>`,
    },
  },
  {
    id: "card",
    title: "Card",
    note: "The section card the whole design system is built from: bordered, with a muted header and a body.",
    html: `<section class="${CARD} overflow-hidden">
  <header class="${DIALOG_HEADER}">
    <h2 class="${DIALOG_TITLE}">Team</h2>
  </header>
  <div class="px-5 py-4 text-sm leading-relaxed">
    Anything goes here.
  </div>
</section>`,
    blade: {
      path: "resources/views/components/vui/card.blade.php",
      body: `@props(['title' => null])

<section {{ $attributes->merge(['class' => '${CARD} overflow-hidden']) }}>
    @if ($title)
        <header class="${DIALOG_HEADER}">
            <h2 class="${DIALOG_TITLE}">{{ $title }}</h2>
        </header>
    @endif
    <div class="px-5 py-4 text-sm leading-relaxed">{{ $slot }}</div>
</section>`,
      usage: `<x-vui.card title="Team">Anything goes here.</x-vui.card>`,
    },
  },
  {
    id: "form",
    title: "Input, select and checkbox",
    note: "Add aria-invalid to an input and the border and focus ring turn destructive on their own.",
    html: `<label class="flex items-center gap-2 text-sm leading-none font-medium select-none" for="email">
  Email
</label>
<input id="email" type="email" placeholder="you@example.com" class="${INPUT}" />

<select class="${SELECT_TRIGGER}">
  <option>Platform</option>
  <option>Growth</option>
</select>

<input type="checkbox" class="${CHECKBOX}" />`,
  },
  {
    id: "table",
    title: "Table",
    note: "Bordered rows with a muted header, matching the datatable the React package ships.",
    html: `<div class="${CARD} vui-scroll overflow-x-auto">
  <table class="w-full border-collapse text-sm">
    <thead>
      <tr class="border-b border-border bg-muted/40 text-left">
        <th class="px-4 py-2.5 font-medium">Name</th>
        <th class="px-4 py-2.5 font-medium">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-border transition-colors last:border-b-0 hover:bg-accent/50">
        <td class="px-4 py-2.5">Acme Retail</td>
        <td class="px-4 py-2.5">
          <span class="${cn(BADGE_BASE, BADGE_VARIANTS.success)}">Active</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>`,
  },
  {
    id: "menu",
    title: "Menu",
    note: "The bordered-row list standard. Separators between rows, none trailing.",
    html: `<div class="w-56 overflow-hidden rounded-md border border-border bg-popover text-sm shadow-md">
  <button type="button" class="${DROPDOWN_ITEM}">Rename</button>
  <button type="button" class="${DROPDOWN_ITEM}">Duplicate</button>
  <button type="button" class="${DROPDOWN_ITEM}">Delete</button>
</div>`,
  },
  {
    id: "dialog",
    title: "Dialog",
    note: "Markup only: opening, closing and the focus trap are yours. In Laravel, Alpine's x-show and x-trap do it in two attributes.",
    html: `<div class="${DIALOG_OVERLAY}">
  <div role="dialog" aria-modal="true" aria-label="Invite" class="${DIALOG_PANEL}">
    <div class="${DIALOG_HEADER}">
      <h2 class="${DIALOG_TITLE}">Invite teammate</h2>
    </div>
    <div class="${DIALOG_BODY}">Anything goes here.</div>
    <div class="${DIALOG_FOOTER}">
      <button type="button" class="${cn(BUTTON_BASE, BUTTON_VARIANTS.default, BUTTON_SIZES.default)}">Cancel</button>
      <button type="button" class="${cn(BUTTON_BASE, BUTTON_VARIANTS.primary, BUTTON_SIZES.default)}">Send invite</button>
    </div>
  </div>
</div>`,
  },
];
