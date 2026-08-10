<script setup lang="ts">
import { cn } from "@viliha/vui-core";
import { computed } from "vue";

const props = defineProps<{ class?: string }>();
const classes = computed(() => cn("animate-pulse rounded-md bg-accent", props.class));
</script>

<template>
  <div data-slot="skeleton" :class="classes" />
</template>
