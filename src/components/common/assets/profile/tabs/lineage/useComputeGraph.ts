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

    searchItems.value = []
    model.value = null
    edges.value = []
    nodes.value = []

    /* Nodes */
    let columnEntity = {}
    const columnEntityIds = []

    const createNodesFromEntityMap = async (lineageData, hasBase = true) => {
        const { relations, childrenCounts, baseEntityGuid } = lineageData
        const guidEntityMap = Object.values(lineageData.guidEntityMap)

        await Promise.all(
            guidEntityMap.map(async (entity) => {
                if (entity.typeName === 'Column') {
                    const parentGuid = entity.attributes.table.guid
                    if (!columnEntity[parentGuid])
                        columnEntity = {
                            ...columnEntity,
                            [parentGuid]: [entity],
                        }
                    else columnEntity[parentGuid].push(entity)

                    columnEntityIds.push(entity.guid)
                    return
                }

                const { nodeData, entity: ent } = await createNodeData(
                    entity,
                    relations,
                    childrenCounts,
                    hasBase ? baseEntityGuid : null
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
    }

    await createNodesFromEntityMap(lineage.value)

    /* Edges */
    const createNodeEdges = (lineageData) => {
        const { relations } = lineageData

        const fromAndToIdSet = new Set()
        relations.forEach((x) => {
            const { fromEntityId, toEntityId, processId } = x

            let data = {}
            const fromAndToId = `${fromEntityId}@${toEntityId}`
            if (fromAndToIdSet.has(fromAndToId)) data = { isDup: true }
            else fromAndToIdSet.add(fromAndToId)

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

            if (x.type) relation.type = x.type

            const { edgeData } = createEdgeData(relation, data)
            edges.value.push(edgeData)
        })
    }

    createNodeEdges(lineage.value)

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

    /* Transformations */
    fit(lineage.value.baseEntityGuid)
    currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`

    /* addNewNodesShadow */
    const addNewNodesShadow = (entityMap) => {
        Object.keys(entityMap).forEach((guid) => {
            const ele = document.getElementById(guid)
            ele?.classList.add('node-added-shadow')
        })
    }

    /* addSubGraph */
    const addSubGraph = async (
        data,
        registerAllListeners,
        removeAddedNodesShadow
    ) => {
        const newData = data
        const guidEntityMapArr = Object.keys(newData.guidEntityMap)
        nodes.value.forEach((x) => {
            if (guidEntityMapArr.includes(x.id))
                delete newData.guidEntityMap[x.id]
        })
        await createNodesFromEntityMap(newData, false)
        createNodeEdges(newData)
        renderLayout()
        removeAddedNodesShadow()
        addNewNodesShadow(newData.guidEntityMap)

        graph.value.getNodes().forEach((n) => {
            const ctaEle = document.getElementById(`node-${n.id}-loadCTA`)
            const cell = graph.value.getCellById(n.id)
            const isRootNode = graph.value.isRootNode(cell)
            const isLeafNode = graph.value.isLeafNode(cell)
            if (isRootNode || isLeafNode) return
            ctaEle?.remove()
        })
        registerAllListeners()
    }

    return {
        addSubGraph,
    }
}
