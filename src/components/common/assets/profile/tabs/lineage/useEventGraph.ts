/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/** VUE */
import { watch, ref, computed } from 'vue'
import { useDebounceFn, watchOnce } from '@vueuse/core'

/** PACKAGES */
import { message } from 'ant-design-vue'

/** COMPOSABLES */
import useLineageStore from '~/store/lineage'
import useLineageService from '~/services/meta/lineage/lineage_service'
import useUpdateGraph from './useUpdateGraph'
import useGetNodes from './useGetNodes'
import useGraph from './useGraph'
import useTransformGraph from './useTransformGraph'
import fetchPorts from './fetchPorts'
import useAddEvent from '~/composables/eventTracking/useAddEvent'

/** CONSTANTS */
import {
    LineageAttributes,
    LineageAttributesPortLevel,
} from '~/constant/projection'

/** UTILS */
import {
    getFilteredRelations,
    getCyclicRelations,
    controlCyclicEdges,
    controlGroupedEdges,
    setFront,
    setBack,
} from './util.js'

export default function useEventGraph({
    graph,
    currZoom,
    guidToSelectOnGraph,
    mergedLineageData,
    sameSourceCount,
    sameTargetCount,
    nodes,
    edges,
    onSelectAsset,
    onCloseDrawer,
    addSubGraph,
    renderLayout,
    controlPrefRetainer,
}) {
    /** INITIALIZE */
    const lineageStore = useLineageStore()
    const { useFetchLineage } = useLineageService()
    const { highlightNode, highlightNodes, highlightEdges, dimNodesEdges } =
        useUpdateGraph(graph)
    const { addNode, addEdge, createEdgeData, createNodeData } = useGraph(graph)
    const { fit } = useTransformGraph(graph, () => {})

    /** DATA */
    const selectedNodeId = ref('')
    const selectedNodeEdgeId = ref('')
    const selectedPortId = ref('')
    const selectedPortIdNext = ref('')
    const selectedPortEdgeId = ref('')
    const nodesEdgesHighlighted = ref([])
    const nodesTranslated = ref({})
    const expandedNodes = ref([])
    const portHighlightedBINodes = ref([])
    const activeNodesToggled = ref({})
    const currPortLineage = ref({})
    const actions = ref({})
    const portToSelect = computed(() => lineageStore.getPortToSelect())
    const depthCounter = ref(1)
    const isGraphLoading = ref(false)
    const portToggledNodes = ref({})
    const preferences = lineageStore.getPreferences()

    /** METHODS */
    /** Utils */
    // handleError
    const handleError = (err) => {
        let msg = err.message
        const status = err?.response?.status

        if (status === 403) msg = "Sorry, you don't have access to this asset"

        message.error(msg)
    }

    // sendNodeClickedEvent - Analytics Events
    const sendNodeClickedEvent = useDebounceFn(
        (asset_type, connector, node_id) => {
            useAddEvent('lineage', 'node', 'clicked', {
                asset_type,
                connector,
                node_id,
            })
        },
        400
    )

    // sendSubNodeClickedEvent - Analytics Events
    const sendSubNodeClickedEvent = useDebounceFn(
        (asset_type, connector, click_index, node_id) => {
            useAddEvent('lineage', 'sub_node', 'clicked', {
                asset_type,
                connector,
                click_index,
                node_id,
            })
        },
        400
    )

    // sendSubNodeShowMoreEvent - Analytics Events
    const sendSubNodeShowMoreEvent = useDebounceFn(
        (current_list_count, load_more_size, node_id) => {
            useAddEvent('lineage', 'sub_node', 'show_more', {
                current_list_count,
                load_more_size,
                node_id,
            })
        },
        400
    )

    // sendProcessClickedEvent - Analytics Events
    const sendProcessClickedEvent = useDebounceFn(
        (is_group, is_cyclic, edge_id) => {
            useAddEvent('lineage', 'process', 'clicked', {
                is_group,
                is_cyclic,
                edge_id,
            })
        },
        400
    )

    // sendNodeExpandedEvent - Analytics Events
    const sendNodeExpandedEvent = useDebounceFn(
        (child_count, node_id, type) => {
            useAddEvent(
                'lineage',
                'node',
                type === 'expanded' ? 'expanded' : 'collapsed',
                {
                    child_count,
                    node_id,
                }
            )
        },
        400
    )

    // getNodeQN
    const getNodeQN = (portQN) => {
        if (!portQN) return null
        const qnArr = portQN.split('/')
        qnArr.pop()
        const parentName = qnArr.join('/')

        return parentName
    }

    // getPortLabel
    const getNodePortLabel = (node) => {
        const { typeName } = node.store.data.entity
        const portsLabelMap = {
            Table: 'column',
            View: 'column',
            MaterialisedView: 'column',
            TableauDatasource: 'field',
            // LookerExplore: 'field',
            // LookerView: 'field',
        }
        return portsLabelMap[typeName]
    }

    // getEventPath
    const getEventPath = (e) => {
        const path = (e.composedPath && e.composedPath()) || e.path
        const target = e?.target

        if (path != null)
            return path.indexOf(window) < 0 ? path.concat(window) : path
        if (target === window) return [window]

        const getParents = (node, memo = []) => {
            const parentNode = node?.parentNode
            if (!parentNode) return memo
            return getParents(parentNode, memo.concat(parentNode))
        }

        return [target].concat(getParents(target), window)
    }

    /** Graph utils */
    // isEdgeClickable
    const isEdgeClickable = (edge) => {
        if (edge.id.includes('vpNode')) return false

        const isPortEdge = !!edge.id.includes('port')
        if (!isPortEdge && (selectedPortId.value || selectedPortEdgeId.value))
            return false

        return true
    }

    // isEdgeHoverable
    const isEdgeHoverable = (edge) => {
        if (edge.id.includes('vpNode')) return false

        const isPortEdge = !!edge.id.includes('port')
        if (!isPortEdge && (selectedPortId.value || selectedPortEdgeId.value))
            return false

        return true
    }

    // isExpandedNode
    const isExpandedNode = (nodeId) => expandedNodes.value.includes(nodeId)

    // isNodePortInCurrPortLineage
    const isNodePortInCurrPortLineage = (nodeId) => {
        if (!currPortLineage.value?.guidEntityMap) return false

        const portIds = Object.keys(currPortLineage.value.guidEntityMap)
        const node = getX6Node(nodeId)

        if (!node) return false

        const res = portIds.some(
            (portId) => node.hasPort(portId) && isPortRendered(portId)
        )

        return res
    }

    // isNodeHidden
    const isNodeHidden = (nodeId, returnBoolean) => {
        let res = {
            isHidden: false,
            type: '',
            node: null,
        }

        Object.entries(sameSourceCount.value).forEach(([k, v]) => {
            if (res?.isHidden) return

            const targetsHiddenGuids = v?.targetsHidden.map((x) => x.guid)
            const isHidden = targetsHiddenGuids.includes(nodeId)
            if (isHidden)
                res = {
                    isHidden,
                    type: 'sameSourceCount',
                    node: k,
                }
        })

        if (res?.isHidden) {
            if (returnBoolean) return !!res?.isHidden
            return res
        }

        Object.entries(sameTargetCount.value).forEach(([k, v]) => {
            if (res?.isHidden) return

            const sourcesHiddenGuids = v?.sourcesHidden.map((x) => x.guid)
            const isHidden = sourcesHiddenGuids.includes(nodeId)
            if (isHidden)
                res = {
                    isHidden,
                    type: 'sameTargetCount',
                    node: k,
                }
        })

        if (returnBoolean) return !!res?.isHidden
        return res
    }

    // isPortRendered
    const isPortRendered = (portId) =>
        graph.value.getNodes().some((x) => x.hasPort(portId))

    // isPortTypeName
    const isPortTypeName = (typeName) => {
        const typeNames = [
            'Column',
            'TableauDatasourceField',
            'TableauCalculatedField',
            // 'LookerField',
        ]
        return typeNames.includes(typeName)
    }

    // isPortEdgesPresent
    const isPortEdgesPresent = () =>
        graph.value.getEdges().filter((x) => x.id.includes('port')).length

    // getX6Node
    const getX6Node = (nodeId) =>
        graph.value.getNodes().find((x) => x.id === nodeId)

    // getX6Edge
    const getX6Edge = (edgeId) =>
        graph.value.getEdges().find((x) => x.id === edgeId)

    // getNodesToHighlight
    const getNodesToHighlight = (guid) => {
        let res = []
        if (guid.value) {
            const { predecessors, successors } = useGetNodes(graph, guid.value)
            res = [guid.value, ...predecessors, ...successors]
        }
        return res
    }

    // getNodePorts
    const getNodePorts = (node) => {
        const { ports } = node.getData()

        return ports
    }

    // selectNode
    const selectNode = (guid) => {
        const cyclicRelations = lineageStore.getCyclicRelations()
        const isCyclicRelation = cyclicRelations.find((x) => x.includes(guid))
        const entity = getX6Node(guid)?.store?.data?.entity
        onSelectAsset(entity)

        if (guid) {
            selectedNodeId.value = guid
            lineageStore.setSelectedNodeId(guid)
        }

        if (isCyclicRelation) {
            highlightNode(selectedNodeId.value, 'select')
            return
        }

        const nodesToHighlight = getNodesToHighlight(selectedNodeId)

        highlightNodes(selectedNodeId, nodesToHighlight)
        nodesEdgesHighlighted.value = highlightEdges(nodesToHighlight)
    }

    // selectNodeEdge
    const selectNodeEdge = (edgeId, edge) => {
        const cell = graph.value.getCellById(edgeId)
        const isCyclicEdge = cell.store.data.data?.isCyclicEdge

        if (isCyclicEdge) {
            sendProcessClickedEvent(
                !!edge.data?.isGroupEdge,
                !!isCyclicEdge,
                edgeId
            )
            return
        }

        const processId = edgeId.split('/')[0]
        onSelectAsset({ guid: processId })

        if (edgeId) selectedNodeEdgeId.value = edgeId

        const [source, target] = edgeId.split('/')[1].split('@')

        const cyclicRelations = lineageStore.getCyclicRelations()
        const isCyclicRelation = cyclicRelations.find((x) => {
            const [s, t] = x.split('@')
            if (source === s && target === t) return true
            if (source === t && target === s) return true
            return false
        })

        sendProcessClickedEvent(
            !!edge.data?.isGroupEdge,
            !!isCyclicRelation,
            edgeId
        )

        if (isCyclicRelation) return

        const { predecessors } = useGetNodes(graph, source)
        const { successors } = useGetNodes(graph, target)

        const nodesToHighlight = [
            source,
            ...predecessors,
            target,
            ...successors,
        ]

        nodesEdgesHighlighted.value = highlightEdges(nodesToHighlight)
        highlightNodes(null, nodesToHighlight)
    }

    // selectVpNode
    const selectVpNode = (node, entityIdsToAdd: string[] = []) => {
        if (!node?.getData()) return
        const { mode, modeId, hiddenEntities } = node.getData()

        const entitiesToAdd = !entityIdsToAdd.length
            ? hiddenEntities.slice(0, 4)
            : hiddenEntities.filter((hn) => entityIdsToAdd.includes(hn.guid))
        const filteredEntityIdsToAdd = entitiesToAdd.map((ent) => ent.guid)
        const filteredHiddenEntities = hiddenEntities.filter(
            (ent) => !filteredEntityIdsToAdd.includes(ent.guid)
        )

        graph.value.freeze('selectVpNode-entitiesToAdd')
        entitiesToAdd.forEach((ent) => {
            const { nodeData } = createNodeData(ent, null)
            nodes.value.push(nodeData)
            addNode(ent)
        })
        graph.value.unfreeze('selectVpNode-entitiesToAdd')

        const { relations } = mergedLineageData.value
        const filteredRelations = getFilteredRelations(relations)
        const relationsToAdd = filteredRelations.filter((rel) =>
            mode === 'vpNodeSS'
                ? filteredEntityIdsToAdd.includes(rel.toEntityId)
                : filteredEntityIdsToAdd.includes(rel.fromEntityId)
        )

        graph.value.freeze('selectVpNode-relationsToAdd')
        relationsToAdd.forEach((rel) => {
            const { fromEntityId: from, toEntityId: to, processId } = rel

            if (from === to) return

            const relation = {
                id: `${processId}/${from}@${to}`,
                sourceCell: from,
                sourcePort: `${from}-invisiblePort`,
                targetCell: to,
                targetPort: `${to}-invisiblePort`,
            }

            const itExist = edges.value.find((edge) => edge.id === relation.id)
            if (itExist) return

            const { edgeData } = createEdgeData(relation, {})
            edges.value.push(edgeData)
            addEdge(relation)

            const entry = `${from}@${to}`
            const cyclicRelations = getCyclicRelations(filteredRelations)

            if (cyclicRelations.includes(entry)) {
                const relACW = filteredRelations.find(
                    (r) => r.fromEntityId === to && r.toEntityId === from
                )
                const relationACW = {
                    id: `${relACW.processId}/${to}@${from}`,
                    sourceCell: to,
                    sourcePort: `${to}-invisiblePort`,
                    targetCell: from,
                    targetPort: `${from}-invisiblePort`,
                }
                const { edgeData: edACW } = createEdgeData(relationACW, {})
                edges.value.push(edACW)
                addEdge(relationACW)
            }
        })
        graph.value.unfreeze('selectVpNode-relationsToAdd')

        nodes.value = nodes.value.filter((n) => n.id !== node.id)
        edges.value = edges.value.filter((e) =>
            mode === 'vpNodeSS'
                ? e.id !== `vpNodeProcessId/${modeId}@${node.id}`
                : e.id !== `vpNodeProcessId/${node.id}@${modeId}`
        )

        if (filteredHiddenEntities.length !== 0) {
            // add back vp node
            const entity = node?.store?.data?.entity || node.entity
            const { nodeData } = createNodeData(entity, null)
            nodeData.data.mode = mode
            nodeData.data.modeId = modeId
            nodeData.data.count = filteredHiddenEntities.length
            nodeData.data.hiddenEntities = filteredHiddenEntities
            nodes.value.push(nodeData)
            addNode(nodeData.entity)

            // add back vp edge
            const from = mode === 'vpNodeSS' ? modeId : node.id
            const processId = 'vpNodeProcessId'
            const to = mode === 'vpNodeSS' ? node.id : modeId
            const relation = {
                id: `${processId}/${from}@${to}`,
                sourceCell: from,
                sourcePort: `${from}-invisiblePort`,
                targetCell: to,
                targetPort: `${to}-invisiblePort`,
            }
            const { edgeData } = createEdgeData(relation, {})
            edges.value.push(edgeData)
            addEdge(relation)
        }

        renderLayout()
    }

    // getAllXPos
    const getAllXPos = () => {
        let allXPos = {}
        graph.value.getNodes().forEach((node) => {
            const { x } = node.position()
            const order = node.store.data._order
            if (allXPos[x]) allXPos[x].push(order)
            else allXPos = { ...allXPos, [x]: [order] }
        })
        Object.entries(allXPos).forEach(([x, v]) => {
            allXPos[x] = v.sort((a, b) => a - b)
        })
        return allXPos
    }

    // updateNodeRawData
    const updateNodeRawData = (nodeId, rawData) => {
        const x6Node = getX6Node(nodeId)
        const currData = x6Node.getData()
        const newData = {
            ...currData,
            ...rawData,
        }
        nodes.value = nodes.value.map((n) => {
            if (n.id !== nodeId) return n
            return { ...n, data: newData }
        })
    }

    // getNodeToTranslatePos
    const getNodeToTranslatePos = (nodeToTranslate) => {
        const { x: nttXPos } = nodeToTranslate.position()
        const allXPos = getAllXPos()
        const allXPosValue = allXPos[nttXPos]
        const nttOrder = nodeToTranslate.store.data._order
        const nttOrderIndex = allXPosValue.findIndex((x) => x === nttOrder)
        const orderOfNodeToFind = allXPosValue[nttOrderIndex - 1]

        const nodePrev = graph.value.getNodes().find((n) => {
            const { x: nXPos } = n.position()
            const nOrder = n.store.data._order
            if (nXPos !== nttXPos) return false
            return nOrder === orderOfNodeToFind
        })

        const { y: y2 } = nodePrev.position()
        const nodePrevPortsLength = getNodePorts(nodePrev).length + 1
        const portsLengthTotal = nodePrevPortsLength * 43
        const newY = y2 + 133 + portsLengthTotal

        return { nttXPos, newY }
    }

    // fetchNodeLineage
    const fetchNodeLineage = (guid) => {
        const cell = graph.value.getCellById(guid)
        const isLeafNode = graph.value.isLeafNode(cell)
        const nodeConfig = computed(() => ({
            depth: 1,
            guid,
            direction: isLeafNode ? 'OUTPUT' : 'INPUT',
            hideProcess: true,
            allowDeletedProcess: false,
            entityFilters: {
                attributeName: '__state',
                operator: 'eq',
                attributeValue: 'ACTIVE',
            },
            attributes: LineageAttributes,
        }))

        const n = getX6Node(guid)
        const { data, error } = useFetchLineage(nodeConfig, true)
        const lineageDirection = nodeConfig.value.direction
        const path = lineageDirection === 'OUTPUT' ? 'right' : 'left'

        watchOnce(error, () => {
            handleError(error.value)

            if (Object.keys(actions.value).length) {
                Object.entries(actions.value).forEach(([k, v]) => {
                    if (k === 'selectNode') {
                        selectNode(v)
                        delete actions.value[k]
                    }
                    if (k === 'selectNodeEdge') {
                        const edge = getX6Edge(v)
                        controlEdgeAnimation(edge)
                        selectNodeEdge(v, edge)
                        delete actions.value[k]
                    }
                    if (k === 'selectPort') {
                        const nodeId = v?.nodeId
                        const node = getX6Node(nodeId)
                        fetchNodePorts(node)
                        // TODO: persist port lineage
                    }
                })
            } else {
                if (path === 'right')
                    n.updateData({
                        ctaRightLoading: false,
                    })
                if (path === 'left')
                    n.updateData({
                        ctaLeftLoading: false,
                    })
            }
        })

        watchOnce(data, () => {
            const { guidEntityMap: gem1 } = mergedLineageData.value
            const { guidEntityMap: gem2, relations: rel2 } = data.value
            const keys1 = Object.keys(gem1)
            const keys2 = Object.keys(gem2)

            if (keys2.length > 1) {
                const guidOfHiddenNode = keys2.find(
                    (x) => x !== guid && keys1.includes(x)
                )

                const { isHidden, type, node } = isNodeHidden(
                    guidOfHiddenNode,
                    false
                )

                if (guidOfHiddenNode && isHidden) {
                    const prefix =
                        type === 'sameSourceCount' ? 'vpNodeSS' : 'vpNodeST'
                    const vpNodeId = `${prefix}-${node}`
                    const x6Node = getX6Node(vpNodeId)
                    selectVpNode(x6Node, [guidOfHiddenNode])
                    resetState(true)
                }

                addSubGraph(data.value)
                depthCounter.value += 1
            } else {
                const isCircularLineage = keys2.length === 1 && rel2.length
                message.info(
                    `${
                        isCircularLineage
                            ? 'Circular lineage'
                            : 'No lineage to show'
                    }`
                )

                updateNodeRawData(n.id, { disableCta: true })

                if (path === 'right') {
                    n.updateData({
                        disableCta: true,
                        ctaRightIcon: '',
                        ctaRightId: '',
                        ctaRightLoading: false,
                    })
                }
                if (path === 'left') {
                    n.updateData({
                        disableCta: true,
                        ctaLeftIcon: '',
                        ctaLeftId: '',
                        ctaLeftLoading: false,
                    })
                }
            }

            if (Object.keys(actions.value).length) {
                Object.entries(actions.value).forEach(([k, v]) => {
                    if (k === 'selectNode') {
                        selectNode(v)
                        delete actions.value[k]
                    }
                    if (k === 'selectNodeEdge') {
                        const edge = getX6Edge(v)
                        controlEdgeAnimation(edge)
                        selectNodeEdge(v, edge)
                        delete actions.value[k]
                    }
                    if (k === 'selectPort') {
                        const nodeId = v?.nodeId
                        const x6Node = getX6Node(nodeId)
                        fetchNodePorts(x6Node)
                        // TODO: persist port lineage
                    }
                })
            }
            controlPrefRetainer()
        })
    }

    // fetchNodePorts
    const fetchNodePorts = (node, offset = 0) => {
        if (offset === 0) controlPortsLoader(node, true, 'list')
        else controlPortsLoader(node, true, 'showMore')

        if (lineageStore.hasPortsList(node.id) && offset === 0) {
            const { ports: p, total: t } = lineageStore.getNodesPortList(
                node.id
            )
            addPorts(node, p, false, {
                portsCount: t,
            })
            removeShowMorePort(node)
            if (p.length < t) addShowMorePort(node)
            translateSubsequentNodes(node)
            controlPortsLoader(node, false)
            return
        }

        const asset = node.store.data.entity
        const { typeName, attributes } = asset
        const { qualifiedName } = attributes
        const { list, count, error } = fetchPorts(
            typeName,
            qualifiedName,
            offset
        )

        watchOnce(error, () => {
            handleError(error.value)
            controlPortsLoader(node, false)
        })

        watchOnce(
            list,
            () => {
                const total = count.value || 0
                const ports = list.value

                if (ports.length) {
                    const overrideExp = offset !== 0
                    addPorts(node, ports, overrideExp, {
                        portsCount: total,
                    })

                    const newPorts = []

                    if (lineageStore.hasPortsList(node.id)) {
                        const { ports: p } = lineageStore.getNodesPortList(
                            node.id
                        )
                        newPorts.push(...p)
                    }

                    newPorts.push(...ports)
                    const portsLength = newPorts.length

                    lineageStore.setNodesPortsList(
                        node.id,
                        newPorts,
                        offset,
                        total
                    )

                    if (portsLength < total) addShowMorePort(node)
                    else removeShowMorePort(node)

                    translateSubsequentNodes(node)

                    if (Object.keys(actions.value).length) {
                        Object.entries(actions.value).forEach(([k, v]) => {
                            if (k === 'selectPort') {
                                const portId = v
                                if (!portId) return
                                selectPort(node, portId, true)
                                delete actions.value[k]
                            }
                        })
                    }
                } else
                    message.info(
                        `No ${getNodePortLabel(
                            node
                        )} with lineage found for this node`
                    )

                controlPortsLoader(node, false)
            },
            { deep: true }
        )
    }

    // translateSubsequentNodes
    const translateSubsequentNodes = (node) => {
        const { x } = node.position()

        const nodesToTranslate = graph.value.getNodes().filter((n) => {
            const { x: x2 } = n.position()
            if (
                x === x2 &&
                n.store.data._order > node.store.data._order &&
                n.id !== node.id
            )
                return n
            return false
        })

        nodesToTranslate.sort(
            (a, b) => Number(a.store.data._order) - Number(b.store.data._order)
        )

        nodesToTranslate.forEach((ntt) => {
            const { nttXPos, newY } = getNodeToTranslatePos(ntt)

            ntt.position(nttXPos, newY)

            if (nodesTranslated.value[node.id]) {
                const itExists = nodesTranslated.value[node.id].some(
                    (y) => y.id === ntt.id
                )
                if (!itExists) nodesTranslated.value[node.id].push(ntt)
            } else nodesTranslated.value[node.id] = [ntt]
        })
    }

    // computeDataForPortLineage
    const computeDataForPortLineage = (node, portId, data) => {
        const portLineage = data?.value || data
        if (!portLineage?.relations.length) {
            controlPortsLoader(node, false, 'item')
            message.info(
                `There is no lineage data available for the selected ${getNodePortLabel(
                    node
                )}`
            )
            resetSelectedPort()
            return
        }

        if (!lineageStore.hasPortLineage(portId)) {
            lineageStore.setPortLineage(portId, portLineage)
            currPortLineage.value = portLineage
        }

        const { guidEntityMap } = portLineage
        let nodesToMakeVisible = {}
        let nodesForPortLineage = {}

        const allNodesQN = getAllNodesQN()
        const addNodesForPortLineage = (guid, pd, isPortToPort = true) => {
            const portData = { ...pd, isPortToPort }
            portData.highlight = true
            if (nodesForPortLineage[guid])
                nodesForPortLineage[guid].push(portData)
            else
                nodesForPortLineage = {
                    ...nodesForPortLineage,
                    [guid]: [portData],
                }
        }

        Object.entries(guidEntityMap).forEach(([k, v]) => {
            if (isPortTypeName(v.typeName) && k !== portId) {
                const parentName = getNodeQN(v?.attributes?.qualifiedName)
                const parentNode = Object.values(
                    mergedLineageData.value.guidEntityMap
                ).find((x) => x.attributes.qualifiedName === parentName)

                if (!parentNode) return

                const { guid } = parentNode

                const { isHidden, type, node: nn } = isNodeHidden(guid, false)

                if (isHidden) {
                    const prefix =
                        type === 'sameSourceCount' ? 'vpNodeSS' : 'vpNodeST'
                    const vpNodeId = `${prefix}-${nn}`
                    if (nodesToMakeVisible[vpNodeId]) {
                        const exist = nodesToMakeVisible[vpNodeId].find(
                            (x) => x === guid
                        )
                        if (!exist) nodesToMakeVisible[vpNodeId].push(guid)
                    } else
                        nodesToMakeVisible = {
                            ...nodesToMakeVisible,
                            [vpNodeId]: [guid],
                        }

                    addNodesForPortLineage(guid, v)
                } else if (allNodesQN.includes(parentName))
                    addNodesForPortLineage(guid, v)
            } else if (!isPortTypeName(v.typeName)) {
                const { isHidden, type, node: nn } = isNodeHidden(v.guid, false)

                if (isHidden) {
                    const prefix =
                        type === 'sameSourceCount' ? 'vpNodeSS' : 'vpNodeST'
                    const vpNodeId = `${prefix}-${nn}`
                    nodesToMakeVisible = {
                        ...nodesToMakeVisible,
                        [vpNodeId]: [v.guid],
                    }
                }
                addNodesForPortLineage(v.guid, v, false)
            }
        })

        if (Object.keys(nodesToMakeVisible).length) {
            Object.entries(nodesToMakeVisible).forEach(([k, v], i, a) => {
                const vpNode = getX6Node(k)
                selectVpNode(vpNode, v)

                if (i === a.length - 1) {
                    const _node = graph.value
                        .getNodes()
                        .find((x) => x.id === node.id)
                    if (lineageStore.hasPortsList(_node.id)) {
                        const { ports: p, total: t } =
                            lineageStore.getNodesPortList(_node.id)
                        removePorts(_node)
                        addPorts(_node, p)
                        removeShowMorePort(_node)
                        if (p.length < t) addShowMorePort(_node)
                    } else {
                        const port = portLineage.guidEntityMap[portId]
                        addPorts(_node, [port])
                    }
                    translateSubsequentNodes(_node)
                    selectPort(_node, portId, false)
                    addLineagePorts(nodesForPortLineage, portLineage)
                }
            })
        } else addLineagePorts(nodesForPortLineage, portLineage)

        if (isPortEdgesPresent()) {
            const parentNode = getPortNode(portId)
            fit(parentNode.id)
        }

        controlPortsLoader(node, false, 'item')
    }

    // fetchPortLineage
    const fetchPortLineage = (node, portId) => {
        if (lineageStore.hasPortLineage(portId)) {
            const data = lineageStore.getPortsLineage(portId)
            currPortLineage.value = data
            computeDataForPortLineage(node, portId, data)
            return
        }

        const config = computed(() => ({
            depth: depthCounter.value * 2,
            guid: portId,
            direction: 'BOTH',
            attributes: LineageAttributesPortLevel,
            hideProcess: true,
        }))

        const { data, error } = useFetchLineage(config, true)

        watchOnce(error, () => {
            handleError(error.value)
            controlPortsLoader(node, false, 'item')
        })

        watchOnce(data, () => {
            computeDataForPortLineage(node, portId, data)
        })
    }

    //  getPortNode
    const getPortNode = (portId) => {
        if (portId.includes('invisiblePort')) {
            const id = portId.split('-').slice(0, 5).join('-')
            return { id }
        }
        return graph.value.getNodes().find((x) => x.hasPort(portId))
    }

    // controlPortsLoader
    const controlPortsLoader = (node, show, type = 'list') => {
        if (!show) {
            node.updateData({
                portsListLoading: show,
                portItemLoading: show,
                portShowMoreLoading: show,
            })
        } else {
            if (type === 'list')
                node.updateData({
                    portsListLoading: show,
                })
            if (type === 'item')
                node.updateData({
                    portItemLoading: show,
                })
            if (type === 'showMore') {
                node.updateData({
                    portShowMoreLoading: show,
                })
            }
        }
    }

    // removePorts
    const removePorts = (node, options = {}) => {
        if (selectedPortIdNext.value && node.hasPort(selectedPortIdNext.value))
            return

        removeX6Ports(node)

        node.updateData({
            ports: [],
            portsListExpanded: false,
            ...options,
        })
        const index = expandedNodes.value.findIndex((x) => x === node.id)
        expandedNodes.value.splice(index, 1)
    }

    // removeX6Ports
    const removeX6Ports = (node) => {
        const { ports } = node.getData()
        const portsPortData = ports.map((x) => ({
            id: x.guid,
            group: 'portsList',
            zIndex: 0,
        }))
        node.removePorts(portsPortData)
    }

    // addPorts
    const addPorts = (node, newPorts, overrideExp?, options = {}) => {
        const { ports } = node.getData()
        const mergedPorts = [...ports, ...newPorts]
        const uniquePorts = []

        mergedPorts.forEach((x) => {
            if (!x.guid) return
            const exist = uniquePorts.find((y) => y.guid === x.guid)
            if (!exist) uniquePorts.push(x)
        })

        node.updateData({
            ports: uniquePorts,
            portsListExpanded: true,
            ...options,
        })

        if (!overrideExp || !isExpandedNode(node.id))
            expandedNodes.value.push(node.id)

        addX6Ports(node, uniquePorts)
    }

    // addX6Ports
    const addX6Ports = (node, p) => {
        const ports = p.filter((x) => x.guid)
        const portsPortData = ports
            .filter((x) => !node.hasPort(x.guid))
            .map((x) => ({
                id: x.guid,
                group: 'portsList',
                zIndex: 0,
            }))
        node.addPorts(portsPortData)
    }

    // addShowMorePort
    const addShowMorePort = (node) => {
        const { ports } = node.getData()
        const filtered = ports.filter(
            (x) => !x?.typeName.includes('showMorePort')
        )
        const showMorePort = { typeName: 'showMorePort' }
        node.updateData({
            ports: [...filtered, showMorePort],
        })
    }

    // removeShowMorePort
    const removeShowMorePort = (node) => {
        const { ports } = node.getData()
        const filtered = ports.filter(
            (x) => !x?.typeName.includes('showMorePort')
        )
        node.updateData({
            ports: filtered,
        })
    }

    // selectPort
    const selectPort = (node, portId, fetchLineage = true) => {
        const { ports } = node.getData()
        const portEntity = ports.find((x) => x.guid === portId)
        const portIndex = ports.indexOf(portEntity)

        node.updateData({ selectedPortId: portId })

        if (portEntity) {
            onSelectAsset(portEntity)
            selectedPortId.value = portId
            lineageStore.setSelectedPortId(portId)
            if (fetchLineage) {
                controlPortsLoader(node, true, 'item')
                fetchPortLineage(node, portId)
            }
        }
    }

    // selectPortEdge
    const selectPortEdge = (edgeId, edge) => {
        // Handle Event - lineage_process_clicked
        sendProcessClickedEvent(
            !!edge?.data?.isGroupEdge,
            !!edge?.data?.isCyclicEdge,
            edgeId
        )

        const processId = edgeId.split('/')[1]
        onSelectAsset({ guid: processId })

        if (edgeId) selectedPortEdgeId.value = edgeId
    }

    // getAllNodesQN
    const getAllNodesQN = () => {
        const res = graph.value
            .getNodes()
            .map((x) => x?.store?.data?.entity?.attributes?.qualifiedName)
        return res
    }

    // controlShowMorePort
    const controlShowMorePort = (node) => {
        if (!node) return

        const { id } = node
        if (!lineageStore.hasPortsList(id)) return

        const { ports: p, total: t } = lineageStore.getNodesPortList(id)

        if (p.length < t) addShowMorePort(node)
        if (p.length >= t) removeShowMorePort(node)
    }

    // addLineagePorts
    const addLineagePorts = (nodesForPortLineage, portLineage) => {
        dimNodesEdges(true)

        const { guidEntityMap, relations } = portLineage
        const filteredRelations = getFilteredRelations(relations)

        Object.entries(nodesForPortLineage).forEach(([k, ports]) => {
            const parentNode = getX6Node(k)
            if (!parentNode) return

            const { hasPorts } = parentNode.getData()
            if (!hasPorts) return

            const highlightPorts = ports.map((p) => p.guid)

            const portsToAdd = [...ports]

            if (lineageStore.hasPortsList(parentNode.id)) {
                const { ports: p } = lineageStore.getNodesPortList(
                    parentNode.id
                )
                portsToAdd.push(...p)
            }
            addPorts(parentNode, portsToAdd, false, {
                highlightPorts,
            })

            controlShowMorePort(parentNode)
        })

        const fromToSet = new Set()
        Object.values(nodesForPortLineage).forEach((ports) => {
            graph.value.freeze('addPortEdges')
            ports.forEach((port) => {
                const rels = filteredRelations.filter((y) => {
                    const { fromEntityId, toEntityId } = y
                    const fromToId = `${fromEntityId}@${toEntityId}`
                    if (fromToSet.has(fromToId)) return false
                    if ([fromEntityId, toEntityId].includes(port.guid)) {
                        fromToSet.add(fromToId)
                        return true
                    }
                    return false
                })

                if (rels.length)
                    rels.forEach((r) => {
                        addPortEdge(r, guidEntityMap)
                    })
            })
            graph.value.unfreeze('addPortEdges')
        })

        const selectedPortNode = getPortNode(selectedPortId.value)
        graph.value.getNodes().forEach((n) => {
            const { ports } = n.getData()
            if (ports.length && selectedPortNode.id !== n.id)
                translateSubsequentNodes(n)
        })

        if (!isPortEdgesPresent()) {
            // TODO: rename "port" to appropriate label
            message.info(
                'There are no related assets present on the graph for the selected port'
            )
            resetSelectedPort()
        } else {
            // controlCyclicEdges(graph, relations, 'port')
            controlGroupedEdges(graph, relations, 'port')
        }
    }

    // addPortEdge
    const addPortEdge = (relation, guidEntityMap = {}, mode = '') => {
        const getTypeName = (guid) => guidEntityMap[guid]?.typeName

        const { fromEntityId, toEntityId, processId } = relation

        const sourceTypeName = guidEntityMap ? getTypeName(fromEntityId) : null
        const targetTypeName = guidEntityMap ? getTypeName(toEntityId) : null

        let sourceCell = ''
        let sourcePort = ''
        let targetCell = ''
        let targetPort = ''

        const isPortToPort =
            isPortTypeName(sourceTypeName) && isPortTypeName(targetTypeName)

        const isPortToNode =
            isPortTypeName(sourceTypeName) && !isPortTypeName(targetTypeName)

        const isNodeToPort =
            !isPortTypeName(sourceTypeName) && isPortTypeName(targetTypeName)

        const isNodeToNode =
            !isPortTypeName(sourceTypeName) && !isPortTypeName(targetTypeName)

        if (isPortToPort || mode === 'port>port') {
            sourceCell = getPortNode(fromEntityId)?.id
            sourcePort = fromEntityId
            targetCell = getPortNode(toEntityId)?.id
            targetPort = toEntityId

            if (!getX6Node(sourceCell) || !getX6Node(targetCell)) return
        }

        if (isPortToNode || mode === 'port>node') {
            sourceCell = getPortNode(fromEntityId)?.id
            sourcePort = fromEntityId
            targetCell = toEntityId
            targetPort = `${toEntityId}-invisiblePort`

            if (!getX6Node(sourceCell) || !getX6Node(targetCell)) return

            portHighlightedBINodes.value.push(targetCell)
            highlightNode(targetCell, 'highlight')
        }

        if (isNodeToPort || mode === 'node>port') {
            sourceCell = fromEntityId
            sourcePort = `${fromEntityId}-invisiblePort`
            targetCell = getPortNode(toEntityId)?.id
            targetPort = toEntityId

            if (!getX6Node(sourceCell) || !getX6Node(targetCell)) return

            portHighlightedBINodes.value.push(sourceCell)
            highlightNode(sourceCell, 'highlight')
        }

        if (isNodeToNode || mode === 'node>node') {
            const edge = graph.value.getEdges().find((e) => {
                if (e.id.includes('port')) return false
                const [source, target] = e.id.split('/')[1].split('@')

                if (source === fromEntityId && target === toEntityId)
                    return true
                return false
            })

            edge.attr('line/stroke', '#3c71df')
            edge.attr('line/targetMarker/stroke', '#3c71df')

            targetCell = toEntityId

            portHighlightedBINodes.value.push(targetCell)
            highlightNode(targetCell, 'highlight')

            return
        }

        if (!(sourceCell && sourcePort && targetCell && targetPort)) return

        const sanitizedRelation = {
            id: `port/${processId}/${fromEntityId}@${toEntityId}`,
            sourceCell,
            sourcePort,
            targetCell,
            targetPort,
        }

        addEdge(
            sanitizedRelation,
            {
                stroke: '#3c71df',
                arrowSize: preferences.showArrow ? 12 : 0.1,
            },
            {}
        )
    }

    /** Controls */
    // controlPortClickEvent
    const controlPortClickEvent = (e, yyy) =>
        getEventPath(e).find((x) =>
            typeof x === 'object' && x !== null && 'getAttribute' in x
                ? x?.getAttribute(yyy)
                : ''
        )

    // controlCaret
    const controlCaret = (node) => {
        if (
            selectedPortId.value &&
            (isNodePortInCurrPortLineage(node.id) ||
                activeNodesToggled.value[node.id])
        )
            return

        const nodeData = node?.store?.data

        if (isExpandedNode(node.id)) {
            // Handle Event - lineage_node_collapsed
            sendNodeExpandedEvent(
                nodeData?.data?.portsCount,
                node.id,
                'collapsed'
            )

            removePorts(node)
            resetNodeTranslatedNodes(node)
        } else {
            // TODO: Handle Event - lineage_node_expanded

            sendNodeExpandedEvent(
                nodeData?.data?.portsCount,
                node.id,
                'expanded'
            )

            fetchNodePorts(node)
        }
    }

    // controlHoPaCTALoader
    const controlHoPaCTALoader = (node, portId) => {
        const path = portId.includes('ctaRight') ? 'right' : 'left'
        if (path === 'right') node.updateData({ ctaRightLoading: true })
        if (path === 'left') node.updateData({ ctaLeftLoading: true })
    }

    // controlHoriPagiCTA
    const controlHoriPagiCTA = (node, portId) => {
        if (isGraphLoading.value) return

        if (selectedNodeId.value) controlSelectedNodeAction(node, portId)
        else if (selectedNodeEdgeId.value)
            controlSelectedNodeEdgeAction(node, portId)
        else if (selectedPortId.value) {
            controlSelectedPortAction(node, portId)
        } else {
            resetState(true)
            controlHoPaCTALoader(node, portId)
            fetchNodeLineage(node.id)
        }
    }

    // controlHoriToggleCTA
    const controlHoriToggleCTA = (node, portId) => {
        let newState = ''
        const path = portId.includes('ctaRight') ? 'right' : 'left'
        const { predecessors, successors } = useGetNodes(graph, node.id)
        const nodesToToggle = graph.value
            .getNodes()
            .filter((n) =>
                path === 'right'
                    ? successors.includes(n.id)
                    : predecessors.includes(n.id)
            )

        graph.value.freeze('controlHoriToggleCTA')
        nodesToToggle.forEach((n) => {
            const cell = graph.value.getCellById(n.id)
            let shouldToggle = true

            Object.entries(portToggledNodes.value).forEach(([k, v]) => {
                if (v.includes(n.id) && k !== node.id) shouldToggle = false
            })

            if (!shouldToggle) return

            if (!newState && cell.isVisible()) newState = 'exp'
            if (!newState && !cell.isVisible()) newState = 'col'
            cell.toggleVisible()

            if (newState === 'col') setBack(n)
        })
        graph.value.unfreeze('controlHoriToggleCTA')

        if (newState === 'exp') {
            portToggledNodes.value = {
                ...portToggledNodes.value,
                [node.id]: nodesToToggle.map((x) => x.id),
            }
        } else delete portToggledNodes.value[node.id]

        if (path === 'right')
            node.updateData({
                ctaRightIcon: newState,
            })
        if (path === 'left')
            node.updateData({
                ctaLeftIcon: newState,
            })

        if (!selectedPortId.value && newState === 'col') {
            graph.value
                .getEdges()
                .filter((edge) =>
                    path === 'right'
                        ? edge.getSourceNode().id === node.id
                        : edge.getTargetNode().id === node.id
                )
                .forEach((edge) => {
                    setBack(edge)
                })
        }

        if (selectedPortId.value)
            graph.value
                .getEdges()
                .filter((edge) => edge.id.includes('port'))
                .forEach((edge) => {
                    setFront(edge)
                })

        setFront(node)
    }

    // controlEdgeAnimation
    const controlEdgeAnimation = (edge, animate = true) => {
        if (!edge) return

        const isCyclicEdge = edge.store.data.data?.isCyclicEdge
        const isPortEdge = !!edge.id.includes('port')
        const isHighlightedEdge = nodesEdgesHighlighted.value.find(
            (e) => e === edge.id
        )

        const defaultStateColor = isCyclicEdge ? '#F4B444' : '#B2B8C7'
        const highlightStateColor = isCyclicEdge ? '#F4B444' : '#3c71df'

        const nodeEdgeDefaultStroke =
            // eslint-disable-next-line no-nested-ternary
            selectedNodeId.value || selectedNodeEdgeId.value
                ? isHighlightedEdge
                    ? highlightStateColor
                    : '#dce0e5'
                : defaultStateColor
        const portEdgeDefaultStroke = '#3c71df'
        const edgeDefaultStroke = isPortEdge
            ? portEdgeDefaultStroke
            : nodeEdgeDefaultStroke

        if (!isCyclicEdge) {
            edge.attr('line/strokeWidth', animate ? 2 : 1.6)
            edge.attr('line/strokeDasharray', animate ? 5 : 0)
            edge.attr(
                'line/stroke',
                animate ? highlightStateColor : edgeDefaultStroke
            )
            edge.attr(
                'line/style/animation',
                animate ? 'ant-line 30s infinite linear' : 'unset'
            )
            edge.attr(
                'line/targetMarker/stroke',
                animate ? highlightStateColor : edgeDefaultStroke
            )
            if (animate) setFront(edge)
            else if (!isPortEdge && !isHighlightedEdge) setBack(edge)
        }

        edge.setLabels(
            edge.getLabels().map((lbl) => ({
                attrs: {
                    label: {
                        fill: animate ? highlightStateColor : 'none',
                        text: lbl.attrs.label.text,
                    },
                    body: {
                        fill: animate ? '#ffffff' : 'none',
                        stroke: animate ? highlightStateColor : 'none',
                    },
                },
            }))
        )
    }

    // controlSelectedNodeAction
    const controlSelectedNodeAction = (node, portId) => {
        const _selectedNodeId = selectedNodeId.value

        if (!portId) {
            selectVpNode(node)
            resetState(true)
            selectNode(_selectedNodeId)
        } else {
            const newAction = { selectNode: _selectedNodeId }
            actions.value = { ...actions.value, ...newAction }

            resetState(true)
            controlHoPaCTALoader(node, portId)
            fetchNodeLineage(node.id)
        }
    }

    // controlSelectedNodeEdgeAction
    const controlSelectedNodeEdgeAction = (node, portId) => {
        const _selectedNodeEdgeId = selectedNodeEdgeId.value

        if (!portId) {
            selectVpNode(node)
            resetState(true)
            const edge = getX6Edge(_selectedNodeEdgeId)
            controlEdgeAnimation(edge)
            selectNodeEdge(_selectedNodeEdgeId, edge)
        } else {
            const newAction = { selectNodeEdge: _selectedNodeEdgeId }
            actions.value = { ...actions.value, ...newAction }

            resetState(true)
            controlHoPaCTALoader(node, portId)
            fetchNodeLineage(node.id)
        }
    }

    // controlSelectedPortAction
    const controlSelectedPortAction = (node, portId) => {
        const _selectedPortId = selectedPortId.value
        const _parentNodeId = getPortNode(_selectedPortId)?.id

        if (!portId) {
            selectVpNode(node)
            resetState()

            const parentNode = getX6Node(_parentNodeId)
            const { ports: p, total: t } = lineageStore.getNodesPortList(
                parentNode.id
            )

            addPorts(parentNode, p, false, {
                portsCount: t,
            })
            removeShowMorePort(parentNode)
            if (p.length < t) addShowMorePort(parentNode)

            translateSubsequentNodes(parentNode)
            selectPort(parentNode, _selectedPortId)
        } else {
            const newAction = {
                selectPort: { nodeId: node.id, portId: _selectedPortId },
            }
            actions.value = { ...actions.value, ...newAction }

            resetState(true)
            controlHoPaCTALoader(node, portId)
            fetchNodeLineage(node.id)
        }
    }

    /** Resets */
    // resetSelectedNode
    const resetSelectedNode = () => {
        nodesEdgesHighlighted.value = []
        selectedNodeId.value = ''
        lineageStore.setSelectedNodeId('')
        selectNode(null)
    }

    // resetSelectedNodeEdge
    const resetSelectedNodeEdge = () => {
        const edge = getX6Edge(selectedNodeEdgeId.value)
        controlEdgeAnimation(edge, false)
        nodesEdgesHighlighted.value = []
        selectedNodeEdgeId.value = ''
        selectNode(null)
    }

    // resetSelectedPort
    const resetSelectedPort = () => {
        portHighlightedBINodes.value.forEach((nodeId) => {
            const portEdges = graph.value
                .getEdges()
                .filter((x) => x.id.includes('port'))
            portEdges.forEach((x) => {
                const [sourceId, targetId] = x.id.split('/')[2].split('@')

                if (sourceId === selectedPortId.value && targetId === nodeId)
                    graph.value.removeCell(x.id)
            })
            highlightNode(nodeId, 'reset')
        })

        const _expandedNodes = [...expandedNodes.value]
        _expandedNodes.forEach((nodeId) => {
            const x6Node = getX6Node(nodeId)
            if (lineageStore.hasPortsList(x6Node?.id)) {
                graph.value
                    .getEdges()
                    .filter((edge) => edge.id.includes('port'))
                    .forEach((edge) => {
                        const cell = graph.value.getCellById(edge.id)
                        cell.remove()
                    })
                x6Node.updateData({
                    highlightPorts: [],
                    selectedPortId: '',
                })
            } else {
                removePorts(x6Node, {
                    portsCount: null,
                    highlightPorts: [],
                })
                resetNodeTranslatedNodes(x6Node)
            }
        })

        selectedPortId.value = ''
        lineageStore.setSelectedPortId('')
        activeNodesToggled.value = {}
        portHighlightedBINodes.value = []
        currPortLineage.value = {}

        dimNodesEdges(false)
    }

    // resetSelectedPortEdge
    const resetSelectedPortEdge = () => {
        const edge = getX6Edge(selectedPortEdgeId.value)
        controlEdgeAnimation(edge, false)
        selectedPortEdgeId.value = ''
    }

    // resetState
    const resetState = (all?) => {
        onCloseDrawer()
        if (selectedNodeId.value) resetSelectedNode()
        else if (selectedNodeEdgeId.value) resetSelectedNodeEdge()
        else if (selectedPortId.value || selectedPortEdgeId.value) {
            if (selectedPortId.value) resetSelectedPort()
            if (selectedPortEdgeId.value) resetSelectedPortEdge()
        }

        if (all) {
            const _expandedNodes = [...expandedNodes.value]
            _expandedNodes.forEach((nodeId) => {
                const x6Node = getX6Node(nodeId)
                removePorts(x6Node)
                resetNodeTranslatedNodes(x6Node)
            })
            lineageStore.setNodesPortsList(null)
            lineageStore.setPortLineage(null)
        }
    }

    //  resetNodeTranslatedNodes
    const resetNodeTranslatedNodes = (x) => {
        if (!nodesTranslated.value?.[x.id]) return
        const nodesToTranslate = nodesTranslated.value?.[x.id] || []
        nodesToTranslate.forEach((nodeToTranslate) => {
            const { nttXPos, newY } = getNodeToTranslatePos(nodeToTranslate)
            nodeToTranslate.position(nttXPos, newY)
        })
        delete nodesTranslated.value?.[x.id]
    }

    /** EVENTS */
    // Cell - Mousewheel
    graph.value.on('cell:mousewheel', () => {
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })

    // Node - Mouseup
    graph.value.on('node:mouseup', ({ e, node }) => {
        if (isGraphLoading.value) return

        if (controlPortClickEvent(e, 'isctaleft')) {
            const ele = controlPortClickEvent(e, 'isctaleft')
            const portId = ele.getAttribute('isctaleft')
            if (portId.includes('-hoTo')) controlHoriToggleCTA(node, portId)
            if (portId.includes('-hoPa')) controlHoriPagiCTA(node, portId)
            return
        }

        if (controlPortClickEvent(e, 'isctaright')) {
            const ele = controlPortClickEvent(e, 'isctaright')
            const portId = ele.getAttribute('isctaright')
            if (portId.includes('-hoTo')) controlHoriToggleCTA(node, portId)
            if (portId.includes('-hoPa')) controlHoriPagiCTA(node, portId)
            return
        }

        if (controlPortClickEvent(e, 'isportlist')) {
            controlCaret(node)
            return
        }

        if (controlPortClickEvent(e, 'isportitem')) {
            const ele = controlPortClickEvent(e, 'isportitem')
            const portId = ele.getAttribute('isportitem')

            if (portId === selectedPortId.value) {
                resetState()
            } else {
                const { ports, portsCount } = node.getData()
                const portEntity = ports.find((x) => x.guid === portId)
                const portIndex = ports.findIndex((x) => x.guid === portId)

                if (!portsCount) selectedPortIdNext.value = portId

                resetState()

                if (!portsCount) {
                    const newAction = { selectPort: portId }
                    actions.value = { ...actions.value, ...newAction }
                    node.updateData({ highlightPorts: [] })
                    fetchNodePorts(node)
                    return
                }

                // Handle Event - lineage_sub_node_clicked
                sendSubNodeClickedEvent(
                    portEntity.typeName?.toLowerCase(),
                    portEntity.attributes?.connectorName ||
                        portEntity.attributes?.qualifiedName?.split('/')[1],
                    portIndex,
                    node.id
                )

                selectPort(node, portId, true)
            }
            return
        }

        if (controlPortClickEvent(e, 'isportshowmore')) {
            const { ports } = lineageStore.getNodesPortList(node.id)
            const newOffset = ports.length

            // Handle Event - lineage_sub_node_show_more
            sendSubNodeShowMoreEvent(
                ports.at(-1)?.typeName === 'showMorePort'
                    ? ports.length - 1
                    : ports?.length,
                5,
                node.id
            )

            fetchNodePorts(node, newOffset)
            return
        }

        // Handle Event - lineage_node_clicked
        const nodeEntity = node?.store?.data?.entity

        if (nodeEntity) {
            sendNodeClickedEvent(
                nodeEntity.typeName,
                nodeEntity.attributes?.qualifiedName?.split('/')[1],
                node.id
            )
        }

        if (node.id.includes('vpNode')) {
            if (selectedNodeId.value) controlSelectedNodeAction(node, null)
            else if (selectedNodeEdgeId.value)
                controlSelectedNodeEdgeAction(node, null)
            else if (selectedPortId.value) controlSelectedPortAction(node, null)
            else {
                selectVpNode(node)
                resetState(true)
            }

            return
        }

        if (node.id === selectedNodeId.value) {
            resetState()
            return
        }

        resetState()

        selectNode(node.id)
    })

    // Edge - Click
    graph.value.on('edge:click', ({ edge }) => {
        if (isGraphLoading.value) return

        if (!isEdgeClickable(edge)) return

        if (edge.id.includes('port')) {
            onCloseDrawer()
            if (edge.id === selectedPortEdgeId.value) {
                resetSelectedPortEdge()
                return
            }
            if (selectedPortEdgeId.value) resetSelectedPortEdge()
        } else if (edge.id === selectedNodeEdgeId.value) {
            resetState()
            return
        } else resetState()

        if (edge.id.includes('port')) selectPortEdge(edge.id, edge)
        else selectNodeEdge(edge.id, edge)
    })

    // Edge - Mouseenter
    graph.value.on('edge:mouseenter', ({ edge }) => {
        if (!isEdgeHoverable(edge)) return
        controlEdgeAnimation(edge)
    })

    // Edge - Mouseleave
    graph.value.on('edge:mouseleave', ({ edge }) => {
        if (!isEdgeHoverable(edge)) return
        if (
            edge.id === selectedNodeEdgeId.value ||
            edge.id === selectedPortEdgeId.value
        )
            return
        controlEdgeAnimation(edge, false)
    })

    // Port - Click
    graph.value.on('port:click', ({ e }) => {
        if (isGraphLoading.value) return
        e.stopPropagation()
    })

    // Blank - Click
    graph.value.on('blank:click', () => {
        if (isGraphLoading.value) return
        resetState()
    })

    // Blank - Mousewheel
    graph.value.on('blank:mousewheel', () => {
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })

    /** WATCHERS */
    watch(
        portToSelect,
        (newVal) => {
            if (isGraphLoading.value) return

            if (!Object.keys(newVal).length) return

            resetState()

            const parentName = getNodeQN(newVal.attributes.qualifiedName)
            const parentNode = graph.value
                .getNodes()
                .find(
                    (x) =>
                        x.store.data.entity.attributes.qualifiedName ===
                        parentName
                )
            const portsToAdd = [newVal]
            if (lineageStore.hasPortsList(parentNode.id)) {
                const { ports: p } = lineageStore.getNodesPortList(
                    parentNode.id
                )
                portsToAdd.push(...p)
            }

            addPorts(parentNode, portsToAdd)
            controlShowMorePort(parentNode)

            translateSubsequentNodes(parentNode)
            selectPort(parentNode, newVal.guid)
        },
        {
            deep: true,
        }
    )

    watch(guidToSelectOnGraph, (newVal) => {
        if (isGraphLoading.value) return

        if (newVal) {
            const { isHidden, type, node } = isNodeHidden(newVal, false)

            if (isHidden) {
                const prefix =
                    type === 'sameSourceCount' ? 'vpNodeSS' : 'vpNodeST'
                const vpNodeId = `${prefix}-${node}`
                const x6Node = getX6Node(vpNodeId)
                selectVpNode(x6Node, [newVal])
                resetState(true)
            } else resetState()

            selectNode(newVal)

            const cell = graph.value.getCellById(newVal)
            graph.value.scrollToCell(cell, { animation: { duration: 600 } })
            guidToSelectOnGraph.value = ''
        }
    })
}
