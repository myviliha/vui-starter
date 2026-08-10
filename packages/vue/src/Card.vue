<script setup lang="ts">
import { cn } from "@viliha/vui-core";
import { computed } from "vue";

const props = defineProps<{ class?: string }>();
const classes = computed(() => cn("rounded-lg border border-border bg-card text-card-foreground", props.class));
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
