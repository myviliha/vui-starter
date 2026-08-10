<script setup lang="ts">
import { DIALOG_HEADER, cn } from "@viliha/vui-core";
import { computed } from "vue";

const props = defineProps<{ class?: string }>();
const classes = computed(() => cn(DIALOG_HEADER, props.class));
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
