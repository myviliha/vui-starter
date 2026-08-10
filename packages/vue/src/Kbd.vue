<script setup lang="ts">
import { cn } from "@viliha/vui-core";
import { computed } from "vue";

/** A single keyboard key cap. */
const props = defineProps<{ class?: string }>();
const classes = computed(() =>
  cn(
    "inline-grid min-w-[1.4rem] place-items-center rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] leading-none text-muted-foreground",
    props.class,
  ),
);
</script>

<template>
  <kbd :class="classes">
    <slot />
  </kbd>
</template>
