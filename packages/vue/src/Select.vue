<script setup lang="ts">
import { SELECT_TRIGGER, SELECT_PLACEHOLDER, cn } from "@viliha/vui-core";
import {
  SelectContent,
  SelectIcon,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "reka-ui";
import { computed } from "vue";

import SelectContentSurface from "./SelectContent.vue";

/**
 * Trigger plus listbox in one component, the shape the React select has: a
 * select is never used without both, so composing four elements per usage buys
 * nothing. Pass options as the default slot using `SelectItem`.
 */
const model = defineModel<string>();
const props = defineProps<{
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  class?: string;
}>();

// Reka marks the trigger with data-placeholder while nothing is chosen, which
// is how the placeholder gets the muted colour the React select applies in JS.
const trigger = computed(() =>
  cn(SELECT_TRIGGER, `data-[placeholder]:${SELECT_PLACEHOLDER}`, props.class),
);
</script>

<template>
  <SelectRoot v-model="model" :disabled="disabled">
    <SelectTrigger :aria-label="ariaLabel" :class="trigger">
      <SelectValue class="truncate" :placeholder="placeholder" />
      <SelectIcon>
        <svg
          class="vui-icon-plain size-3.5 shrink-0 text-muted-foreground"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </SelectIcon>
    </SelectTrigger>
    <SelectContentSurface>
      <SelectViewport>
        <slot />
      </SelectViewport>
    </SelectContentSurface>
  </SelectRoot>
</template>
