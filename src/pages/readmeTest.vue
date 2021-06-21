<template>
  <div
    class="flex flex-col w-full h-full bg-white"
  >
    <h1 class="font-bold">readme test yo</h1>
    <Editor />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import Editor from "@/common/editor/index.vue"

export default defineComponent({
  components: {
    Editor,
  },
});
</script>

<style lang="less">
</style>

<route lang="yaml">
  meta:
    layout: project
    requiresAuth: true
</route>

