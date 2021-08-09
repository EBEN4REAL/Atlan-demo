
<template>
  <LoadingView v-if="isLoading"></LoadingView>

  <div v-else class="flex flex-col h-full space-y-2">
    <!-- <div class="flex flex-wrap gap-1 mx-3 mb-2">
      <template
        v-for="item in dataTypeAggregationList(
          aggregationArray(dataTypeAggregationAttribute)
        )"
        :key="item.id"
      >
        <div
          class="flex items-center px-1 text-blue-500 align-middle bg-white border rounded-md hover:bg-opacity-100 hover:bg-blue-500 hover:text-white hover:bg-opacity-10"
          style="padding-top: 2px; padding-bottom: 2px"
          @click="handleDataTypeSelect(item.label)"
        >
          <component :is="item.image" class="w-4 h-auto mr-1" />
          {{ item.count }}
        </div>
      </template>
    </div> -->
    <div class="flex px-3 mt-3">
      <a-input class=""></a-input>
    </div>

    <a-tabs class="w-full px-3" type="card" :class="$style.assetbar">
      <a-tab-pane key="all">
        <template #tab> All </template>
      </a-tab-pane>
      <a-tab-pane key="special">
        <template #tab> Special </template>
      </a-tab-pane>
      <a-tab-pane key="pinned">
        <template #tab> Pinned </template>
      </a-tab-pane>
    </a-tabs>

    <div class="flex flex-col flex-grow px-3 space-y-2 overflow-y-auto">
      <!-- <div class="mt-3 mb-3" v-if="specialList?.length > 0 && queryText == ''">
        <p
          class="mb-0 text-xs font-medium tracking-tight text-gray-500 uppercase "
        >
          Important Columns
        </p>
        <template v-for="item in specialList" :key="item.guid">
          <div class="flex items-center w-full tracking-tight text-gray-600">
            <div class="flex items-center w-11/12 align-middle">
              <component
                :is="getDataTypeImage(item?.attributes?.dataType)"
                class="w-5 h-5 mr-1 text-gray-500"
                style="min-width: 1.25rem; min-height: 1.25rem"
              ></component>

              <div class="leading-none truncate">
                {{ item?.attributes?.name }}
              </div>
            </div>
            <fa
              icon="fas key"
              class="text-yellow-400"
              v-if="item?.attributes?.isPrimary"
            ></fa>
          </div>
        </template>
      </div> -->
      <template v-for="item in list" :key="item.guid">
        <div
          class="flex items-center w-full tracking-tight text-gray-600 gap-y-1"
        >
          <div class="flex items-center w-11/12 align-middle">
            <component
              :is="getDataTypeImage(item?.attributes?.dataType)"
              class="w-5 h-5 mr-1 text-gray-500"
              style="min-width: 1.25rem; min-height: 1.25rem"
            ></component>

            <div class="leading-none truncate">
              {{ item?.attributes?.name }}
            </div>
          </div>
          <fa
            v-if="item?.attributes?.isPrimary"
            icon="fas key"
            class="text-yellow-400"
          ></fa>
        </div>
      </template>
    </div>
    <div class="flex justify-between px-3">
      <AssetPagination
        :limit="limit"
        :offset="offset"
        :list-count="list.length"
        :total-count="totalCount"
        label=""
      ></AssetPagination>
      <div
        v-if="isLoadMore && (!isLoading || !isValidating)"
        class="text-xs cursor-pointer text-primary"
        @click="loadMore"
      >
        more...
      </div>
      <!-- <div>{{ listCount }} of {{ totalCount }}</div> -->
      <!-- <p
        class="px-3 mb-0 cursor-pointer text-primary"
        v-if="isLoadMore"
        @click="loadMore"
      >
        more..
      </p> -->
    </div>
  </div>
</template>
          
<script lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { computed, ref, watch , defineComponent } from "vue";

import LoadingView from "@common/loaders/section.vue";
import AssetPagination from "@common/pagination/index.vue";
import { Components } from "~/api/atlas/client";


