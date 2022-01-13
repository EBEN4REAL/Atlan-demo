export default function useUpdateGraph() {
    const updateNodesToHighlight = (
        graph,
        nodes,
        highlightedNode,
        nodesToHighlight,
        reset = false
    ) => {
        const graphNodes = graph.value.getNodes()
        const newNodesData = []

        nodes.value.forEach((m) => {
            nodesToHighlight.forEach((x) => {
                if (m.id === x) {
                    const nodeData = m
                    nodeData.isSelectedNode = null
                    if (highlightedNode.value === m.id)
                        nodeData.isSelectedNode = reset ? null : m.id
                    newNodesData.push(nodeData)
                }
            })
        })

        newNodesData.forEach((y) => {
            graphNodes.forEach((z) => {
                if (y.id === z.id) z.updateData(y)
            })
        })
    }

    return {
        updateNodesToHighlight,
    }
}
