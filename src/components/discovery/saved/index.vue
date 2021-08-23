<template>
  <div class="flex flex-col h-full">
    <div class="mb-3">
      <a-input placeholder="Search.."></a-input>
    </div>
    <div class="flex flex-col flex-grow w-full space-y-2">
      <div
        v-for="item in list"
        :key="item.guid"
        class="flex flex-col px-3 py-2 text-gray-800 bg-white border rounded-lg cursor-pointer  hover:bg-gray-100"
        :class="{ 'bg-gray-100': isSelected(item.guid) }"
        @click="handleSelect(item)"
      >
        <div class="mb-0 leading-none tracking-tight">
          {{ item?.attributes?.name }}
        </div>
        <div class="text-sm text-gray">
          {{ item?.attributes?.__createdBy }}
        </div>
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

export default defineComponent({
  components: { LoadingView, ErrorView },
  props: {},
  emits: ["refresh"],
  setup(props, { emit }) {
    const selected = ref("");

    const now = ref(true);
    const { list, totalCount, listCount, isLoading, isError, error } =
      fetchSavedSearchList("sadasd", now);

    const handleSelect = (payload) => {
      selected.value = payload.guid;
      console.log(payload);
      emit("refresh", payload);
    };

    const isSelected = (id) => {
      if (selected.value === id) return true;
      return false;
    };

    return {
      list,
      isLoading,
      totalCount,
      isError,
      listCount,
      error,
      handleSelect,
      isSelected,
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