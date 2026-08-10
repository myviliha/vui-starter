<script setup lang="ts">
defineProps<{ class?: string }>();
</script>

<template>
  <code :class="$props.class">
    <slot />
  </code>
</template>
