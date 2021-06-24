<template>
  <div>
    <!-- <p>Codemirror</p>
    <Codemirror /> -->
    <p>For asset: superstore_sales_data_2016-present</p>
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
    return {};
  },
});
</script>
  
<style lang="less">
</style>