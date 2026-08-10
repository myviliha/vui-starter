<script setup lang="ts">
import { DIALOG_OVERLAY, DIALOG_PANEL, cn } from "@viliha/vui-core";
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot } from "reka-ui";
import { computed } from "vue";

/**
 * Sectioned modal dialog, the same shell as the React one: centered panel,
 * themed scrim, entrance animation, Escape and backdrop click to close. Compose
 * it with DialogHeader, DialogBody and DialogFooter.
 *
 * Reka owns the focus trap, the scroll lock and the aria wiring, which the
 * React component hand-rolls; the classes are shared so both look identical.
 */
const open = defineModel<boolean>("open");
const props = withDefaults(
  defineProps<{ label?: string; dismissible?: boolean; class?: string }>(),
  { dismissible: true },
);

const panel = computed(() => cn(DIALOG_PANEL, props.class));
</script>

<template>
  <DialogRoot v-model:open="open" :modal="true">
    <DialogPortal>
      <DialogOverlay :class="DIALOG_OVERLAY">
        <DialogContent
          :aria-label="label"
          :class="panel"
          :style="{ '--vui-pop-origin': 'center' }"
          @escape-key-down="dismissible ? undefined : $event.preventDefault()"
          @pointer-down-outside="dismissible ? undefined : $event.preventDefault()"
        >
          <slot />
        </DialogContent>
      </DialogOverlay>
    </DialogPortal>
  </DialogRoot>
</template>
