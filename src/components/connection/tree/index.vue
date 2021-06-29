<template>
  <LoadingView v-if="isLoading"></LoadingView>
  <ErrorView v-else-if="isError" :error="error"></ErrorView>
  <EmptyView
    v-else-if="!isLoading && treeData?.length === 0"
    empty="There are no connectitions available"
    buttonText="Setup new connection"
    @event="handleEvent"
  ></EmptyView>

  <div v-else>
    <a-tree
      :treeData="treeData"
      :blockNode="true"
      v-model:expandedKeys="expandedKeys"
      v-model:value="selectedKeys"
      :defaultExpandAll="true"
      @select="selectNode"
      @expand="expandNode"
    >
      <template #title="{ title, image, type, count }" class="w-full">
        <a-dropdown :trigger="['contextmenu']">
          <div class="flex items-center align-middle">
            <img
              :src="image"
              class="w-4 h-auto mr-1"
              v-if="type === 'connector'"
            />
            <div class="w-full text-sm leading-none text-gray-600">
              {{ title }} <span v-if="type === 'connector'">({{ count }})</span>
            </div>
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item key="2" disabled>{{ title }}</a-menu-item>
              <a-menu-divider></a-menu-divider>
              <a-menu-item key="open">Open</a-menu-item>
              <a-menu-divider></a-menu-divider>
              <a-menu-item key="delete" class="text-red-500"
                >Delete Connection</a-menu-item
              >
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-tree>
  </div>
</template>
  
  
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import handleTreeExpand from "~/composables/tree/handleTreeExpand";
import fetchConnectionList from "~/composables/connection/fetchConnectionList";
import { debouncedWatch } from "@vueuse/core";
// :loading="[STATES.PENDING].includes(state)"
import EmptyView from "@common/empty/index.vue";
import ErrorView from "@common/error/index.vue";
import LoadingView from "@common/loaders/section.vue";
import { useRouter } from "vue-router";
import { CONNECTION_FETCH_LIST } from "~/constant/cache";

export default defineComponent({
  components: { EmptyView, ErrorView, LoadingView },
  props: {
    searchText: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
  },
  data() {
    return {};
  },
  setup(props, { emit }) {
    const { treeData, query, error, isLoading, isError } = fetchConnectionList(
      CONNECTION_FETCH_LIST
    );

    debouncedWatch(
      () => props.searchText,
      () => {
        query(props.searchText);
      },
      { debounce: 100 }
    );

    const router = useRouter();
    const handleEvent = () => {
      router.push("/setup");
    };

    const { expandedKeys, selectNode, selectedKeys, expandNode } =
      handleTreeExpand(emit);
    return {
      treeData,
      handleEvent,
      expandedKeys,
      selectedKeys,
      selectNode,
      expandNode,
      isLoading,
      isError,
      error,
    };
  },
});
</script>