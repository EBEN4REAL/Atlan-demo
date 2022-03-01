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
    const { highlightNodes, highlightEdges, toggleNodesEdges } =
        useUpdateGraph(graph)
    const { createPortData, addNode, addEdge, createEdgeData, createNodeData } =
        useGraph(graph)

    /** DATA */
    const selectedNodeEdgeId = ref('')
    const selectedPortId = ref('')
    const selectedPortEdgeId = ref('')
    const nodesEdgesHighlighted = ref([])
    const nodesTranslated = ref([])
    const expandedNodes = ref([])

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
    // isExpandedNode
    const isExpandedNode = (nodeId) => expandedNodes.value.includes(nodeId)

    // isPortExist
    const isPortExist = (portId) =>
        graph.value.getNodes().some((x) => x.hasPort(portId))

    // getNodesToHighlight
    const getNodesToHighlight = (guid) => {
        let res = []
        if (guid.value) {
            const { predecessors, successors } = useGetNodes(graph, guid.value)
            res = [guid.value, ...predecessors, ...successors]
        }
        return res
    }

    // highlightNode
    const highlightNode = (guid, styleSelectedNode = true) => {
        if (guid === selectedNodeId.value) {
            onCloseDrawer()
            selectedNodeId.value = ''
        } else if (guid) selectedNodeId.value = guid

        const nodesToHighlight = getNodesToHighlight(selectedNodeId)
        nodesEdgesHighlighted.value = highlightEdges(nodesToHighlight)
        highlightNodes(
            styleSelectedNode ? selectedNodeId : '',
            nodesToHighlight
        )
        hideLoader()
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

    // fetchNodeColumns
    const fetchNodeColumns = (node) => {
        const asset = node.store.data.entity
        const { typeName, attributes } = asset

        const qualifiedName = []
        const typeNameLC = typeName.toLowerCase()

        if (['view', 'table'].includes(typeNameLC))
            qualifiedName.push(attributes.qualifiedName)

        if (!qualifiedName.length) return

        const { list } = fetchColumns(typeNameLC, qualifiedName)

        watchOnce(
            list,
            () => {
                const columns = list.value
                if (!columns) {
                    const caretElement = getNodeCaretElement(node.id)
                    controlCaretIcon(node.id, caretElement)
                    message.info('No column with lineage found for this node')
                    hideLoader()
                    return
                }

                addPorts(node, columns)
                translateSubsequentNodes(node)
                hideLoader()
            },
            { deep: true }
        )
    }

    // fetchPortLineage
    const fetchPortLineage = (portId) => {
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

            addPortLineagePorts(portId, data.value)
            hideLoader()
        })
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

    //  getPortNode
    const getPortNode = (id) =>
        graph.value.getNodes().find((x) => x.hasPort(id))

    // removePorts
    const removePorts = (node) => {
        const ports = node.getPorts()
        ports.shift()
        node.removePorts(ports)
    }

    // addPorts
    const addPorts = (node, columns) => {
        const ports = columns.map((x) => {
            const { portData } = createPortData(x)
            return portData
        })

        ports.forEach((x) => {
            if (isPortExist(x.id)) node.removePort(x.id)
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
    const selectPort = (node, portId) => {
        selectedPortId.value = portId
        setPortStyle(node, portId, 'select')
        fetchPortLineage(portId)
    }

    // addPortLineagePorts
    const addPortLineagePorts = (portId, portLineage) => {
        const { guidEntityMap, relations } = portLineage

        Object.entries(guidEntityMap).forEach(([k, v]) => {
            if (k === portId) return

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

            if (parentNode) {
                const caretElement = getNodeCaretElement(parentNode.id)
                controlCaretIcon(parentNode.id, caretElement)
                addPorts(parentNode, [v])
                const relation = relations.find((rel) =>
                    [rel.fromEntityId, rel.toEntityId].includes(portId)
                )
                console.log('relations:', relations)
                console.log('relation:', relation)
                addPortEdge(relation)
                setPortStyle(parentNode, v.guid, 'highlight')
            }
        })
    }

    // addPortEdge
    const addPortEdge = (relation) => {
        const { fromEntityId, toEntityId, processId } = relation
        const sourceCell = getPortNode(fromEntityId)
        const targetCell = getPortNode(toEntityId)

        const sanitizedRelation = {
            id: `port/${processId}/${fromEntityId}@${toEntityId}`,
            sourceCell,
            sourcePort: fromEntityId,
            targetCell,
            targetPort: toEntityId,
        }
        const edge = addEdge(sanitizedRelation, {
            stroke: '#5277d7',
            arrowSize: preferences.value.showArrow ? 12 : 0.1,
        })
        edge.toFront()
    }

    /** Controls */
    // controlCaretIcon
    const controlCaretIcon = (nodeId, caretEle) => {
        if (isExpandedNode(nodeId)) {
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

    /** Resets */
    // resetSelectedNode
    const resetSelectedNode = () => {
        selectedNodeId.value = ''
        highlightNode(null)
    }

    // resetSelectedNodeEdge
    const resetSelectedNodeEdge = () => {
        //
    }

    // resetSelectedPort
    const resetSelectedPort = () => {
        //
    }

    // resetSelectedPortEdge
    const resetSelectedPortEdge = () => {
        //
    }

    //  resetTranslatedNodes
    const resetTranslatedNodes = (x) => {
        const nodesToTranslate = nodesTranslated.value?.[x.id] || []
        nodesToTranslate.forEach((nodeToTranslate) => {
            const { nttXPos, newY } = getNodeToTranslatePos(nodeToTranslate)
            nodeToTranslate.position(nttXPos, newY)
        })
    }

    // resetState
    const resetState = () => {
        onCloseDrawer()
        resetSelectedNode()
        resetSelectedNodeEdge()
        resetSelectedPort()
        resetSelectedPortEdge()
        nodesEdgesHighlighted.value = []
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
    registerCaretListeners()

    // Cell - Mousewheel
    graph.value.on('cell:mousewheel', () => {
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })

    // Node - Mouseup
    graph.value.on('node:mouseup', ({ node }) => {
        const { entity } = node.store.data

        if (entity.guid === selectedNodeId.value) {
            resetSelectedNode()
            return
        }

        onSelectAsset(entity)
        highlightNode(entity?.guid)
    })

    // Port - Click
    graph.value.on('port:click', ({ e, node }) => {
        e.stopPropagation()

        resetState()

        const gEle = getEventPath(e).find((x) => x.getAttribute('port'))
        const portId = gEle.getAttribute('port')

        showLoader(e)
        selectPort(node, portId)
        const port = node.getPort(portId)
        onSelectAsset(port.entity)
    })

    // Blank - Click
    graph.value.on('blank:click', () => {
        if (selectedNodeId.value) resetSelectedNode()
    })

    // Blank - Mousewheel
    graph.value.on('blank:mousewheel', () => {
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })
}
