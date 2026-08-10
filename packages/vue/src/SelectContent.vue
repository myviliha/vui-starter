<script setup lang="ts">
import { SELECT_CONTENT, cn } from "@viliha/vui-core";
import { SelectContent, SelectPortal } from "reka-ui";
import { computed } from "vue";

/**
 * The listbox surface. `Select` renders it for you; it is a component of its
 * own so the stacking rules can be checked on one file, the same way the React
 * package checks select.tsx.
 */
const props = withDefaults(
  defineProps<{ position?: "item-aligned" | "popper"; class?: string }>(),
  { position: "popper" },
);

const classes = computed(() => cn(SELECT_CONTENT, props.class));
</script>

<template>
  <!-- Portalled here rather than by the parent, so using this surface directly
       is as safe as using it through `Select`. Same shape as PopoverContent and
       DropdownMenuContent. -->
  <SelectPortal>
    <SelectContent data-slot="select-content" :position="position" :class="classes">
      <slot />
    </SelectContent>
  </SelectPortal>
</template>
