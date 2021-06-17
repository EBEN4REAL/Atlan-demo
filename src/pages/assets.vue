<template>
  <div class="grid h-full grid-cols-12 gap-x-3">
    <AssetDiscovery @preview="handlePreview"></AssetDiscovery>
    <div
      class="flex flex-col items-stretch h-full col-span-3 bg-white border-l"
      style="overflow: hidden"
    >
      <AssetPreview :item="selected" v-if="selected?.guid"></AssetPreview>
    </div>
  </div>
</template>
  
  
<script lang="ts">
import { defineComponent, ref } from "vue";
import AssetDiscovery from "@/discovery/asset/index.vue";
import AssetPreview from "@/preview/asset/index.vue";

export default defineComponent({
  components: {
    AssetPreview,
    AssetDiscovery,
  },
  setup() {
    let selected = ref({});
    const handlePreview = (selectedItem: any) => {
      selected.value = selectedItem;
    };
    return {
      selected,
      handlePreview,
    };
  },
});
</script>
  
  
<route lang="yaml">
meta:
  layout: default
  requiresAuth: true
</route>