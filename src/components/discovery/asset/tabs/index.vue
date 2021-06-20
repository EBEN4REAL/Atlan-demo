<template>
  <a-tabs class="w-full" :class="$style.assetbar" v-model:value="assetType">
    <a-tab-pane :key="item.id" v-for="item in assetTypeList">
      <template #tab>
        {{ item.label }} <span class="text-xs">({{ item.count }})</span>
      </template>
    </a-tab-pane>
    <!-- <a-tab-pane key="2" tab="Tab 2"></a-tab-pane>
    <a-tab-pane key="3" tab="Tab 3"></a-tab-pane> -->
  </a-tabs>
</template>
    
<script lang="ts">
import { defineComponent, Ref, ref } from "vue";

export default defineComponent({
  props: {
    assetTypeList: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
    defaultAssetType: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
  },
  setup(props, { emit }) {
    const assetType: Ref<""> = ref("");
    if (props.defaultAssetType) {
      assetType.value = props.defaultAssetType;
    }
    return {
      assetType,
    };
  },
});
</script>


      
<style lang="less" module>
.assetbar {
  :global(.ant-tabs-bar) {
    margin-bottom: 0px;
    border-color: #fff !important;
  }

  :global(.ant-tabs-tab) {
    margin: 0 32px 0 0 !important;
    padding: 6px 8px !important;
  }
}
</style>
      