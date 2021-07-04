<template>
  <div class="flex flex-col h-full">
    <LoadingView v-if="isLoading"></LoadingView>

    <ErrorView :error="error" v-else-if="isError"></ErrorView>

    <div class="flex flex-col flex-grow w-full space-y-2">
      <div
        class="flex justify-between px-3 py-2 text-gray-800 bg-white border cursor-pointer  hover:bg-gray-50"
        v-for="item in list"
        :key="item.guid"
      >
        <div class="mb-0 leading-none tracking-tight">
          {{ item?.attributes?.name }}
        </div>
        <fa icon="fal filter"></fa>
      </div>
    </div>
  </div>
</template>
      
<script lang="ts">
import { defineComponent, ref } from "vue";
import fetchSavedSearchList from "~/composables/savedsearch/fetchSavedSearchList";

import LoadingView from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";
import EmptyView from "@common/empty/index.vue";
import { SAVED_SEARCH } from "~/api/keyMaps/search";

export default defineComponent({
  components: { LoadingView, ErrorView },
  props: {},
  setup(props) {
    let now = ref(true);
    const { list, totalCount, listCount, isLoading, isError, error } =
      fetchSavedSearchList("sadasd", now);
    return {
      list,
      error,
      totalCount,
      listCount,
      isError,
      isLoading,
    };
  },
});
</script>
      
<style scoped>
.scroller {
  height: 100%;
  overflow-y: auto;
}
</style>