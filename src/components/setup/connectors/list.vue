<template>
  <div class="h-full">
    <div class="flex justify-between w-full px-6 py-4 border-b bg-gray-50">
      <a-input-search
        size="default"
        placeholder="Search Connectors"
        @change="handleSearchChange"
      ></a-input-search>
      <!-- <CategorySelector style="min-width: 200px;" v-model:value="category"></CategorySelector> -->
    </div>

    <div class="flex-grow h-full" v-if="isError">
      <ErrorView :error="error"></ErrorView>
    </div>

    <LoadingView v-else-if="isLoading"></LoadingView>
    <div class="flex items-center px-6 py-4 space-x-3 align-middle" v-else>
      <template v-for="item in list" :key="item.guid">
        <ItemView :item="item" @click="handleSelect(item)"></ItemView>
      </template>
    </div>
  </div>
</template>
            
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import ItemView from "./item.vue";
import CategorySelector from "@common/selector/category/index.vue";

import LoadingView from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";
import EmptyView from "@common/empty/index.vue";

import fetchBotsList from "~/composables/bots/fetchBotsList";

import { Components } from "~/api/atlas/client";
import { useRoute, useRouter } from "vue-router";
import { useDebounceFn } from "@vueuse/core";
import { BotsType } from "~/types/atlas/bots";

export default defineComponent({
  components: {
    ItemView,
    CategorySelector,
    LoadingView,
    ErrorView,
    EmptyView,
  },
  setup(props, { emit }) {
    let now = ref(true);
    const entityFilters: Components.Schemas.FilterCriteria = {
      operator: <Components.Schemas.Operator>"eq",
      attributeName: "category",
      attributeValue: "metadata",
    };

    const { list, isError, isLoading, query, error } = fetchBotsList(
      true,
      now,
      entityFilters
    );
    const route = useRoute();

    const router = useRouter();
    watch(list, () => {
      let isSample = false;
      if (route.query.sample) {
        isSample = route.query.sample == "true";
      }
      if (route.query.connector) {
        let found = list?.value?.find(
          (item) =>
            item.attributes.integrationName == route.query.connector &&
            item.attributes.isSample === isSample
        );
        if (found) {
          emit("select", found);
        }
      }
    });

    const handleSearchChange = useDebounceFn((val) => {
      query(val.target.value);
    }, 100);

    const handleSelect = (item: BotsType) => {
      const isSample = item?.attributes?.isSample?.toString();

      const query = {
        ...route?.query,
        connector: item?.attributes?.integrationName,
        sample: isSample,
      };
      router.replace({ query });
      emit("select", item);
    };

    return {
      list,
      isError,
      isLoading,
      handleSearchChange,
      handleSelect,
      error,
    };
  },
  data() {
    return {};
  },
  emits: ["select"],
});
</script>