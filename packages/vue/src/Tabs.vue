<script setup lang="ts">
import { TABS_ROOT, cn } from "@viliha/vui-core";
import { TabsRoot } from "reka-ui";
import { computed } from "vue";

const model = defineModel<string>();
const props = withDefaults(
  defineProps<{ orientation?: "horizontal" | "vertical"; class?: string }>(),
  { orientation: "horizontal" },
);

const classes = computed(() => cn(TABS_ROOT, props.class));
</script>

<template>
  <TabsRoot
    v-model="model"
    data-slot="tabs"
    :data-orientation="orientation"
    :orientation="orientation"
    :class="classes"
  >
    <slot />
  </TabsRoot>
</template>
