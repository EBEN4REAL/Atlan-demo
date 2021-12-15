/* eslint-disable no-nested-ternary */
export default function useUpdateGraph() {
    const highlightNodes = (graph, highlightedNode, nodesToHighlight) => {
        const graphNodes = graph.value.getNodes()

        graphNodes.forEach((x) => {
            const itExists = nodesToHighlight.includes(x.id)
            const isHN = highlightedNode?.value === x.id
            x.updateData({
                isHighlightedNode: itExists ? (isHN ? x.id : null) : null,
                isHighlightedNodePath: itExists ? x.id : null,
                isGrayed: !highlightedNode?.value ? false : !itExists,
            })
        })
    }

    const highlightEdges = (graph, nodesToHighlight, edgesHighlighted) => {
        edgesHighlighted.value = []
        const graphEdges = graph.value.getEdges()
        const gray = nodesToHighlight.length ? '#d9d9d9' : '#c7c7c7'
        graphEdges.forEach((x) => {
            const cell = graph.value.getCellById(x.id)
            const [source, target] = x.id.split('/')[1].split('@')
            const itExists =
                nodesToHighlight.includes(source) &&
                nodesToHighlight.includes(target)
            if (itExists) {
                edgesHighlighted.value.push(x.id)
            }
            x.attr('line/stroke', itExists ? '#5277d7' : gray)
            if (!itExists) {
                cell.attr('line/strokeWidth', 1.6)
                cell.attr('line/strokeDasharray', 0)
            }
            x.attr('line/targetMarker/stroke', itExists ? '#5277d7' : gray)
            if (itExists) cell.toFront()
        })
    }

    return {
        highlightNodes,
        highlightEdges,
    }
}
