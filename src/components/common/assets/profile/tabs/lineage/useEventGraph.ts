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

export default function useEventGraph({
    graph,
    loaderCords,
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

    /** METHODS */
    /** Utils */
    // showLoader
    const showLoader = (e) => {
        loaderCords.value = { x: e.clientX, y: e.clientY }
    }

    // hideLoader
    const hideLoader = () => {
        loaderCords.value = {}
    }

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

    // getNodeCaretElement
    const getNodeCaretElement = (nodeId) => {
        const nodeElement = document.querySelectorAll(
            `[data-cell-id="${nodeId}"]`
        )[0]
        const caretElement = Array.from(nodeElement.querySelectorAll('*')).find(
            (y) => y.classList.contains('node-caret')
        )
        return caretElement
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
    // isGraphLoading
    const isGraphLoading = () => {
        if (Object.keys(loaderCords.value).length) return true
        return false
    }

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

    // selectNode
    const selectNode = (guid) => {
        const entity = getX6Node(guid)?.store?.data?.entity
        onSelectAsset(entity)

        if (guid) selectedNodeId.value = guid

        const nodesToHighlight = getNodesToHighlight(selectedNodeId)
        nodesEdgesHighlighted.value = highlightEdges(nodesToHighlight)
        highlightNodes(selectedNodeId, nodesToHighlight)
        hideLoader()
    }

    const selectNodeEdge = (edgeId) => {
        const processId = edgeId.split('/')[0]
        onSelectAsset({ guid: processId })

        if (edgeId) selectedNodeEdgeId.value = edgeId

        const [source, target] = edgeId.split('/')[1].split('@')

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
        hideLoader()
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

        let nodesHidden = [...hidden]

        const handleNodeIdsToAdd = (nita) => {
            const nh = nodesHidden.filter((x) => !nita.includes(x.guid))
            const nta = nodesHidden.filter((x) => nita.includes(x.guid))
            nodesHidden = nh
            return nta
        }
        const nodesToAdd = !nodeIdsToAdd.length
            ? nodesHidden.splice(0, 4)
            : handleNodeIdsToAdd(nodeIdsToAdd)

        if (mode === 'sameSource')
            sameSourceCount.value[id].targetsHidden = nodesHidden
        if (mode === 'sameTarget')
            sameTargetCount.value[id].sourcesHidden = nodesHidden

        const { relations, childrenCounts } = mergedLineageData.value

        graph.value.freeze('selectVpNode-nodesToAdd')
        nodesToAdd.forEach((ent) => {
            const { nodeData } = createNodeData(
                ent,
                relations,
                childrenCounts,
                true
            )
            nodes.value.push(nodeData)
            addNode(relations, childrenCounts, ent)
        })
        graph.value.unfreeze('selectVpNode-nodesToAdd')

        const nodesToAddIds = nodesToAdd.map((ent) => ent.guid)

        const edgesToAdd = relations.filter((rel) => {
            if (mode === 'sameSource')
                return nodesToAddIds.includes(rel.toEntityId)
            return nodesToAddIds.includes(rel.fromEntityId)
        })

        graph.value.freeze('selectVpNode-edgesToAdd')
        edgesToAdd.forEach((rel) => {
            const { fromEntityId: from, toEntityId: to, processId } = rel
            const relation = {
                id: `${processId}/${from}@${to}`,
                sourceCell: from,
                sourcePort: `${from}-invisiblePort`,
                targetCell: to,
                targetPort: `${to}-invisiblePort`,
            }
            const exists = edges.value.find((edge) => edge.id === relation.id)

            if (exists) return

            const { edgeData } = createEdgeData(
                relation,
                {},
                { stroke: '#aaaaaa' }
            )
            edges.value.push(edgeData)
            addEdge(relation)
        })
        graph.value.unfreeze('selectVpNode-edgesToAdd')

        nodes.value = nodes.value.filter((x) => x.id !== node.id)
        edges.value = edges.value.filter((x) => {
            if (mode === 'sameSource')
                return x.id !== `vpNodeProcessId/${id}@${node.id}`
            return x.id !== `vpNodeProcessId/${node.id}@${id}`
        })

        renderLayout(registerAllListeners)

        if (nodesHidden.length === 0) return

        // add back vp node
        const entity = node?.store?.data?.entity || node.entity
        const { nodeData } = createNodeData(
            entity,
            relations,
            childrenCounts,
            true
        )
        nodeData.data.hiddenCount = nodesHidden.length
        nodes.value.push(nodeData)
        graph.value.freeze('selectVpNode-addVpNode')
        addNode(relations, childrenCounts, nodeData.entity)
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

        const styles = { stroke: '#aaaaaa' }
        const { edgeData } = createEdgeData(relation, {}, styles)
        edges.value.push(edgeData)
        graph.value.freeze('selectVpNode-addVpEdge')
        addEdge(relation)
        graph.value.unfreeze('selectVpNode-addVpEdge')

        renderLayout(registerAllListeners)

        const cell = graph.value.getCellById(node.id)
        const updatedData = {
            hiddenCount: nodesHidden.length,
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
        const nodePrevPortsLength = nodePrev.getPorts().length - 1
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
                    if (k === 'selectNode') selectNode(v)
                    if (k === 'selectNodeEdge') {
                        const edge = getX6Edge(v)
                        controlEdgeAnimation(edge)
                        selectNodeEdge(v)
                    }
                    delete actions.value[k]
                })
            } else hideLoader()
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

                addSubGraph(data.value, registerAllListeners)
                depthCounter.value += 1
            } else {
                message.info('No assets fetched')
            }

            if (Object.keys(actions.value).length) {
                Object.entries(actions.value).forEach(([k, v]) => {
                    if (k === 'selectNode') selectNode(v)
                    if (k === 'selectNodeEdge') {
                        const edge = getX6Edge(v)
                        controlEdgeAnimation(edge)
                        selectNodeEdge(v)
                    }
                    delete actions.value[k]
                })
            } else hideLoader()
        })
    }

    // fetchNodeColumns
    const fetchNodeColumns = (node, offset = 0) => {
        if (lineageStore.hasColumnList(node.id) && offset === 0) {
            const { columns: c, total: t } = lineageStore.getNodesColumnList(
                node.id
            )

            addPorts(node, c)
            if (c.length < t) addPorts(node, ['showMorePort'], true)
            translateSubsequentNodes(node)

            if (Object.keys(actions.value).length) {
                Object.entries(actions.value).forEach(([k, v]) => {
                    if (k === 'selectPort') selectPort(v)
                    delete actions.value[k]
                })
            } else hideLoader()
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
                    if (k === 'selectPort') selectPort(v)
                    delete actions.value[k]
                })
            } else {
                const caretElement = getNodeCaretElement(node.id)
                controlCaretIcon(node.id, caretElement)
                hideLoader()
            }
        })

        watchOnce(
            list,
            () => {
                const total = count.value || 0
                const columns = list.value

                if (columns) {
                    addPorts(node, columns)

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

                    if (node.hasPort(shomeMorePortId))
                        node.removePort(shomeMorePortId)

                    if (columnsLength < total)
                        addPorts(node, ['showMorePort'], true)

                    translateSubsequentNodes(node)
                } else {
                    const caretElement = getNodeCaretElement(node.id)
                    controlCaretIcon(node.id, caretElement)
                    message.info('No column with lineage found for this node')
                }

                if (Object.keys(actions.value).length) {
                    Object.entries(actions.value).forEach(([k, v]) => {
                        if (k === 'selectPort') selectPort(v)
                        delete actions.value[k]
                    })
                } else hideLoader()
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
                    (x) => x.id === ntt.id
                )
                if (!itExists) nodesTranslated.value[node.id].push(ntt)
            } else nodesTranslated.value[node.id] = [ntt]
        })
    }

    // translateNodesToDefault
    const translateNodesToDefault = (node) => {
        const { nttXPos, newY } = getNodeToTranslatePos(node)
        node.position(nttXPos, newY)
    }

    // fetchPortLineage
    const fetchPortLineage = (portId) => {
        if (lineageStore.hasPortLineage(portId)) {
            const portLineage = lineageStore.getPortsLineage(portId)
            dimNodesEdges(true)
            addPortLineagePorts(portId, portLineage)
            currPortLineage.value = portLineage
            hideLoader()
            return
        }

        const config = computed(() => ({
            depth: depthCounter.value, // 1
            guid: portId,
            direction: 'BOTH',
            attributes: ['dataType', 'qualifiedName', 'certificateStatus'],
            hideProcess: true,
        }))

        const { data, error } = useFetchLineage(config, true)

        watchOnce(error, () => {
            handleError(error.value)
            hideLoader()
        })

        watchOnce(data, () => {
            if (!data.value?.relations.length) {
                hideLoader()
                message.info('No lineage data available for selected column')
                return
            }

            const portLineage = data.value

            if (!lineageStore.hasPortLineage(portId)) {
                lineageStore.setPortLineage(portId, portLineage)
                currPortLineage.value = portLineage
            }

            dimNodesEdges(true)
            addPortLineagePorts(portId, data.value)
            hideLoader()
        })
    }

    //  getPortNode
    const getPortNode = (id) =>
        graph.value.getNodes().find((x) => x.hasPort(id))

    // removePorts
    const removePorts = (node, handleCaretIcon = false) => {
        const ports = node.getPorts()
        ports.shift()
        node.removePorts(ports)

        if (handleCaretIcon) {
            const caretElement = getNodeCaretElement(node.id)
            controlCaretIcon(node.id, caretElement)
        }
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

        const fill = mode === 'select' ? '#F4F6FD' : '#ffffff'

        node.setPortProp(portId, 'attrs/portBody', {
            fill,
            stroke: '#5277d7',
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

        hideLoader()
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

                const caretElement = getNodeCaretElement(parentNode.id)
                controlCaretIcon(parentNode.id, caretElement, true)

                const shomeMorePortId = `${parentNode.id}-showMorePort`
                if (parentNode.hasPort(shomeMorePortId)) {
                    parentNode.removePort(shomeMorePortId)

                    if (!parentNode.hasPort(k)) addPorts(parentNode, [v])

                    const { columns: c, total: t } =
                        lineageStore.getNodesColumnList(parentNode.id)
                    if (c.length < t)
                        addPorts(parentNode, ['showMorePort'], true)
                } else if (!parentNode.hasPort(k)) addPorts(parentNode, [v])

                setPortStyle(parentNode, k, 'highlight')
                translateSubsequentNodes(parentNode)
            }

            // TODO: check for duplicate from@to
            // port/processId/source@target
            // label them as grouped processes
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
            highlightNode(targetCell)
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
                stroke: '#5277d7',
                arrowSize: preferences.value.showArrow ? 12 : 0.1,
            },
            edgeExtraData
        )
        edge.toFront()
    }

    /** Controls */
    // controlCaretIcon
    const controlCaretIcon = (nodeId, caretEle, override = false) => {
        const nodeEle = document.getElementById(`node-${nodeId}`)

        if (isExpandedNode(nodeId)) {
            if (override) return

            const index = expandedNodes.value.findIndex((x) => x === nodeId)
            expandedNodes.value.splice(index, 1)
            caretEle.classList.remove('caret-expanded')
            nodeEle?.classList.remove('node-is-expanded')
        } else {
            expandedNodes.value.push(nodeId)
            caretEle.classList.add('caret-expanded')
            nodeEle?.classList.add('node-is-expanded')
        }
    }

    // controlCaret
    const controlCaret = (e, n?) => {
        let caretEle = n ? getNodeCaretElement(n.id) : ''
        let node = n || ''
        let nodeId = n ? n.id : ''

        if (!n) {
            e.stopPropagation()
            showLoader(e)

            caretEle = e.target
            const gEle = getEventPath(e).find((x) =>
                x.getAttribute('data-cell-id')
            )
            nodeId = gEle.getAttribute('data-cell-id')
            node = graph.value.getNodes().find((x) => x.id === nodeId)
        }

        if (
            selectedPortId.value &&
            (isNodePortInCurrPortLineage(nodeId) ||
                activeNodesToggled.value[nodeId])
        ) {
            controlToggleOfActiveNode(node)
            hideLoader()
            return
        }

        if (isExpandedNode(nodeId)) {
            hideLoader()
            controlCaretIcon(nodeId, caretEle)
            removePorts(node)
            resetTranslatedNodes(node)
        } else {
            controlCaretIcon(nodeId, caretEle)
            fetchNodeColumns(node)
        }
    }

    // controlHoPaCTA
    const controlHoPaCTA = (e) => {
        e.stopPropagation()

        if (isGraphLoading()) return

        if (selectedNodeId.value) controlSelectedNodeAction(null, e)
        else if (selectedNodeEdgeId.value)
            controlSelectedNodeEdgeAction(null, e)
        else {
            const gEle = getEventPath(e).find((x) =>
                x.getAttribute('data-cell-id')
            )
            const nodeId = gEle.getAttribute('data-cell-id')

            resetState(true)
            showLoader(e)
            fetchNodeLineage(nodeId)
        }
    }

    // controlToggleOfActiveNode
    const controlToggleOfActiveNode = (node) => {
        if (!activeNodesToggled.value[node.id]) {
            const ports = node.getPorts()
            ports.shift()
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

            const caretElement = getNodeCaretElement(node.id)
            controlCaretIcon(node.id, caretElement)
            node.removePorts(ports)
            resetTranslatedNodes(node)
            return
        }

        if (activeNodesToggled.value[node.id]) {
            const { portsEdges, ports } = activeNodesToggled.value[node.id]
            node.addPorts(ports)
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
            const caretElement = getNodeCaretElement(node.id)
            controlCaretIcon(node.id, caretElement)
        }
    }

    // controlEdgeAnimation
    const controlEdgeAnimation = (edge, animate = true) => {
        if (!edge) return

        const isPortEdge = !!edge.id.includes('port')
        const isHighlightedEdge = (edgeId) =>
            nodesEdgesHighlighted.value.find((x) => x === edgeId)
        const nodeEdgeDefaultStroke =
            // eslint-disable-next-line no-nested-ternary
            selectedNodeId.value || selectedNodeEdgeId.value
                ? isHighlightedEdge(edge.id)
                    ? '#5277d7'
                    : '#d9d9d9'
                : '#aaaaaa'
        const portEdgeDefaultStroke = '#5277d7'
        const edgeDefaultStroke = isPortEdge
            ? portEdgeDefaultStroke
            : nodeEdgeDefaultStroke

        edge.attr('line/strokeWidth', animate ? 3 : 1.6)
        edge.attr('line/strokeDasharray', animate ? 5 : 0)
        edge.attr('line/stroke', animate ? '#5277d7' : edgeDefaultStroke)
        edge.attr(
            'line/style/animation',
            animate ? 'ant-line 30s infinite linear' : 'unset'
        )
        edge.attr(
            'line/targetMarker/stroke',
            animate ? '#5277d7' : edgeDefaultStroke
        )

        if (animate || isHighlightedEdge(edge.id)) edge.toFront()
        else if (
            !animate &&
            !(selectedPortId.value || selectedPortEdgeId.value)
        )
            edge.toBack()

        edge.setLabels(
            edge.getLabels().map((lbl) => ({
                attrs: {
                    label: {
                        fill: animate ? '#5277d7' : 'none',
                        text: lbl.attrs.label.text,
                    },
                    body: {
                        fill: animate ? '#ffffff' : 'none',
                        stroke: animate ? '#5277d7' : 'none',
                    },
                },
            }))
        )
    }

    // controlSelectedNodeAction
    const controlSelectedNodeAction = (node, e) => {
        const _selectedNodeId = selectedNodeId.value

        if (node) {
            selectVpNode(node)
            resetState(true)
            showLoader(e)
            selectNode(_selectedNodeId)
        } else {
            const gEle = getEventPath(e).find((x) =>
                x.getAttribute('data-cell-id')
            )
            const nodeId = gEle.getAttribute('data-cell-id')

            const newAction = { selectNode: _selectedNodeId }
            actions.value = { ...actions.value, ...newAction }

            resetState(true)
            showLoader(e)
            fetchNodeLineage(nodeId)
        }
    }

    // controlSelectedNodeEdgeAction
    const controlSelectedNodeEdgeAction = (node, e) => {
        const _selectedNodeEdgeId = selectedNodeEdgeId.value

        if (node) {
            selectVpNode(node)
            resetState(true)
            showLoader(e)
            const edge = getX6Edge(_selectedNodeEdgeId)
            controlEdgeAnimation(edge)
            selectNodeEdge(_selectedNodeEdgeId)
        } else {
            const gEle = getEventPath(e).find((x) =>
                x.getAttribute('data-cell-id')
            )
            const nodeId = gEle.getAttribute('data-cell-id')
            const newAction = { selectNodeEdge: _selectedNodeEdgeId }
            actions.value = { ...actions.value, ...newAction }

            resetState(true)
            showLoader(e)
            fetchNodeLineage(nodeId)
        }
    }

    // controlSelectedPortAction
    const controlSelectedPortAction = (node, e) => {
        const _selectedPortId = selectedPortId.value
        const _parentNodeId = getPortNode(_selectedPortId)?.id

        if (node) {
            selectVpNode(node)

            resetState()
            showLoader(e)

            const parentNode = getX6Node(_parentNodeId)
            const { columns: c, total: t } = lineageStore.getNodesColumnList(
                parentNode.id
            )

            addPorts(parentNode, c)

            const caretElement = getNodeCaretElement(parentNode.id)
            controlCaretIcon(parentNode.id, caretElement)

            if (c.length !== t) addPorts(parentNode, ['showMorePort'], true)

            translateSubsequentNodes(parentNode)

            selectPort(_selectedPortId)
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
            portEdges.find((x) => {
                const [sourceId, targetId] = x.id.split('/')[2].split('@')

                if (sourceId === selectedPortId.value && targetId === nodeId)
                    graph.value.removeCell(x.id)
            })
            highlightNode(nodeId, false)
        })

        const _expandedNodes = [...expandedNodes.value]

        _expandedNodes.forEach((nodeId) => {
            const x6Node = getX6Node(nodeId)
            const ports = x6Node
                .getPorts()
                .filter((x) => x.attrs?.portBody?.stroke)

            if (parentNode?.id === nodeId || ports.length > 0) {
                ports.forEach((x) => {
                    resetPortStyle(x6Node, x.id)
                })
                return
            }

            removePorts(x6Node, true)

            const nodesToTranslateToDefault =
                nodesTranslated.value[nodeId] || []

            if (nodesToTranslateToDefault.length) {
                nodesToTranslateToDefault.forEach((ntttd) => {
                    translateNodesToDefault(ntttd)
                })
            }
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
            stroke: '#e6e6eb',
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

                const nodesToTranslateToDefault =
                    nodesTranslated.value[nodeId] || []

                if (nodesToTranslateToDefault.length) {
                    nodesToTranslateToDefault.forEach((ntttd) => {
                        translateNodesToDefault(ntttd)
                    })
                }
            })
            lineageStore.setNodesColumnList(null)
            lineageStore.setPortLineage(null)
        }
    }

    //  resetTranslatedNodes
    const resetTranslatedNodes = (x) => {
        if (!nodesTranslated.value?.[x.id]) return
        const nodesToTranslate = nodesTranslated.value?.[x.id] || []
        nodesToTranslate.forEach((nodeToTranslate) => {
            const { nttXPos, newY } = getNodeToTranslatePos(nodeToTranslate)
            nodeToTranslate.position(nttXPos, newY)
        })
        delete nodesTranslated.value?.[x.id]
    }

    /** EVENTS */
    // registerCaretListeners
    const registerCaretListeners = (remove = false) => {
        const carets = document.getElementsByClassName('node-caret')
        const caretsArray = Array.from(carets)

        caretsArray.forEach((x) => {
            if (remove) x.removeEventListener('mousedown', controlCaret)
            else x.addEventListener('mousedown', controlCaret)
        })
    }

    // registerHoriPagiListeners - Horizontal Pagination
    const registerHoPaCTAListeners = (remove = false) => {
        const hoPaCTAs = document.getElementsByClassName('node-hoPaCTA')
        const hoPaCTAsArray = Array.from(hoPaCTAs)
        hoPaCTAsArray.forEach((x) => {
            if (remove) x.removeEventListener('mousedown', controlHoPaCTA)
            else x.addEventListener('mousedown', controlHoPaCTA)
        })
    }

    // registerAllListeners
    const registerAllListeners = () => {
        registerCaretListeners()
        registerHoPaCTAListeners()
    }
    registerAllListeners()

    // removeAllListeners
    const removeAllListeners = () => {
        registerCaretListeners(true)
        registerHoPaCTAListeners(true)
    }

    // Cell - Mousewheel
    graph.value.on('cell:mousewheel', () => {
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })

    // Node - Mouseup
    graph.value.on('node:mouseup', ({ e, node }) => {
        if (isGraphLoading()) return

        if (node.id.includes('vpNode')) {
            if (selectedNodeId.value) controlSelectedNodeAction(node, e)
            else if (selectedNodeEdgeId.value)
                controlSelectedNodeEdgeAction(node, e)
            else if (selectedPortId.value) controlSelectedPortAction(node, e)
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

        showLoader(e)

        selectNode(node.id)
    })

    // Edge - Click
    graph.value.on('edge:click', ({ e, edge }) => {
        if (isGraphLoading()) return

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

        showLoader(e)

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

        if (isGraphLoading()) return

        const gEle = getEventPath(e).find((x) => x.getAttribute('port'))
        const portId = gEle.getAttribute('port')

        if (portId === selectedPortId.value) {
            resetState()
            return
        }

        showLoader(e)

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
        if (isGraphLoading()) return

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
            if (isGraphLoading()) return

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

            translateSubsequentNodes(parentNode)

            if (!isExpandedNode(parentNode.id)) {
                const caretElement = getNodeCaretElement(parentNode.id)
                controlCaretIcon(parentNode.id, caretElement)
            }

            selectPort(newVal.guid)
        },
        {
            deep: true,
        }
    )

    watch(guidToSelectOnGraph, (newVal) => {
        if (isGraphLoading()) return

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
        (val) => {
            const size = val ? 12 : 0.1
            graph.value.freeze('showArrow')
            graph.value.getEdges().forEach((edge) => {
                edge.attr('line/targetMarker/height', size)
                edge.attr('line/targetMarker/width', size)
            })
            graph.value.unfreeze('showArrow')
        }
    )

    return {
        registerAllListeners,
        removeAllListeners,
    }
}
