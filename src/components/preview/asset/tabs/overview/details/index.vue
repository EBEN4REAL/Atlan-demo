<template>
  <div class="px-2 hover:bg-gray-50 hover:rounded py-1">
    <p class="text-gray-400 mb-0 text-sm tracking-wide">Description</p>
    <p class="mb-0 text-dark-400" v-if="description(item)">
      {{ description(item) }}
    </p>
    <p class="mb-0 text-dark-400" v-else>No description available</p>
  </div>
  <div class="mt-3 px-2">
    <p class="text-gray-400 mb-0 text-sm tracking-wide">Rows/Columns</p>
    <p class="mb-0 text-dark-400">
      <span class="tracking-wide font-bold">{{ rowCount(item, true) }}</span>
      rows,
      <span class="tracking-wide font-bold text-primary-500 cursor-pointer">{{
        columnCount(item, true)
      }}</span>
      cols
    </p>
  </div>
  <div class="mt-2 px-2 hover:bg-gray-50 hover:rounded py-1">
    <p class="text-gray-400 mb-0 text-sm tracking-wide">Status</p>
    <StatusBadge
      :status="status(item)"
      :showNoStatus="true"
      :showLabel="true"
    ></StatusBadge>
  </div>

  <div class="mt-2 px-2 hover:bg-gray-50 hover:rounded py-1">
    <p class="text-gray-400 mb-0 text-sm tracking-wide">Owners</p>
    <StatusBadge :status="status(item)"></StatusBadge>
  </div>

  <div class="mt-2 px-2 hover:bg-gray-50 hover:rounded py-1">
    <p class="text-gray-400 mb-0 text-sm tracking-wide">Terms</p>
    <StatusBadge :status="status(item)"></StatusBadge>
  </div>

  <div class="mt-2 px-2 hover:bg-gray-50 hover:rounded py-1">
    <p class="text-gray-400 mb-0 text-sm tracking-wide">Classifications</p>
    <StatusBadge :status="status(item)"></StatusBadge>
  </div>
</template>
            
      <script lang="ts">
import { defineComponent, PropType } from "vue";
import AssetMixin from "~/mixins/asset";
import { Components } from "~/api/atlas/client";

import StatusBadge from "@common/badge/status/index.vue";

export default defineComponent({
  mixins: [AssetMixin],
  components: { StatusBadge },
  props: {
    item: {
      type: Object,
      required: false,
      default(): any {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {},
});
</script>
  
  
     
  <style lang="less" module>
.filter {
  :global(.ant-collapse-header) {
    @apply py-1;
  }

  :global(.ant-collapse-item) {
    @apply border-none;
    // padding: 8px 12px !important;
    // max-width: 60px !important;
    //   min-height: 48px !important;
    //   line-height: 40px;
  }
}
</style>
          