<template>
  <div class="flex flex-col px-2 space-y-3">
    <div
      class="px-2"
      v-if="
        item?.typeName?.toLowerCase() === 'table' ||
        item?.typeName?.toLowerCase() === 'view'
      "
    >
      <p class="mb-0 text-sm tracking-wide text-gray-400">Rows/Columns</p>
      <p class="mb-0 text-dark-400">
        <span v-if="item?.typeName?.toLowerCase() === 'table'">
          <span class="font-bold tracking-wide">{{
            rowCount(item, true)
          }}</span>
          rows,
        </span>
        <span class="font-bold tracking-wide cursor-pointer text-primary-500">{{
          columnCount(item, true)
        }}</span>
        cols
      </p>
    </div>

    <Description :item="item" :key="item.guid"></Description>

    <Status :item="item" :key="item.guid"></Status>

    <Owners :item="item" :key="item.guid"></Owners>
  </div>
</template>
            
<script lang="ts">
import { defineComponent } from "vue";
import AssetMixin from "~/mixins/asset";

import Description from "./description.vue";
import Status from "./status.vue";
import Owners from "./owners.vue";

export default defineComponent({
  mixins: [AssetMixin],
  components: { Status, Description, Owners },
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
          