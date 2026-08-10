<script setup lang="ts">
import { CollapsibleContent } from "reka-ui";

defineProps<{ class?: string }>();
</script>

<template>
  <CollapsibleContent data-slot="collapsible-content" :class="$props.class">
    <slot />
  </CollapsibleContent>
</template>
