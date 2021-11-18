import { ref, watch } from 'vue'
import useUpdateGraph from './useUpdateGraph'
import useGetNodes from './useGetNodes'

const { updateEdgesStroke, updateNodesToHighlight } = useUpdateGraph()
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
    highlightLoadingCords,
    highlightedNode,
    selectedSearchItem,
    selectedNodeType,
    emit
) {
    const previewedNode = ref('')
    const getCell = (guid) => graph.value.getCellById(guid)
    const cell = getCell(baseEntityGuid)
    const { entity: defaultEntity } = cell.store.data

    const getHighlights = async (guid) => {
        await getPredecessors(graph, guid, showProcess)
        await getSuccessors(graph, guid, showProcess)
    }

    const highlight = async (guid) => {
        if (!guid || guid === highlightedNode.value) {
            highlightedNode.value = ''
            edgesToHighlightSet.clear()
            nodesToHighlightSet.clear()

            const edgesToHighlight = edges.value
            await updateEdgesStroke(
                graph,
                model,
                edges,
                edgesToHighlight,
                baseEntityGuid,
                true
            )
            const nodesToHighlight = Array.from(nodesToHighlightSet)
            updateNodesToHighlight(
                graph,
                model,
                nodes,
                highlightedNode,
                nodesToHighlight,
                true
            )
        } else {
            highlightedNode.value = guid
            edgesToHighlightSet.clear()
            nodesToHighlightSet.clear()
            await getHighlights(guid)

            const edgesToHighlight = Array.from(edgesToHighlightSet)
            await updateEdgesStroke(
                graph,
                model,
                edges,
                edgesToHighlight,
                baseEntityGuid,
                false
            )
            const nodesToHighlight = Array.from(nodesToHighlightSet)
            updateNodesToHighlight(
                graph,
                model,
                nodes,
                highlightedNode,
                nodesToHighlight,
                false
            )
        }

        highlightLoadingCords.value = {}
    }

    const preview = (node) => {
        if (!node || node.id === previewedNode.value) {
            previewedNode.value = ''
            selectedNodeType.value = ''
            emit('preview', defaultEntity)
        } else {
            previewedNode.value = node.id
            selectedNodeType.value =
                node.store.data.entity.typeName === 'Process' ? 'p' : 'np'
            emit('preview', node.store.data.entity)
        }
    }

    watch(selectedSearchItem, (newVal) => {
        highlight(newVal)
    })

    watch(showProcess, (newVal) => {
        emit('preview', defaultEntity)
    })

    graph.value.on('cell:mouseup', ({ node }) => {
        highlight(node.id)
        preview(node)
    })
    graph.value.on('blank:click', () => {
        highlight(null)
        preview(null)
    })

    return {
        highlightedNode,
    }
}
