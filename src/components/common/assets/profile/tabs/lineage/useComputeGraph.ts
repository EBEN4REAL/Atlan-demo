/** VUE */
import { ref, computed } from 'vue'

/** PACKAGES */
import { DagreLayout } from '@antv/layout'

/** STORE */
import useLineageStore from '~/store/lineage'

/** COMPOSABLES */
import useGraph from './useGraph'
import useGetNodes from './useGetNodes'
import useTransformGraph from './useTransformGraph'
import {
    featureEnabledMap,
    LINEAGE_LOOKER_FIELD_LEVEL_LINEAGE,
} from '~/composables/labs/labFeatureList'

/** UTILS */
import {
    getFilteredRelations,
    controlCyclicEdges,
    controlGroupedEdges,
} from './util.js'

export default async function useComputeGraph({
    graph,
    graphLayout,
    lineage,
    currZoom,
    isComputeDone,
    controlPrefRetainer,
}) {
    const lineageStore = useLineageStore()
    lineageStore.selectedNodeId = ''
    lineageStore.selectedPortId = ''
    lineageStore.cyclicRelations = []
    lineageStore.portToSelect = {}
    lineageStore.mergedLineageData = {}
    lineageStore.nodesPortsList = {}
    lineageStore.portLineage = {}
    lineageStore.preferences = {
        showArrow: true,
        showSchema: true,
        showDatabase: true,
        showAnnouncement: true,
        showLegend: false,
    }

    const model = ref(null)
    const edges = ref([])
    const nodes = ref([])
    const mergedLineageData = ref({})

    const { createNodeData, createEdgeData } = useGraph(graph)
    const { fit } = useTransformGraph(graph, () => {})

    mergedLineageData.value = { ...lineage.value }
    lineageStore.setMergedLineageData(mergedLineageData.value)
    lineageStore.setSelectedNodeId(mergedLineageData.value.baseEntityGuid)

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
            'LookerField',
        ]
        if (featureEnabledMap.value[LINEAGE_LOOKER_FIELD_LEVEL_LINEAGE])
            typeNames.push('LookerField')

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

    const createNodesFromEntityMap = (data, hasBase = true) => {
        const lineageData = { ...data }
        const { relations, baseEntityGuid } = lineageData
        const getAsset = (id) => lineageData.guidEntityMap[id]
        const isNodeExist = (id) => nodes.value.find((x) => x.id === id)

        // compute vertical pagination
        const filteredRelations = getFilteredRelations(relations)
        filteredRelations.forEach((x) => {
            const { fromEntityId: from, toEntityId: to } = x
            const { typeName: fromTypeName, guid: fromGuid } = getAsset(from)
            const { typeName: toTypeName, guid: toGuid } = getAsset(to)

            if (isPortTypeName(fromTypeName) || isPortTypeName(toTypeName))
                return

            if (from === to) return

            if (isNodeExist(fromGuid) && isNodeExist(toGuid)) return

            // compute sameSourceCount vertical pagination
            if (sameSourceCount.value[from]) {
                sameSourceCount.value[from].count += 1

                if (sameSourceCount.value[from].count > 4)
                    sameSourceCount.value[from].targetsHidden = [
                        ...sameSourceCount.value[from].targetsHidden,
                        getAsset(to),
                    ]
            } else
                sameSourceCount.value = {
                    ...sameSourceCount.value,
                    [from]: {
                        count: 1,
                        targetsHidden: [],
                    },
                }

            // compute sameTargetCount vertical pagination
            if (sameTargetCount.value[to]) {
                sameTargetCount.value[to].count += 1

                if (sameTargetCount.value[to].count > 4)
                    sameTargetCount.value[to].sourcesHidden = [
                        ...sameTargetCount.value[to].sourcesHidden,
                        getAsset(from),
                    ]
            } else
                sameTargetCount.value = {
                    ...sameTargetCount.value,
                    [to]: {
                        count: 1,
                        sourcesHidden: [],
                    },
                }
        })

        // add nodes for same source vertical pagination to entityMap
        Object.entries(sameSourceCount.value).forEach(([k, v]) => {
            if (v.count < 5) return
            if (!v.targetsHidden.length) return
            lineageData.guidEntityMap = {
                ...lineageData.guidEntityMap,
                [`vpNodeSS-${k}`]: {
                    typeName: 'vpNode',
                    guid: `vpNodeSS-${k}`,
                    dataObj: {
                        mode: 'vpNodeSS',
                        modeId: k,
                        count: v.targetsHidden.length,
                        hiddenEntities: v.targetsHidden,
                    },
                },
            }
        })

        // add nodes for same target vertical pagination to entityMap
        Object.entries(sameTargetCount.value).forEach(([k, v]) => {
            if (v.count < 5) return
            if (!v.sourcesHidden.length) return
            lineageData.guidEntityMap = {
                ...lineageData.guidEntityMap,
                [`vpNodeST-${k}`]: {
                    typeName: 'vpNode',
                    guid: `vpNodeST-${k}`,
                    dataObj: {
                        mode: 'vpNodeST',
                        modeId: k,
                        count: v.sourcesHidden.length,
                        hiddenEntities: v.sourcesHidden,
                    },
                },
            }
        })

        // create all other nodes from entityMap
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
                hasBase ? baseEntityGuid : null,
                entity?.dataObj || {}
            )

            nodes.value.push(nodeData)
        })
    }

    createNodesFromEntityMap(lineage.value)

    /* Edges */
    const createNodeEdges = (data) => {
        const lineageData = { ...data }

        // add edges for same source vertical pagination to relations
        Object.entries(sameSourceCount.value).forEach(([k, v]) => {
            if (v.count < 5) return
            if (!v.targetsHidden.length) return

            lineageData.relations.push({
                fromEntityId: k,
                processId: 'vpNodeProcessId',
                toEntityId: `vpNodeSS-${k}`,
            })
        })

        // add edges for same target vertical pagination to relations
        Object.entries(sameTargetCount.value).forEach(([k, v]) => {
            if (v.count < 5) return
            if (!v.sourcesHidden.length) return

            lineageData.relations.push({
                fromEntityId: `vpNodeST-${k}`,
                processId: 'vpNodeProcessId',
                toEntityId: k,
            })
        })

        // create all other edges from filtered relations
        const filteredRelations = getFilteredRelations(lineageData.relations)
        filteredRelations.forEach((rel) => {
            const { fromEntityId: from, toEntityId: to, processId } = rel

            if (from === to) return

            if (portIds.find((y) => [from, to].includes(y))) return

            if (allTargetsHiddenIds.value.find((y) => [from, to].includes(y)))
                return

            if (allSourcesHiddenIds.value.find((y) => [from, to].includes(y)))
                return

            const relation = {
                id: `${processId}/${from}@${to}`,
                sourceCell: from,
                sourcePort: `${from}-invisiblePort`,
                targetCell: to,
                targetPort: `${to}-invisiblePort`,
            }

            const { edgeData } = createEdgeData(relation, {})
            edges.value.push(edgeData)
        })
    }

    createNodeEdges(lineage.value)

    /* createCTAs */
    const createCTAs = () => {
        const { relations, baseEntityGuid, childrenCounts } =
            mergedLineageData.value

        const { predecessors, successors } = useGetNodes(graph, baseEntityGuid)

        const isCollapsible = (id) =>
            !!relations.find((x) => x.fromEntityId === id) &&
            !!relations.find((x) => x.toEntityId === id)

        const hasHoPa = (id) => {
            let res = false
            const isRootNode = graph.value.isRootNode(id)
            const isLeafNode = graph.value.isLeafNode(id)
            if (isRootNode) res = !!childrenCounts?.[id]?.INPUT
            if (isLeafNode) res = !!childrenCounts?.[id]?.OUTPUT
            return res
        }

        graph.value.freeze('createCTAs')
        graph.value.getNodes().forEach((node) => {
            const { disableCta } = node.getData()
            const isCyclicGraph = !!lineageStore.getCyclicRelations().length
            const isColNode = isCollapsible(node.id)
            const isHoPaNode = hasHoPa(node.id)
            const isRootNode = graph.value.isRootNode(node.id)
            const isLeafNode = graph.value.isLeafNode(node.id)

            if (!disableCta && !isCyclicGraph) {
                // create CTAs for "right" horizontal expand/collpase
                if (
                    (isColNode && successors.includes(node.id)) ||
                    (baseEntityGuid === node.id && successors.length)
                ) {
                    const id = `${node.id}-ctaRight-hoTo`
                    node.updateData({
                        ctaRightIcon: 'col',
                        ctaRightId: id,
                    })
                }

                // create CTAs for "left" horizontal expand/collpase
                if (
                    (isColNode && predecessors.includes(node.id)) ||
                    (baseEntityGuid === node.id && predecessors.length)
                ) {
                    const id = `${node.id}-ctaLeft-hoTo`
                    node.updateData({
                        ctaLeftIcon: 'col',
                        ctaLeftId: id,
                    })
                }
            }

            // create CTAs for horizontal pagination
            if (!disableCta) {
                if ((isRootNode || isLeafNode) && isHoPaNode) {
                    const pos = isLeafNode ? 'ctaRight' : 'ctaLeft'
                    const id = `${node.id}-${pos}-hoPa`
                    if (pos === 'ctaRight')
                        node.updateData({
                            ctaRightIcon: 'exp',
                            ctaRightId: id,
                        })
                    if (pos === 'ctaLeft')
                        node.updateData({
                            ctaLeftIcon: 'exp',
                            ctaLeftId: id,
                        })
                }
            }

            // increase width of node's invisible port to fit the CTAs
            const { ctaRightIcon, ctaLeftIcon } = node.getData()
            if (!ctaRightIcon && !ctaLeftIcon) return

            let widthVal = 268
            let xVal = 1

            if (ctaRightIcon && ctaLeftIcon) {
                widthVal = 298
                xVal = -14
            }
            if (ctaRightIcon && !ctaLeftIcon) {
                widthVal = 284
            }
            if (!ctaRightIcon && ctaLeftIcon) {
                widthVal = 284
                xVal = -14
            }

            node.setPortProp(
                `${node.id}-invisiblePort`,
                'attrs/portBody/width',
                widthVal
            )
            node.setPortProp(
                `${node.id}-invisiblePort`,
                'attrs/portBody/x',
                xVal
            )
        })
        graph.value.unfreeze('createCTAs')
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

        const { relations } = mergedLineageData.value
        controlCyclicEdges(graph, relations)
        controlGroupedEdges(graph, relations)
        createCTAs()
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
        fit(assetGuidToFit)
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
