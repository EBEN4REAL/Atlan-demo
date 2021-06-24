<template>
  <div class="w-full p-6 bg-white border rounded-md">
    <p
      class="mb-1 text-sm font-semibold text-gray-500 uppercase leading-tighter"
    >
      Last 7 days
    </p>
    <a-radio-group v-model:value="timeMode" button-style="solid">
      <a-radio-button value="last30">Last 30 Days</a-radio-button>
      <a-radio-button value="last7">Last 7 days</a-radio-button>
      <a-radio-button value="last24h">Last 24 hrs</a-radio-button>
      <a-radio-button value="last1h">Last 1 hr</a-radio-button>
    </a-radio-group>

    <table class="table w-full table-report">
      <tbody>
        <template
          v-for="item in aggregationArray(typeNameAttribute)"
          :key="item.id"
        >
          <tr class="">
            <td class="w-3">
              <component :is="item.id" class="w-auto h-5 mr-1"></component>
            </td>
            <td class="">
              {{ numeralFormat(item.value) }}
            </td>
            <td>
              {{ numeralFormat(getCRUDUpdateValue(item.id).value) }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>

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
import { Components } from "~/api/atlas/client";
// import EmptyView from "@common/empty/index.vue";
import { CRUD_AGGREGATION } from "~/constant/cache";

export default defineComponent({
  mixins: [],
  components: { LoadingView, ErrorView },
  props: {},
  setup(props) {
    let timeMode = ref("last30");

    let now = ref(true);
    const typeNameAttribute = "__typeName.keyword";
    const integrationNameAttribute = "integrationName";

    let last7 = new Date(
      new Date().setDate(new Date().getDate() - 7)
    ).getTime();

    // var today = new Date();
    // var hourago = new Date(today.getTime() - 1000 * 60 * 60).getTime();
    // console.log(hourago);

    let entityFilters = ref({
      condition: "OR" as Components.Schemas.Condition,
      criterion: [
        {
          attributeName: "__timestamp",
          operator: ">=",
          attributeValue: last7.toString(),
        },
      ],
    });
    let entityFiltersUpdate = ref({
      condition: "AND" as Components.Schemas.Condition,
      criterion: [
        {
          attributeName: "connectionLastSyncedAt",
          operator: "gte",
          attributeValue: last7.toString(),
        },
      ],
    });

    const { aggregationArray, aggregationSum } = fetchAssetAggregation(
      "Catalog",
      [typeNameAttribute, integrationNameAttribute],
      entityFilters.value,
      CRUD_AGGREGATION,
      now
    );

    const { aggregationArray: updateAggregationArray } = fetchAssetAggregation(
      "Catalog",
      [typeNameAttribute, integrationNameAttribute],
      entityFiltersUpdate.value,
      `${CRUD_AGGREGATION}_update`,
      now
    );

    const getCRUDUpdateValue = (id) => {
      return updateAggregationArray(typeNameAttribute).find((i) => i.id == id);
    };

    return {
      timeMode,
      aggregationArray,
      aggregationSum,
      updateAggregationArray,
      integrationNameAttribute,
      typeNameAttribute,
      getCRUDUpdateValue,
    };
  },
  mounted() {},
});
</script>