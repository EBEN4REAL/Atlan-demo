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
  <Loading v-if="loading"></Loading>
  <ErrorView v-else-if="!loading && error" :error="error"></ErrorView>
  <EmptyView
    v-else-if="!loading && !error && list.length == 0"
    empty="No connectors found"
  ></EmptyView>
  <div class="flex items-center px-6 py-4 space-x-3 align-middle" v-else>
    <template v-for="item in list" :key="item.guid">
      <ItemView :item="item" @click="handleSelect(item)"></ItemView>
    </template>
  </div>
</template>
            
<script lang="ts">
import { defineComponent } from "vue";
import ItemView from "./item.vue";
import CategorySelector from "@common/selector/category/index.vue";

import Loading from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";
import EmptyView from "@common/empty/index.vue";

import { ConnectorAttributes } from "~/constant/projection";
import { Search } from "~/api/atlas/search";
import { Components } from "~/api/atlas/client";

export default defineComponent({
  components: {
    ItemView,
    CategorySelector,
    Loading,
    ErrorView,
    EmptyView,
  },
  data() {
    return {
      searchText: "",
      category: "",
      loading: false,
      error: "",
      list: [],
      debounce: undefined as any,
      cancelToken: undefined,
    };
  },
  emits: ["select"],
  mounted() {
    this.handleSearch();
  },
  methods: {
    handleSelect(item: any) {
      this.$emit("select", item);
    },
    handleChangeSearchText() {
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        this.handleSearch();
      }, 100);
    },
    async handleSearch() {
      try {
        if (this.loading && this.cancelToken) {
          this.cancelToken?.cancel("CANCELLED");
        } else {
          this.loading = true;
          this.error = "";
          this.cancelToken = this.$axios.CancelToken.source();
        }
        let body: Components.Schemas.SearchParameters = {
          typeName: "AtlanBot",
          excludeDeletedEntities: true,
          includeClassificationAttributes: true,
          includeSubClassifications: true,
          includeSubTypes: false,
          limit: 50,
          offset: 0,
          query: this.searchText,
          attributes: ConnectorAttributes,
          entityFilters: {},
        };
        const res = await Search.Basic(body, {
          cache: true,
          cancelToken: this.cancelToken.token,
        });
        if (res?.data?.entities) {
          this.list = res.data.entities;
        } else {
          this.list = [];
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        if (error?.message === "CANCELLED") {
          this.error = "";
        } else {
          this.error = error;
        }
      }
    },
  },
});
</script>