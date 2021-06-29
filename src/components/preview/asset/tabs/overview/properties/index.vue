<template>
  <div class="flex flex-col px-2 space-y-3">
    <div class="px-2">
      <p class="mb-0 text-sm tracking-wide text-gray-400">Unique ID (GUID)</p>
      <p class="mb-0 text-gray-700">{{ item?.guid }}</p>
    </div>
    <div class="px-2">
      <p class="mb-0 text-sm tracking-wide text-gray-400">Last updated</p>
      <p class="mb-0 text-gray-700">
        {{ dayjs().from(item?.attributes?.__modificationTimestamp, true) }} ago,
        {{ item?.attributes?.__modifiedBy }}
      </p>
    </div>
    <div class="px-2">
      <p class="mb-0 text-sm tracking-wide text-gray-400">Created</p>
      <p class="mb-0 text-gray-700">
        {{ dayjs().from(item?.attributes?.__timestamp, true) }} ago,
        {{ item?.attributes?.__createdBy }}
      </p>
    </div>
  </div>
</template>
            
<script lang="ts">
import { defineComponent } from "vue";
import AssetMixin from "~/mixins/asset";

import dayjs from "dayjs";

export default defineComponent({
  mixins: [AssetMixin],
  components: {},
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
    return { dayjs };
  },
});
</script>
  
  
     
<style lang="less" module>
</style>
          