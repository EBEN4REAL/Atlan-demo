<template>
  <div>
    <!-- <p>Codemirror</p>
    <Codemirror /> -->

    <div class="flex justify-between mb-2 run-btn-wrapper">
      <p>For asset: superstore_sales_data_2016-present</p>
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
