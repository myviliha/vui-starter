<script setup lang="ts">
import { DROPDOWN_CONTENT, cn } from "@viliha/vui-core";
import { DropdownMenuContent, DropdownMenuPortal } from "reka-ui";
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    align?: "start" | "center" | "end";
    sideOffset?: number;
    class?: string;
  }>(),
  { align: "start", sideOffset: 4 },
);

const classes = computed(() => cn(DROPDOWN_CONTENT, props.class));
</script>

<template>
  <!-- Portalled so a menu opened inside a scrolling card or a slide-over is not
       clipped by it; z-[200] in the shared class puts it above both. -->
  <DropdownMenuPortal>
    <DropdownMenuContent
      data-slot="dropdown-menu-content"
      :align="align"
      :side-offset="sideOffset"
      :class="classes"
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
