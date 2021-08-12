<template>
  <div class="flex flex-col px-2 space-y-3">
    <div class="px-2">
      <p class="mb-0 text-sm tracking-wide text-gray">Unique ID (GUID)</p>
      <p class="mb-0 text-gray-700">{{ item?.guid }}</p>
    </div>
    <div class="px-2">
      <p class="mb-0 text-sm tracking-wide text-gray">Last updated</p>
      <p class="mb-0 text-gray-700">
        {{ dayjs().from(item?.attributes?.__modificationTimestamp, true) }} ago,
        {{ item?.attributes?.__modifiedBy }}
      </p>
    </div>
    <div class="px-2">
      <p class="mb-0 text-sm tracking-wide text-gray">Created</p>
      <p class="mb-0 text-gray-700">
        {{ dayjs().from(item?.attributes?.__timestamp, true) }} ago,
        {{ item?.attributes?.__createdBy }}
      </p>
    </div>
    <div class="px-2">
      <p class="mb-0 text-sm tracking-wide text-gray">Popularity Score</p>
      <p class="mb-0 text-gray-700">
        {{ item?.attributes?.popularityScore }}
      </p>
    </div>
  </div>
</template>
            
<script lang="ts">
import { defineComponent } from "vue";
import dayjs from "dayjs";
import AssetMixin from "~/mixins/asset";


export default defineComponent({
  components: {},
  mixins: [AssetMixin],
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
          