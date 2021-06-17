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

  <div
    class="flex-grow"
    v-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
  >
    <ErrorView :error="errorMessage"></ErrorView>
  </div>

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
import { defineComponent, ref, watch } from "vue";
import ItemView from "./item.vue";
import CategorySelector from "@common/selector/category/index.vue";

import LoadingView from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";
import EmptyView from "@common/empty/index.vue";

import fetchBotsList from "~/composables/bots/fetchBotsList";

import { debounce } from "~/composables/utils/debounce";
import { Components } from "~/api/atlas/client";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    ItemView,
    CategorySelector,
    LoadingView,
    ErrorView,
    EmptyView,
  },
  setup(props, { emit }) {
    let searchText = ref("");
    let now = ref(true);

    const entityFilters = {
      operator: <Components.Schemas.Operator>"eq",
      attributeName: "category",
      attributeValue: "metadata",
    };

    const {
      errorMessage,
      list,
      totalCount,
      listCount,
      mutate,
      body,
      state,
      STATES,
    } = fetchBotsList(now, searchText.value, entityFilters);

    const route = useRoute();
    watch(list, () => {
      console.log(route.query.connector);
      console.log(route.query.sample);

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

    const handleChangeSearchText = debounce((input: any) => {
      body.value.query = input.target.value;
      mutate();
    }, 200);

    return {
      list,
      state,
      errorMessage,
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
  methods: {
    handleSelect(item: any) {
      const isSample = item?.attributes?.isSample?.toString();
      const query = {
        ...this.$route.query,
        connector: item.attributes.integrationName,
        sample: isSample,
      };
      this.$router.replace({ query });
      this.$emit("select", item);
    },
  },
});
</script>