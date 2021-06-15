<template>
  <a-tree
    :treeData="treeData"
    :load-data="onLoadData"
    :blockNode="true"
    v-model:expandedKeys="expandedKeys"
    v-model:value="selectedKeys"
    @select="selectNode"
    @expand="expandNode"
  >
    <template #title="{ title, type }" class="">
      <a-dropdown :trigger="['contextmenu']">
        <div>
          <span>
            <emoji
              :data="index"
              emoji="file_folder"
              set="twitter"
              :size="20"
              v-if="type === 'glossary'"
            />
            <emoji
              :data="index"
              emoji="file_folder"
              :size="20"
              v-if="type === 'category'"
            />
          </span>
          <span class="text-sm leading-none text-gray-600">{{ title }}</span>
        </div>
        <template #overlay>
          <GlossaryContextMenu :type="type" />
        </template>
      </a-dropdown>
    </template>
  </a-tree>
  <a-dropdown :trigger="['contextmenu']">
    <div class="root"></div>
    <template #overlay>
      <GlossaryContextMenu type="root" />
    </template>
  </a-dropdown>
</template>


<script lang="ts">
import data from "emoji-mart-vue-fast/data/all.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { Emoji, EmojiIndex } from "emoji-mart-vue-fast/src";

import { defineComponent } from "vue";
import fetchGlossaryList from "~/composables/glossary/fetchGlossaryList";
import useGlossaryTree from "~/composables/glossary/useGlossaryTree";
import handleTreeExpand from "~/composables/tree/handleTreeExpand";

import GlossaryContextMenu from "./glossaryContextMenu.vue";

export default defineComponent({
  components: { Emoji, GlossaryContextMenu },
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
  setup() {
    const { list, totalCount, listCount } = fetchGlossaryList();
    const { selectedKeys, expandedKeys, expandNode, selectNode } =
      handleTreeExpand();

    const index = new EmojiIndex(data);

    const { treeData, onLoadData } = useGlossaryTree(list);

    return {
      index,
      list,
      treeData,
      listCount,
      totalCount,
      onLoadData,
      selectedKeys,
      expandedKeys,
      expandNode,
      selectNode,
    };
  },
});
</script>
<style lang="less" scoped>
.root {
  min-height: 50vh;
}
</style>