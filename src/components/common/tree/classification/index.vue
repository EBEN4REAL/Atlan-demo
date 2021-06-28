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
        class="relative flex items-center justify-between w-full pt-1 pb-1"
        @mouseenter="() => showAddClassificationIcon(key)"
        @mouseleave="() => hideAddClassificationIcon(key)"
      >
        <div class="flex items-center text-base leading-none select-none">
          <fa icon="fal shield text-indigo-700" class="mr-2" />
          <p class="pr-5 mb-0 text-gray-600 overflow-ellipsis">{{ title }}</p>
        </div>
        <div class="absolute flex items-center justify-center right-1">
          <!-- <fa
            v-if="addClassificationIcon && key == hoveredClassificationKey"
            icon="fal plus-circle text-purple-800"
          /> -->
        </div>
      </div>
    </template>
  </a-tree>
</template>

<script lang="ts">
import { defineComponent, ref, computed, toRaw } from "vue";
import handleTreeExpand from "~/composables/tree/handleTreeExpand";
import { useStore } from "~/store";

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
    const store = useStore();
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
