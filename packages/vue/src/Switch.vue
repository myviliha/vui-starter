<script setup lang="ts">
import { SWITCH_ROOT, SWITCH_THUMB, cn } from "@viliha/vui-core";
import { SwitchRoot, SwitchThumb } from "reka-ui";
import { computed } from "vue";

const model = defineModel<boolean>();
const props = withDefaults(
  defineProps<{ size?: "sm" | "default"; disabled?: boolean; class?: string }>(),
  { size: "default" },
);

const classes = computed(() => cn(SWITCH_ROOT, props.class));
</script>

<template>
  <SwitchRoot
    v-model="model"
    data-slot="switch"
    :data-size="size"
    :disabled="disabled"
    :class="classes"
  >
    <SwitchThumb data-slot="switch-thumb" :class="SWITCH_THUMB" />
  </SwitchRoot>
</template>
