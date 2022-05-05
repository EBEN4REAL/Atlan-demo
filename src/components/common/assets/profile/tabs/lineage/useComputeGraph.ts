/** VUE */
import { ref, computed } from 'vue'

/** PACKAGES */
import { DagreLayout } from '@antv/layout'

/** STORE */
import useLineageStore from '~/store/lineage'

/** COMPOSABLES */
import useGraph from './useGraph'

/** UTILS */
import { isCyclicEdge, getFilteredRelations } from './util.js'
import useGetNodes from './useGetNodes'

export default async function useComputeGraph({
    graph,
    graphLayout,
    lineage,
    currZoom,
    isComputeDone,
    controlPrefRetainer,
}) {
    const lineageStore = useLineageStore()
    lineageStore.cyclicRelations = []
    lineageStore.portToSelect = {}
    lineageStore.mergedLineageData = {}
    lineageStore.nodesPortsList = {}
    lineageStore.portLineage = {}

    const model = ref(null)
    const edges = ref([])
    const nodes = ref([])
    const mergedLineageData = ref({})

    const { createNodeData, createEdgeData } = useGraph(graph)

    mergedLineageData.value = { ...lineage.value }
    lineageStore.setMergedLineageData(mergedLineageData.value)

    model.value = null
    edges.value = []
    nodes.value = []

    /* Nodes */
    const portIds = []
    const isPortTypeName = (typeName) => {
        const typeNames = [
            'Column',
            'TableauDatasourceField',
            'TableauCalculatedField',
            // 'LookerField',
        ]
        return typeNames.includes(typeName)
    }

    const sameSourceCount = ref({})
    const sameTargetCount = ref({})

    const allTargetsHiddenIds = computed(() => {
        const y = Object.values(sameSourceCount.value)
        const z = y.map((x) => x.targetsHidden).flat()
        return z.map((x) => x.guid)
    })

    const allSourcesHiddenIds = computed(() => {
        const y = Object.values(sameTargetCount.value)
        const z = y.map((x) => x.sourcesHidden).flat()
        return z.map((x) => x.guid)
    })

    const fromAndToIdSetForNodes = new Set()

    const createNodesFromEntityMap = (data, hasBase = true) => {
        const lineageData = { ...data }

        const { relations, baseEntityGuid } = lineageData

        const getAsset = (id) => lineageData.guidEntityMap[id]

        const isNodeExist = (id) => nodes.value.find((x) => x.id === id)

        relations.forEach((x) => {
            const { fromEntityId: from, toEntityId: to } = x

            const { typeName: fromTypeName, guid: fromGuid } = getAsset(from)
            const { typeName: toTypeName, guid: toGuid } = getAsset(to)

            if (isPortTypeName(fromTypeName) || isPortTypeName(toTypeName))
                return

            if (from === to) return

            const fromAndToId = `${from}@${to}`
            if (!fromAndToIdSetForNodes.has(fromAndToId))
                fromAndToIdSetForNodes.add(fromAndToId)
            else return

            if (isNodeExist(fromGuid) && isNodeExist(toGuid)) return

            // same source
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

            // same target
            if (sameTargetCount.value[to]) {
                sameTargetCount.value[to].count += 1

                if (sameTargetCount.value[to].count <= 4)
                    sameTargetCount.value[to].sourcesVisible = [
                        ...sameTargetCount.value[to].sourcesVisible,
                        getAsset(from),
                    ]
                else {
                    sameTargetCount.value[to].sourcesHidden = [
                        ...sameTargetCount.value[to].sourcesHidden,
                        getAsset(from),
                    ]
                }
            } else
                sameTargetCount.value = {
                    ...sameTargetCount.value,
                    [to]: {
                        count: 1,
                        sourcesVisible: [getAsset(from)],
                        sourcesHidden: [],
                    },
                }
        })

        // same source
        Object.entries(sameSourceCount.value).forEach(([k, v]) => {
            if (v.count < 5) return
            if (!v.targetsHidden.length) return
            lineageData.guidEntityMap = {
                ...lineageData.guidEntityMap,
                [`vpNodeSS-${k}`]: {
                    typeName: 'vpNode',
                    guid: `vpNodeSS-${k}`,
                    attributes: {
                        hiddenCount: v.targetsHidden.length,
                    },
                },
            }
        })

        // same target
        Object.entries(sameTargetCount.value).forEach(([k, v]) => {
            if (v.count < 5) return
            if (!v.sourcesHidden.length) return
            lineageData.guidEntityMap = {
                ...lineageData.guidEntityMap,
                [`vpNodeST-${k}`]: {
                    typeName: 'vpNode',
                    guid: `vpNodeST-${k}`,
                    attributes: {
                        hiddenCount: v.sourcesHidden.length,
                    },
                },
            }
        })

        const guidEntityMapValues = Object.values(lineageData.guidEntityMap)

        guidEntityMapValues.forEach((entity) => {
            const ent = { ...entity }
            const { typeName, guid } = ent

            if (isNodeExist(guid)?.id) return
            if (allTargetsHiddenIds.value.includes(entity.guid)) return
            if (allSourcesHiddenIds.value.includes(entity.guid)) return

            if (isPortTypeName(typeName)) {
                portIds.push(guid)
                return
            }

            const { nodeData } = createNodeData(
                ent,
                hasBase ? baseEntityGuid : null
            )

            nodes.value.push(nodeData)
        })
    }

    createNodesFromEntityMap(lineage.value)

    /* Edges */
    const createNodeEdges = (data) => {
        const lineageData = { ...data }

        // same source
        Object.entries(sameSourceCount.value).forEach(([k, v]) => {
            if (v.count < 5) return
            if (!v.targetsHidden.length) return

            lineageData.relations.push({
                fromEntityId: k,
                processId: 'vpNodeProcessId',
                toEntityId: `vpNodeSS-${k}`,
            })
        })

        // same target
        Object.entries(sameTargetCount.value).forEach(([k, v]) => {
            if (v.count < 5) return
            if (!v.sourcesHidden.length) return

            lineageData.relations.push({
                fromEntityId: `vpNodeST-${k}`,
                processId: 'vpNodeProcessId',
                toEntityId: k,
            })
        })

        const newRels = getFilteredRelations(lineageData.relations)

        newRels.forEach((rel) => {
            const { fromEntityId: from, toEntityId: to, processId } = rel

            if (from === to) return

            if (portIds.find((y) => [from, to].includes(y))) return

            if (allTargetsHiddenIds.value.find((y) => [from, to].includes(y)))
                return

            if (allSourcesHiddenIds.value.find((y) => [from, to].includes(y)))
                return

            let edgeExtraData = {}
            const styles = {
                stroke: '#B2B8C7',
            }

            if (isCyclicEdge(mergedLineageData, from, to)) {
                styles.stroke = '#ff4848'
                edgeExtraData = { ...edgeExtraData, isCyclicEdge: true }

                lineageStore.setCyclicRelation(`${from}@${to}`)
            }

            edgeExtraData = { ...edgeExtraData, isDup: !!rel?.isDup }

            const relation = {
                id: `${processId}/${from}@${to}`,
                sourceCell: from,
                sourcePort: `${from}-invisiblePort`,
                targetCell: to,
                targetPort: `${to}-invisiblePort`,
            }

            const { edgeData } = createEdgeData(relation, edgeExtraData, styles)
            edges.value.push(edgeData)
        })
    }

    createNodeEdges(lineage.value)

    /* createColCTAPorts */
    const createColCTAPorts = () => {
        const { relations, baseEntityGuid } = mergedLineageData.value

        const { predecessors, successors } = useGetNodes(graph, baseEntityGuid)

        const isCollapsible = (id) =>
            !!relations.find((x) => x.fromEntityId === id) &&
            !!relations.find((x) => x.toEntityId === id)

        graph.value.freeze('createColCTAPorts')
        graph.value.getNodes().forEach((node) => {
            const isColNode = isCollapsible(node.id)

            if (
                (isColNode && successors.includes(node.id)) ||
                (baseEntityGuid === node.id && successors.length)
            ) {
                const id = `${node.id}-ctaPortRight-coll`
                node.updateData({
                    ctaPortRightIcon: 'col',
                    ctaPortRightId: id,
                })
            }

            if (
                (isColNode && predecessors.includes(node.id)) ||
                (baseEntityGuid === node.id && predecessors.length)
            ) {
                const id = `${node.id}-ctaPortLeft-coll`
                node.updateData({
                    ctaPortLeftIcon: 'col',
                    ctaPortLeftId: id,
                })
            }
        })
        graph.value.unfreeze('createColCTAPorts')
    }

    /* createHoPaCTAPorts */
    const createHoPaCTAPorts = () => {
        const { relations, childrenCounts } = mergedLineageData.value

        const checkNode = (id, prop) => {
            let res = true
            relations.forEach((x) => {
                if (x[prop] === id) res = false
            })
            return res
        }

        const hasHoPa = (id) => {
            let res = false
            const isRootNode = checkNode(id, 'toEntityId')
            const isLeafNode = checkNode(id, 'fromEntityId')
            if (isRootNode) res = !!childrenCounts?.[id]?.INPUT
            if (isLeafNode) res = !!childrenCounts?.[id]?.OUTPUT
            return res
        }

        graph.value.freeze('createHoPaCTAPorts')
        graph.value.getNodes().forEach((node) => {
            const isHoPaNode = hasHoPa(node.id)
            const isRootNode = checkNode(node.id, 'toEntityId')
            const isLeafNode = checkNode(node.id, 'fromEntityId')

            if ((isRootNode || isLeafNode) && isHoPaNode) {
                const pos = isLeafNode ? 'ctaPortRight' : 'ctaPortLeft'
                const id = `${node.id}-${pos}-hoPa`
                if (pos === 'ctaPortRight')
                    node.updateData({
                        ctaPortRightIcon: 'exp',
                        ctaPortRightId: id,
                    })
                if (pos === 'ctaPortLeft')
                    node.updateData({
                        ctaPortLeftIcon: 'exp',
                        ctaPortLeftId: id,
                    })
            }
        })
        graph.value.unfreeze('createHoPaCTAPorts')
    }

    /* Render */
    const renderLayout = () => {
        model.value = graphLayout.value?.layout({
            edges: edges.value,
            nodes: nodes.value,
        })
        graph.value.fromJSON(model.value)

        graphLayout.value = new DagreLayout({
            type: 'dagre',
            rankdir: 'LR',
            controlPoints: true,
            nodesepFunc() {
                return 40
            },
            ranksepFunc() {
                return 250
            },
            preset: {
                nodes: model.value?.nodes?.map((node) => ({
                    id: node.id,
                    _order: node._order,
                })),
            },
        })

        createColCTAPorts()
        createHoPaCTAPorts()
        controlPrefRetainer()
    }
    renderLayout()
    isComputeDone.value = true

    /* Transformations */
    const cell = graph.value.getCellById(lineage.value.baseEntityGuid)
    graph.value.scrollToCell(cell)
    graph.value.scale(0.7)

    currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`

    /* addSubGraph */
    const addSubGraph = (data) => {
        if (!Object.keys(mergedLineageData.value).length)
            mergedLineageData.value = lineage.value

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
        lineageStore.setMergedLineageData(mergedLineageData.value)

        const newData = { ...data }

        createNodesFromEntityMap(newData, false)
        createNodeEdges(newData)
        renderLayout()

        const assetGuidToFit = Object.keys(newData.guidEntityMap).find(
            (x) =>
                x !== newData.baseEntityGuid &&
                graph.value.getNodes().find((y) => y.id === x)
        )
        const cellToFit = graph.value.getCellById(assetGuidToFit)

        graph.value.scrollToCell(cellToFit, { animation: { duration: 600 } })
    }

    return {
        addSubGraph,
        renderLayout,
        mergedLineageData,
        sameSourceCount,
        sameTargetCount,
        nodes,
        edges,
    }
}
