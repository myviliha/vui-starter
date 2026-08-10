<script setup lang="ts">
import { BADGE_BASE, BADGE_VARIANTS, cn, type BadgeVariant } from "@viliha/vui-core";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{ variant?: BadgeVariant; class?: string }>(),
  { variant: "default" },
);

const classes = computed(() => cn(BADGE_BASE, BADGE_VARIANTS[props.variant], props.class));
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
