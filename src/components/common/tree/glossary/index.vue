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
    <template #title="{ title, type, key }" class="">
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
          <GlossaryContextMenu
            @glossarContextMenuClick="createGlossaryCategoryTerm"
            :type="type"
            :guid="key"
          />
        </template>
      </a-dropdown>
    </template>
  </a-tree>
  <a-dropdown :trigger="['contextmenu']">
    <div class="root"></div>
    <template #overlay>
      <GlossaryContextMenu
        type="root"
        :guid="key"
        @glossarContextMenuClick="createGlossaryCategoryTerm"
      />
    </template>
  </a-dropdown>
</template>


<script lang="ts">
import data from "emoji-mart-vue-fast/data/all.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { Emoji, EmojiIndex } from "emoji-mart-vue-fast/src";
import { Modal } from "ant-design-vue";

import { defineComponent } from "vue";
import fetchGlossaryList from "~/composables/glossary/fetchGlossaryList";
import useGlossaryTree from "~/composables/glossary/useGlossaryTree";
import handleTreeExpand from "~/composables/tree/handleTreeExpand";
import { Glossary } from "~/api/atlas/glossary";

import GlossaryContextMenu from "./glossaryContextMenu.vue";
import { MenuInfo } from "ant-design-vue/lib/menu/src/interface";

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
  emits: ["showCreateGlossaryModal"],
  data() {
    return {};
  },
  setup(props, { emit }) {
    const { list, totalCount, listCount } = fetchGlossaryList();
    const { selectedKeys, expandedKeys, expandNode, selectNode } =
      handleTreeExpand();

    const index = new EmojiIndex(data);

    const { treeData, onLoadData } = useGlossaryTree(list);

    const createGlossaryCategoryTerm = (context: any) => {
      if (context.action === "create") emit("showCreateGlossaryModal", context);
      if (context.action === "delete") {
        Modal.confirm({
          title: `Are you sure delete this ${context.parentType}?`,
          okText: "Yes",
          okType: "danger",
          cancelText: "No",
          onOk() {
            const serviceMap: Record<
              string,
              "DeleteGlossary" | "DeleteGlossaryCategory" | "DeleteGlossaryTerm"
            > = {
              glossary: "DeleteGlossary",
              category: "DeleteGlossaryCategory",
              term: "DeleteGlossaryTerm",
            };
            const service = serviceMap[context.parentType];
            Glossary[service](context.parentGuid);
          },
        });
      }
    };

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
      createGlossaryCategoryTerm,
    };
  },
});
</script>
<style lang="less" scoped>
.root {
  min-height: 50vh;
}
</style>