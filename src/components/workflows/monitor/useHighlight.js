import useUpdateGraph from './useUpdateGraph'

const { updateNodesToHighlight } = useUpdateGraph()

export default function useHighlight(
    graph,
    nodes,
    highlightLoadingCords,
    highlightedNode,
    emit,
    selectedPod
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
    const handleClickNode = (node) => {
        highlight(node.id)
        const clickedPod = nodes.value.find((x) => x.id === node.id)
        emit('change', highlightedNode.value, 'dag', clickedPod)
    }
    const findIndex = nodes.value.findIndex((el) => el.id === selectedPod?.id)
    if (findIndex !== -1) {
        handleClickNode(nodes.value[findIndex])
    }
    graph.value.on('cell:mouseup', ({ node }) => {
        handleClickNode(node)
        // highlight(node.id)
        // const clickedPod = nodes.value.find((x) => x.id === node.id)
        // emit('change', highlightedNode.value, 'dag', clickedPod)
    })

    return {
        highlightedNode,
    }
}
