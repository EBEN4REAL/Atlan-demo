import { ref } from 'vue'
import useUpdateGraph from './useUpdateGraph'
import useGetNodes from './useGetNodes'

const { updateEdgesStroke } = useUpdateGraph()
const {
    getPredecessors,
    getSuccessors,
    edgesToHighlightSet,
    nodesToHighlightSet,
} = useGetNodes()

export default function useHighlight(
    graph,
    model,
    edges,
    nodes,
    baseEntityGuid,
    showProcess,
    highlightLoadingCords
) {
    const highlightedNode = ref(null)

    const getEdgesToHighlight = async (guid) => {
        await getPredecessors(graph, guid, showProcess)
        await getSuccessors(graph, guid, showProcess)
    }

    const highlight = async (guid) => {
        if (!guid || guid === highlightedNode.value) {
            highlightedNode.value = null
            edgesToHighlightSet.clear()
            nodesToHighlightSet.clear()
            // const nodesToHighlight = Array.from(nodesToHighlightSet)
            // updateNodesToHighlight(
            //     graph,
            //     model,
            //     nodes,
            //     highlightedNode,
            //     nodesToHighlight,
            //     true
            // )
            const edgesToHighlight = edges.value
            updateEdgesStroke(
                graph,
                model,
                edges,
                edgesToHighlight,
                baseEntityGuid,
                true
            )
        } else {
            highlightedNode.value = guid
            edgesToHighlightSet.clear()
            nodesToHighlightSet.clear()
            await getEdgesToHighlight(guid)
            // const nodesToHighlight = Array.from(nodesToHighlightSet)
            // updateNodesToHighlight(
            //     graph,
            //     model,
            //     nodes,
            //     highlightedNode,
            //     nodesToHighlight,
            //     false
            // )
            const edgesToHighlight = Array.from(edgesToHighlightSet)
            updateEdgesStroke(
                graph,
                model,
                edges,
                edgesToHighlight,
                baseEntityGuid,
                false
            )
        }

        highlightLoadingCords.value = {}
    }

    graph.value.on('cell:mouseup', ({ node }) => {
        highlight(node.id)
    })
    graph.value.on('blank:click', () => {
        highlight(null)
    })
}
