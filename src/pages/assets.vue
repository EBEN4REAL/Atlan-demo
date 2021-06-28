<template>
  <div class="grid h-full grid-cols-12">
    <AssetDiscovery @preview="handlePreview"></AssetDiscovery>
    <div
      class="flex flex-col items-stretch hidden h-full bg-white border-l md:col-span-3 md:block"
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
import { useHead } from "@vueuse/head";

export default defineComponent({
  components: {
    AssetPreview,
    AssetDiscovery,
  },
  setup() {
    let selected = ref({});
    useHead({
      title: "Discover assets",
    });
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
