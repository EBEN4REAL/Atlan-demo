<template>
  <div class="w-full p-6 bg-white border rounded-md">
    <p
      class="mb-1 text-sm font-semibold text-gray-500 uppercase leading-tighter"
    >
      Last 30 days
    </p>

    <div
      v-for="item in aggrgeationsArray(typeNameAttribute)"
      :key="item.id"
      class="flex flex-col mt-4 space-y-2"
    >
      <div class="flex justify-between">
        <div class="flex">
          <component :is="item.id" class="w-auto h-5 mr-1"></component>
        </div>
        <div>
          {{ numeralFormat(item.value) }}
        </div>
      </div>
    </div>

    <!-- <div v-else>
      <p
        class="mb-1 text-2xl font-semibold leading-tight text-gray-800 uppercase "
      >
        {{ numeralFormat(assetDistributionSum) }}
      </p>
      <div
        v-for="item in assetTypeList"
        :key="item.id"
        class="flex flex-col mt-4 space-y-2"
      >
        <div class="flex justify-between">
          <div class="flex">
            <component :is="item.id" class="w-auto h-5 mr-1"></component>
            {{ item.label }}
          </div>
          <div>
            {{ numeralFormat(item.count) }}
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>
    
<script lang="ts">
import { defineComponent, ref } from "vue";

import fetchAssetAggregation from "~/composables/asset/fetchAssetAggregation";
import LoadingView from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";
// import EmptyView from "@common/empty/index.vue";

export default defineComponent({
  mixins: [],
  components: { LoadingView, ErrorView },
  props: {},
  setup(props) {
    let now = ref(true);
    const typeNameAttribute = "__typeName.keyword";
    const integrationNameAttribute = "integrationName";
    const { aggregations, aggrgeationsArray, aggrgeationsSum } =
      fetchAssetAggregation(
        "Catalog",
        [typeNameAttribute, integrationNameAttribute],
        true,
        now
      );
    return {
      aggregations,
      aggrgeationsArray,
      aggrgeationsSum,
      integrationNameAttribute,
      typeNameAttribute,
    };
  },
  mounted() {},
});
</script>