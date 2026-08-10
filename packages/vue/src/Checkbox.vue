<script setup lang="ts">
import { CHECKBOX, cn } from "@viliha/vui-core";
import { computed } from "vue";

// A native checkbox, like the React one: the browser's is accessible, keyboard
// operable and themeable through accent-color, so a headless primitive would
// only add markup.
const model = defineModel<boolean | unknown[]>();
const props = defineProps<{ value?: unknown; disabled?: boolean; class?: string }>();

const classes = computed(() => cn(CHECKBOX, props.class));
</script>

<template>
  <input
    v-model="model"
    type="checkbox"
    :value="value"
    :disabled="disabled"
    :class="classes"
  />
</template>
