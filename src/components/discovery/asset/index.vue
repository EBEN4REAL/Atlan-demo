


<template>
  <div
    class="hidden h-full pt-6 pl-4 bg-white  sm:block sm:col-span-4 md:col-span-2 sm"
  >
    <div class="flex flex-col h-full">
      <div class="mb-3">
        <a-radio-group
          class="flex w-full text-center"
          v-model:value="filterMode"
        >
          <a-radio-button class="flex-grow" value="custom"
            ><fa icon="fal filter" class="pushtop"></fa
          ></a-radio-button>
          <a-radio-button class="flex-grow" value="saved"
            ><fa icon="fal list-alt" class="pushtop"></fa
          ></a-radio-button>
        </a-radio-group>
      </div>

      <div v-show="filterMode === 'custom'" class="flex-grow h-full">
        <div class="pb-2 mb-2">
          <ConnectorDropdown
            @change="handleChangeConnectors"
          ></ConnectorDropdown>
        </div>

        <AssetFilters @refresh="handleFilterChange"></AssetFilters>
      </div>

      <div v-show="filterMode === 'saved'">
        <!--     <SavedFilters @refresh="handleSavedSearchChange"></SavedFilters> -->
      </div>
    </div>
  </div>
  <div
    class="flex flex-col items-stretch h-full col-span-12 pt-6 bg-white  sm:col-span-8 md:col-span-7"
    style="overflow: hidden"
  >
    <div class="flex items-center px-6 gap-x-3">
      <a-input
        placeholder="Search"
        v-model:value="queryText"
        @change="handleSearchChange"
      >
        <template #suffix>
          <a-popover placement="bottomLeft">
            <template #content>
              <Preferences
                :defaultProjection="projection"
                @change="handleChangePreferences"
                @sort="handleChangeSort"
                @state="handleState"
              ></Preferences>
            </template>
            <fa icon="fal cog"></fa>
          </a-popover>
        </template>
      </a-input>
    </div>

    <div class="flex w-full px-6 mt-3">
      <AssetTabs
        v-model="assetType"
        :assetTypeList="assetTypeList"
        :assetTypeMap="assetTypeMap"
        :total="totalSum"
        class="rounded-tr"
      ></AssetTabs>
    </div>

    <div
      v-if="list && list.length <= 0 && !isLoading && !isValidating"
      class="flex-grow mx-6 border-b border-l border-r rounded-b-md"
    >
      <EmptyView></EmptyView>
    </div>
    <AssetList
      v-else
      :list="list"
      :score="searchScoreList"
      @preview="handlePreview"
      :projection="projection"
      :isLoading="isLoading || isValidating"
      ref="assetlist"
    ></AssetList>
    <div class="flex w-full px-6 py-1" style="height: 24px; min-height: 24px">
      <div class="flex items-center justify-between w-full">
        <div
          class="flex items-center text-sm leading-none"
          v-if="isLoading || isValidating"
        >
          <a-spin size="small" class="mr-2 leading-none"></a-spin
          ><span>searching results</span>
        </div>
        <AssetPagination
          v-else
          :label="assetTypeLabel"
          :listCount="list.length"
          :totalCount="totalCount"
        ></AssetPagination>

        <div
          class="text-sm cursor-pointer text-primary"
          @click="loadMore"
          v-if="isLoadMore && (!isLoading || !isValidating)"
        >
          load more...
        </div>
      </div>
    </div>
  </div>
</template>
      
<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from "vue";

import AssetFilters from "@/discovery/asset/filters/index.vue";
import SavedFilters from "@/discovery/asset/saved/index.vue";
import AssetList from "@/discovery/asset/list/index.vue";
import AssetTabs from "@/discovery/asset/tabs/index.vue";
import AssetPagination from "@common/pagination/index.vue";
import SearchBox from "@common/searchbox/searchlist.vue";
import ConnectorDropdown from "@common/dropdown/connector/index.vue";
import EmptyView from "@common/empty/discover.vue";
import Preferences from "@/discovery/asset/preference/index.vue";
// import { useDebounceFn } from "@vueuse/core";
// import fetchAssetDiscover from "~/composables/asset/fetchAssetDiscover";
import useDiscoveryPreferences from "~/composables/preference/useDiscoveryPreference";
// import { DISCOVERY_FETCH_LIST } from "~/constant/cache";
// import { Components } from "~/api/atlas/client";

