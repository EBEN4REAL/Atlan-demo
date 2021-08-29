<template>
  <div class="flex flex-col w-full p-6 bg-white border rounded-md">
    <div
      class="flex items-center justify-between w-full pb-3 align-middle border-gray-100 "
    >
      <a-radio-group
        v-model:value="timeMode"
        button-style="solid"
        @change="handleModeChange"
      >
        <a-radio-button value="all">All</a-radio-button>
        <a-radio-button value="last30">30 Days</a-radio-button>
        <a-radio-button value="last7">7 days</a-radio-button>
        <a-radio-button value="last24h">24 hrs</a-radio-button>
        <a-radio-button value="last1h">1 hr</a-radio-button>
      </a-radio-group>
      <a-spin
        v-if="isLoadingDelete || isLoadingUpdate || isLoadingCreate"
        size="small"
      ></a-spin>
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
    <div class="grid grid-cols-12 mt-3">
      <div class="flex col-span-12 pb-3 mb-3 border-b border-dashed gap-x-10">
        <div class="">
          <p
            class="mb-0 text-xs font-bold tracking-tight text-gray-500 uppercase "
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
            class="mb-0 text-xs font-bold tracking-tight text-gray-500 uppercase "
          >
            Updated
            <a-tooltip title="Created & Updated"
              ><fa icon="fal info-circle" class="ml-1"></fa
            ></a-tooltip>
          </p>
          <div
            class="mb-1 text-2xl font-semibold leading-tight text-gray-900 uppercase "
          >
            {{
              numeralFormat(
                updateAggregationSum(integrationNameAttribute) -
                  aggregationSum(integrationNameAttribute)
              )
            }}
          </div>
        </div>
        <div>
          <p
            class="mb-0 text-xs font-bold tracking-tight text-gray-500 uppercase "
          >
            Archived
            <a-tooltip title="Archived"
              ><fa icon="fal info-circle" class="ml-1"></fa
            ></a-tooltip>
          </p>
          <div
            class="mb-1 text-2xl font-semibold leading-tight text-gray-900 uppercase "
          >
            {{ numeralFormat(deleteAggregationSum(integrationNameAttribute)) }}
          </div>
        </div>
      </div>
      <div class="col-span-6">
        <table class="table table-report">
          <!-- <thead>
            <tr class="font-normal text-gray">
              <th class="pr-8 text-sm">Connector</th>
              <th class="pr-8 text-sm">New</th>
              <th class="pr-8 text-sm">Updated</th>
              <th class="pr-8 text-sm">Deleted</th>
            </tr>
          </thead> -->
          <tbody>
            <template
              v-for="item in createAggregationArray(integrationNameAttribute)"
              :key="item.id"
            >
              <tr class="mb-3 text-gray-900">
                <td class="flex py-2 pr-6">
                  <!-- <component :is="item.id" class="w-auto h-5 mr-1"></component> -->
                  <img :src="source(item.id)?.image" class="w-auto h-5 mr-1" />
                  {{ source(item.id)?.label }}
                </td>
                <td class="py-2 pr-8">
                  {{
                    numeralFormat(
                      getCreateValue(item.id, integrationNameAttribute)?.value
                    )
                  }}
                </td>
                <td class="py-2 pr-8">
                  {{
                    numeralFormat(
                      getUpdateValue(item.id, integrationNameAttribute)?.value -
                        getCreateValue(item.id, integrationNameAttribute)?.value
                    )
                  }}

                  <!-- {{ numeralFormat(getCRUDUpdateValue(item.id).value) }} -->
                </td>
                <td class="py-2">
                  {{
                    numeralFormat(
                      getDeleteValue(item.id, integrationNameAttribute)?.value
                    )
                  }}
                  <!-- {{ numeralFormat(getCRUDUpdateValue(item.id).value) }} -->
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      <div class="col-span-6">
        <table class="table table-report">
          <tbody>
            <template
              v-for="item in createAggregationArray(typeNameAttribute)"
              :key="item.id"
            >
              <tr class="text-gray-900">
                <td class="flex py-2 pr-6">
                  <component :is="item.id" class="w-auto h-5 mr-1"></component>
                  {{ item.id }}
                </td>

                <td class="py-2 pr-8">
                  {{
                    numeralFormat(
                      getCreateValue(item.id, typeNameAttribute)?.value
                    )
                  }}
                </td>
                <td class="py-2 pr-8">
                  {{
                    numeralFormat(
                      getUpdateValue(item.id, typeNameAttribute)?.value
                    )
                  }}
                </td>
                <td class="py-2">
                  {{
                    numeralFormat(
                      getDeleteValue(item.id, typeNameAttribute)?.value
                    )
                  }}
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

import LoadingView from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";
import fetchAssetAggregation from "~/composables/asset/fetchAssetAggregation";

import { CONNECTIONWISE_AGGREGATION, CRUD_AGGREGATION } from "~/constant/cache";
import { Components } from "~/api/atlas/client";
// import EmptyView from "@common/empty/index.vue";

