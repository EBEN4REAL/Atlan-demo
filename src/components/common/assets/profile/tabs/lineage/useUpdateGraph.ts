export default function useUpdateGraph() {
    const updateEdgesStroke = async (
        graph,
        model,
        edges,
        edgesToHighlight,
        baseEntityGuid,
        reset = false
    ) => {
        const graphEdges = graph.value.getEdges()
        const newEdgesData = []
        const getEdgeData = (x) =>
            edges.value.find((edgeData) => edgeData.id === x)

        edges.value.forEach((m) => {
            const edgeData = getEdgeData(m.id)
            let computedStroke

            // #9cb781 - green
            // #f1a183 - orange
            // #d9d9d9 - gray
            // #2351cc - blue

            if (reset) {
                const edgesSplit = m.id.split('@')
                const baseCell = graph.value.getCellById(baseEntityGuid)
                const cell = graph.value.getCellById(edgesSplit[0])
                const isPredecessor = graph.value.isPredecessor(baseCell, cell)
                computedStroke = isPredecessor ? '#9cb781' : '#f1a183'
                if (edgesSplit[1] === baseEntityGuid) computedStroke = '#9cb781'
            }

            edgeData.attrs.line.stroke = reset ? computedStroke : '#d9d9d9'
            edgeData.attrs.line.targetMarker.stroke = reset
                ? computedStroke
                : '#d9d9d9'
            edgeData.zIndex = 1
            newEdgesData.push(edgeData)
        })

        if (!reset) {
            edgesToHighlight.forEach((x) => {
                const edgeData = getEdgeData(x)
                edgeData.attrs.line.stroke = '#2351cc'
                edgeData.attrs.line.targetMarker.stroke = '#2351cc'
                edgeData.zIndex = 30
                newEdgesData.push(edgeData)
            })
        }

        newEdgesData.forEach((y) => {
            graphEdges.forEach((z) => {
                if (y.id === z.id) z.updateData(y)
            })
        })

        await graph.value.fromJSON(model.value)
    }

    // TODO: To improve on
    const updateNodesToHighlight = (
        graph,
        model,
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
                    nodeData.isHighlightedNode = null
                    nodeData.isHighlightedNodePath = reset ? null : m.id
                    if (highlightedNode.value === m.id)
                        nodeData.isHighlightedNode = reset ? null : m.id
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
        updateEdgesStroke,
        updateNodesToHighlight,
    }
}
