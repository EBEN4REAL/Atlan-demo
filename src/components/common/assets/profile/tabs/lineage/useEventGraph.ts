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
import fetchColumns from './fetchColumns'

/** CONSTANTS */
import { LineageAttributes } from '~/constant/projection'

/** UTILS */
import { isCyclicEdge, getFilteredRelations } from './util.js'
import { iconMinusB64, iconPlusB64, iconLoaderB64 } from './iconsBase64'

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
}) {
    /** INITIALIZE */
    const lineageStore = useLineageStore()
    const { useFetchLineage } = useLineageService()
    const { highlightNode, highlightNodes, highlightEdges, dimNodesEdges } =
        useUpdateGraph(graph)
    const {
        createPortData,
        createShowMorePortData,
        addNode,
        addEdge,
        createEdgeData,
        createNodeData,
    } = useGraph(graph)

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
    const columnToSelect = computed(() => lineageStore.getColumnToSelect())
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
    const getNodeQN = (columnQN) => {
        if (!columnQN) return null
        const qnArr = columnQN.split('/')
        qnArr.pop()
        const parentName = qnArr.join('/')

        return parentName
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

    // getNodeColumnOnlyPorts
    const getNodeColumnOnlyPorts = (node) => {
        const ports = node.getPorts()
        const res = ports.filter(
            (port) =>
                !port.id.includes('invisiblePort') &&
                !port.id.includes('viewPort') &&
                !port.id.includes('ctaPortLeft') &&
                !port.id.includes('ctaPortRight')
        )
        return res
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
                const edge = addEdge(newRelation)
                edge.setZIndex(0)

                lineageStore.setCyclicRelation(`${from}@${to}`)
            }

            const { edgeData } = createEdgeData(relation, edgeExtraData, styles)
            edges.value.push(edgeData)
            const edge = addEdge(relation)
            edge.setZIndex(0)
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

        renderLayout()

        controlEdgesArrow()

        const cell = graph.value.getCellById(node.id)
        const updatedData = {
            hiddenCount: entitiesHidden.length,
        }
        cell.updateData({ ...updatedData })
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
        const nodePrevPortsLength = getNodeColumnOnlyPorts(nodePrev).length + 1
        const portsLengthTotal = nodePrevPortsLength * 40
        const newY = y2 + 130.5 + portsLengthTotal

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
            entityFilters: {
                attributeName: '__state',
                operator: 'eq',
                attributeValue: 'ACTIVE',
            },
            attributes: LineageAttributes,
        }))

        const { data, error } = useFetchLineage(nodeConfig, true)

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
                        controlColumnListLoader(nodeId, true)
                        controlCaretExp(nodeId)
                        fetchNodeColumns(node)
                    }
                })
            }
        })

        watchOnce(data, () => {
            const { guidEntityMap: gem1 } = mergedLineageData.value
            const { guidEntityMap: gem2, lineageDirection } = data.value
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

                const dirId =
                    lineageDirection === 'OUTPUT'
                        ? 'ctaPortRight'
                        : 'ctaPortLeft'
                const hoPaCTAId = `${guid}-${dirId}-hoPa`
                const node = getPortNode(hoPaCTAId)
                node.removePort(hoPaCTAId)
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
                        const nodeId = v.nodeId
                        const node = getX6Node(nodeId)
                        controlColumnListLoader(nodeId, true)
                        controlCaretExp(nodeId)
                        fetchNodeColumns(node)
                    }
                })
            }
            controlEdgesArrow()
        })
    }

    // fetchNodeColumns
    const fetchNodeColumns = (node, offset = 0) => {
        if (lineageStore.hasColumnList(node.id) && offset === 0) {
            const { columns: c, total: t } = lineageStore.getNodesColumnList(
                node.id
            )

            addPorts(node, c)
            controlNodeWithColumnsHeight(node, c.length)
            if (c.length < t) {
                addPorts(node, ['showMorePort'], true)
                controlNodeWithColumnsHeight(node, c.length + 1)
            }
            translateSubsequentNodes(node)

            if (Object.keys(actions.value).length) {
                Object.entries(actions.value).forEach(([k, v]) => {
                    if (k === 'selectPort') selectPort(v.portId)
                    delete actions.value[k]
                })
            } else {
                controlColumnListLoader(node.id, false)
            }
            return
        }

        const asset = node.store.data.entity
        const { typeName, attributes } = asset

        const qualifiedName = []
        const typeNameLC = typeName.toLowerCase()

        if (['view', 'table'].includes(typeNameLC))
            qualifiedName.push(attributes.qualifiedName)

        if (!qualifiedName.length) return

        const { list, count, error } = fetchColumns(
            typeNameLC,
            qualifiedName,
            offset
        )

        watchOnce(error, () => {
            handleError(error.value)

            if (Object.keys(actions.value).length) {
                Object.entries(actions.value).forEach(([k, v]) => {
                    if (k === 'selectPort') selectPort(v.portId)
                    delete actions.value[k]
                })
            } else {
                controlCaretExp(node.id)
                controlColumnListLoader(node.id, false)
            }
        })

        watchOnce(
            list,
            () => {
                const total = count.value || 0
                const columns = list.value

                if (columns.length) {
                    addPorts(node, columns)
                    controlNodeWithColumnsHeight(node, columns.length)

                    let columnsLength = columns.length
                    const newColumns = [...columns]
                    const shomeMorePortId = `${node.id}-showMorePort`

                    if (lineageStore.hasColumnList(node.id)) {
                        const { columns: c } = lineageStore.getNodesColumnList(
                            node.id
                        )
                        columnsLength = c.length + newColumns.length
                        newColumns.push(...c)
                    }

                    lineageStore.setNodesColumnList(
                        node.id,
                        newColumns,
                        offset,
                        total
                    )

                    if (node.hasPort(shomeMorePortId)) {
                        node.removePort(shomeMorePortId)
                        controlNodeWithColumnsHeight(node, columnsLength)
                    }

                    if (columnsLength < total) {
                        addPorts(node, ['showMorePort'], true)
                        controlNodeWithColumnsHeight(node, columnsLength + 1)
                    }

                    translateSubsequentNodes(node)
                } else {
                    controlCaretExp(node.id)
                    message.info('No column with lineage found for this node')
                }

                if (Object.keys(actions.value).length) {
                    Object.entries(actions.value).forEach(([k, v]) => {
                        if (k === 'selectPort') selectPort(v.portId)
                        delete actions.value[k]
                    })
                } else {
                    controlColumnListLoader(node.id, false)
                }
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

    // fetchPortLineage
    const fetchPortLineage = (portId) => {
        const node = graph.value.getNodes().find((n) => n.hasPort(portId))

        if (lineageStore.hasPortLineage(portId)) {
            const portLineage = lineageStore.getPortsLineage(portId)
            dimNodesEdges(true)
            addPortLineagePorts(portId, portLineage)
            currPortLineage.value = portLineage
            controlColumnListLoader(node.id, false)
            return
        }

        const config = computed(() => ({
            depth: depthCounter.value,
            guid: portId,
            direction: 'BOTH',
            attributes: ['dataType', 'qualifiedName', 'certificateStatus'],
            hideProcess: true,
        }))

        const { data, error } = useFetchLineage(config, true)

        watchOnce(error, () => {
            handleError(error.value)
            controlColumnListLoader(node.id, false)
        })

        watchOnce(data, () => {
            if (!data.value?.relations.length) {
                controlColumnListLoader(node.id, false)
                message.info(
                    'There is no lineage data available for the selected column'
                )
                return
            }

            const portLineage = data.value

            if (!lineageStore.hasPortLineage(portId)) {
                lineageStore.setPortLineage(portId, portLineage)
                currPortLineage.value = portLineage
            }

            dimNodesEdges(true)
            addPortLineagePorts(portId, data.value)
            controlColumnListLoader(node.id, false)
        })
    }

    //  getPortNode
    const getPortNode = (id) =>
        graph.value.getNodes().find((x) => x.hasPort(id))

    // removePorts
    const removePorts = (node, handleCaretExp = false) => {
        const ports = getNodeColumnOnlyPorts(node)
        node.removePorts(ports)

        if (handleCaretExp) controlCaretExp(node.id)
    }

    // addPorts
    const addPorts = (node, columns, isShowMorePort = false) => {
        const ports = columns.map((x) => {
            const { portData } = !isShowMorePort
                ? createPortData(x)
                : createShowMorePortData(node)
            return portData
        })

        ports.forEach((x) => {
            if (isPortRendered(x.id)) node.removePort(x.id)
        })
        node.addPorts(ports)
    }

    // setPortStyle
    const setPortStyle = (node, portId, mode) => {
        if (!node || !portId) return

        const fill = mode === 'select' ? '#ebf1ff' : '#ffffff'

        node.setPortProp(portId, 'attrs/portBody', {
            fill,
            stroke: '#3c71df',
        })
    }

    // selectPort
    const selectPort = (portId) => {
        const parentNode = getPortNode(portId)
        if (!parentNode) return

        const port = parentNode.getPort(portId)
        onSelectAsset(port.entity)

        selectedPortId.value = portId
        setPortStyle(parentNode, portId, 'select')
        fetchPortLineage(portId)
    }

    // selectPortEdge
    const selectPortEdge = (edgeId) => {
        const processId = edgeId.split('/')[1]
        onSelectAsset({ guid: processId })

        if (edgeId) selectedPortEdgeId.value = edgeId

        // hideLoader()
    }

    // addPortLineagePorts
    const addPortLineagePorts = (portId, portLineage) => {
        const { guidEntityMap, relations } = portLineage

        const guidEntityMapFiltered = Object.values(guidEntityMap).filter(
            (x) => {
                const parentName = getNodeQN(x?.attributes?.qualifiedName)
                const inr = graph.value
                    .getNodes()
                    .find(
                        (y) =>
                            y?.store?.data?.entity?.attributes
                                ?.qualifiedName === parentName
                    )

                if (inr) return true
                return false
            }
        )

        const _guidEntityMap = {}

        guidEntityMapFiltered.forEach((x) => {
            _guidEntityMap[x.guid] = x
        })

        Object.entries(_guidEntityMap).forEach(([k, v]) => {
            if (v.typeName === 'Column' && k !== portId) {
                const parentName = getNodeQN(v.attributes.qualifiedName)

                const parentNode = graph.value
                    .getNodes()
                    .find(
                        (x) =>
                            x.store.data.entity.attributes.qualifiedName ===
                            parentName
                    )

                if (!parentNode) return

                controlCaretExp(parentNode.id, true)

                const shomeMorePortId = `${parentNode.id}-showMorePort`
                if (parentNode.hasPort(shomeMorePortId)) {
                    parentNode.removePort(shomeMorePortId)

                    if (!parentNode.hasPort(k)) {
                        addPorts(parentNode, [v])
                        const ports = getNodeColumnOnlyPorts(parentNode)
                        controlNodeWithColumnsHeight(parentNode, ports.length)
                    }

                    const { columns: c, total: t } =
                        lineageStore.getNodesColumnList(parentNode.id)
                    if (c.length < t) {
                        addPorts(parentNode, ['showMorePort'], true)
                        const ports = getNodeColumnOnlyPorts(parentNode)
                        controlNodeWithColumnsHeight(
                            parentNode,
                            ports.length + 1
                        )
                    }
                } else if (!parentNode.hasPort(k)) {
                    addPorts(parentNode, [v])
                    const ports = getNodeColumnOnlyPorts(parentNode)
                    controlNodeWithColumnsHeight(parentNode, ports.length)
                }

                setPortStyle(parentNode, k, 'highlight')
                translateSubsequentNodes(parentNode)
            }

            const rels = relations.filter((rel) =>
                [rel.fromEntityId, rel.toEntityId].includes(k)
            )

            const relsSet = new Set()
            const newRels = []
            rels.forEach((rel) => {
                const { processId, fromEntityId, toEntityId } = rel
                const entry = `${fromEntityId}@${toEntityId}`
                const isr =
                    isPortRendered(fromEntityId) && isPortRendered(toEntityId)

                if (!relsSet.has(entry) && isr) {
                    const arr = rels.filter((x) => {
                        const { fromEntityId: from, toEntityId: to } = x
                        if (entry === `${from}@${to}`) return true
                        return false
                    })

                    relsSet.add(entry)
                    newRels.push({
                        processId,
                        fromEntityId,
                        toEntityId,
                        isDup: !!(arr.length > 1),
                    })
                }
            })

            graph.value.freeze('rels-addPortEdge')
            newRels.forEach((r) => {
                addPortEdge(r, _guidEntityMap)
            })
            graph.value.unfreeze('rels-addPortEdge')
        })
        const portEdges = graph.value
            .getEdges()
            .filter((x) => x.id.includes('port'))

        if (!portEdges.length)
            message.info(
                'There are no related assets present on the graph for the selected column'
            )
    }

    // addPortEdge
    const addPortEdge = (relation, guidEntityMap, mode?) => {
        const getTypeName = (guid) => guidEntityMap[guid]?.typeName

        const { fromEntityId, toEntityId, processId } = relation

        const sourceTypeName = guidEntityMap ? getTypeName(fromEntityId) : null
        const targetTypeName = guidEntityMap ? getTypeName(toEntityId) : null

        let sourceCell = ''
        let sourcePort = ''
        let targetCell = ''
        let targetPort = ''

        // column > column
        if (
            (sourceTypeName === 'Column' && targetTypeName === 'Column') ||
            (!guidEntityMap && mode === 'column>column')
        ) {
            sourceCell = getPortNode(fromEntityId)?.id
            sourcePort = fromEntityId
            targetCell = getPortNode(toEntityId)?.id
            targetPort = toEntityId
        }

        // column > query ... column > dataset
        if (
            (sourceTypeName === 'Column' &&
                ['LookerQuery', 'PowerBiDataset'].includes(targetTypeName)) ||
            (!guidEntityMap && mode === 'column>bi')
        ) {
            sourceCell = getPortNode(fromEntityId)?.id
            sourcePort = fromEntityId
            targetCell = toEntityId
            targetPort = `${toEntityId}-invisiblePort`

            if (!isNodeRendered(targetCell)) return
            if (isNodeHidden(targetCell, true)) return

            portHighlightedBINodes.value.push(targetCell)
            highlightNode(targetCell, 'highlight')
        }

        // dataset > report
        // if (
        //     sourceTypeName === 'PowerBiDataset' &&
        //     targetTypeName === 'PowerBiReport'
        // ) {
        //     // TODO: Edge already exist
        //     sourceCell = fromEntityId
        //     sourcePort = `${fromEntityId}-invisiblePort`
        //     targetCell = toEntityId
        //     targetPort = `${toEntityId}-invisiblePort`

        //     if (!isNodeRendered(sourceCell)) return
        //     if (isNodeHidden(sourceCell)) return
        //     if (!isNodeRendered(targetCell)) return
        //     if (isNodeHidden(targetCell)) return
        // }

        if (!(sourceCell && sourcePort && targetCell && targetPort)) return

        const sanitizedRelation = {
            id: `port/${processId}/${fromEntityId}@${toEntityId}`,
            sourceCell,
            sourcePort,
            targetCell,
            targetPort,
        }

        const edgeExtraData = { isDup: !!relation?.isDup }

        const edge = addEdge(
            sanitizedRelation,
            {
                stroke: '#3c71df',
                arrowSize: preferences.value.showArrow ? 12 : 0.1,
            },
            edgeExtraData
        )
        edge.setZIndex(0)
    }

    /** Controls */
    // controlNodeWithColumnsHeight
    const controlNodeWithColumnsHeight = (node, columnsLength = 0) => {
        const height = columnsLength ? columnsLength * 41 + 114 + 12 : 114
        const nodeEle = document.getElementById(`node-${node.id}`)
        if (nodeEle) {
            nodeEle.style.height = `${height}px`
            node.updateData({ nodeHeight: height })
        }
    }

    // controlCaretExp
    const controlCaretExp = (nodeId, override = false) => {
        if (isExpandedNode(nodeId)) {
            if (override) return

            const index = expandedNodes.value.findIndex((x) => x === nodeId)
            expandedNodes.value.splice(index, 1)
        } else expandedNodes.value.push(nodeId)
    }

    // controlCaret
    const controlCaret = (node) => {
        const nodeId = node.id

        controlColumnListLoader(nodeId, true)

        if (
            selectedPortId.value &&
            (isNodePortInCurrPortLineage(nodeId) ||
                activeNodesToggled.value[nodeId])
        ) {
            controlToggleOfActiveNode(node)
            controlColumnListLoader(nodeId, false)

            return
        }

        if (isExpandedNode(nodeId)) {
            controlColumnListLoader(nodeId, false)

            controlCaretExp(nodeId)
            removePorts(node)
            controlNodeWithColumnsHeight(node)
            resetNodeTranslatedNodes(node)
        } else {
            controlCaretExp(nodeId)
            fetchNodeColumns(node)
        }
    }

    // controlColumnListLoader
    const controlColumnListLoader = (nodeId, show) => {
        const id = `node-${nodeId}-columnListLoader`
        const ele = document.getElementById(id)
        if (show) {
            isGraphLoading.value = true
            ele?.classList.remove('hidden')
            ele?.classList.add('inline')
        } else {
            isGraphLoading.value = false
            ele?.classList.remove('inline')
            ele?.classList.add('hidden')
        }
    }

    // controlHoPaCTALoader
    const controlHoPaCTALoader = (node, portId) => {
        node.setPortProp(portId, 'attrs/portImage/href', iconLoaderB64)
        node.setPortProp(portId, 'attrs/portImage/width', 35)
        node.setPortProp(portId, 'attrs/portImage/height', 35)
        node.setPortProp(portId, 'attrs/portImage/refX', -4)
        node.setPortProp(portId, 'attrs/portImage/refY', -4)
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
        let state = ''
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

            if (!state && cell.isVisible()) state = 'exp'
            if (!state && !cell.isVisible()) state = 'col'
            cell.toggleVisible()
        })
        graph.value.unfreeze('controlColCTAPort')

        if (state === 'exp') {
            colToggledNodes.value = {
                ...colToggledNodes.value,
                [node.id]: nodesToToggle.map((x) => x.id),
            }
        } else {
            delete colToggledNodes.value[node.id]
        }

        const icon = state === 'exp' ? iconPlusB64 : iconMinusB64

        node.setPortProp(portId, 'attrs/portImage/href', icon)

        graph.value.getEdges().forEach((edge) => {
            if (
                edge.getSourceNode().id === node.id ||
                edge.getTargetNode().id === node.id
            ) {
                const cell = graph.value.getCellById(edge.id)
                cell.toBack()
            }
        })
    }

    // controlToggleOfActiveNode
    const controlToggleOfActiveNode = (node) => {
        if (!activeNodesToggled.value[node.id]) {
            const ports = getNodeColumnOnlyPorts(node)

            activeNodesToggled.value[node.id] = {
                ports,
                newEdgesId: [],
                portsEdges: [],
            }

            const graphEdges = graph.value.getEdges()
            const newEdgesIdSet = new Set()

            ports.forEach((port) => {
                const portsEdges = graphEdges.filter((edge) =>
                    edge.id.includes(port.id)
                )

                portsEdges.forEach((edge) => {
                    const [_, processId, sourceTarget] = edge.id.split('/')
                    const [source, target] = sourceTarget.split('@')
                    const invisiblePort = `${node.id}-invisiblePort`
                    let newSource = source
                    let newTarget = target
                    if (source === port.id) newSource = invisiblePort
                    if (target === port.id) newTarget = invisiblePort
                    const newEdgeId = `port/${processId}/${newSource}@${newTarget}`

                    newEdgesIdSet.add(newEdgeId)

                    const newRelation = {
                        fromEntityId: newSource,
                        toEntityId: newTarget,
                        processId,
                    }

                    addPortEdge(newRelation, null, 'column>column')
                    addPortEdge(newRelation, null, 'column>bi')
                })
                activeNodesToggled.value[node.id].portsEdges.push(...portsEdges)
            })

            activeNodesToggled.value[node.id].newEdgesId =
                Array.from(newEdgesIdSet)

            controlCaretExp(node.id)
            removePorts(node)
            controlNodeWithColumnsHeight(node)
            resetNodeTranslatedNodes(node)
            return
        }

        if (activeNodesToggled.value[node.id]) {
            const { portsEdges, ports } = activeNodesToggled.value[node.id]
            node.addPorts(ports)
            controlNodeWithColumnsHeight(node, ports.length)
            translateSubsequentNodes(node)
            portsEdges.forEach((edge) => {
                const [_, processId, sourceTarget] = edge.id.split('/')
                const [source, target] = sourceTarget.split('@')
                const relation = {
                    fromEntityId: source,
                    toEntityId: target,
                    processId,
                }
                addPortEdge(relation, null, 'column>column')
                addPortEdge(relation, null, 'column>bi')
            })

            activeNodesToggled.value[node.id].newEdgesId.forEach((edgeId) => {
                const cell = graph.value.getCellById(edgeId)
                if (cell) cell.remove()
            })
            delete activeNodesToggled.value[node.id]
            controlCaretExp(node.id)
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

        if (animate || isHighlightedEdge(edge.id)) edge.setZIndex(0)
        else if (
            !animate &&
            !(selectedPortId.value || selectedPortEdgeId.value)
        )
            edge.toBack()

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
            controlColumnListLoader(node.id, true)

            const parentNode = getX6Node(_parentNodeId)
            const { columns: c, total: t } = lineageStore.getNodesColumnList(
                parentNode.id
            )

            addPorts(parentNode, c)
            controlNodeWithColumnsHeight(parentNode, c.length)

            controlCaretExp(parentNode.id)

            if (c.length !== t) {
                addPorts(parentNode, ['showMorePort'], true)
                controlNodeWithColumnsHeight(parentNode, c.length + 1)
            }

            translateSubsequentNodes(parentNode)

            selectPort(_selectedPortId)
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

    // controlEdgesArrow
    const controlEdgesArrow = () => {
        const val = preferences.value.showArrow
        const size = val ? 12 : 0.1
        graph.value.freeze('showArrow')
        graph.value.getEdges().forEach((edge) => {
            if (edge.id.includes('port')) return
            edge.attr('line/targetMarker/height', size)
            edge.attr('line/targetMarker/width', size)
        })
        graph.value.unfreeze('showArrow')
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
            const ports = getNodeColumnOnlyPorts(x6Node)

            if (parentNode?.id === nodeId || ports.length > 0) {
                ports.forEach((x) => {
                    resetPortStyle(x6Node, x.id)
                })
                return
            }

            removePorts(x6Node, true)
            controlNodeWithColumnsHeight(x6Node)
            resetNodeTranslatedNodes(x6Node)
        })

        resetPortStyle(parentNode, selectedPortId.value)
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

    // resetPortStyle
    const resetPortStyle = (node, portId) => {
        if (!node || !portId) return

        const portEdge = graph.value
            .getEdges()
            .filter((x) => x.id.includes('port'))
            .find((x) => x.id.includes(portId))

        if (portEdge) {
            const cell = graph.value.getCellById(portEdge.id)
            if (cell) graph.value.removeCell(cell)
        }

        node.setPortProp(portId, 'attrs/portBody', {
            fill: '#ffffff',
            stroke: '#E0E4EB',
        })
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
                removePorts(x6Node, true)
                controlNodeWithColumnsHeight(x6Node)
                resetNodeTranslatedNodes(x6Node)
            })
            lineageStore.setNodesColumnList(null)
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
    graph.value.on('port:click', ({ e, node }) => {
        e.stopPropagation()

        if (isGraphLoading.value) return

        const gEle = getEventPath(e).find((x) => x.getAttribute('port'))
        const portId = gEle.getAttribute('port')

        if (portId.includes('-col')) {
            controlColCTAPort(node, portId)
            return
        }

        if (portId.includes('-hoPa')) {
            controlHoPaCTAPort(node, portId)
            return
        }

        if (portId.includes('-viewPort')) {
            controlCaret(node)
            return
        }

        if (portId === selectedPortId.value) {
            resetState()
            return
        }

        controlColumnListLoader(node.id, true)

        if (portId.includes('showMorePort')) {
            const { columns } = lineageStore.getNodesColumnList(node.id)
            const newOffset = columns.length

            fetchNodeColumns(node, newOffset)
            return
        }

        resetState()

        selectPort(portId)
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
        columnToSelect,
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

            addPorts(parentNode, [newVal])
            controlNodeWithColumnsHeight(parentNode, 1)

            translateSubsequentNodes(parentNode)

            if (!isExpandedNode(parentNode.id)) controlCaretExp(parentNode.id)

            selectPort(newVal.guid)
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

    watch(
        () => preferences.value.showArrow,
        () => {
            controlEdgesArrow()
        }
    )
}
