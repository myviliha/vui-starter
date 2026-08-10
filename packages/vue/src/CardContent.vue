<script setup lang="ts">
import { cn } from "@viliha/vui-core";
import { computed } from "vue";

const props = defineProps<{ class?: string }>();
const classes = computed(() => cn("px-5 pb-5", props.class));
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
