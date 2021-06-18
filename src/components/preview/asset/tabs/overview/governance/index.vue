<template>
  <div class="flex flex-col px-2 space-y-3">
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
    return {};
  },
});
</script>
  
  
     
<style lang="less" module>
</style>
          