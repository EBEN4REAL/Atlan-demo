<template>
  <div class="flex flex-col h-full">
    <LoadingView
      v-if="
        [STATES.PENDING].includes(state) || [STATES.VALIDATING].includes(state)
      "
    ></LoadingView>

    <ErrorView
      :error="errorMessage"
      v-else-if="[STATES.ERROR, STATES.STALE_IF_ERROR].includes(state)"
    ></ErrorView>

    <div class="px-3 mb-3" v-else>
      <a-input placeholder="Search.."></a-input>
    </div>
    <div class="flex flex-col flex-grow w-full px-3 space-y-2">
      <div
        class="flex flex-col px-3 py-2 text-gray-800 bg-white border rounded-lg cursor-pointer  hover:bg-gray-50"
        v-for="item in list"
        :key="item.guid"
      >
        <div class="mb-0 leading-none tracking-tight">
          {{ item?.attributes?.name }}
        </div>
        <div class="text-gray-400">{{ item?.attributes?.__createdBy }}</div>
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

export default defineComponent({
  components: { LoadingView, ErrorView },
  props: {},
  setup(props) {
    let now = ref(true);
    const { list, totalCount, listCount, state, STATES, errorMessage } =
      fetchSavedSearchList(now);
    return {
      list,
      state,
      STATES,
      errorMessage,
      totalCount,
      listCount,
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