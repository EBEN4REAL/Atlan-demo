import { ref, watch } from 'vue'
import useUpdateGraph from './useUpdateGraph'
import useGraph from './useGraph'
import useTransformGraph from './useTransformGraph'

import { useAPIPromise } from '~/services/api/useAPIPromise'
import { map as entityMap } from '~/services/meta/entity/key'

const { highlightEdges, toggleProcessNodes } = useUpdateGraph()
const { createNodeData, createEdgeData } = useGraph()

const getEntity = async (guid: string) => {
    const { entity } = await useAPIPromise(
        entityMap.GET_ENTITY({ guid }),
        'GET',
        {}
    )
    return entity
}

export default async function useComputeGraph(
    graph,
    graphLayout,
    lineageData,
    showProcess,
    searchItems,
    currZoom,
    isComputationDone,
    emit
) {
    const model = ref(null)
    const edges = ref([])
    const nodes = ref([])

    searchItems.value = []

    const { relations, baseEntityGuid } = lineageData.value
    let baseEntity = null
    if (!relations.length) baseEntity = await getEntity(baseEntityGuid)

    const guidEntityMap = !relations.length
        ? [baseEntity]
        : Object.values(lineageData.value.guidEntityMap)

    /* Nodes */
    await Promise.all(
        guidEntityMap.map(async (entity) => {
            const { nodeData, enrichedEntity } = await createNodeData(
                entity,
                baseEntityGuid
            )

            const searchItem = enrichedEntity
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
    const renderLayout = (reload = false) => {
        const graphNodes = graph.value.getNodes()
        const graphEdges = graph.value.getEdges()
        const graphNodesNew = graphNodes.map((x) => {
            const { data } = x.store
            const newData = { ...data }
            newData.width = data.size.width
            newData.height = data.size.height
            return newData
        })
        const graphEdgesNew = graphEdges.map((x) => {
            const { data } = x.store
            const newData = { ...data }
            newData.source = data.source.cell
            newData.target = data.target.cell
            return newData
        })

        model.value = graphLayout.value.layout({
            edges: reload ? graphEdgesNew : edges.value,
            nodes: reload ? graphNodesNew : nodes.value,
        })
        graph.value.fromJSON(model.value)
    }

    renderLayout()
    highlightEdges(graph, [])

    const { fit } = useTransformGraph(graph, emit)
    fit(baseEntityGuid)
    currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`

    isComputationDone.value = true

    watch(showProcess, async () => {
        await toggleProcessNodes(graph, showProcess)
        renderLayout(true)
        highlightEdges(graph, [])
    })

    return { baseEntityGuid }
}
