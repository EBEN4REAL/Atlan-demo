/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
export default function useUpdateGraph(graph) {
    const updateIconStroke = (node, color) => {
        const hoPaCTAIdRight = `${node.id}-ctaPortRight-hoPa`
        const hoPaCTAIdLeft = `${node.id}-ctaPortLeft-hoPa`
        const colCTAIdRight = `${node.id}-ctaPortRight-col`
        const colCTAIdLeft = `${node.id}-ctaPortLeft-col`
        const arr = [hoPaCTAIdRight, hoPaCTAIdLeft, colCTAIdRight, colCTAIdLeft]

        arr.forEach((portId) => {
            if (node.hasPort(portId))
                node.setPortProp(portId, 'attrs/portBody/stroke', color)
        })
    }

    const highlightNode = (nodeId, state: string) => {
        const node = graph.value.getNodes().find((x) => x.id === nodeId)
        const isBase = node.store.data?.isBase
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

        if (!isBase) updateIconStroke(node, '#B2B8C7')

        if (state === 'highlight') {
            lineageNodeElement?.classList.add('isHighlightedNode')
            if (!isBase) updateIconStroke(node, '#3c71df')
        }
        if (state === 'select') {
            lineageNodeElement?.classList.add('isSelectedNode')
            updateIconStroke(node, '#3c71df')
        }
    }

    const highlightNodes = (selectedNodeId, nodesToHighlight) => {
        const graphNodes = graph.value.getNodes()

        graph.value.freeze('highlightNodes')
        graphNodes.forEach((x) => {
            const isBase = x.store.data?.isBase
            const graphNodeElement = document.querySelectorAll(
                `[data-cell-id="${x.id}"]`
            )[0]
            const lineageNodeElement = Array.from(
                graphNodeElement.querySelectorAll('*')
            ).find((y) => y.classList.contains('lineage-node'))

            const itExists = nodesToHighlight.includes(x.id)
            const cell = graph.value.getCellById(x.id)

            const isSelectedNode = selectedNodeId?.value === x.id ? x.id : null
            const isHighlightedNode = itExists ? x.id : null
            const isGrayed = !itExists

            lineageNodeElement?.classList.remove(
                'isSelectedNode',
                'isHighlightedNode',
                'isGrayed'
            )

            if (!isBase) {
                updateIconStroke(x, '#B2B8C7')
                cell.updateData({ isSelectedNode: null })
                cell.updateData({ isHighlightedNode: null })
                cell.updateData({ isGrayed: null })
            }
            if (!selectedNodeId?.value && !nodesToHighlight.length) return
            cell.setZIndex(0)

            if (isSelectedNode) {
                lineageNodeElement?.classList.add('isSelectedNode')
                cell.setZIndex(10)
                cell.updateData({ isSelectedNode: x.id })
                cell.updateData({ isHighlightedNode: null })
                cell.updateData({ isGrayed: null })
                updateIconStroke(x, '#3c71df')
            }
            if (isHighlightedNode && !isSelectedNode) {
                lineageNodeElement?.classList.add('isHighlightedNode')
                cell.setZIndex(10)
                cell.updateData({ isSelectedNode: null })
                cell.updateData({ isHighlightedNode: x.id })
                cell.updateData({ isGrayed: null })
                if (!isBase) updateIconStroke(x, '#3c71df')
            }
            if (isGrayed) {
                lineageNodeElement?.classList.add('isGrayed')
                cell.setZIndex(0)
                cell.updateData({ isSelectedNode: null })
                cell.updateData({ isHighlightedNode: null })
                cell.updateData({ isGrayed: x.id })
                if (!isBase) updateIconStroke(x, '#e0e4eb')
            }
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

            cell.setZIndex(0)

            if (itExists) cell.setZIndex(10)
            else cell.setZIndex(0)
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
