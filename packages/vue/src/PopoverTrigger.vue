<script setup lang="ts">
import { PopoverTrigger } from "reka-ui";

defineProps<{ class?: string }>();
</script>

<template>
  <PopoverTrigger data-slot="popover-trigger" :class="$props.class">
    <slot />
  </PopoverTrigger>
</template>
