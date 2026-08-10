<script setup lang="ts">
import { POPOVER_CONTENT, cn } from "@viliha/vui-core";
import { PopoverContent, PopoverPortal } from "reka-ui";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    align?: "start" | "center" | "end";
    sideOffset?: number;
    class?: string;
  }>(),
  { align: "center", sideOffset: 4 },
);

const classes = computed(() =>
  cn(
    POPOVER_CONTENT,
    // Reka publishes the measured origin under its own name, the way Radix does
    // for the React component. Everything else about the surface is shared.
    "origin-(--reka-popover-content-transform-origin)",
    props.class,
  ),
);
</script>

<template>
  <PopoverPortal>
    <PopoverContent
      data-slot="popover-content"
      :align="align"
      :side-offset="sideOffset"
      :class="classes"
    >
      <slot />
    </PopoverContent>
  </PopoverPortal>
</template>
