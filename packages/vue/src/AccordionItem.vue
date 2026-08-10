<script setup lang="ts">
import { ACCORDION_ITEM, cn } from "@viliha/vui-core";
import { AccordionItem } from "reka-ui";
import { computed } from "vue";

const props = defineProps<{ value: string; disabled?: boolean; class?: string }>();
const classes = computed(() => cn(ACCORDION_ITEM, props.class));
</script>

<template>
  <AccordionItem data-slot="accordion-item" :value="value" :disabled="disabled" :class="classes">
    <slot />
  </AccordionItem>
</template>
