


<template>
  <div class="h-full col-span-2 pt-5">
    <div class="flex flex-col h-full">
      <div class="px-3 mb-3">
        <a-radio-group
          class="flex w-full text-center"
          v-model:value="filterMode"
        >
          <a-radio-button class="flex-grow" value="custom"
            >Filters</a-radio-button
          >
          <a-radio-button class="flex-grow" value="saved">Saved</a-radio-button>
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
    class="flex flex-col items-stretch h-full col-span-7"
    style="overflow: hidden"
  >
    <div class="flex items-center border-b border-gray-200">
      <SearchBox
        @change="handleSearchChange"
        :loading="
          [STATES.PENDING].includes(state) ||
          [STATES.VALIDATING].includes(state)
        "
        size="large"
        class="px-4 mt-4"
      ></SearchBox>
    </div>
    <div class="flex w-full">
      <AssetTabs :assetTypeList="assetTypeList"></AssetTabs>
    </div>

    <AssetList :list="list.value" @preview="handlePreview"> </AssetList>
    <div class="flex items-center px-6 py-2" style="min-height: 17px">
      <div
        class="flex items-center leading-none"
        v-if="
          [STATES.PENDING].includes(state) ||
          [STATES.VALIDATING].includes(state)
        "
      >
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

import fetchAssetDiscover from "~/composables/asset/fetchAssetDiscover";

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
  },
  props: {},
  data() {
    return {
      activeKey: "",
      debounce: null,
    };
  },
  computed: {
    loading(): boolean {
      return false;
    },
  },
  mounted() {
    // this.fetchSearch({});
  },
  emits: ["preview"],
  setup(props) {
    let filterMode = ref("custom");

    let now = ref(true);
    let debounce = null;
    const defaultBody = ref({
      typeName: "Table",
      excludeDeletedEntities: true,
      includeClassificationAttributes: true,
      includeSubClassifications: true,
      includeSubTypes: true,
      limit: 20,
      offset: 0,
      attributes: [...BaseAttributes, ...BasicSearchAttributes],
      entityFilters: null,
      aggregationAttributes: ["__typeName.keyword"],
    });
    const {
      list,
      totalCount,
      listCount,
      assetTypeList,
      offset,
      limit,
      mutate,
      state,
      STATES,
    } = fetchAssetDiscover(now, defaultBody);

    const handleSearchChange = (value: string) => {
      if (value == "") {
        defaultBody.value.query = value;
        mutate();
      } else {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          defaultBody.value.query = value;
          mutate();
        }, 100);
      }
    };

    return {
      list,
      filterMode,
      state,
      STATES,
      offset,
      limit,
      assetTypeList,
      totalCount,
      listCount,
      defaultBody,
      handleSearchChange,
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
      
      
