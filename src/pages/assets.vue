<template>
  <div class="grid grid-cols-12 h-full">
    <AssetDiscovery @preview="handlePreview"></AssetDiscovery>
    <div
      class="col-span-3 h-full flex flex-col items-stretch bg-white border-left"
    >
      <AssetPreview :item="selected"></AssetPreview>
    </div>
  </div>
</template>
  
  
  <script lang="ts">
import { defineComponent } from "vue";
import PageLoader from "@common/loaders/page.vue";
import AssetDiscovery from "@/discovery/asset/index.vue";
import AssetPreview from "@/preview/asset/index.vue";

export default defineComponent({
  name: "HelloWorld",
  components: {
    PageLoader,
    AssetDiscovery,
    AssetPreview,
  },
  data() {
    return {
      selected: {},
    };
  },
  setup() {
    return {};
  },
  methods: {
    handlePreview(selectedItem: any) {
      console.log(selectedItem);
      this.selected = selectedItem;
    },
  },
});
</script>
  
<style lang="less" module>
</style>
      
  
  <route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
  </route>