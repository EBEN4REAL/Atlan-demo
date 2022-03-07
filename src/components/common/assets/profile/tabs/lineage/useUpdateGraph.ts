/* eslint-disable no-nested-ternary */
export default function useUpdateGraph(graph) {
    const highlightNode = (nodeId, addHighlight = true) => {
        const graphNodeElement = document.querySelectorAll(
            `[data-cell-id="${nodeId}"]`
        )[0]
        const lineageNodeElement = Array.from(
            graphNodeElement.querySelectorAll('*')
        ).find((y) => y.classList.contains('lineage-node'))

        lineageNodeElement?.classList.remove(
            'isSelectedNode',
            'isHighlightedNode',
            'isGrayed'
        )

        if (addHighlight) lineageNodeElement?.classList.add('isHighlightedNode')
    }

    const highlightNodes = (selectedNodeId, nodesToHighlight) => {
        const graphNodes = graph.value.getNodes()

        graph.value.freeze('highlightNodes')
        graphNodes.forEach((x) => {
            const graphNodeElement = document.querySelectorAll(
                `[data-cell-id="${x.id}"]`
            )[0]
            const lineageNodeElement = Array.from(
                graphNodeElement.querySelectorAll('*')
            ).find((y) => y.classList.contains('lineage-node'))

            const itExists = nodesToHighlight.includes(x.id)

            const isSelectedNode = selectedNodeId?.value === x.id ? x.id : null
            const isHighlightedNode = itExists ? x.id : null
            const isGrayed = !itExists

            lineageNodeElement?.classList.remove(
                'isSelectedNode',
                'isHighlightedNode',
                'isGrayed'
            )

            if (!selectedNodeId?.value && !nodesToHighlight.length) return

            if (isSelectedNode)
                lineageNodeElement?.classList.add('isSelectedNode')
            if (isHighlightedNode && !isSelectedNode)
                lineageNodeElement?.classList.add('isHighlightedNode')
            if (isGrayed) lineageNodeElement?.classList.add('isGrayed')
        })
        graph.value.unfreeze('highlightNodes')
    }

    const highlightEdges = (nodesToHighlight) => {
        const edgesHighlighted = []
        const gray = nodesToHighlight.length ? '#d9d9d9' : '#aaaaaa'
        graph.value.freeze('highlightEdges')
        graph.value.getEdges().forEach((x) => {
            const cell = graph.value.getCellById(x.id)
            const [source, target] = x.id.split('/')[1].split('@')

            // if (source.includes('vpNode') || target.includes('vpNode')) return

            const itExists =
                nodesToHighlight.includes(source) &&
                nodesToHighlight.includes(target)
            if (itExists) edgesHighlighted.push(x.id)

            x.attr('line/stroke', itExists ? '#5277d7' : gray)
            x.attr('line/targetMarker/stroke', itExists ? '#5277d7' : gray)

            if (itExists) cell.setZIndex(50)
            else {
                cell.setZIndex(15)
                cell.attr('line/strokeWidth', 1.6)
            }
        })
        graph.value.unfreeze('highlightEdges')

        return edgesHighlighted
    }

    const dimNodesEdges = (dim) => {
        graph.value.freeze('dimNodesEdges')
        graph.value.getEdges().forEach((x) => {
            if (x.id.includes('vpNode')) return
            const cell = graph.value.getCellById(x.id)
            cell.attr('line/stroke', dim ? '#dce0e5' : '#aaaaaa')
            cell.toBack()
        })
        graph.value.unfreeze('dimNodesEdges')
    }

    return {
        highlightNode,
        highlightNodes,
        highlightEdges,
        dimNodesEdges,
    }
}
