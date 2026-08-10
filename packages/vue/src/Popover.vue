<script setup lang="ts">
import { PopoverRoot } from "reka-ui";

const open = defineModel<boolean>("open");
</script>

<template>
  <PopoverRoot v-model:open="open" data-slot="popover">
    <slot />
  </PopoverRoot>
</template>
