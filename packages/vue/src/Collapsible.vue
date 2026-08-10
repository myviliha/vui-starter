<script setup lang="ts">
import { CollapsibleRoot } from "reka-ui";

const open = defineModel<boolean>("open");
defineProps<{ disabled?: boolean }>();
</script>

<template>
  <CollapsibleRoot v-model:open="open" data-slot="collapsible" :disabled="disabled">
    <slot />
  </CollapsibleRoot>
</template>
