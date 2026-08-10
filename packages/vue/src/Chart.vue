<script setup lang="ts">
import { cn } from "@viliha/vui-core";
import { Chart, type ChartDefinition } from "@tanstack/charts/vue";
import { computed } from "vue";

/**
 * A TanStack chart wearing the theme.
 *
 * TanStack Charts has no theme of its own: it paints with `currentColor` and
 * reads six CSS variables for the categorical palette. `vui-chart` (in
 * theme.css) maps our tokens onto those names, so the chart follows light and
 * dark mode and a per-tenant brand with no colour props here and no chart
 * config to keep in sync.
 *
 * Pass a definition built with `defineChart` from `@tanstack/charts`. This
 * component owns the frame and the colours; the definition owns the data.
 */
const props = withDefaults(
  defineProps<{
    definition: ChartDefinition;
    /** Required: a chart with no accessible name is unusable to a screen reader. */
    ariaLabel: string;
    ariaDescription?: string;
    height?: number;
    aspectRatio?: number;
    /** Render inside a bordered card, like the rest of the design system. */
    card?: boolean;
    class?: string;
  }>(),
  { card: true },
);

const classes = computed(() =>
  cn(
    "vui-chart w-full",
    props.card && "rounded-lg border border-border bg-card p-4",
    props.class,
  ),
);
</script>

<template>
  <Chart
    :definition="definition"
    :aria-label="ariaLabel"
    :aria-description="ariaDescription"
    :height="height"
    :aspect-ratio="aspectRatio"
    :class="classes"
  >
    <template v-if="$slots.tooltipBody" #tooltipBody="ctx">
      <slot name="tooltipBody" v-bind="ctx" />
    </template>
  </Chart>
</template>
