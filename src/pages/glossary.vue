<template>
  <splitpanes class="default-theme h-full">
    <pane min-size="25" max-size="50" size="25" class="bg-white"> </pane>
    <pane></pane>
  </splitpanes>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";
export default defineComponent({});
</script>

<route lang="yaml">
    meta:
      layout: default
      requiresAuth: true
</route>