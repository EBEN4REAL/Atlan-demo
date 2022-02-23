/* eslint-disable no-nested-ternary */
export default function useUpdateGraph() {
    const highlightNodes = (graph, highlightedNode, nodesToHighlight) => {
        const graphNodes = graph.value.getNodes()

        // graph.value.freeze('highlightNodes')
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
        // graph.value.unfreeze('highlightNodes')
    }

    const highlightEdges = (graph, nodesToHighlight, edgesHighlighted) => {
        edgesHighlighted.value = []
        const graphEdges = graph.value.getEdges()
        const gray = nodesToHighlight.length ? '#d9d9d9' : '#aaaaaa'
        // graph.value.freeze('highlightEdges')
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
            x.attr('line/targetMarker/stroke', itExists ? '#5277d7' : gray)

            if (itExists) cell.setZIndex(50)
            else {
                cell.setZIndex(15)
                cell.attr('line/strokeWidth', 1.6)
            }
        })
        // graph.value.unfreeze('highlightEdges')
    }

    return {
        highlightNodes,
        highlightEdges,
    }
}
