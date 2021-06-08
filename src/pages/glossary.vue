<template>
  <splitpanes class="h-full default-theme">
    <pane min-size="25" max-size="50" :size="25" class="px-3 bg-white">
      <a-input placeholder="Search" class="mt-3"></a-input>
      <GlossaryTree></GlossaryTree>
    </pane>
    <pane :size="74"> </pane>
  </splitpanes>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from "vue";

import GlossaryTree from "@common/tree/glossary/index.vue";

export default defineComponent({
  components: { GlossaryTree },
});
</script>

<route lang="yaml">
    meta:
      layout: default
      requiresAuth: true
</route>