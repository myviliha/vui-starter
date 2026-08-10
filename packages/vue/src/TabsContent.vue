<script setup lang="ts">
import { TABS_CONTENT, cn } from "@viliha/vui-core";
import { TabsContent } from "reka-ui";
import { computed } from "vue";

const props = defineProps<{ value: string; class?: string }>();
const classes = computed(() => cn(TABS_CONTENT, props.class));
</script>

<template>
  <TabsContent data-slot="tabs-content" :value="value" :class="classes">
    <slot />
  </TabsContent>
</template>
