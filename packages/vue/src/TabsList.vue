<script setup lang="ts">
import {
  TABS_LIST_BASE,
  TABS_LIST_VARIANTS,
  cn,
  type TabsListVariant,
} from "@viliha/vui-core";
import { TabsList } from "reka-ui";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{ variant?: TabsListVariant; class?: string }>(),
  { variant: "default" },
);

const classes = computed(() =>
  cn(TABS_LIST_BASE, TABS_LIST_VARIANTS[props.variant], props.class),
);
</script>

<template>
  <TabsList data-slot="tabs-list" :data-variant="variant" :class="classes">
    <slot />
  </TabsList>
</template>
