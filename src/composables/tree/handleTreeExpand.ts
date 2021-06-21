import { Ref, ref, toRaw } from "vue";

export default function handleTreeExpand(emit: any): any {

    const selectedKeys = ref([]) as Ref<string[]>;
    let expandedKeys = ref([]) as Ref<string[]>;
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
        return;
    }
    return;
  };

  const selectNode = (selected: any, node) => {
    console.log(selected, node, "select");
    if (selectedKeys.value.includes(selected)) {
      selectedKeys.value = [];
    } else {
      selectedKeys.value = selected;
    }
    if (node.node.dataRef?.isRoot) {
      expandNode(["_node_select_"], node);
    } else {
      console.log("emit");
      emit("select", node.node.eventKey);
    }
    return;
  };

  const classificationSelectNode = (selected: any, node) => {
    console.log(selected, node, "select");
    if (selectedKeys.value.includes(selected)) {
      selectedKeys.value = [];
    } else {
      selectedKeys.value = selected;
    }
    if (node.node.dataRef?.isRoot) {
      expandNode(["_node_select_"], node);
    } else {
      console.log("emit");
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
