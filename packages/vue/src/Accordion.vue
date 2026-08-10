<script setup lang="ts">
import { AccordionRoot } from "reka-ui";

const model = defineModel<string | string[]>();
withDefaults(
  defineProps<{ type?: "single" | "multiple"; collapsible?: boolean; class?: string }>(),
  { type: "single", collapsible: true },
);
</script>

<template>
  <AccordionRoot
    v-model="model"
    data-slot="accordion"
    :type="type"
    :collapsible="collapsible"
    :class="$props.class"
  >
    <slot />
  </AccordionRoot>
</template>
