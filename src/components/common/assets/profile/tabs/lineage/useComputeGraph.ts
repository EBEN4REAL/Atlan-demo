import { ref } from 'vue'
import useLineageStore from '~/store/lineage'
import useGraph from './useGraph'
import useTransformGraph from './useTransformGraph'

export default async function useComputeGraph(
    graph,
    graphLayout,
    lineage,
    searchItems,
    currZoom,
    isComputeDone,
    emit
) {
    const lineageStore = useLineageStore()
    lineageStore.nodesColumnList = {}
    lineageStore.columnsLineage = {}

    const { createNodeData, createEdgeData } = useGraph()
    const { fit } = useTransformGraph(graph, emit)

    const model = ref(null)
    const edges = ref([])
    const nodes = ref([])

    const { relations, baseEntityGuid } = lineage.value
    const guidEntityMap = Object.values(lineage.value.guidEntityMap)

    searchItems.value = []
    model.value = null
    edges.value = []
    nodes.value = []

    let columnEntity = {}
    const columnEntityIds = []

    /* Nodes */
    await Promise.all(
        guidEntityMap.map(async (entity) => {
            if (entity.typeName === 'Column') {
                const parentGuid = entity.attributes.table.guid // TODO: Handle for views too
                if (!columnEntity[parentGuid])
                    columnEntity = { ...columnEntity, [parentGuid]: [entity] }
                else columnEntity[parentGuid].push(entity)

                columnEntityIds.push(entity.guid)
                return
            }

            if (entity.typeName.toLowerCase() === 'powerbidataset') {
                lineageStore.setNodesColumnList(
                    [entity.guid],
                    [
                        {
                            text: 'view related',
                        },
                    ]
                )
            }

            const { nodeData, entity: ent } = await createNodeData(
                entity,
                baseEntityGuid
            )

            const searchItem = ent
            searchItems.value.push(searchItem)

            nodes.value.push(nodeData)
        })
    )

    if (Object.keys(columnEntity).length) {
        Object.entries(columnEntity).forEach(([parentGuid, columns]) => {
            lineageStore.setNodesColumnList(parentGuid, columns)
        })
    }

    /* Edges */
    relations.forEach((x) => {
        const { fromEntityId, toEntityId, processId } = x

        if (
            columnEntityIds.includes(fromEntityId) ||
            columnEntityIds.includes(toEntityId)
        )
            return

        const relation = {
            id: `${processId}/${fromEntityId}@${toEntityId}`,
            sourceCell: fromEntityId,
            sourcePort: `${fromEntityId}-invisiblePort`,
            targetCell: toEntityId,
            targetPort: `${toEntityId}-invisiblePort`,
            stroke: '#aaaaaa',
        }
        const { edgeData } = createEdgeData(relation)
        edges.value.push(edgeData)
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
