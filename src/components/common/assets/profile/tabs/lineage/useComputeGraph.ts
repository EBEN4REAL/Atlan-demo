import { ref, watch } from 'vue'
import graphlib from '@dagrejs/graphlib'
import useUpdateGraph from './useUpdateGraph'
import useGraph from './useGraph'
import useTransformGraph from './useTransformGraph'

export default async function useComputeGraph(
    graph,
    graphLayout,
    lineageData,
    showProcess,
    searchItems,
    currZoom,
    removedNodes,
    isComputeDone,
    emit
) {
    const { highlightEdges, toggleProcessNodes, updateProcessNodesPosition } =
        useUpdateGraph()
    const { createNodeData, createEdgeData } = useGraph()
    const { fit } = useTransformGraph(graph, emit)

    const model = ref(null)
    const edges = ref([])
    const nodes = ref([])

    const { relations, baseEntityGuid } = lineageData.value
    const guidEntityMap = Object.values(lineageData.value.guidEntityMap)

    searchItems.value = []
    model.value = null
    edges.value = []
    nodes.value = []

    const getCyclicStatus = () => {
        const g = new graphlib.Graph({
            directed: true,
        })
        if (lineageData.value && lineageData.value.guidEntityMap) {
            Object.values(lineageData.value.guidEntityMap).forEach((value) => {
                g.setNode(value.guid, {
                    ...value,
                })
            })

            lineageData.value.relations.forEach((item) => {
                g.setEdge(item.fromEntityId, item.toEntityId)
            })
        }

        return !graphlib.alg.isAcyclic(g)
    }

    const isCyclic = getCyclicStatus()

    /* Nodes */
    await Promise.all(
        guidEntityMap.map(async (entity) => {
            const { nodeData, enrichedEntity: ent } = await createNodeData(
                entity,
                baseEntityGuid
            )

            const searchItem = ent
            searchItems.value.push(searchItem)

            nodes.value.push(nodeData)
        })
    )

    /* Edges */
    relations.forEach((relation) => {
        const { edgeData } = createEdgeData(relation)
        edges.value.push(edgeData)
    })

    /* Render */
    const renderLayout = async () => {
        model.value = graphLayout.value.layout({
            edges: edges.value,
            nodes: nodes.value,
        })
        graph.value.fromJSON(model.value)
    }

    /** Process toggle */
    const toggleProcess = async () => {
        await renderLayout()
        await toggleProcessNodes(graph, showProcess, removedNodes)
        await updateProcessNodesPosition(graph, 110)
        highlightEdges(graph, [])
        isComputeDone.value = true
    }

    await toggleProcess()

    watch(showProcess, async () => {
        await toggleProcess()
    })

    fit(baseEntityGuid)
    currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`

    return { isCyclic }
}
