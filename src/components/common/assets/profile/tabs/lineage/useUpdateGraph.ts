/* eslint-disable no-nested-ternary */
export default function useUpdateGraph() {
    const updateNodesData = async (
        graph,
        highlightedNode,
        nodesToHighlight
    ) => {
        await graph.value.model.nodes
        const graphNodes = graph.value.getNodes()

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

    const updateEdgesData = async (graph, edgesToHighlight) => {
        await graph.value.model.edges
        const graphEdges = graph.value.getEdges()

        graphEdges.forEach(async (x) => {
            const itExists = edgesToHighlight.includes(x.id)
            x.attr('line/stroke', itExists ? '#5277D7' : '#d9d9d9')
            x.attr('line/targetMarker/stroke', itExists ? '#5277D7' : '#d9d9d9')
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

    // TODO: WIP
    const toggleProcessNodes = async (graph) => {
        await graph.value.model.nodes
        const graphNodes = graph.value.getNodes()

        graphNodes.forEach(async (x) => {
            if (x.store.data.isProcess) {
                const cell = graph.value.getCellById(x.id)
                cell.toggleVisible()
            }
        })
    }

    return {
        updateNodesData,
        updateEdgesData,
        updateProcessNodesPosition,
        toggleProcessNodes,
    }
}
