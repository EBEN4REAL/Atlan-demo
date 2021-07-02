


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
      </a-input>
      <a-popover placement="bottom">
        <template #content>
          <Preferences
            :defaultProjection="projection"
            @change="handleChangePreferences"
            @sort="handleChangeSort"
          ></Preferences>
        </template>
        <a-button size="default"
          ><fa icon="fal cog" class="mr-1"></fa
          ><fa icon="fal chevron-down" class="text-xs text-primary-500"></fa
        ></a-button>
      </a-popover>
    </div>

    <div class="flex w-full px-6 my-1" style="min-height: 34px">
      <AssetTabs
        v-model="assetType"
        :assetTypeList="assetTypeList"
        class="rounded-tr"
      ></AssetTabs>
    </div>
    <div
      v-if="list && list.length <= 0 && !isLoading && !isValidating"
      class="flex-grow mx-6 border rounded"
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
    <div class="flex w-full px-6 pb-2" style="min-height: 17px">
      <div class="flex items-center justify-between w-full px-2 py-2">
        <div
          class="flex items-center text-sm leading-none"
          v-if="isLoading || isValidating"
        >
          <a-spin size="small" class="mr-2 leading-none"></a-spin
          ><span>searching results</span>
        </div>
        <!--        <AssetPagination
          v-else
          :limit="limit"
          :offset="offset"
          :totalCount="totalCount"
          :listCount="listCount"
        ></AssetPagination>

        <div
          class="text-sm cursor-pointer text-primary-500"
          @click="loadMore(limit)"
          v-if="isLoadMore"
        >
          Load More...
        </div> -->
      </div>
    </div>
  </div>
</template>
      
<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";

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

    //Get All Disoverable Asset Types
    let assetTypeList = ref([]);
    assetTypeList.value = AssetTypeList.filter((item) => {
      return item.isDiscoverable == true;
    });
    const assetTypeListString = assetTypeList.value
      .map((item) => item.id)
      .join(",");

    // Push all asset type
    assetTypeList.value.push({
      id: "Catalog",
      label: "All",
    });

    //TODO - Get Filtered Asset Types based on selected connectors
    const { list, replaceBody, isLoading, isValidating, searchScoreList } =
      useAssetList(now, assetTypeListString, initialBody, assetType.value);

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

      let connectorCritera = {
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
        connectorCritera.criterion?.push({
          attributeName: "connectionQualifiedName",
          attributeValue: element,
          operator: "eq",
        });
      });
      initialBody.entityFilters.criterion.push(connectorCritera);

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
    };

    watch(
      assetType,
      () => {
        console.log("asset type changed");
        // abort();
        updateBody();
        if (!now.value) {
          now.value = true;
        }
      },
      {
        immediate: true,
      }
    );

    // const assetlist = ref(null);
    const { projection } = useDiscoveryPreferences();
    // const immediate = ref(true);
    // const {
    //   listCount,
    //   isLoadMore,
    //   loadMore,
    //   query,
    //   filter,
    //   isLoading,
    //   limit,
    //   offset,
    //   totalCount,
    //   changeAssetType,
    //   assetTypeList,
    //   changeSort,
    //   changeConnectors,
    //   savedSearch,
    // } = fetchAssetDiscover(DISCOVERY_FETCH_LIST, immediate);

    const handleSearchChange = useDebounceFn((val) => {
      updateBody();
      // query(val.target.value);
      // if (assetlist.value) {
      //   console.log("scroll");
      //   assetlist?.value.scrollToItem(0);
      // }
    }, 100);

    const handleChangePreferences = (payload: any) => {
      projection.value = payload;
    };

    const handleChangeSort = (payload: any) => {
      sortOrder.value = payload;
      updateBody();

      // changeSort(payload);
    };

    const handleFilterChange = (payload: any) => {
      filters.value = payload;
      updateBody();
    };

    // const handleSavedSearchChange = (payload: any) => {
    //   console.log(payload);

    //   if (payload.attributes) {
    //     let searchParam = JSON.parse(payload?.attributes?.searchParameters);
    //     console.log(searchParam);
    //     savedSearch(searchParam);
    //   }
    // };

    // const handleChangeAssetType = (payload: any) => {
    //   changeAssetType(payload);
    // };

    const handleChangeConnectors = (payload: any) => {
      connectorsPayload.value = payload;
      updateBody();
    };

    const handlePreview = (item) => {
      emit("preview", item);
    };

    return {
      searchScoreList,
      list,
      assetType,
      assetTypeList,
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
      
      
