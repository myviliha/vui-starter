<script setup lang="ts">
import { DIALOG_BODY, cn } from "@viliha/vui-core";
import { computed } from "vue";

const props = defineProps<{ class?: string }>();
const classes = computed(() => cn(DIALOG_BODY, props.class));
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
