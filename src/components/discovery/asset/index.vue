


<template>
  <div class="h-full col-span-2 pt-5 border-r bg-gray-50">
    <p class="px-4 text-2xl font-medium tracking-tight">Assets</p>
    <div class="px-4">
      <p class="flex text-sm leading-none text-gray-500">
       Filters
      </p>
    </div>

    <AssetFilters @change="handleFilterChange" class="bg-gray-50"></AssetFilters>
  </div>
  <div
    class="flex flex-col items-stretch h-full col-span-7 pt-5"
    style="overflow: hidden"
  >
    <div class="flex px-6 mb-2">
      <SearchBox @change="handleSearchChange"></SearchBox>
      <div class="flex ml-3">
        <a-dropdown>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1">1st item</a-menu-item>
              <a-menu-item key="2">2nd item</a-menu-item>
              <a-menu-item key="3">3rd item</a-menu-item>
            </a-menu>
          </template>
          <a-button> Actions <fa icon="fal -down" class="ml-1"></fa></a-button>
        </a-dropdown>
        <a-button> <fa icon="fal eye" class=""></fa></a-button>
      </div>
    </div>
    <div class="flex items-center px-6 mb-1" style="min-height: 17px">
      <div class="flex items-center leading-none" v-if="loading">
        <a-spin size="small" class="mr-1 leading-none"></a-spin
        ><span>searching results</span>
      </div>
      <AssetPagination
        v-else
        :limit="limit"
        :offset="offset"
        :totalCount="totalCount"
        :listCount="listCount"
      ></AssetPagination>
    </div>

    <AssetList :items="list" @preview="handlePreview" class="px-6"> </AssetList>
    <div class="flex items-center px-6 mt-2 mb-2" style="min-height: 17px">
      <div class="flex items-center leading-none" v-if="loading">
        <a-spin size="small" class="mr-1 leading-none"></a-spin
        ><span>searching results</span>
      </div>
      <AssetPagination
        v-else
        :limit="limit"
        :offset="offset"
        :totalCount="totalCount"
        :listCount="listCount"
      ></AssetPagination>
    </div>
  </div>
</template>
      
<script lang="ts">
import { defineComponent } from "vue";

import AssetFilters from "@/discovery/asset/filters/index.vue";
import AssetList from "@/discovery/asset/list/index.vue";
import AssetPagination from "@common/pagination/index.vue";
import { ActionTypes } from "~/store/modules/search/types-action";
import { useStore } from "~/store";
import SearchBox from "@common/searchbox/searchlist.vue";
import { Components } from "~/api/atlas/client";
import { SearchParameters } from "~/store/modules/search/state";
export default defineComponent({
  name: "HelloWorld",
  components: {
    AssetList,
    SearchBox,
    AssetFilters,
    AssetPagination,
  },
  props: {},
  data() {
    return {
      activeKey: "",
      debounce: null,
    };
  },
  computed: {
    result(): Components.Schemas.AtlasSearchResult {
      const store = useStore();
      return store.getters.getSearchResult;
    },
    searchParams(): SearchParameters {
      const store = useStore();
      return store.getters.getSearchParams;
    },
    list(): Components.Schemas.AtlasEntityHeader[] {
      return this.result.entities;
    },
    loading(): boolean {
      const store = useStore();
      return store.getters.getSearchLoading;
    },
    limit(): number {
      return this.searchParams.limit;
    },
    offset(): number {
      return this.searchParams.offset;
    },
    totalCount(): number {
      return this.result?.approximateCount;
    },
    listCount(): number {
      return this.list?.length;
    },
  },
  mounted() {
    this.fetchSearch({});
  },
  emits: ["preview"],
  methods: {
    handlePreview(item) {
      this.$emit("preview", item);
    },
    handleFilterChange(params: SearchParameters) {
      this.fetchSearch(params);
    },
    fetchSearch(params: SearchParameters) {
      const store = useStore();
      store.dispatch(ActionTypes.SEARCH_FETCH_LIST, params);
    },
    handleSearchChange(value: string) {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        // store.commit(MutationTypes.SEARCH_SET_SEARCH, { query: `${value}*` });
        this.fetchSearch({ query: `${value}*` });
      }, 200);
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
      
      
<style lang="less" module>
</style>
      