import fetchColumnList from "~/composables/columns/fetchColumnList";

import useColumnList from "~/composables/bots/useColumnList";
import { COLUMNS_FETCH_LIST } from "~/constant/cache";
import { BaseAttributes, ColumnAttributes } from "~/constant/projection";

export default defineComponent({
  components: {
    LoadingView,
    AssetPagination,
  },
  props: {
    item: {
      type: Object,
      required: false,
      default() {
        return {};
      },
    },
  },
  setup(props: any) {
    const immediate = ref(true);

    const limit = ref(20);
    const offset = ref(0);

    const sortBy = ref("Column.order");
    const sortOrder = ref("ASCENDING");

    const entityFilters = ref({
      condition: "OR" as Components.Schemas.Condition,
      criterion: [
        {
          attributeName: "tableQualifiedName",
          operator: "eq",
          attributeValue: props.item?.attributes?.qualifiedName,
        },
        {
          attributeName: "viewQualifiedName",
          operator: "eq",
          attributeValue: props.item?.attributes?.qualifiedName,
        },
      ],
    });

    let initialBody = {
      typeName: "Column",
      // includeClassificationAttributes: true,
      // includeSubClassifications: true,
      limit: limit.value,
      offset: offset.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
      attributes: [...BaseAttributes, ...ColumnAttributes],
      aggregationAttributes: [],
      entityFilters: entityFilters.value,
    };

    const {
      list,
      getDataTypeImage,
      isLoading,
      totalCount,
      isAggregate,
      replaceBody,
    } = useColumnList(immediate, initialBody, "", true);

    const isLoadMore = computed(() => totalCount.value > list.value.length);

    const loadMore = () => {
      if (list.value.length + limit.value < totalCount.value) {
        offset.value = list.value.length + limit.value;
      }
      isAggregate.value = false;
      updateBody();
    };

    const updateBody = () => {
      initialBody = {
        typeName: "Column",
        // includeClassificationAttributes: true,
        // includeSubClassifications: true,
        limit: limit.value,
        offset: offset.value,
        sortBy: sortBy.value,
        sortOrder: sortOrder.value,
        attributes: [...BaseAttributes, ...ColumnAttributes],
        aggregationAttributes: [],
        entityFilters: entityFilters.value,
      };
      replaceBody(initialBody);
    };

    // let queryText = ref("");

    // let selectedDataType = ref([]);

    // let columnCount = ref(props.item?.attributes?.columnCount);

    // let placeholder = ref(`Search by column name (${columnCount.value})`);

    // const dataTypeAggregationAttribute = "Column.dataType.keyword";

    // let entityFilters = ref({
    //   condition: "OR" as Components.Schemas.Condition,
    //   criterion: [
    //     {
    //       attributeName: "tableQualifiedName",
    //       operator: "eq",
    //       attributeValue: props.item?.attributes?.qualifiedName,
    //     },
    //     {
    //       attributeName: "viewQualifiedName",
    //       operator: "eq",
    //       attributeValue: props.item?.attributes?.qualifiedName,
    //     },
    //   ],
    // });
    // const {
    //   list,
    //   aggregationArray,
    //   dataTypeAggregationList,
    //   getDataTypeImage,
    //   loadMore,
    //   filter,
    //   isLoadMore,
    //   totalCount,
    //   query,
    //   isLoading,
    //   refresh,
    //   listCount,
    // } = fetchColumnList(
    //   COLUMNS_FETCH_LIST,
    //   immediate,
    //   entityFilters.value,
    //   [dataTypeAggregationAttribute],
    //   "Column.order",
    //   "ASCENDING"
    // );

    // let entityFiltersSpecialColumns = ref({
    //   condition: "AND" as Components.Schemas.Condition,
    //   criterion: [
    //     {
    //       condition: "OR" as Components.Schemas.Condition,
    //       criterion: [
    //         {
    //           attributeName: "isPrimary",
    //           operator: "eq",
    //           attributeValue: true,
    //         },
    //         {
    //           attributeName: "isPartition",
    //           operator: "eq",
    //           attributeValue: true,
    //         },
    //         {
    //           attributeName: "isClustered",
    //           operator: "eq",
    //           attributeValue: true,
    //         },
    //         {
    //           attributeName: "isIndexed",
    //           operator: "eq",
    //           attributeValue: true,
    //         },
    //       ],
    //     },
    //     {
    //       condition: "OR" as Components.Schemas.Condition,
    //       criterion: [
    //         {
    //           attributeName: "tableQualifiedName",
    //           operator: "eq",
    //           attributeValue: props.item?.attributes?.qualifiedName,
    //         },
    //         {
    //           attributeName: "viewQualifiedName",
    //           operator: "eq",
    //           attributeValue: props.item?.attributes?.qualifiedName,
    //         },
    //       ],
    //     },
    //   ],
    // });

    // const { list: specialList } = fetchColumnList(
    //   `${COLUMNS_FETCH_LIST}_key`,
    //   immediate,
    //   entityFiltersSpecialColumns.value
    // );

    // const handleSearchChange = useDebounceFn((val) => {
    //   query(val.target.value);
    // }, 100);

    // const handleDataTypeSelect = (val) => {
    //   let index = selectedDataType.value.indexOf(val);
    //   if (index !== -1) {
    //     selectedDataType.value.splice(index, 1);
    //   } else {
    //     selectedDataType.value.push(val);
    //   }
    //   filter({
    //     condition: "AND" as Components.Schemas.Condition,
    //     criterion: [
    //       {
    //         attributeName: "dataType",
    //         operator: "eq",
    //         attributeValue: "NUMBER",
    //       },
    //       {
    //         condition: "OR",
    //         criterion: [
    //           {
    //             attributeName: "tableQualifiedName",
    //             operator: "eq",
    //             attributeValue: props.item?.attributes?.qualifiedName,
    //           },
    //           {
    //             attributeName: "viewQualifiedName",
    //             operator: "eq",
    //             attributeValue: props.item?.attributes?.qualifiedName,
    //           },
    //         ],
    //       },
    //     ],
    //   });
    // };
    // let debounce = null;

    // const handleSearchChange = (value: any) => {
    //   if (value.target.value == "") {
    //     body.value.query = "";
    //     mutate();
    //   } else {
    //     clearTimeout(debounce);
    //     debounce = setTimeout(() => {
    //       body.value.query = value.target.value;
    //       mutate();
    //     }, 100);
    //   }
    // };

    return {
      list,
      getDataTypeImage,
      isLoading,
      limit,
      offset,
      isLoadMore,
      totalCount,
      loadMore,
      // list,
      // specialList,
      // isLoading,
      // placeholder,
      // columnCount,
      // aggregationArray,
      // dataTypeAggregationAttribute,
      // dataTypeAggregationList,
      // getDataTypeImage,
      // loadMore,
      // listCount,
      // isLoadMore,
      // totalCount,
      // handleSearchChange,
      // queryText,
      // selectedDataType,
      // handleDataTypeSelect,
    };
  },
});
</script>


   



      
<style lang="less" module>
.assetbar {
  height: 32px !important;
  min-height: 32px !important;

  :global(.ant-tabs-nav-container) {
    height: 32px !important;
    min-height: 32px !important;
  }

  :global(.ant-tabs-bar) {
    @apply border-b border-gray-200 !important;
    margin-bottom: 0px;
  }

  :global(.ant-tabs-tab) {
    height: 32px !important;
    line-height: 30px !important;
    @apply bg-transparent border-0  !important;
  }

  :global(.ant-tabs-tab-active) {
    @apply bg-white border-t border-l border-r border-gray-200 !important;
  }

  :global(.ant-tabs-ink-bar) {
    @apply hidden;
  }
}
</style>
      