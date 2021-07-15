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
    <template #title="{ title, type, key }">
      <a-dropdown :trigger="['contextmenu']">
        <div @click="() => reirectToProfile(type, key)" class="min-w-full">
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
          <span
            class="text-sm leading-none text-gray-600"
            >{{ title }}</span
          >
        </div>
        <template #overlay>
          <GlossaryContextMenu
            @glossarContextMenuClick="glossaryTreeContextMenuClick"
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
        @glossarContextMenuClick="glossaryTreeContextMenuClick"
      />
    </template>
  </a-dropdown>
</template>

<script lang="ts">
import data from "emoji-mart-vue-fast/data/facebook.json";
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { Emoji, EmojiIndex } from "emoji-mart-vue-fast/src";
import { Modal } from "ant-design-vue";

import { defineComponent, watch } from "vue";
import fetchGlossaryList from "~/composables/glossary/fetchGlossaryList";
import useGlossaryTree from "~/composables/glossary/useGlossaryTree";
import handleTreeExpand from "~/composables/tree/handleTreeExpand";
import { Glossary } from "~/api/atlas/glossary";

import GlossaryContextMenu from "./glossaryContextMenu.vue";
import { MenuInfo } from "ant-design-vue/lib/menu/src/interface";
import { useRouter } from "vue-router";

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
  emits: ["showCreateGlossaryModal", "showUpdateGlossaryModal", "success"],
  data() {
    return {};
  },

  setup(props, { emit }) {
    const { list, totalCount, listCount, refetchGlossary, response } =
      fetchGlossaryList();
    const { selectedKeys, expandedKeys, expandNode, selectNode } =
      handleTreeExpand();

    const index = new EmojiIndex(data);

    const { treeData, onLoadData } = useGlossaryTree(list);
    console.log(treeData, "treeData");

    const refreshTree = () => {
      refetchGlossary();
    };

    const glossaryTreeContextMenuClick = (context: any) => {
      if (context.action === "create") emit("showCreateGlossaryModal", context);
      if (context.action === "update") emit("showUpdateGlossaryModal", context);
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

            setTimeout(() => {
              refreshTree();
            }, 1000);
          },
        });
      }
    };
    const router = useRouter();

    const reirectToProfile = (type: string, guid: string) => {
      if (type === "glossary") router.push(`/glossary/${guid}`);
      else router.push(`/glossary/${type}/${guid}`);
    };

    return {
      index,
      list,
      response,
      treeData,
      listCount,
      totalCount,
      onLoadData,
      selectedKeys,
      expandedKeys,
      expandNode,
      selectNode,
      refreshTree,
      glossaryTreeContextMenuClick,
      reirectToProfile,
    };
  },
});
</script>
<style lang="less" scoped>
.root {
  min-height: 50vh;
}
</style>
