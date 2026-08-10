<script setup lang="ts">
import { CollapsibleTrigger } from "reka-ui";

defineProps<{ class?: string }>();
</script>

<template>
  <CollapsibleTrigger data-slot="collapsible-trigger" :class="$props.class">
    <slot />
  </CollapsibleTrigger>
</template>
