<template>
  <div>
    <!-- <p>Codemirror</p>
    <Codemirror /> -->

    <div class="flex justify-between mb-4 run-btn-wrapper">
      <div>
        <p class="text-base mb-1">Superstore sales data 2016</p>
        <span class="text-sm text-gray-400 mr-4">Add to Test Suite</span>
        <span class="text-sm text-gray-400">Schedule query</span>
      </div>
      <a-button type="primary" class="mr-5" @click="runQuery"
        >Run Query</a-button
      >
    </div>
    <Monaco />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Monaco from "@/editor/monaco/monaco.vue";

export default defineComponent({
  components: {
    Monaco,
  },
  setup(props, context) {
    const runQuery = () => {
      console.log("run");
    };
    return {
      runQuery,
    };
  },
});
</script>

<style lang="less"></style>
