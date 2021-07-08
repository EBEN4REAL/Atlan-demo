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
import { defineComponent, ref, watch } from "vue";
import AssetDiscovery from "@/discovery/asset/index.vue";
import AssetPreview from "@/preview/asset/index.vue";
import { useHead } from "@vueuse/head";
import { Classification } from "~/api/atlas/classification";
import { useDiscoveryStore } from "~/pinia/discovery";
export default defineComponent({
  components: {
    AssetPreview,
    AssetDiscovery,
  },
  setup() {
    const store = useDiscoveryStore();

    let selected = ref({});
    useHead({
      title: "Discover assets",
    });
    const handlePreview = (selectedItem: any) => {
      selected.value = selectedItem;
      console.log(selected.value, "selected");
    };

    const {
      data: classificationData,
      error: classificationError,
    } = Classification.getClassificationList({ cache: false });
    watch([classificationData, classificationError], () => {
      if (classificationData.value) {
        let classifications = classificationData.value.classificationDefs ?? [];
        classifications = classifications.map((classification) => {
          classification.alias = classification.name;
          return classification;
        });
        // setting classifications in store
        store.setClassifications(classifications);
      } else {
        console.log("classification erorr ");
      }
    });

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
