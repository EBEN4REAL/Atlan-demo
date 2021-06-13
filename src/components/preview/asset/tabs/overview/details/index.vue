<template>
  <div class="px-2">
    <a-popover
      placement="left"
      overlayClassName="inlinepopover"
      trigger="click"
    >
      <template #content>
        <a-textarea
          placeholder="Description"
          :class="$style.borderless"
          :rows="10"
          style="width: 300px"
        >
        </a-textarea>
        <div class="flex justify-end p-2 border-t border-gray-100">
          <a-button type="primary" size="small">Update</a-button>
        </div>
      </template>
      <div class="px-2 py-1 rounded-lg hover:bg-white hover:border">
        <p class="mb-0 text-sm tracking-wide text-gray-400">Description</p>
        <p class="mb-0 text-dark-400" v-if="description(item)">
          {{ description(item) }}
        </p>
        <p class="mb-0 text-dark-400" v-else>No description available</p>
      </div>
    </a-popover>

    <div class="px-4 mt-3">
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

    <a-popover
      placement="left"
      overlayClassName="inlinepopover"
      trigger="click"
    >
      <template #content>
        <a-input
          placeholder="Status"
          :class="$style.borderless"
          style="width: 300px"
        >
        </a-input>
        <a-radio-group>
          <a-radio>Status</a-radio>
        </a-radio-group>
      </template>
      <div class="px-2 py-1 rounded-lg hover:bg-white hover:border">
        <p class="mb-0 text-sm tracking-wide text-gray-400">Status</p>
        <StatusBadge
          :status="status(item)"
          :showNoStatus="true"
          :showLabel="true"
        ></StatusBadge>
      </div>
    </a-popover>

    <!-- <div class="px-4 py-1 mt-2 hover:bg-gray-50 hover:rounded">
      <p class="mb-0 text-sm tracking-wide text-gray-400">Owners</p>
      <StatusBadge :status="status(item)"></StatusBadge>
    </div> -->

    <div class="px-4 py-1 mt-2 hover:bg-gray-50 hover:rounded">
      <p class="mb-0 text-sm tracking-wide text-gray-400">Terms</p>
      <StatusBadge :status="status(item)"></StatusBadge>
    </div>

    <div class="px-4 py-1 mt-2 hover:bg-gray-50 hover:rounded">
      <p class="mb-0 text-sm tracking-wide text-gray-400">Classifications</p>
      <StatusBadge :status="status(item)"></StatusBadge>
    </div>
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
.borderless {
  @apply border-none shadow-none !important;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  &:global(.ant-input-affix-wrapper-focused) {
    @apply border-none shadow-none;
  }
}
</style>
          