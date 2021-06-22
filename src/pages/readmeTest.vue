<template>
  <div
    class="flex container flex-col w-full h-full bg-gray-200"
  >
    <h1>readme test yo</h1>
    <div class="readmewrapper">
      <Editor :editable="true" />
    </div>
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
.readmewrapper{
  width: 70vw
}
.container{
   display: flex;
   width: 100vw !important;
  align-items: center;
}
</style>

<route lang="yaml">
  meta:
    layout: project
    requiresAuth: true
</route>

