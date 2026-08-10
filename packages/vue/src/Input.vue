<script setup lang="ts">
import { cn } from "@viliha/vui-core";
import { computed } from "vue";

// v-model is how a Vue developer expects an input to work; the React component's
// controlled-value prop has no equivalent idiom here.
const model = defineModel<string | number>();
const props = defineProps<{ class?: string }>();

const classes = computed(() =>
  cn(
    "flex h-8 w-full rounded-md border border-input bg-background px-2.5 py-1 transition-colors",
    "placeholder:text-muted-foreground",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
    // Invalid state — set `aria-invalid` and the border/ring turn destructive
    // (the `[aria-invalid]` selector out-specifies the base border, no !important).
    "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "file:border-0 file:bg-transparent file:font-medium",
    props.class,
  ),
);
</script>

<template>
  <input v-model="model" :class="classes" />
</template>
