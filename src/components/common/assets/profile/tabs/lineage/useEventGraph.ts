/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/** VUE */
import { watch, ref, computed } from 'vue'
import { watchOnce, whenever } from '@vueuse/core'

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
    baseEntity,
    selectedNodeId,
    loaderCords,
    currZoom,
    searchItems,
    resetSelections,
    drawerActiveKey,
    preferences,
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

    // console.log('nodes.value:', nodes.value)
    // console.log('graphNodes:', graph.value.getNodes())
    // console.log('mergedLineageData:', mergedLineageData.value)
    // console.log('sameSourceCount:', sameSourceCount.value)
    // console.log('sameTargetCount:', sameTargetCount.value)

    /** DATA */
    const selectedNodeEdgeId = ref('')
    const selectedPortId = ref('')
    const selectedPortEdgeId = ref('')
    const nodesEdgesHighlighted = ref([])
    const nodesTranslated = ref({})
    const expandedNodes = ref([])
    const portHighlightedBINodes = ref([])
    const activeNodesToggled = ref({})
    const currPortLineage = ref({})

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
    const isNodeHidden = (nodeId) => {
        const allHiddenNodes = []
        Object.values(sameSourceCount.value).forEach((v) => {
            const targetsHidden = v?.targetsHidden
            allHiddenNodes.push(...targetsHidden)
        })
        Object.values(sameTargetCount.value).forEach((v) => {
            const sourcesHidden = v?.sourcesHidden
            allHiddenNodes.push(...sourcesHidden)
        })
        const exist = allHiddenNodes.find((x) => x.guid === nodeId)
        return !!exist
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
    const selectVpNode = () => {}

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
            hideLoader()
        })

        watchOnce(data, async () => {
            await addSubGraph(data.value, registerAllListeners)
            const ucell = graph.value.getCellById(guid)
            graph.value.scrollToCell(ucell, { animation: { duration: 600 } })
            hideLoader()
        })
    }

    // fetchNodeColumns
    const fetchNodeColumns = (node, offset = 0) => {
        if (lineageStore.hasColumnList(node.id)) {
            const { columns: c, total: t } = lineageStore.getNodesColumnList(
                node.id
            )

            if (c.length === t) {
                addPorts(node, c)
                translateSubsequentNodes(node)
                hideLoader()
                return
            }
        }

        const asset = node.store.data.entity
        const { typeName, attributes } = asset

        const qualifiedName = []
        const typeNameLC = typeName.toLowerCase()

        if (['view', 'table'].includes(typeNameLC))
            qualifiedName.push(attributes.qualifiedName)

        if (!qualifiedName.length) return

        const { list, count } = fetchColumns(typeNameLC, qualifiedName, offset)

        watchOnce(
            list,
            () => {
                const total = count.value || 0
                const columns = list.value

                if (!columns) {
                    const caretElement = getNodeCaretElement(node.id)
                    controlCaretIcon(node.id, caretElement)
                    message.info('No column with lineage found for this node')
                    hideLoader()
                    return
                }

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
                hideLoader()
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
            depth: 20,
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

        Object.entries(guidEntityMap).forEach(([k, v]) => {
            if (v.typeName === 'Column' && k !== portId) {
                const qnArr = v.attributes.qualifiedName.split('/')
                qnArr.pop()
                const parentName = qnArr.join('/')
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
                addPorts(parentNode, [v])
                setPortStyle(parentNode, k, 'highlight')
                translateSubsequentNodes(parentNode)
            }

            const rels = relations.filter((rel) =>
                [rel.fromEntityId, rel.toEntityId].includes(k)
            )
            rels.forEach((r) => {
                addPortEdge(r, portLineage)
            })
        })
    }

    // addPortEdge
    const addPortEdge = (relation, portLineage, mode?) => {
        const getTypeName = (guid) => portLineage?.guidEntityMap[guid]?.typeName

        const { fromEntityId, toEntityId, processId } = relation

        const sourceTypeName = portLineage ? getTypeName(fromEntityId) : null
        const targetTypeName = portLineage ? getTypeName(toEntityId) : null

        let sourceCell = ''
        let sourcePort = ''
        let targetCell = ''
        let targetPort = ''

        // column > column
        if (
            (sourceTypeName === 'Column' && targetTypeName === 'Column') ||
            (!portLineage && mode === 'column>column')
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
            (!portLineage && mode === 'column>bi')
        ) {
            sourceCell = getPortNode(fromEntityId)?.id
            sourcePort = fromEntityId
            targetCell = toEntityId
            targetPort = `${toEntityId}-invisiblePort`

            if (!isNodeRendered(targetCell)) return
            if (isNodeHidden(targetCell)) return

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

        const edge = addEdge(sanitizedRelation, {
            stroke: '#5277d7',
            arrowSize: preferences.value.showArrow ? 12 : 0.1,
        })
        edge.toFront()
    }

    /** Controls */
    // controlCaretIcon
    const controlCaretIcon = (nodeId, caretEle, override = false) => {
        if (isExpandedNode(nodeId)) {
            if (override) return

            const index = expandedNodes.value.findIndex((x) => x === nodeId)
            expandedNodes.value.splice(index, 1)
            caretEle.classList.remove('caret-expanded')
        } else {
            expandedNodes.value.push(nodeId)
            caretEle.classList.add('caret-expanded')
        }
    }

    // controlCaret
    const controlCaret = (e) => {
        e.stopPropagation()
        showLoader(e)

        const caretEle = e.target
        const gEle = getEventPath(e).find((x) => x.getAttribute('data-cell-id'))
        const nodeId = gEle.getAttribute('data-cell-id')
        const node = graph.value.getNodes().find((x) => x.id === nodeId)

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

        resetState(true)

        showLoader(e)

        const gEle = getEventPath(e).find((x) => x.getAttribute('data-cell-id'))
        const nodeId = gEle.getAttribute('data-cell-id')

        fetchNodeLineage(nodeId)
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
            return
        }

        if (activeNodesToggled.value[node.id]) {
            const { portsEdges, ports } = activeNodesToggled.value[node.id]
            node.addPorts(ports)
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
            if (parentNode?.id === nodeId) {
                const ports = parentNode.getPorts()
                ports.shift()
                ports.forEach((x) => {
                    resetPortStyle(parentNode, x.id)
                })
                return
            }

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

        node.setPortProp(portId, 'attrs/portBody', {
            fill: '#ffffff',
            stroke: '#e6e6eb',
        })
    }

    // resetState
    const resetState = (total = false) => {
        onCloseDrawer()
        if (selectedNodeId.value) resetSelectedNode()
        if (selectedNodeEdgeId.value) resetSelectedNodeEdge()
        if (selectedPortId.value) resetSelectedPort()
        if (selectedPortEdgeId.value) resetSelectedPortEdge()

        if (!total) return
        nodesTranslated.value = {}
        activeNodesToggled.value = {}
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

    //  resetTranslatedNodes
    const resetTranslatedNodes = (x) => {
        const nodesToTranslate = nodesTranslated.value?.[x.id] || []
        nodesToTranslate.forEach((nodeToTranslate) => {
            const { nttXPos, newY } = getNodeToTranslatePos(nodeToTranslate)
            nodeToTranslate.position(nttXPos, newY)
        })
    }

    /** EVENTS */
    // registerCaretListeners
    const registerCaretListeners = () => {
        const carets = document.getElementsByClassName('node-caret')
        const caretsArray = Array.from(carets)

        caretsArray.forEach((x) => {
            x.addEventListener('mousedown', controlCaret)
        })
    }

    // registerHoriPagiListeners - Horizontal Pagination
    const registerHoPaCTAListeners = () => {
        const hoPaCTAs = document.getElementsByClassName('node-hoPaCTA')
        const hoPaCTAsArray = Array.from(hoPaCTAs)
        hoPaCTAsArray.forEach((x) => {
            x.addEventListener('mousedown', controlHoPaCTA)
        })
    }

    // registerAllListeners
    const registerAllListeners = () => {
        registerCaretListeners()
        registerHoPaCTAListeners()
    }
    registerAllListeners()

    // Cell - Mousewheel
    graph.value.on('cell:mousewheel', () => {
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })

    // Node - Mouseup
    graph.value.on('node:mouseup', ({ e, node }) => {
        if (node.id === selectedNodeId.value) {
            resetState()
            return
        }

        resetState()

        if (node.id.includes('vpNode')) {
            selectVpNode(node.id)
            return
        }

        showLoader(e)

        selectNode(node.id)
    })

    // Edge - Click
    graph.value.on('edge:click', ({ e, edge }) => {
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

        const gEle = getEventPath(e).find((x) => x.getAttribute('port'))
        const portId = gEle.getAttribute('port')

        if (portId === selectedPortId.value) {
            resetState()
            return
        }

        resetState()

        showLoader(e)

        if (portId.includes('showMorePort')) {
            const { columns } = lineageStore.getNodesColumnList(node.id)
            const newOffset = columns.length

            fetchNodeColumns(node, newOffset)
            return
        }

        selectPort(portId)
    })

    // Blank - Click
    graph.value.on('blank:click', () => {
        if (selectedNodeId.value) resetSelectedNode()
        if (selectedNodeEdgeId.value) resetSelectedNodeEdge()
    })

    // Blank - Mousewheel
    graph.value.on('blank:mousewheel', () => {
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })

    return {
        registerAllListeners,
    }
}
