<template>
  <div class="h-full p-4 overflow-y-auto overview-container">
    <div class="p-2">
      <Readme
        placeholder="Add some details about the Table"
        class="w-5/6 m-h-48"
        parentAssetId="asset.guid"
      />
    </div>
    <div class="flex flex-col items-center w-full p-2">
      <TableColumn
        v-if="['Table', 'View'].includes(asset.typeName)"
        :asset="asset"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import Readme from "@/common/readme/index.vue";
import TableColumn from "@/asset/assetProfile/overview/tableColumn.vue";

export default defineComponent({
  props: ["asset"],
  components: { Readme, TableColumn },
  setup(props) {
    return {
      asset: computed(() => props.asset),
    };
  },
});
</script>
<style scoped>
.overview-container {
  width: 100%;
  display: grid;
  grid-template-columns: 70% auto;
}
</style>
