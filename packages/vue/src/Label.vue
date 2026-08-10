<script setup lang="ts">
import { cn } from "@viliha/vui-core";
import { Label } from "reka-ui";
import { computed } from "vue";

const props = defineProps<{ for?: string; class?: string }>();
const classes = computed(() =>
  cn(
    "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
    props.class,
  ),
);
</script>

<template>
  <Label data-slot="label" :for="props.for" :class="classes">
    <slot />
  </Label>
</template>
