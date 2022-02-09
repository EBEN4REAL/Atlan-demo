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

    const createNodesFromEntityMap = (lineageData, hasBase = true) => {
        const { relations, childrenCounts, baseEntityGuid } = lineageData
        const guidEntityMap = Object.values(lineageData.guidEntityMap)

        guidEntityMap.forEach((entity) => {
            const ent = { ...entity }
            const { attributes, typeName, guid } = ent

            if (typeName === 'Column') {
                const parentGuid = attributes.table.guid
                if (!columnEntity[parentGuid])
                    columnEntity = {
                        ...columnEntity,
                        [parentGuid]: [ent],
                    }
                else columnEntity[parentGuid].push(ent)

                columnEntityIds.push(guid)
                return
            }

            const { nodeData } = createNodeData(
                ent,
                relations,
                childrenCounts,
                hasBase ? baseEntityGuid : null
            )

            const searchItem = ent
            searchItems.value.push(searchItem)

            nodes.value.push(nodeData)
        })

        if (Object.keys(columnEntity).length) {
            Object.entries(columnEntity).forEach(([parentGuid, columns]) => {
                lineageStore.setNodesColumnList(parentGuid, columns)
            })
        }
    }

    createNodesFromEntityMap(lineage.value)

    /* Edges */

    const createNodeEdges = (lineageData) => {
        const { relations } = lineageData

        const fromAndToIdSet = new Set()
        relations.forEach((x) => {
            const { fromEntityId: from, toEntityId: to, processId } = x

            let data = {}
            const fromAndToId = `${from}@${to}`
            if (fromAndToIdSet.has(fromAndToId)) data = { isDup: true }
            else fromAndToIdSet.add(fromAndToId)

            if (columnEntityIds.find((y) => [from, to].includes(y))) return

            const relation = {
                id: `${processId}/${from}@${to}`,
                sourceCell: from,
                sourcePort: `${from}-invisiblePort`,
                targetCell: to,
                targetPort: `${to}-invisiblePort`,
            }

            if (x.type) relation.type = x.type

            const { edgeData } = createEdgeData(relation, data, {
                stroke: '#aaaaaa',
            })
            edges.value.push(edgeData)
        })
    }

    createNodeEdges(lineage.value)

    /* Render */
    const renderLayout = () => {
        model.value = graphLayout.value?.layout({
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

    /* addSubGraph */
    const addSubGraph = (data, registerAllListeners) => {
        const newData = data
        const guidEntityMapArr = Object.keys(newData.guidEntityMap)
        nodes.value.forEach((x) => {
            if (guidEntityMapArr.includes(x.id))
                delete newData.guidEntityMap[x.id]
        })
        createNodesFromEntityMap(newData, false)
        createNodeEdges(newData)
        renderLayout()

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
