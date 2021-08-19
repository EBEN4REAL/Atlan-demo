<template>
  <div class="flex flex-col h-full">
    <LoadingView v-if="isLoading"></LoadingView>

    <ErrorView v-else-if="isError" :error="error"></ErrorView>

    <div class="flex flex-col flex-grow w-full space-y-2">
      <div
        v-for="item in list"
        :key="item.guid"
        class="flex justify-between px-3 py-2 text-gray-800 bg-white border cursor-pointer  hover:bg-gray-100"
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

import LoadingView from "@common/loaders/section.vue";
import ErrorView from "@common/error/index.vue";
import EmptyView from "@common/empty/index.vue";
import fetchSavedSearchList from "~/composables/savedsearch/fetchSavedSearchList";
import { SAVED_SEARCH } from "~/api/keyMaps/search";

export default defineComponent({
  components: { LoadingView, ErrorView },
  props: {},
  setup(props) {
    const now = ref(true);
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