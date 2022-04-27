/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/** VUE */
import { watch, ref, computed } from 'vue'
import { watchOnce } from '@vueuse/core'

/** PACKAGES */
import { message } from 'ant-design-vue'

/** COMPOSABLES */
import useLineageStore from '~/store/lineage'
import useLineageService from '~/services/meta/lineage/lineage_service'
import useUpdateGraph from './useUpdateGraph'
import useGetNodes from './useGetNodes'
import useGraph from './useGraph'
import fetchPorts from './fetchPorts'

/** CONSTANTS */
import {
    LineageAttributes,
    LineageAttributesPortLevel,
} from '~/constant/projection'

/** UTILS */
import { isCyclicEdge, getFilteredRelations } from './util.js'

export default function useEventGraph({
    graph,
    currZoom,
    preferences,
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

    /** DATA */
    const selectedNodeId = ref('')
    const selectedNodeEdgeId = ref('')
    const selectedPortId = ref('')
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
    const colToggledNodes = ref({})

    /** METHODS */
    /** Utils */
    // handleError
    const handleError = (err) => {
        let msg = err.message
        const status = err?.response?.status

        if (status === 403) msg = "Sorry, you don't have access to this asset"

        message.error(msg)
    }

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

    // isNodeRendered
    const isNodeRendered = (nodeId) =>
        graph.value.getNodes().find((x) => x.id === nodeId)

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
        ]
        return typeNames.includes(typeName)
    }

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

        if (guid) selectedNodeId.value = guid

        if (isCyclicRelation) {
            highlightNode(selectedNodeId.value, 'select')
            return
        }

        const nodesToHighlight = getNodesToHighlight(selectedNodeId)

        highlightNodes(selectedNodeId, nodesToHighlight)
        nodesEdgesHighlighted.value = highlightEdges(nodesToHighlight)
    }

    // selectNodeEdge
    const selectNodeEdge = (edgeId) => {
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
    const selectVpNode = (node, nodeIdsToAdd: string[] = []) => {
        const nodeIdArr = node.id.split('-')
        nodeIdArr.splice(0, 1)
        const id = nodeIdArr.join('-')
        const identifier = node.id.split('-').splice(0, 1)[0]
        const mode = identifier.includes('vpNodeSS')
            ? 'sameSource'
            : 'sameTarget'

        const hidden =
            mode === 'sameSource'
                ? sameSourceCount.value?.[id]?.targetsHidden
                : sameTargetCount.value?.[id]?.sourcesHidden

        let entitiesHidden = [...hidden]

        const handleNodeIdsToAdd = (nita) => {
            const nh = entitiesHidden.filter((x) => !nita.includes(x.guid))
            const nta = entitiesHidden.filter((x) => nita.includes(x.guid))
            entitiesHidden = nh
            return nta
        }
        const entitiesToAdd = !nodeIdsToAdd.length
            ? entitiesHidden.splice(0, 4)
            : handleNodeIdsToAdd(nodeIdsToAdd)

        if (mode === 'sameSource')
            sameSourceCount.value[id].targetsHidden = entitiesHidden
        if (mode === 'sameTarget')
            sameTargetCount.value[id].sourcesHidden = entitiesHidden

        const { relations } = mergedLineageData.value

        graph.value.freeze('selectVpNode-entitiesToAdd')
        entitiesToAdd.forEach((ent) => {
            const { nodeData } = createNodeData(ent, null)
            nodes.value.push(nodeData)
            addNode(ent)
        })
        graph.value.unfreeze('selectVpNode-entitiesToAdd')

        const entitiesToAddIds = entitiesToAdd.map((ent) => ent.guid)

        const relsToAdd = relations.filter((rel) => {
            if (mode === 'sameSource')
                return entitiesToAddIds.includes(rel.toEntityId)
            return entitiesToAddIds.includes(rel.fromEntityId)
        })

        graph.value.freeze('selectVpNode-relsToAdd')
        const newRels = getFilteredRelations(relsToAdd)

        newRels.forEach((rel) => {
            const { fromEntityId: from, toEntityId: to, processId } = rel

            if (from === to) return

            const relation = {
                id: `${processId}/${from}@${to}`,
                sourceCell: from,
                sourcePort: `${from}-invisiblePort`,
                targetCell: to,
                targetPort: `${to}-invisiblePort`,
            }

            const exists = edges.value.find((edge) => edge.id === relation.id)

            if (exists) return

            let edgeExtraData = { isDup: !!rel?.isDup }
            const styles = {
                stroke: '#B2B8C7',
            }

            const _isCyclicEdge = isCyclicEdge(mergedLineageData, from, to)

            if (_isCyclicEdge) {
                edgeExtraData = { ...edgeExtraData, isCyclicEdge: true }

                const newSource = mode === 'sameSource' ? to : from
                const newTarget = mode === 'sameSource' ? from : to

                const exist = edges.value.find((x) => {
                    const [f, t] = x.id.split('/')[1].split('@')
                    if (f === newSource && t === newTarget) return true
                    return false
                })

                if (exist) return

                const newRelation = {
                    id: `${processId}/${newSource}@${newTarget}`,
                    sourceCell: newSource,
                    sourcePort: `${newSource}-invisiblePort`,
                    targetCell: newTarget,
                    targetPort: `${newTarget}-invisiblePort`,
                }

                styles.stroke = '#ff4848'
                const { edgeData } = createEdgeData(
                    newRelation,
                    edgeExtraData,
                    styles
                )
                edges.value.push(edgeData)
                addEdge(newRelation)

                lineageStore.setCyclicRelation(`${from}@${to}`)
            }

            const { edgeData } = createEdgeData(relation, edgeExtraData, styles)
            edges.value.push(edgeData)
            addEdge(relation)
        })
        graph.value.unfreeze('selectVpNode-relsToAdd')

        nodes.value = nodes.value.filter((x) => x.id !== node.id)
        edges.value = edges.value.filter((x) => {
            if (mode === 'sameSource')
                return x.id !== `vpNodeProcessId/${id}@${node.id}`
            return x.id !== `vpNodeProcessId/${node.id}@${id}`
        })

        renderLayout()

        if (entitiesHidden.length === 0) return

        // add back vp node
        const entity = node?.store?.data?.entity || node.entity
        const { nodeData } = createNodeData(entity, null)
        nodeData.data.hiddenCount = entitiesHidden.length
        nodes.value.push(nodeData)
        graph.value.freeze('selectVpNode-addVpNode')
        addNode(nodeData.entity)
        graph.value.unfreeze('selectVpNode-addVpNode')

        // add back vp edge
        const from = mode === 'sameSource' ? id : node.id
        const processId = 'vpNodeProcessId'
        const to = mode === 'sameSource' ? node.id : id

        const relation = {
            id: `${processId}/${from}@${to}`,
            sourceCell: from,
            sourcePort: `${from}-invisiblePort`,
            targetCell: to,
            targetPort: `${to}-invisiblePort`,
        }

        const styles = { stroke: '#B2B8C7' }
        const { edgeData } = createEdgeData(relation, {}, styles)
        edges.value.push(edgeData)
        graph.value.freeze('selectVpNode-addVpEdge')
        addEdge(relation)
        graph.value.unfreeze('selectVpNode-addVpEdge')

        const cell = graph.value.getCellById(node.id)
        const updatedData = {
            hiddenCount: entitiesHidden.length,
        }
        cell.updateData({ ...updatedData })
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
                        selectNodeEdge(v)
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
                        ctaPortRightLoading: false,
                    })
                if (path === 'left')
                    n.updateData({
                        ctaPortLeftLoading: false,
                    })
            }
        })

        watchOnce(data, () => {
            const { guidEntityMap: gem1 } = mergedLineageData.value
            const { guidEntityMap: gem2 } = data.value
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
                message.info('No lineage to show')
                if (path === 'right')
                    n.updateData({
                        ctaPortRightIcon: '',
                        ctaPortRightId: '',
                        ctaPortRightLoading: false,
                    })
                if (path === 'left')
                    n.updateData({
                        ctaPortLeftIcon: '',
                        ctaPortLeftId: '',
                        ctaPortLeftLoading: false,
                    })
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
                        selectNodeEdge(v)
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
                        const { ports: c } = lineageStore.getNodesPortList(
                            node.id
                        )
                        newPorts.push(...c)
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

        const parentNode = getPortNode(portId)
        const cellToFit = graph.value.getCellById(parentNode.id)
        graph.value.scrollToCell(cellToFit, { animation: { duration: 600 } })

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
            depth: depthCounter.value,
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
            if (type === 'showMore')
                node.updateData({
                    portShowMoreLoading: show,
                })
        }
    }

    // removePorts
    const removePorts = (node, options = {}) => {
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
    const addX6Ports = (node, c) => {
        const cols = c.filter((x) => x.guid)
        const colsPortData = cols
            .filter((x) => !node.hasPort(x.guid))
            .map((x) => ({
                id: x.guid,
                group: 'portsList',
                zIndex: 0,
            }))
        node.addPorts(colsPortData)
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

        node.updateData({ selectedPortId: portId })

        if (portEntity) {
            onSelectAsset(portEntity)
            selectedPortId.value = portId
            if (fetchLineage) {
                controlPortsLoader(node, true, 'item')
                fetchPortLineage(node, portId)
            }
        }
    }

    // selectPortEdge
    const selectPortEdge = (edgeId) => {
        const processId = edgeId.split('/')[1]
        onSelectAsset({ guid: processId })

        if (edgeId) selectedPortEdgeId.value = edgeId
    }

    // getAllNodesQN
    const getAllNodesQN = () => {
        const res = graph.value
            .getNodes()
            .map((x) => x.store.data.entity.attributes.qualifiedName)
        return res
    }

    // addLineagePorts
    const addLineagePorts = (nodesForPortLineage, portLineage) => {
        dimNodesEdges(true)

        const { guidEntityMap, relations } = portLineage
        Object.entries(nodesForPortLineage).forEach(([k, cols]) => {
            const parentNode = getX6Node(k)
            const { ports, hasPorts } = parentNode.getData()
            if (!hasPorts) return

            if (ports.length) removePorts(parentNode)
            addPorts(parentNode, cols, false, {
                portsCount: null,
                highlightPorts: true,
            })
            removeShowMorePort(parentNode)
        })

        const fromToSet = new Set()
        Object.values(nodesForPortLineage).forEach((ports) => {
            graph.value.freeze('addPortEdges')
            ports.forEach((port) => {
                const rels = relations.filter((y) => {
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

        const portEdges = graph.value
            .getEdges()
            .filter((x) => x.id.includes('port'))

        if (!portEdges.length)
            message.info(
                'There are no related assets present on the graph for the selected port'
            ) // TODO: rename "port" to appropriate label
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

        if (isPortToPort || mode === 'port>port') {
            sourceCell = getPortNode(fromEntityId)?.id
            sourcePort = fromEntityId
            targetCell = getPortNode(toEntityId)?.id
            targetPort = toEntityId
        }

        if (isPortToNode || mode === 'port>node') {
            sourceCell = getPortNode(fromEntityId)?.id
            sourcePort = fromEntityId
            targetCell = toEntityId
            targetPort = `${toEntityId}-invisiblePort`

            portHighlightedBINodes.value.push(targetCell)
            highlightNode(targetCell, 'highlight')
        }

        if (isNodeToPort || mode === 'node>port') {
            sourceCell = fromEntityId
            sourcePort = `${fromEntityId}-invisiblePort`
            targetCell = getPortNode(toEntityId)?.id
            targetPort = toEntityId

            portHighlightedBINodes.value.push(sourceCell)
            highlightNode(sourceCell, 'highlight')
        }

        if (!(sourceCell && sourcePort && targetCell && targetPort)) return

        const sanitizedRelation = {
            id: `port/${processId}/${fromEntityId}@${toEntityId}`,
            sourceCell,
            sourcePort,
            targetCell,
            targetPort,
        }

        const edgeExtraData = { isDup: !!relation?.isDup }

        addEdge(
            sanitizedRelation,
            {
                stroke: '#3c71df',
                arrowSize: preferences.value.showArrow ? 12 : 0.1,
            },
            edgeExtraData
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
        ) {
            controlToggleOfActiveNode(node)
            return
        }

        if (isExpandedNode(node.id)) {
            removePorts(node)
            resetNodeTranslatedNodes(node)
        } else fetchNodePorts(node)
    }

    // controlHoPaCTALoader
    const controlHoPaCTALoader = (node, portId) => {
        const path = portId.includes('ctaPortRight') ? 'right' : 'left'
        if (path === 'right') node.updateData({ ctaPortRightLoading: true })
        if (path === 'left') node.updateData({ ctaPortLeftLoading: true })
    }

    // controlHoPaCTAPort
    const controlHoPaCTAPort = (node, portId) => {
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

    // controlColCTAPort
    const controlColCTAPort = (node, portId) => {
        let newState = ''
        const path = portId.includes('ctaPortRight') ? 'right' : 'left'
        const { predecessors, successors } = useGetNodes(graph, node.id)
        const nodesToToggle = graph.value
            .getNodes()
            .filter((n) =>
                path === 'right'
                    ? successors.includes(n.id)
                    : predecessors.includes(n.id)
            )

        graph.value.freeze('controlColCTAPort')
        nodesToToggle.forEach((n) => {
            const cell = graph.value.getCellById(n.id)
            let shouldToggle = true

            Object.entries(colToggledNodes.value).forEach(([k, v]) => {
                if (v.includes(n.id) && k !== node.id) shouldToggle = false
            })

            if (!shouldToggle) return

            if (!newState && cell.isVisible()) newState = 'exp'
            if (!newState && !cell.isVisible()) newState = 'col'
            cell.toggleVisible()

            if (newState === 'col') n.toBack()
        })
        graph.value.unfreeze('controlColCTAPort')

        if (newState === 'exp') {
            colToggledNodes.value = {
                ...colToggledNodes.value,
                [node.id]: nodesToToggle.map((x) => x.id),
            }
        } else delete colToggledNodes.value[node.id]

        if (path === 'right')
            node.updateData({
                ctaPortRightIcon: newState,
            })
        if (path === 'left')
            node.updateData({
                ctaPortLeftIcon: newState,
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
                    edge.toBack()
                })
        }

        if (selectedPortId.value)
            graph.value
                .getEdges()
                .filter((edge) => edge.id.includes('port'))
                .forEach((edge) => {
                    edge.toFront()
                })

        node.toFront()
    }

    // isSelectedPortNode
    const isSelectedPortNode = (nodeId) => {
        const selectedPortNode = getPortNode(selectedPortId.value)
        return selectedPortNode?.id === nodeId
    }

    // controlToggleOfActiveNode
    const controlToggleOfActiveNode = (node) => {
        if (!activeNodesToggled.value[node.id]) {
            const { ports } = node.getData()

            activeNodesToggled.value[node.id] = {
                ports,
                newEdgesId: [],
                portsEdges: [],
            }

            const graphEdges = graph.value.getEdges()
            const newEdgesIdSet = new Set()

            ports.forEach((port) => {
                if (!port.guid) return

                const portsEdges = graphEdges.filter((edge) =>
                    edge.id.includes(port.guid)
                )

                portsEdges.forEach((edge) => {
                    const [_, processId, sourceTarget] = edge.id.split('/')
                    const [source, target] = sourceTarget.split('@')
                    const invisiblePort = `${node.id}-invisiblePort`
                    let newSource = source
                    let newTarget = target
                    if (source === port.guid) newSource = invisiblePort
                    if (target === port.guid) newTarget = invisiblePort
                    const newEdgeId = `port/${processId}/${newSource}@${newTarget}`

                    newEdgesIdSet.add(newEdgeId)

                    const newRelation = {
                        fromEntityId: newSource,
                        toEntityId: newTarget,
                        processId,
                    }

                    if (newTarget.includes('invisible'))
                        addPortEdge(newRelation, {}, 'port>node')
                    else if (newSource.includes('invisible'))
                        addPortEdge(newRelation, {}, 'node>port')
                    else addPortEdge(newRelation, {}, 'port>port')
                })
                activeNodesToggled.value[node.id].portsEdges.push(...portsEdges)
            })

            activeNodesToggled.value[node.id].newEdgesId =
                Array.from(newEdgesIdSet)

            if (isSelectedPortNode(node.id)) removePorts(node)
            else removePorts(node, { portsCount: null })

            resetNodeTranslatedNodes(node)
            return
        }

        if (activeNodesToggled.value[node.id]) {
            const { portsEdges, ports } = activeNodesToggled.value[node.id]

            if (isSelectedPortNode(node.id)) addPorts(node, ports)
            else {
                addPorts(node, ports, { portsCount: null })
                removeShowMorePort(node)
            }

            translateSubsequentNodes(node)
            portsEdges.forEach((edge) => {
                const [_, processId, sourceTarget] = edge.id.split('/')
                const [source, target] = sourceTarget.split('@')
                const relation = {
                    fromEntityId: source,
                    toEntityId: target,
                    processId,
                }
                if (target.includes('invisible'))
                    addPortEdge(relation, {}, 'port>node')
                else if (source.includes('invisible'))
                    addPortEdge(relation, {}, 'node>port')
                else addPortEdge(relation, {}, 'port>port')
            })

            activeNodesToggled.value[node.id].newEdgesId.forEach((edgeId) => {
                const cell = graph.value.getCellById(edgeId)
                if (cell) cell.remove()
            })
            delete activeNodesToggled.value[node.id]
        }
    }

    // controlEdgeAnimation
    const controlEdgeAnimation = (edge, animate = true) => {
        if (!edge) return

        const _isCyclicEdge = edge.store.data.data?.isCyclicEdge
        const isPortEdge = !!edge.id.includes('port')
        const isHighlightedEdge = (edgeId) =>
            nodesEdgesHighlighted.value.find((x) => x === edgeId)

        const defaultStateColor = _isCyclicEdge ? '#ff4848' : '#B2B8C7'
        const highlightStateColor = _isCyclicEdge ? '#ff4848' : '#3c71df'

        const nodeEdgeDefaultStroke =
            // eslint-disable-next-line no-nested-ternary
            selectedNodeId.value || selectedNodeEdgeId.value
                ? isHighlightedEdge(edge.id)
                    ? highlightStateColor
                    : '#dce0e5'
                : defaultStateColor
        const portEdgeDefaultStroke = '#3c71df'
        const edgeDefaultStroke = isPortEdge
            ? portEdgeDefaultStroke
            : nodeEdgeDefaultStroke

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

        // TODO: redundant
        // if (animate || isHighlightedEdge(edge.id)) edge.setZIndex(0)
        // else if (
        //     !animate &&
        //     !(selectedPortId.value || selectedPortEdgeId.value)
        // )
        //     edge.toBack()

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
            selectNodeEdge(_selectedNodeEdgeId)
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
            const { ports: c, total: t } = lineageStore.getNodesPortList(
                parentNode.id
            )

            addPorts(parentNode, c, false, {
                portsCount: t,
            })
            removeShowMorePort(parentNode)
            if (c.length < t) addShowMorePort(parentNode)

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
        const parentNode = getPortNode(selectedPortId.value)

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
            const { ports } = x6Node.getData()
            if (parentNode?.id !== nodeId && ports.length > 0) {
                graph.value
                    .getEdges()
                    .filter((edge) => edge.id.includes('port'))
                    .forEach((edge) => {
                        const cell = graph.value.getCellById(edge.id)
                        cell.remove()
                    })
                x6Node.updateData({ highlightPorts: false, selectedPortId: '' })
            }

            if (parentNode?.id === nodeId)
                parentNode.updateData({
                    highlightPorts: false,
                    selectedPortId: '',
                })
        })

        selectedPortId.value = ''
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
            if (portId.includes('-coll')) controlColCTAPort(node, portId)
            if (portId.includes('-hoPa')) controlHoPaCTAPort(node, portId)
            return
        }

        if (controlPortClickEvent(e, 'isctaright')) {
            const ele = controlPortClickEvent(e, 'isctaright')
            const portId = ele.getAttribute('isctaright')
            if (portId.includes('-coll')) controlColCTAPort(node, portId)
            if (portId.includes('-hoPa')) controlHoPaCTAPort(node, portId)
            return
        }

        if (controlPortClickEvent(e, 'iscollist')) {
            controlCaret(node)
            return
        }

        if (controlPortClickEvent(e, 'iscolitem')) {
            const ele = controlPortClickEvent(e, 'iscolitem')
            const portId = ele.getAttribute('iscolitem')

            if (portId === selectedPortId.value) resetState()
            else {
                resetState()
                selectPort(node, portId)
            }
            return
        }

        if (controlPortClickEvent(e, 'iscolshowmore')) {
            const { ports } = lineageStore.getNodesPortList(node.id)
            const newOffset = ports.length

            fetchNodePorts(node, newOffset)
            return
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

        if (edge.id.includes('port')) selectPortEdge(edge.id)
        else selectNodeEdge(edge.id)
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

        if (selectedNodeId.value) resetSelectedNode()
        if (selectedNodeEdgeId.value) resetSelectedNodeEdge()
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
            removePorts(parentNode, {
                portsCount: null,
            })
            addPorts(parentNode, [newVal])

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
