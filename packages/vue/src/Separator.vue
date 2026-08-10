<script setup lang="ts">
import { cn } from "@viliha/vui-core";
import { Separator } from "reka-ui";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    orientation?: "horizontal" | "vertical";
    decorative?: boolean;
    class?: string;
  }>(),
  { orientation: "horizontal", decorative: true },
);

const classes = computed(() =>
  cn(
    "shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
    props.class,
  ),
);
</script>

<template>
  <Separator
    data-slot="separator"
    :orientation="orientation"
    :decorative="decorative"
    :class="classes"
  />
</template>
