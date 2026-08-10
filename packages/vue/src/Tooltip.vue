<script setup lang="ts">
import { TOOLTIP_CONTENT, cn } from "@viliha/vui-core";
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from "reka-ui";
import { computed } from "vue";

/**
 * One component rather than five: a tooltip is always trigger plus bubble, and
 * the React version is the same shape. Pass the trigger as the default slot and
 * the text as `content` (or the `content` slot for markup).
 *
 * It is a light surface with a border, like every other floating panel. Never a
 * dark bubble: that reads as a second design system on top of this one.
 */
const props = withDefaults(
  defineProps<{
    content?: string;
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
    delayDuration?: number;
    class?: string;
  }>(),
  { side: "top", sideOffset: 6, delayDuration: 200 },
);

const classes = computed(() => cn(TOOLTIP_CONTENT, props.class));
</script>

<template>
  <TooltipProvider :delay-duration="delayDuration">
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side="side"
          :side-offset="sideOffset"
          class="pointer-events-none z-[220]"
          :class="classes"
        >
          <slot name="content">{{ content }}</slot>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
