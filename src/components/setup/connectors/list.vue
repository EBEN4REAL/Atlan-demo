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

    <LoadingView v-if="isLoading || isValidating"></LoadingView>

    <div
      v-else
      class="grid items-center grid-cols-12 gap-2 px-6 py-4 align-middle"
    >
      <template v-for="item in list" :key="item.guid">
        <ItemView :item="item" @click="handleSelect(item)"></ItemView>
      </template>
    </div>
  </div>
</template>
            
<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";

import LoadingView from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";
import EmptyView from "@common/empty/index.vue";

import { useDebounceFn } from "@vueuse/core";
import { useRoute, useRouter } from "vue-router";
import useBotList from "~/composables/bots/useBotList";

import { Components } from "~/api/atlas/client";
import ItemView from "./item.vue";
import { BotsType } from "~/types/atlas/bots";

export default defineComponent({
  components: {
    ItemView,
    LoadingView,
    ErrorView,
    EmptyView,
  },
  emits: ["select"],
  setup(props, { emit }) {
    const now = ref(true);

    const defaultBody = reactive({
      entityFilters: {
        condition: "AND",
        criterion: [
          {
            operator: <Components.Schemas.Operator>"eq",
            attributeName: "category",
            attributeValue: "metadata",
          },
        ],
      },
    });

    const { list, isLoading, isValidating, query } = useBotList(
      now,
      defaultBody
    );

    const route = useRoute();

    const router = useRouter();

    watch(list, () => {
      let isSample = false;
      if (route.query.sample) {
        isSample = route.query.sample == "true";
      }
      if (route.query.connector) {
        const found = list?.value?.find(
          (item) =>
            item.attributes.integrationName == route.query.connector &&
            item.attributes.isSample === isSample
        );
        if (found) {
          emit("select", found);
        }
      }
    });

    const handleSearchChange = useDebounceFn((e) => {
      query(e.target.value);
    }, 200);

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
      isLoading,
      isValidating,
      handleSearchChange,
      handleSelect,
    };
  },
});
</script>