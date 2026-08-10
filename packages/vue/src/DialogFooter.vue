<script setup lang="ts">
import { DIALOG_FOOTER, cn } from "@viliha/vui-core";
import { computed } from "vue";

const props = defineProps<{ class?: string }>();
const classes = computed(() => cn(DIALOG_FOOTER, props.class));
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
