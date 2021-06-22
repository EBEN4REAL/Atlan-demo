<template>
  <div class="flex flex-col w-full p-6 bg-white border rounded-md">
    <div
      class="flex items-center justify-between w-full pb-3 align-middle border-gray-100 "
    >
      <p class="mb-0 font-bold tracking-tight text-gray-500 uppercase">
        Assets
      </p>
      <a-radio-group v-model:value="timeMode" button-style="solid">
        <a-radio-button value="all">All</a-radio-button>
        <a-radio-button value="last30">Last 30 Days</a-radio-button>
        <a-radio-button value="last7">Last 7 days</a-radio-button>
        <a-radio-button value="last24h">Last 24 hrs</a-radio-button>
        <a-radio-button value="last1h">Last 1 hr</a-radio-button>
      </a-radio-group>
    </div>

    <!-- <div class="flex-grow pr-4 border-r border-gray-200 border-dashed">
      <div
        class="mb-1 text-2xl font-semibold leading-tight text-gray-800 uppercase "
      >
        {{ numeralFormat(aggregationSum(integrationNameAttribute)) }}
      </div>
      <div
        v-for="item in aggregationArray(integrationNameAttribute)"
        :key="item.id"
        class="flex flex-col mt-4 space-y-2"
      >
        <div class="flex justify-between">
          <div class="flex items-center align-middle">
            <img :src="source(item.id)?.image" class="w-auto h-5 mr-1" />
            {{ source(item.id)?.label }}
          </div>
          <div>
            {{ numeralFormat(item.value) }}
          </div>
        </div>
      </div>
    </div> -->
    <div class="flex w-full mt-3 gap-x-6">
      <div class="flex flex-col gap-y-10">
        <div class="">
          <p
            class="mb-0 text-xs font-bold tracking-tight text-gray-900 uppercase "
          >
            New
          </p>
          <div
            class="mb-1 text-2xl font-semibold leading-tight text-gray-900 uppercase "
          >
            {{ numeralFormat(aggregationSum(integrationNameAttribute)) }}
          </div>
        </div>
        <div>
          <p
            class="mb-0 text-xs font-bold tracking-tight text-gray-900 uppercase "
          >
            Updated
          </p>
          <div
            class="mb-1 text-2xl font-semibold leading-tight text-gray-900 uppercase "
          >
            {{ numeralFormat(aggregationSum(integrationNameAttribute)) }}
          </div>
        </div>
        <div>
          <p
            class="mb-0 text-xs font-bold tracking-tight text-gray-900 uppercase "
          >
            Deleted
          </p>
          <div
            class="mb-1 text-2xl font-semibold leading-tight text-gray-800 uppercase "
          >
            {{ numeralFormat(aggregationSum(integrationNameAttribute)) }}
          </div>
        </div>
      </div>
      <div class="flex-grow">
        <table class="table table-report">
          <!-- <thead>
            <tr class="font-normal text-gray-400">
              <th class="pr-8 text-sm">Connector</th>
              <th class="pr-8 text-sm">New</th>
              <th class="pr-8 text-sm">Updated</th>
              <th class="pr-8 text-sm">Deleted</th>
            </tr>
          </thead> -->
          <tbody>
            <template
              v-for="item in aggregationArray(integrationNameAttribute)"
              :key="item.id"
            >
              <tr class="text-gray-900">
                <td class="flex pr-6">
                  <!-- <component :is="item.id" class="w-auto h-5 mr-1"></component> -->
                  <img :src="source(item.id)?.image" class="w-auto h-5 mr-1" />
                  {{ source(item.id)?.label }}
                </td>
                <td class="pr-8">
                  {{ numeralFormat(item.value) }}
                </td>
                <td class="pr-8">
                  {{ numeralFormat(item.value) }}
                  <!-- {{ numeralFormat(getCRUDUpdateValue(item.id).value) }} -->
                </td>
                <td>
                  {{ numeralFormat(item.value) }}
                  <!-- {{ numeralFormat(getCRUDUpdateValue(item.id).value) }} -->
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="flex-grow">
        <table class="table table-report">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Views</th>
            </tr>
          </thead>
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
      </div>
    </div>
  </div>
</template>
    
<script lang="ts">
import { defineComponent, ref } from "vue";

import fetchAssetAggregation from "~/composables/asset/fetchAssetAggregation";
import LoadingView from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";

import { CONNECTIONWISE_AGGREGATION, CRUD_AGGREGATION } from "~/constant/cache";
// import EmptyView from "@common/empty/index.vue";

export default defineComponent({
  mixins: [],
  components: { LoadingView, ErrorView },
  props: {},
  setup(props) {
    let timeMode = ref("last30");
    let now = ref(true);
    const typeNameAttribute = "__typeName.keyword";
    const integrationNameAttribute = "Catalog.integrationName.keyword";
    const {
      aggregations,
      aggregationArray,
      aggregationSum,
      source,
      assetTypeObject,
    } = fetchAssetAggregation(
      "Catalog",
      [typeNameAttribute, integrationNameAttribute],
      undefined,
      CONNECTIONWISE_AGGREGATION,
      now
    );

    let last7 = new Date(
      new Date().setDate(new Date().getDate() - 7)
    ).getTime();

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
      aggregations,
      aggregationArray,
      aggregationSum,
      integrationNameAttribute,
      typeNameAttribute,
      source,
      assetTypeObject,
      getCRUDUpdateValue,
    };
  },
  mounted() {},
});
</script>