export default defineComponent({
  components: { LoadingView, ErrorView },
  mixins: [],
  props: {},
  setup(props) {
    const timeMode = ref("last30");

    const period = ref(
      new Date(new Date().setDate(new Date().getDate() - 30)).getTime()
    );

    // Created Aggregations
    const entityFiltersCreate = ref({
      condition: "AND" as Components.Schemas.Condition,
      criterion: [],
    });

    const entityFiltersUpdate = ref({
      condition: "AND" as Components.Schemas.Condition,
      criterion: [],
    });
    const entityFiltersDelete = ref({
      condition: "AND" as Components.Schemas.Condition,
      criterion: [],
    });

    const handleModeChange = (refresh: any) => {
      switch (timeMode.value) {
        case "all":
          updateFilters();
          break;
        case "last30":
          period.value = new Date(
            new Date().setDate(new Date().getDate() - 1000)
          ).getTime();
          updateFilters();
          break;
        case "last7":
          period.value = new Date(
            new Date().setDate(new Date().getDate() - 7)
          ).getTime();
          updateFilters();
          break;
        case "last24h":
          period.value = new Date(
            new Date().getTime() - 24 * 60 * 60 * 1000
          ).getTime();
          updateFilters();
          break;
        case "last1h":
          period.value = new Date(
            new Date().getTime() - 1 * 60 * 60 * 1000
          ).getTime();
          updateFilters();
          break;
      }

      if (refresh) {
        updateCreateFilter(entityFiltersCreate.value);
        updateUpdateFilter(entityFiltersUpdate.value);
        updateDeleteFilter(entityFiltersDelete.value);
      }
    };

    const updateFilters = () => {
      if (timeMode.value === "all") {
        entityFiltersCreate.value.criterion = [
          {
            attributeName: "connectionLastSyncedAt",
            operator: "notNull",
          },
        ];
        entityFiltersUpdate.value.criterion = [];
        entityFiltersDelete.value.criterion = [
          {
            attributeName: "__state",
            operator: "eq",
            attributeValue: "DELETED",
          },
        ];
      } else {
        entityFiltersCreate.value.criterion = [
          {
            attributeName: "__timestamp",
            operator: "gte",
            attributeValue: period.value.toString(),
          },
        ];
        entityFiltersUpdate.value.criterion = [
          {
            attributeName: "connectionLastSyncedAt",
            operator: "gte",
            attributeValue: period.value.toString(),
          },
        ];
        entityFiltersDelete.value.criterion = [
          {
            attributeName: "__state",
            operator: "eq",
            attributeValue: "DELETED",
          },
          {
            attributeName: "__modificationTimestamp",
            operator: "gte",
            attributeValue: period.value.toString(),
          },
        ];
      }
    };
    handleModeChange(false);

    const now = ref(true);
    const typeNameAttribute = "__typeName.keyword";
    const integrationNameAttribute = "Catalog.integrationName.keyword";
    const {
      aggregations,
      aggregationArray: createAggregationArray,
      aggregationSum,
      source,
      filter: updateCreateFilter,
      assetTypeObject,
      isLoading: isLoadingCreate,
    } = fetchAssetAggregation(
      "Catalog",
      [typeNameAttribute, integrationNameAttribute],
      entityFiltersCreate.value,
      CONNECTIONWISE_AGGREGATION,
      now
    );

    const {
      aggregationArray: updateAggregationArray,
      aggregationSum: updateAggregationSum,
      filter: updateUpdateFilter,
      isLoading: isLoadingUpdate,
    } = fetchAssetAggregation(
      "Catalog",
      [typeNameAttribute, integrationNameAttribute],
      entityFiltersUpdate.value,
      `${CRUD_AGGREGATION}_update`,
      now
    );

    const {
      aggregationArray: deleteAggregationArray,
      aggregationSum: deleteAggregationSum,
      filterWithDelete: updateDeleteFilter,
      isLoading: isLoadingDelete,
    } = fetchAssetAggregation(
      "Catalog",
      [typeNameAttribute, integrationNameAttribute],
      entityFiltersDelete.value,
      `${CRUD_AGGREGATION}_delete`,
      now
    );

    const getCreateValue = (id, attribute) => createAggregationArray(attribute).find((i) => i.id == id);

    const getUpdateValue = (id, attribute) => updateAggregationArray(attribute).find((i) => i.id == id);

    const getDeleteValue = (id, attribute) => deleteAggregationArray(attribute).find((i) => i.id == id);

    return {
      timeMode,
      aggregations,
      createAggregationArray,
      aggregationSum,
      integrationNameAttribute,
      typeNameAttribute,
      source,
      assetTypeObject,

      handleModeChange,
      updateAggregationSum,
      period,
      deleteAggregationSum,
      deleteAggregationArray,
      updateDeleteFilter,
      getCreateValue,
      getUpdateValue,
      getDeleteValue,
      isLoadingDelete,
      isLoadingUpdate,
      isLoadingCreate,
    };
  },
  mounted() {},
});
</script>