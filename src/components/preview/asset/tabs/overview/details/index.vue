<template>
  <div class="flex flex-col px-2 space-y-3">
    <div class="px-2">
      <p class="mb-0 text-sm tracking-wide text-gray-400">Rows/Columns</p>
      <p class="mb-0 text-dark-400">
        <span class="font-bold tracking-wide">{{ rowCount(item, true) }}</span>
        rows,
        <span class="font-bold tracking-wide cursor-pointer text-primary-500">{{
          columnCount(item, true)
        }}</span>
        cols
      </p>
    </div>

    <Description :item="item"></Description>

    <Status :item="item" :key="item.guid"></Status>

    <div class="px-2 hover:bg-gray-50 hover:rounded">
      <p class="mb-0 text-sm tracking-wide text-gray-400">Owners</p>
      <!-- <StatusBadge :status="status(item)"></StatusBadge> -->
    </div>

    <div class="px-2 hover:bg-gray-50 hover:rounded">
      <p class="mb-0 text-sm tracking-wide text-gray-400">Terms</p>
      <!-- <StatusBadge :status="status(item)"></StatusBadge> -->
    </div>

    <div class="px-2 py-1 mt-2 hover:bg-gray-50 hover:rounded">
      <p class="mb-0 text-sm tracking-wide text-gray-400">Classifications</p>
      <!-- <StatusBadge :status="status(item)" :key="item.guid"></StatusBadge> -->
    </div>
  </div>
</template>
            
<script lang="ts">
import { defineComponent } from "vue";
import AssetMixin from "~/mixins/asset";

import Description from "./description.vue";
import Status from "./status.vue";

export default defineComponent({
  mixins: [AssetMixin],
  components: { Status, Description },
  props: {
    item: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  setup(props) {
    return {};
  },
});
</script>
  
  
     
<style lang="less" module>
</style>
          