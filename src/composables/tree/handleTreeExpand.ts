import { Ref, ref } from 'vue';

export default function handleTreeExpand(): any {

    const selectedKeys = ref([]) as Ref<string[]>;
    const expandedKeys = ref([]) as Ref<string[]>;
    const expandNode = (expanded: string[], node: { node: { eventKey: string; }; }) => {
        if (expanded.includes("_node_select_")) {
            const key: string = node.node.eventKey;
            const isExpanded = expandedKeys.value.includes(key);
            if (!isExpanded) {
                expandedKeys.value.push(key);
            } else if (isExpanded) {
                const index = expandedKeys.value.indexOf(key);
                expandedKeys.value.splice(index, 1);
            }
        }
        return;
    }
    const selectNode = (selected: any, node) => {
        if (selectedKeys.value.includes(selected)) {
            selectedKeys.value = [];
        } else {
            selectedKeys.value = selected;
        }
        return;
    }

    return {
        selectedKeys,
        expandedKeys,
        expandNode,
        selectNode
    }
}