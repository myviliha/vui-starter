<script setup lang="ts">
import { DROPDOWN_LABEL, cn } from "@viliha/vui-core";
import { DropdownMenuLabel } from "reka-ui";
import { computed } from "vue";

const props = defineProps<{ class?: string }>();
const classes = computed(() => cn(DROPDOWN_LABEL, props.class));
</script>

<template>
  <DropdownMenuLabel data-slot="dropdown-menu-label" :class="classes">
    <slot />
  </DropdownMenuLabel>
</template>
