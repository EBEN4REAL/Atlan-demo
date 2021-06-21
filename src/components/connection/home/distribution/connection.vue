<template>
  <div class="flex w-full p-6 bg-white border rounded-md">
    <div class="flex-grow pr-3 border-r border-gray-200 border-dashed">
      <p
        class="mb-1 text-xs font-semibold text-gray-500 uppercase  leading-tighter"
      >
        Total Connections
      </p>
      <div
        class="mb-1 text-2xl font-semibold leading-tight text-gray-800 uppercase "
      >
        {{ numeralFormat(aggrgeationsSum(typeNameAttribute)) }}
      </div>
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
    </div>
    <div class="flex-grow pl-3">
      <p
        class="mb-1 text-xs font-semibold text-gray-500 uppercase  leading-tighter"
      >
        Total Assets Synced
      </p>
      <div
        class="mb-1 text-2xl font-semibold leading-tight text-gray-800 uppercase "
      >
        {{ numeralFormat(aggrgeationsSum(typeNameAttribute)) }}
      </div>
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
    </div>
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