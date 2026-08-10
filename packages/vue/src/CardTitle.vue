<script setup lang="ts">
import { cn } from "@viliha/vui-core";
import { computed } from "vue";

const props = defineProps<{ class?: string }>();
const classes = computed(() => cn("font-semibold leading-none tracking-tight", props.class));
</script>

<template>
  <h3 :class="classes">
    <slot />
  </h3>
</template>
