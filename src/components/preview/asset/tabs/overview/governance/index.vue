<template>
  <div class="flex flex-col px-2 space-y-3">
    <Terms :item="item" :key="item.guid"></Terms>

    <Classifications
      :item="item"
      :key="item.guid"
      :selectedAssetData="selectedAssetData"
    ></Classifications>
    <!-- <StatusBadge :status="status(item)" :key="item.guid"></StatusBadge> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Classifications from "./classifications/index.vue";
import Terms from "./terms.vue";

export default defineComponent({
  components: { Classifications, Terms },
  props: {
    item: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
    selectedAssetData: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  setup(props, { emit }) {
    return {};
  },
});
</script>

<style lang="less" module></style>
