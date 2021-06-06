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
    <template #title="{ title, image, isLeaf }" class="">
      <div class="flex align-center" v-if="!isLeaf">
        <span><img :src="image" class="float-left w-auto h-4 mr-1" /></span>

        <span class="tracking-wider text-gray-700">{{ title }}</span>
      </div>
      <span class="text-sm leading-none text-gray-600" v-else>{{ title }}</span>
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
        const key = node.node.eventKey;
        const isSelected = this.selectedKeys.includes(key);
        const isExpanded = this.expandedKeys.includes(key);

        if (isSelected && !isExpanded) {
          this.expandedKeys.push(key);
          this.expandedKeys = [...this.expandedKeys];
        } else if (!isSelected && isExpanded) {
          const index = this.expandedKeys.indexOf(key);
          this.expandedKeys.splice(index, 1);
        } else if (isSelected && isExpanded) {
          const index = this.expandedKeys.indexOf(key);
          this.expandedKeys.splice(index, 1);
        } else if (!isSelected && !isExpanded) {
          this.expandedKeys.push(key);
          this.expandedKeys = [...this.expandedKeys];
        }
      }
      return;
    },
  },
});
</script>