import { watch } from 'vue'
import useUpdateGraph from './useUpdateGraph'
import useGetNodes from './useGetNodes'

const { highlightNodes, highlightEdges } = useUpdateGraph()

export default function useHighlight(
    graph,
    baseEntity,
    showProcess,
    assetGuidToHighlight,
    highlightedNode,
    highlightLoadingCords,
    onSelectAsset
) {
    const getHighlights = async (guid) => {
        let nodesToHighlight = []
        if (guid.value) {
            const { predecessors, successors } = useGetNodes(graph, guid.value)
            nodesToHighlight = [guid.value, ...predecessors, ...successors]
        }

        return {
            nodesToHighlight,
        }
    }

    const highlight = async (guid) => {
        highlightedNode.value =
            guid && guid !== highlightedNode.value ? guid : ''
        const { nodesToHighlight } = await getHighlights(highlightedNode)
        highlightEdges(graph, nodesToHighlight)
        highlightNodes(graph, highlightedNode, nodesToHighlight)
        assetGuidToHighlight.value = ''
        highlightLoadingCords.value = {}
    }

    watch(assetGuidToHighlight, (newVal) => {
        if (!newVal) return
        highlight(newVal)
    })

    watch(showProcess, () => {
        onSelectAsset(baseEntity.value)
        highlight(null)
    })

    graph.value.on('cell:mouseup', ({ node }) => {
        onSelectAsset(node.store.data.entity)
        highlight(node?.id)
    })
    graph.value.on('blank:click', () => {
        onSelectAsset(baseEntity.value)
        highlight(null)
    })
}
