<script setup lang="ts">
import { SELECT_ITEM, SELECT_ITEM_CHECKED, cn } from "@viliha/vui-core";
import { SelectItem, SelectItemIndicator, SelectItemText } from "reka-ui";
import { computed } from "vue";

const props = defineProps<{ value: string; disabled?: boolean; class?: string }>();
// Reka reports the selected state as a data attribute, so the highlight is a
// variant rather than a computed class.
const classes = computed(() => cn(SELECT_ITEM, SELECT_ITEM_CHECKED, props.class));
</script>

<template>
  <SelectItem :value="value" :disabled="disabled" :class="classes">
    <SelectItemText><slot /></SelectItemText>
    <SelectItemIndicator>
      <svg
        class="vui-icon-plain size-3.5 shrink-0 text-[var(--button-primary)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </SelectItemIndicator>
  </SelectItem>
</template>
