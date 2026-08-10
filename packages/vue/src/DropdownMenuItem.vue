<script setup lang="ts">
import { DROPDOWN_ITEM, cn } from "@viliha/vui-core";
import { DropdownMenuItem } from "reka-ui";
import { computed } from "vue";

const props = defineProps<{ disabled?: boolean; class?: string }>();
const classes = computed(() => cn(DROPDOWN_ITEM, props.class));
</script>

<template>
  <DropdownMenuItem
    data-slot="dropdown-menu-item"
    :disabled="disabled"
    :class="classes"
    @select="$emit('select', $event)"
  >
    <slot />
  </DropdownMenuItem>
</template>
