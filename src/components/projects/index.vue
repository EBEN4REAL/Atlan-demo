<template>
  <div>
    <div class="flex justify-between mb-4 run-btn-wrapper">
      <div>
        <p class="mb-1 text-base">Superstore sales data 2016</p>
        <span class="mr-4 text-sm text-gray"> Add to Test Suite</span>
        <span class="text-sm text-gray">Schedule query</span>
      </div>
      <a-button
        type="primary"
        class="mr-5"
        :loading="isQueryRunning === 'loading' ? true : false"
        @click="runQuery"
        >Run Query</a-button
      >
    </div>
    <Monaco />
  </div>
</template>

<script lang="ts">
import { defineComponent , computed } from "vue";
import Monaco from "@/projects/monaco/monaco.vue";


export default defineComponent({
  components: {
    Monaco,
  },
  props: {
    isQueryRunning: {
      type: String,
    },
  },
  setup(props, context) {
    const isQueryRunning = computed(() => props.isQueryRunning);

    const runQuery = () => {
      context.emit("run");
    };
    return {
      isQueryRunning,
      runQuery,
    };
  },
});
</script>

<style lang="less" scoped>
.monacoeditor {
  height: 30vh;
}
</style>
