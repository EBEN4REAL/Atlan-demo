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
    const { DagreLayout } = window.layout
    const lineageStore = useLineageStore()
    lineageStore.nodesColumnList = {}
    lineageStore.columnsLineage = {}

    const { createNodeData, createEdgeData } = useGraph()
    const { fit } = useTransformGraph(graph, emit)

    const model = ref(null)
    const edges = ref([])
    const nodes = ref([])
    const mergedLineageData = ref()

    mergedLineageData.value = { ...lineage.value }
    searchItems.value = []
    model.value = null
    edges.value = []
    nodes.value = []

    /* Nodes */
    let columnEntity = {}
    const columnEntityIds = []

    const sameSourceCount = ref({})

    const isNodeExist = (id) => nodes.value.find((x) => x.id === id)

    const createNodesFromEntityMap = (data, hasBase = true) => {
        const lineageData = { ...data }
        const { relations, childrenCounts, baseEntityGuid } = lineageData

        const getAsset = (id) => lineageData.guidEntityMap[id]

        relations.forEach((x) => {
            const { fromEntityId: from, toEntityId: to } = x

            const { typeName: fromTypeName } = getAsset(from)
            const { typeName: toTypeName } = getAsset(to)

            if ([fromTypeName, toTypeName].includes('column')) return

            if (sameSourceCount.value[from]) {
                sameSourceCount.value[from].count += 1

                if (sameSourceCount.value[from].count <= 4)
                    sameSourceCount.value[from].targetsVisible = [
                        ...sameSourceCount.value[from].targetsVisible,
                        getAsset(to),
                    ]
                else {
                    sameSourceCount.value[from].targetsHidden = [
                        ...sameSourceCount.value[from].targetsHidden,
                        getAsset(to),
                    ]
                }
            } else
                sameSourceCount.value = {
                    ...sameSourceCount.value,
                    [from]: {
                        count: 1,
                        targetsVisible: [getAsset(to)],
                        targetsHidden: [],
                    },
                }
        })

        Object.entries(sameSourceCount.value).forEach(([k, v]) => {
            if (v.count < 5) return
            if (!v.targetsHidden.length) return
            lineageData.guidEntityMap = {
                ...lineageData.guidEntityMap,
                [`vpNode/${k}`]: {
                    typeName: 'vpNode',
                    guid: `vpNode/${k}`,
                    attributes: {
                        hiddenCount: v.targetsHidden.length,
                    },
                },
            }
        })

        const y = Object.values(sameSourceCount.value)
        const z = y.map((x) => x.targetsHidden).flat()
        const allTargetsHiddenIds = z.map((x) => x.guid)

        const guidEntityMap = Object.values(lineageData.guidEntityMap)

        guidEntityMap.forEach((entity) => {
            const ent = { ...entity }
            const { attributes, typeName, guid } = ent

            if (isNodeExist(guid)) return

            if (allTargetsHiddenIds.includes(entity.guid)) return

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

    const createNodeEdges = (data) => {
        const lineageData = { ...data }

        const { relations } = lineageData

        const fromAndToIdSet = new Set()

        Object.entries(sameSourceCount.value).forEach(([k, v]) => {
            if (v.count < 5) return
            if (!v.targetsHidden.length) return

            lineageData.relations.push({
                fromEntityId: k,
                processId: 'vpNodeProcessId',
                toEntityId: `vpNode/${k}`,
            })
        })

        const y = Object.values(sameSourceCount.value)
        const z = y.map((x) => x.targetsHidden).flat()
        const allTargetsHiddenIds = z.map((x) => x.guid)

        relations.forEach((x) => {
            const { fromEntityId: from, toEntityId: to, processId } = x

            if (columnEntityIds.find((y) => [from, to].includes(y))) return

            let edgeExtraData = {}
            const fromAndToId = `${from}@${to}`
            if (fromAndToIdSet.has(fromAndToId)) edgeExtraData = { isDup: true }
            else fromAndToIdSet.add(fromAndToId)

            if (allTargetsHiddenIds.find((y) => [from, to].includes(y))) return

            const relation = {
                id: `${processId}/${from}@${to}`,
                sourceCell: from,
                sourcePort: `${from}-invisiblePort`,
                targetCell: to,
                targetPort: `${to}-invisiblePort`,
            }

            const exists = edges.value.find((x) => x.id === relation.id)

            if (exists) return

            if (x.type) relation.type = x.type

            const { edgeData } = createEdgeData(relation, edgeExtraData, {
                stroke: '#aaaaaa',
            })
            edges.value.push(edgeData)
        })
    }

    createNodeEdges(lineage.value)

    /* Render */
    const renderLayout = (registerAllListeners) => {
        model.value = graphLayout.value?.layout({
            edges: edges.value,
            nodes: nodes.value,
        })
        graph.value.fromJSON(model.value)

        graphLayout.value = new DagreLayout({
            type: 'dagre',
            rankdir: 'LR',
            controlPoints: true,
            nodesepFunc(x) {
                // vertical spacing btw nodes
                return 20
            },
            ranksepFunc(x) {
                // horizontal spacing btw nodes
                return 190
            },
            preset: {
                nodes: model.value?.nodes?.map((node) => ({
                    id: node.id,
                    _order: node._order,
                })),
            },
        })

        graph.value.getNodes().forEach((n) => {
            const ctaEle = document.getElementById(`node-${n.id}-loadCTA`)
            const cell = graph.value.getCellById(n.id)
            const isRootNode = graph.value.isRootNode(cell)
            const isLeafNode = graph.value.isLeafNode(cell)
            if (isRootNode || isLeafNode) return
            ctaEle?.remove()
        })

        if (typeof registerAllListeners === 'function') registerAllListeners()
    }
    renderLayout(null)

    isComputeDone.value = true

    /* Transformations */
    fit(lineage.value.baseEntityGuid)
    currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`

    /* addSubGraph */
    const addSubGraph = (data, registerAllListeners) => {
        const newData = data
        createNodesFromEntityMap(newData, false)
        createNodeEdges(newData)
        renderLayout(registerAllListeners)

        if (!mergedLineageData.value) mergedLineageData.value = lineage.value

        const {
            baseEntityGuid,
            limit,
            lineageDepth,
            lineageDirection,
            childrenCounts: cc1,
            guidEntityMap: gem1,
            relations: rel1,
        } = mergedLineageData.value

        const {
            childrenCounts: cc2,
            guidEntityMap: gem2,
            relations: rel2,
        } = data

        const childrenCounts = { ...cc1, ...cc2 }
        const guidEntityMap = { ...gem1, ...gem2 }
        const allRelations = [...rel1, ...rel2]

        const relations = []
        allRelations.forEach((x) => {
            const exists = relations.find(
                (y) =>
                    x.fromEntityId === y.fromEntityId &&
                    x.processId === y.processId &&
                    x.toEntityId === y.toEntityId
            )
            if (exists) return
            relations.push(x)
        })

        mergedLineageData.value = {
            baseEntityGuid,
            limit,
            lineageDepth,
            lineageDirection,
            childrenCounts,
            guidEntityMap,
            relations,
        }
    }

    return {
        addSubGraph,
        renderLayout,
        mergedLineageData,
        sameSourceCount,
        nodes,
        edges,
    }
}
