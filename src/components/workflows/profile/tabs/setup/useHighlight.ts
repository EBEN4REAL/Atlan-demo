import useUpdateGraph from './useUpdateGraph'

const { updateNodesToHighlight } = useUpdateGraph()

export default function useHighlight(
    graph,
    nodes,
    highlightLoadingCords,
    highlightedNode,
    emit
) {
    const highlight = async (id) => {
        highlightedNode.value = id
        const nodesToHighlight = nodes.value.map((x) => x.id)

        updateNodesToHighlight(
            graph,
            nodes,
            highlightedNode,
            nodesToHighlight,
            false
        )

        highlightLoadingCords.value = {}
    }

    graph.value.on('cell:mouseup', ({ node }) => {
        highlight(node.id)
        emit('change', highlightedNode.value, 'dag')
    })

    return {
        highlightedNode,
    }
}
