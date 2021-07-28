<template>
  <a-tree
    :treeData="treeData"
    :blockNode="true"
    v-model:expandedKeys="expandedKeys"
    v-model:value="selectedKeys"
    @select="classificationSelectNode"
    @expand="expandNode"
    class="pt-3 pb-3"
  >
    <!-- <template #switcherIcon="{selectable}">
      {{ selectable }}
      <fa v-if="selectable" icon="fal chevron-right" class="mr-2" />
      <fa v-else icon="fal chevron-down" class="mr-2" />
    </template> -->
    <template #title="{ title,key, type,selected }">
      <div
        class="relative flex items-center justify-between w-full py-1"
        @mouseenter="() => showAddClassificationIcon(key)"
        @mouseleave="() => hideAddClassificationIcon(key)"
      >
        <div class="flex items-center mb-1 text-base leading-none select-none">
          <p class="mb-0 text-gray-500 overflow-ellipsis">
            <span class="">{{ title }}</span>
          </p>
        </div>
      </div>
    </template>
  </a-tree>
</template>

<script lang="ts">
import { defineComponent, ref, computed, toRaw } from "vue";
import handleTreeExpand from "~/composables/tree/handleTreeExpand";

export default defineComponent({
  props: {
    searchText: {
      type: String,
      required: false,
      default() {
        return "";
      },
    },
    select: {
      type: Function,
    },
    treeData: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const treeData = computed(() => {
      return props.treeData;
    });
    console.log(toRaw(treeData.value), "tree");
    const addClassificationIcon = ref(false);
    const hoveredClassificationKey = ref(null);
    const showAddClassificationIcon = (key) => {
      addClassificationIcon.value = true;
      hoveredClassificationKey.value = key;
    };
    const hideAddClassificationIcon = (e) => {
      addClassificationIcon.value = false;
      hoveredClassificationKey.value = null;
    };

    const {
      selectedKeys,
      expandedKeys,
      expandNode,
      classificationSelectNode,
    } = handleTreeExpand(emit);

    return {
      treeData: toRaw(treeData),
      selectedKeys,
      expandedKeys,
      expandNode,
      classificationSelectNode,
      showAddClassificationIcon,
      hideAddClassificationIcon,
      addClassificationIcon,
      hoveredClassificationKey,
    };
  },
});
</script>
