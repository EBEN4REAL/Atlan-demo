/* eslint-disable no-nested-ternary */
export default function useUpdateGraph() {
    const updateNodesData = async (
        graph,
        highlightedNode,
        nodesToHighlight
    ) => {
        await graph.value.model.nodes
        const graphNodes = graph.value.getNodes()

        console.log('highlightedNode:', highlightedNode.value)

        graphNodes.forEach(async (x) => {
            const itExists = nodesToHighlight.includes(x.id)
            const isHN = highlightedNode.value === x.id
            x.updateData({
                isHighlightedNode: itExists ? (isHN ? x.id : null) : null,
                isHighlightedNodePath: itExists ? x.id : null,
                isGrayed: !highlightedNode.value ? false : !itExists,
            })
        })
    }

    const updateEdgesData = async (graph, edgesToHighlight, baseEntityGuid) => {
        await graph.value.model.edges
        const graphEdges = graph.value.getEdges()

        graphEdges.forEach(async (x) => {
            // #9cb781 - green
            // #f1a183 - orange
            // #d9d9d9 - gray
            // #5277D7 - blue
            let computedStroke: string
            const edgesSplit = x.id.split('@')
            const baseCell = graph.value.getCellById(baseEntityGuid)
            const cell = graph.value.getCellById(edgesSplit[0])
            const isPredecessor = graph.value.isPredecessor(baseCell, cell)

            computedStroke = isPredecessor ? '#9cb781' : '#f1a183'
            if (edgesSplit[1] === baseEntityGuid) computedStroke = '#9cb781'
            if (edgesToHighlight.length) computedStroke = '#d9d9d9'

            const itExists = edgesToHighlight.includes(x.id)
            x.attr('line/stroke', itExists ? '#5277D7' : computedStroke)
            x.attr(
                'line/targetMarker/stroke',
                itExists ? '#5277D7' : computedStroke
            )
            x.setZIndex(itExists ? 30 : 1)
        })
    }

    const updateProcessNodesPosition = async (graph) => {
        await graph.value.model.nodes
        const graphNodes = graph.value.getNodes()

        graphNodes.forEach(async (z) => {
            if (z.store.data?.isProcess) {
                const p = z.position()
                z.position(p.x + 110, p.y)
            }
        })
    }

    return {
        updateNodesData,
        updateEdgesData,
        updateProcessNodesPosition,
    }
}
