<script setup lang="ts">
import { DIALOG_TITLE, cn } from "@viliha/vui-core";
import { computed } from "vue";

const props = defineProps<{ class?: string }>();
const classes = computed(() => cn(DIALOG_TITLE, props.class));
</script>

<template>
  <h2 :class="classes">
    <slot />
  </h2>
</template>
