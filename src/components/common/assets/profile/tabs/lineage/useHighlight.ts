import { ref, watch } from 'vue'
import useUpdateGraph from './useUpdateGraph'
import useGetNodes from './useGetNodes'

const { updateEdgesData, updateNodesData } = useUpdateGraph()
const {
    getPredecessors,
    getSuccessors,
    edgesToHighlightSet,
    nodesToHighlightSet,
} = useGetNodes()

export default function useHighlight(
    graph,
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
        edgesToHighlightSet.clear()
        nodesToHighlightSet.clear()
        const isValid = guid && guid !== highlightedNode.value
        highlightedNode.value = isValid ? guid : ''
        if (isValid) await getHighlights(guid)
        const edgesToHighlight = isValid ? Array.from(edgesToHighlightSet) : []
        await updateEdgesData(graph, edgesToHighlight)
        const nodesToHighlight = Array.from(nodesToHighlightSet)
        updateNodesData(graph, highlightedNode, nodesToHighlight)
        highlightLoadingCords.value = {}
    }

    const preview = (node) => {
        const isValid = node && node?.id !== previewedNode.value
        const isProcess = node?.store?.data?.entity?.typeName === 'Process'
        const entityToEmit = isValid ? node.store.data.entity : defaultEntity

        previewedNode.value = isValid ? node?.id : ''
        // eslint-disable-next-line no-nested-ternary
        selectedNodeType.value = isValid ? (isProcess ? 'p' : 'np') : ''
        emit('preview', entityToEmit)
    }

    watch(selectedSearchItem, (newVal) => {
        highlight(newVal)
    })

    watch(showProcess, () => {
        emit('preview', defaultEntity)
    })

    graph.value.on('cell:mouseup', ({ node }) => {
        highlight(node?.id)
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
