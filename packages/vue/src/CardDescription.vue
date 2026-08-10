<script setup lang="ts">
import { cn } from "@viliha/vui-core";
import { computed } from "vue";

const props = defineProps<{ class?: string }>();
const classes = computed(() => cn("text-muted-foreground", props.class));
</script>

<template>
  <p :class="classes">
    <slot />
  </p>
</template>
