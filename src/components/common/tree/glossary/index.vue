<template>
  <!-- {{ listCount }}
  {{ list }}
  {{ totalCount }} -->

  <!-- {{ totalCount }}

  {{ error }} -->

  <a-tree :treeData="treeData" :load-data="onLoadData" :blockNode="true">
    <template #title="{ title, type, isLeaf }" class="">
      <div class="flex items-center align-middle">
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
        <div class="text-sm leading-none text-gray-600">{{ title }}</div>
      </div>
    </template>
  </a-tree>
</template>


<script lang="ts">
import data from "emoji-mart-vue-fast/data/all.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { Emoji, EmojiIndex } from "emoji-mart-vue-fast/src";

import { defineComponent } from "vue";
import fetchGlossaryList from "~/composables/glossary/fetchGlossaryList";
import useGlossaryTree from "~/composables/glossary/useGlossaryTree";
import handleTreeExpand from "~/composables/tree/handleTreeExpand";

export default defineComponent({
  components: { Emoji },
  props: {},
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
  // methods: {
  //   handleNodeSelect(selectedKeys, { selected, node }) {
  //     //   console.log("load select");
  //     this.selectedKeys = selectedKeys;

  //     if (this.selectedKeys.includes(selected)) {
  //       this.selectedKeys = [];
  //     } else {
  //       this.selectedKeys = selectedKeys;
  //     }

  //     if (!node.isLeaf) {
  //       this.handleExpand(["_node_select_"], { node: node });
  //     }
  //     if (selected) {
  //       this.$emit("select", node.dataRef);
  //     }
  //   },
  //   handleExpand(expanded, node) {
  //     if (expanded.includes("_node_select_")) {
  //       const key = node.node.eventKey;
  //       const isSelected = this.selectedKeys.includes(key);
  //       const isExpanded = this.expandedKeys.includes(key);

  //       if (isSelected && !isExpanded) {
  //         this.expandedKeys.push(key);
  //         this.expandedKeys = [...this.expandedKeys];
  //       } else if (!isSelected && isExpanded) {
  //         const index = this.expandedKeys.indexOf(key);
  //         this.expandedKeys.splice(index, 1);
  //       } else if (isSelected && isExpanded) {
  //         const index = this.expandedKeys.indexOf(key);
  //         this.expandedKeys.splice(index, 1);
  //       } else if (!isSelected && !isExpanded) {
  //         this.expandedKeys.push(key);
  //         this.expandedKeys = [...this.expandedKeys];
  //       }
  //     }
  //     return;
  //   },
  // },
});
</script>