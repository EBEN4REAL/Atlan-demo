import { ref } from 'vue'
import useGraph from './useGraph'
import useTransformGraph from './useTransformGraph'

export default async function useComputeGraph(
    graph,
    graphLayout,
    lineage,
    lineageWithProcess,
    searchItems,
    currZoom,
    isComputeDone,
    emit
) {
    const { createNodeData, createEdgeData } = useGraph()
    const { fit } = useTransformGraph(graph, emit)

    const model = ref(null)
    const edges = ref([])
    const nodes = ref([])

    const { relations, baseEntityGuid } = lineage.value
    const { relations: relationsWithProcess } = lineageWithProcess.value
    const guidEntityMap = Object.values(lineage.value.guidEntityMap)

    searchItems.value = []
    model.value = null
    edges.value = []
    nodes.value = []

    /* Nodes */
    await Promise.all(
        guidEntityMap.map(async (entity) => {
            const { nodeData, entity: ent } = await createNodeData(
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
        const { toEntityId } = relation
        const process = relationsWithProcess.find(
            (x) => x.toEntityId === toEntityId
        ).fromEntityId

        if (process) {
            const { edgeData } = createEdgeData(relation, process)
            edges.value.push(edgeData)
        }
    })

    /* Render */
    const renderLayout = () => {
        model.value = graphLayout.value.layout({
            edges: edges.value,
            nodes: nodes.value,
        })
        graph.value.fromJSON(model.value)
    }

    renderLayout()
    isComputeDone.value = true

    fit(baseEntityGuid)
    currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
}
