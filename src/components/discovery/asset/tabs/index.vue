<template>
  <a-tabs class="w-full ml-2" :class="$style.assetbar">
    <a-tab-pane
      :key="item.id"
      :tab="item.label"
      v-for="item in assetTypeList"
    ></a-tab-pane>
    <!-- <a-tab-pane key="2" tab="Tab 2"></a-tab-pane>
    <a-tab-pane key="3" tab="Tab 3"></a-tab-pane> -->
  </a-tabs>
</template>
    
  <script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    assetTypeList: {
      type: Array,
      required: false,
      default() {
        return [];
      },
    },
  },
  computed: {},
  mounted() {},
  methods: {},
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
      