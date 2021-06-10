<template>
  <div>
    <a-tree
      :treeData="treeData"
      :blockNode="true"
      v-model:expandedKeys="expandedKeys"
      v-model:value="selectedKeys"
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

export default defineComponent({
  components: {},
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
    let now = ref(true);
    const { treeData, body, mutate } = fetchConnectionList(now);
    debouncedWatch(
      () => props.searchText,
      () => {
        body.value.query = props.searchText;
        mutate();
      },
      { debounce: 100 }
    );
    const { expandedKeys, selectNode, selectedKeys, expandNode } =
      handleTreeExpand(emit);
    return {
      treeData,
      expandedKeys,
      selectedKeys,
      selectNode,
      expandNode,
    };
  },
});
</script>