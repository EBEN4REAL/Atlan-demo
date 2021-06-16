


<template>
  <div class="h-full col-span-2 pt-5 border-r border-gray-100 bg-sidebar">
    <div class="mb-4">
      <ConnectorDropdown></ConnectorDropdown>
    </div>
    <div class="px-4">
      <p class="flex mb-1 text-sm leading-none text-gray-500">Filters</p>
    </div>

    <AssetFilters @change="handleFilterChange"></AssetFilters>
  </div>
  <div
    class="flex flex-col items-stretch h-full col-span-7 bg-white shadow-md"
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
        class="px-4"
      ></SearchBox>

      <div class="flex px-1 border-dashed">
        <a-button type="link"> <fa icon="fal eye" class=""></fa></a-button>
      </div>
    </div>
    <div class="flex w-full bg-sidebar">
      <AssetTabs :assetTypeList="assetTypeList"></AssetTabs>
    </div>

    <AssetList :list="list.value" @preview="handlePreview"> </AssetList>
    <div
      class="flex items-center px-6 py-2 border-t bg-sidebar"
      style="min-height: 17px"
    >
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
      
      
