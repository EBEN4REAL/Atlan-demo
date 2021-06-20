


<template>
  <div class="h-full col-span-2 pt-6 pl-4 bg-white">
    <div class="flex flex-col h-full">
      <div class="px-3 mb-3">
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

      <keep-alive class="flex-grow h-full">
        <div>
          <div v-if="filterMode === 'custom'">
            <div class="pb-2 mb-2">
              <ConnectorDropdown></ConnectorDropdown>
            </div>

            <AssetFilters @change="handleFilterChange"></AssetFilters>
          </div>

          <SavedFilters v-if="filterMode === 'saved'"></SavedFilters>
        </div>
      </keep-alive>
    </div>
  </div>
  <div
    class="flex flex-col items-stretch h-full col-span-7 pt-6 bg-white"
    style="overflow: hidden"
  >
    <div class="flex items-center px-6">
      <a-input placeholder="Search" @input="handleSearchChange">
        <template #suffix>
          <a-popover placement="bottom">
            <template #content>
              <Preferences
                :defaultProjection="projection"
                @change="handleChangePreferences"
              ></Preferences>
            </template>
            <fa icon="fal eye"></fa>
          </a-popover>
        </template>
      </a-input>
    </div>

    <div class="flex w-full px-6 mt-3">
      <AssetTabs
        :assetTypeList="assetTypeList"
        class="border-t border-l border-r rounded-tl rounded-tr bg-gray-50"
      ></AssetTabs>
    </div>
    <AssetList
      @preview="handlePreview"
      :list="list"
      :projection="projection"
      ref="assetlist"
    ></AssetList>
    <div class="flex w-full px-6 pb-2" style="min-height: 17px">
      <div
        class="flex items-center justify-between w-full px-2 py-2 border rounded-bl rounded-br shadow-lg  bg-gray-50"
      >
        <div class="flex items-center text-sm leading-none" v-if="isLoading">
          <a-spin size="small" class="mr-2 leading-none"></a-spin
          ><span>searching results</span>
        </div>
        <AssetPagination
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
        </div>
      </div>
    </div>
  </div>
</template>
      
<script lang="ts">
import { defineComponent, ref } from "vue";

import AssetFilters from "@/discovery/asset/filters/index.vue";
import SavedFilters from "@/discovery/asset/saved/index.vue";
import AssetList from "@/discovery/asset/list/index.vue";
import AssetTabs from "@/discovery/asset/tabs/index.vue";
import AssetPagination from "@common/pagination/index.vue";
import SearchBox from "@common/searchbox/searchlist.vue";
import { SearchParameters } from "~/store/modules/search/state";
import ConnectorDropdown from "@common/dropdown/connector/index.vue";
import { BaseAttributes, BasicSearchAttributes } from "~/constant/projection";

import Preferences from "@/discovery/asset/preference/index.vue";
import { useDebounceFn } from "@vueuse/core";
import fetchAssetDiscover from "~/composables/asset/fetchAssetDiscover";
import useDiscoveryPreferences from "~/composables/preference/useDiscoveryPreference";

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
  },
  data() {
    return {
      activeKey: "",
      debounce: null,
    };
  },
  emits: ["preview"],
  setup(props) {
    let filterMode = ref("custom");

    const assetlist = ref(null);
    const { projection } = useDiscoveryPreferences();
    const immediate = ref(true);
    const {
      list,
      listCount,
      isLoadMore,
      loadMore,
      query,
      isLoading,
      limit,
      offset,
      totalCount,
      handleChangeAssetType,
      assetTypeList,
    } = fetchAssetDiscover(true, immediate);

    const handleSearchChange = useDebounceFn((val) => {
      query(val.target.value);
      if (assetlist.value) {
        console.log("scroll");
        assetlist?.value.scrollToItem(0);
      }
    }, 100);

    const handleChangePreferences = (payload: any) => {
      projection.value = payload;
    };

    return {
      list,
      filterMode,
      listCount,
      isLoading,
      limit,
      offset,
      totalCount,
      isLoadMore,
      loadMore,
      handleSearchChange,
      assetlist,
      projection,
      handleChangePreferences,
      handleChangeAssetType,
      assetTypeList,
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
    handlePreview(item) {
      this.$emit("preview", item);
    },
    handleFilterChange(params: SearchParameters) {
      this.fetchSearch(params);
    },
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
      
      
