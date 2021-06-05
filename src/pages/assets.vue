<template>
  <div class="grid h-full grid-cols-12">
    <AssetDiscovery @preview="handlePreview" class="shadow-sm"></AssetDiscovery>
    <div class="flex flex-col items-stretch h-full col-span-3 border-l bg-gray-50">
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