import useAssetList from "~/composables/bots/useAssetList";
import { AssetTypeList } from "~/constant/assetType";
import { useDebounceFn } from "@vueuse/core";
import { Components } from "~/api/atlas/client";
import { SearchParameters } from "~/types/atlas/attributes";
import { BaseAttributes, BasicSearchAttributes } from "~/constant/projection";

export default defineComponent({
  name: "HelloWorld",
  components: {
    AssetList,
    SavedFilters,
    SearchBox,
    AssetTabs,
    AssetFilters,
    AssetPagination,
    ConnectorDropdown,
    Preferences,
    EmptyView,
  },
  data() {
    return {
      activeKey: "",
      debounce: null,
    };
  },
  emits: ["preview"],
  setup(props, { emit }) {
    let filterMode = ref("custom");

    const now = ref(false);
    let initialBody: SearchParameters = reactive({});
    const assetType = ref("Catalog");

    const queryText = ref("");

    const connectorsPayload = ref({});

    const filters = ref([]);

    const limit = ref(20);
    const offset = ref(0);
    const sortOrder = ref("");

    const state = ref("active");

    const assetTypeLabel = computed(() => {
      const found = AssetTypeList.find((item) => {
        return item.id == assetType.value;
      });
      return found?.label;
    });

    const totalCount = computed(() => {
      if (assetType.value === "Catalog") {
        return totalSum.value;
      }
      return assetTypeMap.value[assetType.value];
    });

    //Get All Disoverable Asset Types
    let assetTypeList = ref([]);
    assetTypeList.value = AssetTypeList.filter((item) => {
      return item.isDiscoverable == true;
    });

    const totalSum = computed(() => {
      let sum = 0;
      assetTypeList.value.forEach((element) => {
        if (assetTypeMap.value[element.id]) {
          sum = sum + assetTypeMap.value[element.id];
        }
      });
      return sum;
    });

    const assetTypeListString = assetTypeList.value
      .map((item) => item.id)
      .join(",");

    // Push all asset type
    assetTypeList.value.push({
      id: "Catalog",
      label: "All",
    });

    const assetlist = ref(null);

    const isLoadMore = computed(() => {
      return totalCount.value > list.value.length;
    });

    //TODO - Get Filtered Asset Types based on selected connectors
    const {
      list,
      replaceBody,
      isLoading,
      isValidating,
      searchScoreList,
      isAggregate,
      assetTypeMap,
    } = useAssetList(now, assetTypeListString, initialBody, assetType.value);

    const updateBody = () => {
      initialBody = {
        typeName: assetTypeListString,
        limit: limit.value,
        offset: offset.value,
        entityFilters: {},
        attributes: [...BaseAttributes, ...BasicSearchAttributes],
        aggregationAttributes: [],
      };
      initialBody.entityFilters = {
        condition: "AND",
        criterion: [...filters.value],
      };
      if (assetType.value !== "Catalog") {
        initialBody.entityFilters.criterion.push({
          attributeName: "__typeName",
          attributeValue: assetType.value,
          operator: "eq",
        });
      }

      if (state.value) {
        if (state.value === "all") {
          initialBody.excludeDeletedEntities = false;
        } else if (state.value === "deleted") {
          initialBody.excludeDeletedEntities = false;
          initialBody.entityFilters.criterion.push({
            attributeName: "__state",
            attributeValue: "DELETED",
            operator: "eq",
          });
        } else {
          initialBody.excludeDeletedEntities = true;
        }
      }

      let connectorCritera = {
        condition: "OR",
        criterion: [],
      };
      let connectionCriteria = {
        condition: "OR",
        criterion: [],
      };
      connectorsPayload.value?.connectors?.forEach((element: any) => {
        connectorCritera.criterion?.push({
          attributeName: "integrationName",
          attributeValue: element,
          operator: "eq",
        });
      });
      connectorsPayload.value?.connections?.forEach((element: any) => {
        connectionCriteria.criterion?.push({
          attributeName: "connectionQualifiedName",
          attributeValue: element,
          operator: "eq",
        });
      });
      initialBody.entityFilters.criterion.push(connectorCritera);
      initialBody.entityFilters.criterion.push(connectionCriteria);

      if (sortOrder.value !== "default") {
        const split = sortOrder.value.split("|");
        if (split.length > 1) {
          initialBody.sortBy = split[0];
          initialBody.sortOrder = split[1].toUpperCase();
        }
      } else {
        delete initialBody.sortBy;
        delete initialBody.sortOrder;
      }

      if (queryText.value) {
        initialBody.query = queryText.value;
      }

      replaceBody(initialBody);
      if (assetlist.value) {
        assetlist?.value.scrollToItem(0);
      }
    };

    watch(
      assetType,
      () => {
        console.log("asset type changed");
        isAggregate.value = false;
        // abort();
        offset.value = 0;
        updateBody();

        if (!now.value) {
          isAggregate.value = true;
          now.value = true;
        }
      },
      {
        immediate: true,
      }
    );

    const { projection } = useDiscoveryPreferences();

    const handleSearchChange = useDebounceFn((val) => {
      offset.value = 0;
      updateBody();
    }, 100);

    const handleChangePreferences = (payload: any) => {
      projection.value = payload;
    };

    const handleChangeSort = (payload: any) => {
      sortOrder.value = payload;
      isAggregate.value = false;
      updateBody();
    };

    const handleState = (payload: any) => {
      state.value = payload;
      isAggregate.value = true;
      updateBody();
    };

    const handleFilterChange = (payload: any) => {
      filters.value = payload;
      offset.value = 0;
      isAggregate.value = true;
      updateBody();
    };

    const handleChangeConnectors = (payload: any) => {
      connectorsPayload.value = payload;
      isAggregate.value = true;
      offset.value = 0;
      updateBody();
    };

    const handlePreview = (item) => {
      emit("preview", item);
    };

    const loadMore = () => {
      if (list.value.length + limit.value < totalCount.value) {
        offset.value = list.value.length + limit.value;
      }
      isAggregate.value = false;
      updateBody();
    };

    return {
      searchScoreList,
      list,
      assetType,
      assetTypeLabel,
      assetTypeList,
      assetTypeMap,
      isAggregate,
      filterMode,
      replaceBody,
      handleSearchChange,
      projection,
      handleChangePreferences,
      handleChangeSort,
      isLoading,
      isValidating,
      handleChangeConnectors,
      handleFilterChange,
      handlePreview,
      queryText,
      totalCount,
      assetlist,
      isLoadMore,
      loadMore,
      totalSum,
      handleState,
      // listCount,
      // isLoading,
      // limit,
      // offset,
      // totalCount,
      // isLoadMore,
      // loadMore,
      // handleSearchChange,
      // handleFilterChange,
      // assetlist,
      // projection,
      // handleChangePreferences,
      // handleChangeAssetType,
      // assetTypeList,
      // handleChangeConnectors,
      // changeConnectors,
      // handleChangeSort,
      // handleSavedSearchChange,
      // savedSearch,
      // list,
      // filterMode,
      // state,
      // STATES,
      // assetTypeList,
      // totalCount,
      // listCount,
      // // defaultBody,
      // // handleSearchChange,
      // // handleChangePreferences,
      // // handleChangeAssetType,
      // projection,
    };
  },
  methods: {
    getIsLoadMore(
      length: number,
      offset: any,
      limit: number,
      totalCount: number
    ) {
      if (
        totalCount >= limit &&
        length < totalCount &&
        offset + limit <= totalCount &&
        offset + limit < 10000
      ) {
        return true;
      }
      return false;
    },
  },
});
</script>
      
      
