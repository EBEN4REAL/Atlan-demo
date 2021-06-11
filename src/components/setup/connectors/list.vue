<template>
  <div class="flex justify-between w-full px-6 py-4 border-b bg-gray-50">
    <a-input-search
      size="default"
      placeholder="Search Connectors"
      v-model:value="searchText"
      @change="handleChangeSearchText"
    ></a-input-search>
    <!-- <CategorySelector style="min-width: 200px;" v-model:value="category"></CategorySelector> -->
  </div>
  <ErrorView
    v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
  ></ErrorView>
  <LoadingView
    v-else-if="
      [STATES.PENDING].includes(state) ||
      (searchText && [STATES.VALIDATING].includes(state))
    "
  ></LoadingView>
  <div
    class="flex items-center px-6 py-4 space-x-3 align-middle"
    v-else-if="[STATES.SUCCESS].includes(state)"
  >
    <template v-for="item in list" :key="item.guid">
      <ItemView :item="item" @click="handleSelect(item)"></ItemView>
    </template>
  </div>
</template>
            
<script lang="ts">
import { defineComponent, ref } from "vue";
import ItemView from "./item.vue";
import CategorySelector from "@common/selector/category/index.vue";

import LoadingView from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";
import EmptyView from "@common/empty/index.vue";

import fetchBotsList from "~/composables/bots/fetchBotsList";

import { debounce } from "~/composables/utils/debounce";
import { Components } from "~/api/atlas/client";

export default defineComponent({
  components: {
    ItemView,
    CategorySelector,
    LoadingView,
    ErrorView,
    EmptyView,
  },
  setup(props) {
    let searchText = ref("");
    let now = ref(true);

    const entityFilters = {
      operator: <Components.Schemas.Operator>"eq",
      attributeName: "category",
      attributeValue: "crawler",
    };

    const { list, totalCount, listCount, mutate, body, state, STATES } =
      fetchBotsList(now, searchText.value, entityFilters);

    const handleChangeSearchText = debounce((input: any) => {
      body.value.query = input.target.value;
      mutate();
    }, 200);

    return {
      list,
      state,
      STATES,
      searchText,
      listCount,
      totalCount,
      handleChangeSearchText,
    };
  },
  data() {
    return {
      category: "",
      error: "",
      debounce: undefined as any,
      cancelToken: undefined,
    };
  },
  emits: ["select"],
  mounted() {
    // this.handleSearch();
  },
  methods: {
    handleSelect(item: any) {
      this.$emit("select", item);
    },
  },
});
</script>