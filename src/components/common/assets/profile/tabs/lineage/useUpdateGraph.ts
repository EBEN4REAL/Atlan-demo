/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
export default function useUpdateGraph(graph) {
    const highlightNode = (nodeId, state: string) => {
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

        if (state === 'highlight')
            lineageNodeElement?.classList.add('isHighlightedNode')
        if (state === 'select')
            lineageNodeElement?.classList.add('isSelectedNode')
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

        graph.value.freeze('highlightEdges')
        graph.value.getEdges().forEach((edge) => {
            const _isCyclicEdge = edge.store.data.data?.isCyclicEdge
            const defaultStateColor = _isCyclicEdge ? '#ff4848' : '#B2B8C7'
            const highlightStateColor = _isCyclicEdge ? '#ff4848' : '#3c71df'
            const gray = nodesToHighlight.length ? '#dce0e5' : defaultStateColor

            const cell = graph.value.getCellById(edge.id)
            const [source, target] = edge.id.split('/')[1].split('@')

            const itExists =
                nodesToHighlight.includes(source) &&
                nodesToHighlight.includes(target)
            if (itExists) edgesHighlighted.push(edge.id)

            edge.attr('line/stroke', itExists ? highlightStateColor : gray)
            edge.attr(
                'line/targetMarker/stroke',
                itExists ? highlightStateColor : gray
            )

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
        graph.value.getEdges().forEach((edge) => {
            const _isCyclicEdge = edge.store.data.data?.isCyclicEdge
            const defaultStateColor = _isCyclicEdge ? '#ff4848' : '#B2B8C7'

            const cell = graph.value.getCellById(edge.id)
            cell.attr('line/stroke', dim ? '#dce0e5' : defaultStateColor)
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
