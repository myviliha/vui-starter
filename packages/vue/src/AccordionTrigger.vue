<script setup lang="ts">
import { ACCORDION_CHEVRON, ACCORDION_TRIGGER, cn } from "@viliha/vui-core";
import { AccordionHeader, AccordionTrigger } from "reka-ui";
import { computed } from "vue";

const props = defineProps<{ class?: string }>();
const classes = computed(() => cn(ACCORDION_TRIGGER, props.class));
</script>

<template>
  <AccordionHeader class="flex">
    <AccordionTrigger data-slot="accordion-trigger" :class="classes">
      <slot />
      <!-- Inline so the package needs no icon dependency; the React component
           uses the same glyph from lucide. -->
      <svg
        :class="ACCORDION_CHEVRON"
        xmlns="http://www.w3.org/2000/svg"
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
    </AccordionTrigger>
  </AccordionHeader>
</template>
