<script setup lang="ts">
import { ACCORDION_CONTENT, ACCORDION_CONTENT_INNER, cn } from "@viliha/vui-core";
import { AccordionContent } from "reka-ui";
import { computed } from "vue";

const props = defineProps<{ class?: string }>();
const inner = computed(() => cn(ACCORDION_CONTENT_INNER, props.class));
</script>

<template>
  <AccordionContent
    data-slot="accordion-content"
    :class="ACCORDION_CONTENT"
    :style="{
      // theme.css animates --vui-accordion-height. Radix and Reka each measure
      // the content into their own variable name; this is where ours meets Reka's,
      // exactly as accordion.tsx does for Radix.
      '--vui-accordion-height': 'var(--reka-accordion-content-height)',
    }"
  >
    <div :class="inner"><slot /></div>
  </AccordionContent>
</template>
