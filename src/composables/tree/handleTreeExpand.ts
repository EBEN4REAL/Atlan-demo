import { Ref, ref, toRaw } from "vue";
import store from "~/utils/storage";

export default function handleTreeExpand(emit: any, cacheKey?: string): any {
  const selectedKeys = ref([]) as Ref<string[]>;
  let expandedKeys = ref([]) as Ref<string[]>;

  const selectedCacheKey = `${cacheKey}_selected`;
  const expandedCacheKey = `${cacheKey}_expanded`;
  const localSelected = store.get(selectedCacheKey);
  const localExpanded = store.get(expandedCacheKey);
  if (cacheKey && localSelected && localSelected.length >= 0) {
    selectedKeys.value = store.get(selectedCacheKey);
  }
  if (cacheKey && localExpanded && localExpanded.length >= 0) {
    expandedKeys.value = store.get(expandedCacheKey);
  }

  const expandNode = (expanded: string[], node: any) => {
    if (expanded.includes("_node_select_")) {
      const key: string = node.node.eventKey;
      const isExpanded = expandedKeys.value.includes(key);
      if (!isExpanded) {
        expandedKeys.value.push(key);
      } else if (isExpanded) {
        const index = expandedKeys.value.indexOf(key);
        expandedKeys.value.splice(index, 1);
      }
      expandedKeys.value = [...expandedKeys.value];
    }
    node.node.dataRef.isOpen = !!node.expanded;
    store.set(`${cacheKey}_expanded`, expandedKeys.value);
    return;
  };
  const selectNode = (selected: any, node) => {
    if (selectedKeys.value.includes(selected)) {
      selectedKeys.value = [];
    } else {
      selectedKeys.value = selected;
    }
    if (node.node.dataRef?.isRoot) {
      expandNode(["_node_select_"], node);
    } else {
      emit("select", node.node.eventKey);
    }
    store.set(`${cacheKey}_selected`, selectedKeys.value);
    return;
  };

  const classificationSelectNode = (selected: any, node) => {
    if (selectedKeys.value.includes(selected)) {
      selectedKeys.value = [];
    } else {
      selectedKeys.value = selected;
    }
    if (node.node.dataRef?.isRoot) {
      expandNode(["_node_select_"], node);
    } else {
      emit("nodeEmit", toRaw(node.node.dataRef));
    }
    return;
  };

  return {
    selectedKeys,
    expandedKeys,
    expandNode,
    selectNode,
    classificationSelectNode,
  };
}
