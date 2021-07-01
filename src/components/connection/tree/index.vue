<template>
  <LoadingView v-if="isLoading"></LoadingView>
  <ErrorView v-else-if="isError" :error="error"></ErrorView>

  <div>
    <a-tree
      :treeData="sourceTree"
      :blockNode="true"
      :defaultExpandAll="true"
      v-model:expandedKeys="expandedKeys"
      v-model:selectedKeys="selectedKeys"
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
import { defineComponent, reactive, ref, watch } from "vue";
import handleTreeExpand from "~/composables/tree/handleTreeExpand";
import { debouncedWatch } from "@vueuse/core";
import EmptyView from "@common/empty/index.vue";
import ErrorView from "@common/error/index.vue";
import LoadingView from "@common/loaders/section.vue";
import { useRouter } from "vue-router";
import { useConnectionsStore } from "~/pinia/connections";
import useConnectionsList from "~/composables/bots/useConnectionList";
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
  emits: ["select"],
  setup(props, { emit }) {
    const store = useConnectionsStore();

    let sourceTree = ref([...store.getSourceTree(props.searchText)]);
    watch(
      () => store.getList,
      () => {
        sourceTree.value = [...store.getSourceTree(props.searchText)];
      }
    );

    debouncedWatch(
      () => props.searchText,
      () => {
        sourceTree.value = [...store.getSourceTree(props.searchText)];
      },
      { debounce: 100 }
    );
    const router = useRouter();
    const handleEvent = () => {
      router.push("/setup");
    };
    const { expandedKeys, selectNode, selectedKeys, expandNode } =
      handleTreeExpand(emit, "connection_tree");

    const now = ref(true);
    const initialBody = {
      limit: 100,
    };
    useConnectionsList(now, initialBody, CONNECTION_FETCH_LIST);

    return {
      handleEvent,
      expandedKeys,
      selectedKeys,
      selectNode,
      expandNode,
      isSuccess: store.getStatus.isValidating,
      isValidating: store.getStatus.isValidating,
      isLoading: store.getStatus.isLoading,
      isError: store.getStatus.isError,
      error: store.getStatus.error,
      sourceTree,
    };
  },
});
</script>