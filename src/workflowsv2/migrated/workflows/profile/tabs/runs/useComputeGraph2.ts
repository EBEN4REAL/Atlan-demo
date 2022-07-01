import { computed, ref } from 'vue'
import { createEdge, createNode } from './useCells'

export default function useComputeGraph(graph, graphLayout, workflowData) {
    const edges = ref([])
    const nodes = ref([])
    const model = ref(null)

    const rootName = workflowData?.value?.metadata?.name
    // const workflowStatus = workflowData?.value?.metadata?.name
    // const sourceNodes = workflowData.value?.status?.nodes

    const sourceNodes = computed(() => workflowData.value?.status?.nodes || {})

    const getChildren = (nodeId: string): string[] =>
        sourceNodes.value?.[nodeId]?.children || []

    const getNode = (nodeId) => sourceNodes.value?.[nodeId]

    // Setting Node Data
    nodes.value = Object.values(sourceNodes.value)
    .map((node) => createNode(node, rootName))

    // Setting Edge Data
    Object.values(sourceNodes.value).forEach((node) => {
        const children = getChildren(node.id)
        children.forEach((child) => {
            if (getNode(child)?.id) edges.value.push(createEdge(node.id, child))
        })
    })

    model.value = graphLayout.value?.layout({
        edges: edges.value,
        nodes: nodes.value,
    })

    graph.value?.fromJSON(model.value)

    return { edges, nodes }
}
