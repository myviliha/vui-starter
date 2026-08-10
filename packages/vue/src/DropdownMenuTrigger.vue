<script setup lang="ts">
import {
  DROPDOWN_TRIGGER,
  DROPDOWN_TRIGGER_ACTIVE,
  DROPDOWN_TRIGGER_IDLE,
  cn,
} from "@viliha/vui-core";
import { DropdownMenuTrigger } from "reka-ui";
import { computed } from "vue";

const props = defineProps<{ active?: boolean; class?: string }>();
const classes = computed(() =>
  cn(
    DROPDOWN_TRIGGER,
    props.active ? DROPDOWN_TRIGGER_ACTIVE : DROPDOWN_TRIGGER_IDLE,
    props.class,
  ),
);
</script>

<template>
  <DropdownMenuTrigger data-slot="dropdown-menu-trigger" :class="classes">
    <slot />
  </DropdownMenuTrigger>
</template>
