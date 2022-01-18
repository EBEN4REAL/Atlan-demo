/* eslint-disable no-nested-ternary */
export default function useUpdateGraph() {
    const styleReverseEdge = (edge) => {
        if (!edge) return

        const s = edge.getSourcePoint()
        const t = edge.getTargetPoint()

        edge.attr('line/strokeDasharray', s.x > t.x ? '3 6' : 0)
        edge.attr('line/stroke', s.x > t.x ? '#aaaaaa' : '#c7c7c7')

        edge.attr('line/targetMarker/height', 0.1)
        edge.attr('line/targetMarker/width', 0.1)
    }

    const highlightNodes = (graph, highlightedNode, nodesToHighlight) => {
        const graphNodes = graph.value.getNodes()

        graphNodes.forEach((x) => {
            const itExists = nodesToHighlight.includes(x.id)
            const isHN = highlightedNode?.value === x.id
            const graphNodeElement = document.querySelectorAll(
                `[data-cell-id="${x.id}"]`
            )[0]
            const lineageNodeElement = Array.from(
                graphNodeElement.querySelectorAll('*')
            ).find((y) => y.classList.contains('lineage-node'))

            const isHighlightedNode = itExists ? (isHN ? x.id : null) : null
            const isHighlightedNodePath = itExists ? x.id : null
            const isGrayed = !highlightedNode?.value ? false : !itExists

            lineageNodeElement?.classList.remove(
                'isHighlightedNode',
                'isHighlightedNodePath',
                'isGrayed'
            )

            if (isHighlightedNode)
                lineageNodeElement?.classList.add('isHighlightedNode')
            if (isHighlightedNodePath)
                lineageNodeElement?.classList.add('isHighlightedNodePath')
            if (isGrayed) lineageNodeElement?.classList.add('isGrayed')
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
                styleReverseEdge(cell)
            }
            x.attr('line/targetMarker/stroke', itExists ? '#5277d7' : gray)
            if (itExists) cell.toFront()
        })
    }

    return {
        highlightNodes,
        highlightEdges,
        styleReverseEdge,
    }
}
