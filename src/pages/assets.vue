<template>
  <div class="grid h-full grid-cols-12">
    <AssetDiscovery
      :initialFilters="initialFilters"
      @preview="handlePreview"
    ></AssetDiscovery>
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
import { useClassificationStore } from "~/components/admin/classifications/_store";
import { getDecodedOptionsFromString } from "~/utils/routerQuery";
import { useRouter } from "vue-router";

export interface initialFiltersType {
  facetsFilters: any;
  searchText: string;
  limit: number;
}
export default defineComponent({
  components: {
    AssetPreview,
    AssetDiscovery,
  },
  setup() {
    const router = useRouter();
    const initialFilters: initialFiltersType = getDecodedOptionsFromString(
      router
    );
    let selected = ref({});
    const classificationsStore = useClassificationStore();
    useHead({
      title: "Discover assets",
    });
    const handlePreview = (selectedItem: any) => {
      selected.value = selectedItem;
      console.log(selected.value, "selected");
    };
    // get classifications
    classificationsStore.setClassificationsStatus("loading");
    const {
      data: classificationData,
      error: classificationError,
    } = Classification.getClassificationList({ cache: false });

    watch([classificationData, classificationError], () => {
      if (classificationData.value) {
        let classifications = classificationData.value.classificationDefs || [];
        classifications = classifications.map((classification) => {
          classification.alias = classification.name;
          return classification;
        });
        classificationsStore.setClassifications(classifications ?? []);
        classificationsStore.initializeFilterTree();
        classificationsStore.setClassificationsStatus("success");
      } else {
        classificationsStore.setClassificationsStatus("error");
      }
    });

    return {
      initialFilters,
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
