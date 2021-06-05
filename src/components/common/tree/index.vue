<template>
  <a-tree
    v-model:expandedKeys="expandedKeys"
    :blockNode="blockNode"
    :checkable="checkable"
    :tree-data="list"
    v-model:checkedKeys="checkedKeys"
    v-model:selectedKeys="selectedKeys"
    @expand="handleExpand"
    @select="handleNodeSelect"
    :disabled="disabled"
  >
    <template #title="{ title, image, isLeaf }" class="flex">
      <span v-if="!isLeaf"
        ><img :src="image" class="h-4 w-auto float-left mr-1"
      /></span>
      <span class="text-dark-400 text-base leading-none" v-if="!isLeaf">{{
        title
      }}</span>
      <span class="text-dark-400 text-sm leading-none" v-if="isLeaf">{{
        title
      }}</span>
    </template>
  </a-tree>
</template>


<script lang="ts">
import { TreeDataItem } from "ant-design-vue/lib/tree/Tree";
import { defineComponent, PropType } from "vue";
// import { TreeDataItem } from "ant-design-vue/es/tree/Tree";

export default defineComponent({
  name: "Tree",
  props: {
    checkable: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    disabled: {
      type: Boolean,
      required: false,
      default() {
        return false;
      },
    },
    list: {
      type: Array as PropType<TreeDataItem[]>,
      required: false,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      expandedKeys: [],
      blockNode: true,
      checkedKeys: null,
      selectedKeys: [],
    };
  },
  methods: {
    handleNodeSelect(selectedKeys, { selected, node }) {
      //   console.log("load select");
      this.selectedKeys = selectedKeys;

      if (this.selectedKeys.includes(selected)) {
        this.selectedKeys = [];
      } else {
        this.selectedKeys = selectedKeys;
      }

      if (!node.isLeaf) {
        this.handleExpand(["_node_select_"], { node: node });
      }
      //   if (selected) {
      //     this.$emit("select", node.dataRef);
      //   }
    },
    handleExpand(expanded, node) {
      if (expanded.includes("_node_select_")) {
        console.log(expanded);
        if (
          this.selectedKeys.includes(node.node.eventKey) &&
          !this.expandedKeys.includes(node.node.eventKey)
        ) {
          this.expandedKeys.push(node.node.eventKey);
          this.expandedKeys = [...this.expandedKeys];
        } else if (
          !this.selectedKeys.includes(node.node.eventKey) &&
          this.expandedKeys.includes(node.node.eventKey)
        ) {
          const index = this.expandedKeys.indexOf(node.node.eventKey);
          this.expandedKeys.splice(index, 1);
        }
      }

      //   if (
      //     this.selectedKeys.includes(node.node.eventKey) &&
      //     !this.expandedKeys.includes(node.node.eventKey)
      //   ) {
      //     this.expandedKeys.push(node.node.eventKey);
      //     this.expandedKeys = [...this.expandedKeys];
      //   } else if (
      //     !this.selectedKeys.includes(node.node.eventKey) &&
      //     this.expandedKeys.includes(node.node.eventKey)
      //   ) {
      //     const index = this.expandedKeys.indexOf(node.node.eventKey);
      //     this.expandedKeys.splice(index, 1);
      //   }
      //     console.log("handleExpand", this.expandedKeys, node.node.eventKey);
      //   console.log(expanded);

      //   console.log(this.list);

      //     const found = this.list.find((item) => expanded.includes(item.guid));

      return;
      //   //check if the expanded list contains any other glossary guid in case of a glossary node - accordion
      //   if (node.node.dataRef.type === "glossary") {
      //     const found = this.list.find((item) => expanded.includes(item.guid));
      //     if (found) {
      //       const index = this.expandedKeys.indexOf(found.guid);
      //       this.expandedKeys.splice(index, 1);
      //     }
      //   }

      //   this.expandedKeys.push(node.node.eventKey);
      if (!this.expandedKeys.includes(node.node.eventKey)) {
        this.expandedKeys.push(node.node.eventKey);
      } else {
        const index = this.expandedKeys.indexOf(node.node.eventKey);
        if (index > -1) {
          this.expandedKeys.splice(index, 1);
        }
      }
      return;
    },
  },
});
</script>