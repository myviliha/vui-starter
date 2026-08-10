<script setup lang="ts">
import { TABS_TRIGGER, cn } from "@viliha/vui-core";
import { TabsTrigger } from "reka-ui";
import { computed } from "vue";

const props = defineProps<{ value: string; disabled?: boolean; class?: string }>();
const classes = computed(() => cn(TABS_TRIGGER, props.class));
</script>

<template>
  <TabsTrigger
    data-slot="tabs-trigger"
    :value="value"
    :disabled="disabled"
    :class="classes"
  >
    <slot />
  </TabsTrigger>
</template>
