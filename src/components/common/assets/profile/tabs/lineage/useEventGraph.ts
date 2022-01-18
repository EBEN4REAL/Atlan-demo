import { watch, ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import useLineageStore from '~/store/lineage'
import useLineageService from '~/services/meta/lineage/lineage_service'
import useUpdateGraph from './useUpdateGraph'
import useGetNodes from './useGetNodes'
import useGraph from './useGraph'
import fetchColumns from './fetchColumns'
import fetchAsset from './fetchAsset'

const { highlightNodes, highlightEdges, styleReverseEdge } = useUpdateGraph()
const { useFetchLineage } = useLineageService()
const { createPortData, createCustomPortData, toggleNodesEdges, addEdge } =
    useGraph()
const lineageStore = useLineageStore()

export default function useEventGraph(
    graph,
    baseEntity,
    assetGuidToHighlight,
    highlightedNode,
    loaderCords,
    currZoom,
    resetSelections,
    config,
    drawerActiveKey,
    onSelectAsset,
    onCloseDrawer
) {
    /** DATA */
    const edgesHighlighted = ref([])
    const nodesTranslated = ref([])
    const che = ref('') // currentHilightedEdge
    const chp = ref({ portId: '', node: null, expandedNodes: [] }) // currentHilightedPort
    const nodesCaretClicked = ref([])
    const carets = document.getElementsByClassName('node-caret')
    const caretsArray = Array.from(carets)
    const activeNodesToggled = ref({})

    /** METHODS */
    // getHighlights
    const getHighlights = (guid) => {
        let nodesToHighlight = []
        if (guid.value) {
            const { predecessors, successors } = useGetNodes(graph, guid.value)
            nodesToHighlight = [guid.value, ...predecessors, ...successors]
        }

        return {
            nodesToHighlight,
        }
    }

    // highlight
    const highlight = (guid, styleHighlightedNode = true) => {
        if (guid === highlightedNode.value) {
            onCloseDrawer()
            assetGuidToHighlight.value = ''
        }

        highlightedNode.value =
            guid && guid !== highlightedNode.value ? guid : ''
        const { nodesToHighlight } = getHighlights(highlightedNode)
        highlightEdges(graph, nodesToHighlight, edgesHighlighted)
        highlightNodes(
            graph,
            styleHighlightedNode ? highlightedNode : '',
            nodesToHighlight
        )
        loaderCords.value = {}
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

        nodesToTranslate.forEach((nodeToTranslate) => {
            const { nttXPos, newY } = getNodeToTranslatePos(nodeToTranslate)

            nodeToTranslate.position(nttXPos, newY)

            if (nodesTranslated.value[node.id]) {
                const itExists = nodesTranslated.value[node.id].some(
                    (x) => x.id === nodeToTranslate.id
                )
                if (!itExists) {
                    nodesTranslated.value[node.id].push(nodeToTranslate)
                }
            } else nodesTranslated.value[node.id] = [nodeToTranslate]
        })
    }

    // translateExpandedNodesToDefault
    const translateExpandedNodesToDefault = (x) => {
        const nodesToTranslate = nodesTranslated.value?.[x.id] || []
        nodesToTranslate.forEach((nodeToTranslate) => {
            const { nttXPos, newY } = getNodeToTranslatePos(nodeToTranslate)
            nodeToTranslate.position(nttXPos, newY)
        })
    }

    // portExist
    const portExist = (id) => graph.value.getNodes().some((x) => x.hasPort(id))

    // getPortNode
    const getPortNode = (id) =>
        graph.value.getNodes().find((x) => x.hasPort(id))

    // getAllExpandedNodes
    const getAllExpandedNodes = () => {
        const chpExpandedNodes = [...chp.value.expandedNodes]
        const res = chpExpandedNodes
        if (chp.value.node) res.push(chp.value.node)
        return res
    }

    // isExpandedNode
    const isExpandedNode = (nodeId) => {
        const node = getAllExpandedNodes().find((x) => x.id === nodeId)
        return !!node
    }

    // isCHPExpandedNode
    const isCHPExpandedNode = (nodeId) => {
        const node = chp.value.expandedNodes.find((x) => x.id === nodeId)
        return !!node
    }

    // resetPortStyle
    const resetPortStyle = (node, portId) => {
        if (!node || !portId) return
        node.setPortProp(portId, 'attrs/portBody', {
            fill: '#ffffff',
        })
        node.setPortProp(portId, 'attrs/portBody', {
            stroke: '#e6e6eb',
        })
    }

    // setPortStyle
    const setPortStyle = (node, portId, mode = 'select') => {
        if (!node || !portId) return
        const fill = mode === 'select' ? '#F4F6FD' : '#ffffff'

        node.setPortProp(portId, 'attrs/portBody', {
            fill,
        })
        node.setPortProp(portId, 'attrs/portBody', {
            stroke: '#5277d7',
        })
    }

    // getCaretElement
    const getCaretElement = (nodeId) => {
        const graphNodeElement = document.querySelectorAll(
            `[data-cell-id="${nodeId}"]`
        )[0]
        const caretElement = Array.from(
            graphNodeElement.querySelectorAll('*')
        ).find((y) => y.classList.contains('node-caret'))
        return caretElement
    }

    // controlCaret
    const controlCaret = (nodeId, caretEle, override = false) => {
        if (override) {
            if (!nodesCaretClicked.value.includes(nodeId)) {
                nodesCaretClicked.value.push(nodeId)
            }
            caretEle.classList.add('caret-expanded')
            return
        }

        if (nodesCaretClicked.value.includes(nodeId)) {
            const index = nodesCaretClicked.value.findIndex((x) => x === nodeId)
            nodesCaretClicked.value.splice(index, 1)
            caretEle.classList.remove('caret-expanded')
        } else {
            nodesCaretClicked.value.push(nodeId)
            caretEle.classList.add('caret-expanded')
        }
    }

    // controlPorts
    const controlPorts = (node, columns, allRelations, override = false) => {
        if (node.getPorts().length === 1 || override) {
            const ports = columns.map((x) => {
                const { portData } = createPortData(x)
                return portData
            })
            ports.forEach((x) => {
                if (portExist(x.id)) {
                    const parentNode = getPortNode(x.id)
                    parentNode.removePort(x.id)
                }
            })
            node.addPorts(ports)
            if (override) {
                const createdPorts = node.getPorts()
                createdPorts.shift()
                createdPorts.forEach((port) => {
                    const exist = allRelations.find((rel) =>
                        [rel.fromEntityId, rel.toEntityId].includes(port.id)
                    )

                    if (exist && chp.value.portId !== port.id)
                        setPortStyle(node, port.id, 'highlight')
                })
            }
            translateSubsequentNodes(node)
        }
    }

    // createRelations
    const createRelations = (relations) => {
        const graphNodes = graph.value.getNodes()
        relations.forEach((x) => {
            const { fromEntityId, toEntityId, processId } = x

            const sourceCell = graphNodes.find((y) =>
                y.hasPort(fromEntityId)
            ).id
            const targetCell = graphNodes.find((y) => y.hasPort(toEntityId)).id
            const relation = {
                id: `port/${processId}/${fromEntityId}@${toEntityId}`,
                sourceCell,
                sourcePort: fromEntityId,
                targetCell,
                targetPort: toEntityId,
                stroke: '#5277d7',
            }
            addEdge(graph, relation)
        })
    }

    // getValidPortRelations
    const getValidPortRelations = (allRelations) => {
        let rel = []
        if (chp.value.portId) {
            rel = allRelations.filter((x) => {
                if (portExist(x.fromEntityId) && portExist(x.toEntityId)) {
                    return true
                }
                return false
            })
        }
        return rel
    }

    // getNodesColumnList
    const getNodeColumnList = (nodes, allRelations = []) => {
        const viewQualifiedName = ['def']
        const tableQualifiedName = ['def']

        nodes.forEach((node) => {
            const asset = node.store.data.entity
            const { typeName, attributes } = asset

            if (node.getPorts().length > 1) {
                const ports = node.getPorts()
                ports.shift()
                node.removePorts(ports)
                translateExpandedNodesToDefault(node)
                loaderCords.value = {}
                if (!allRelations.length) return
            }

            if (lineageStore.hasColumnList(node.id)) {
                const columnList = lineageStore.getNodesColumnList(node.id)
                if (columnList[0]?.text) {
                    const { text } = columnList[0]
                    const { portData } = createCustomPortData(node.id, text)
                    node.addPort(portData)
                } else {
                    const override = !!allRelations.length
                    controlPorts(node, columnList, allRelations, override)
                }

                const rel = getValidPortRelations(allRelations)
                createRelations(rel)
                translateSubsequentNodes(node)
                loaderCords.value = {}
                return
            }

            if (typeName.toLowerCase() === 'view')
                viewQualifiedName.push(attributes.qualifiedName)
            else if (typeName.toLowerCase() === 'table')
                tableQualifiedName.push(attributes.qualifiedName)
        })

        if (tableQualifiedName.length === 1 && viewQualifiedName.length === 1) {
            loaderCords.value = {}
            return
        }

        const { list } = fetchColumns({
            viewQualifiedName,
            tableQualifiedName,
        })

        watch(
            list,
            () => {
                if (!list.value) {
                    const node = nodes[0]
                    const caretElement = getCaretElement(node.id)
                    controlCaret(node.id, caretElement)
                    loaderCords.value = {}
                    message.info('No column with lineage found for this node')
                    return
                }
                nodes.forEach((node) => {
                    const asset = node.store.data.entity
                    const guid = node.id
                    const assetType = asset.typeName.toLowerCase()
                    const columns = list.value.filter(
                        (column) =>
                            column.attributes?.[assetType]?.guid === guid
                    )
                    const override = !!allRelations.length
                    controlPorts(node, columns, allRelations, override)
                    if (!lineageStore.hasColumnList(node.id))
                        lineageStore.setNodesColumnList(node.id, columns)
                    const rel = getValidPortRelations(allRelations)
                    createRelations(rel)
                    translateSubsequentNodes(node)
                })
                loaderCords.value = {}
            },
            { deep: true }
        )
    }

    // controlTranslate
    const controlTranslate = (portId, lineage) => {
        const translateCandidates = []
        Object.entries(lineage.guidEntityMap).forEach(([k, v]) => {
            if (k !== portId) {
                const qnArr = v.attributes.qualifiedName.split('/')
                qnArr.pop()
                const parentName = qnArr.join('/')
                const graphNodes = graph.value.getNodes()
                const parentNode = graphNodes.find(
                    (x) =>
                        x.store.data.entity.attributes.qualifiedName ===
                            parentName ||
                        x.store.data.entity.typeName.toLowerCase() ===
                            'powerbidataset'
                )
                const parentNodeExists = translateCandidates.find(
                    (x) => x?.id === parentNode?.id
                )
                if (parentNode && !parentNodeExists)
                    translateCandidates.push(parentNode)
            }
        })
        toggleNodesEdges(graph, false)

        if (!translateCandidates.length) {
            toggleNodesEdges(graph, true)
            loaderCords.value = {}
            message.info(
                'The selected column has no relations for the nodes on the graph'
            )
            return
        }

        translateCandidates.sort(
            (a, b) => Number(a.store.data._order) - Number(b.store.data._order)
        )

        translateCandidates.forEach((x) => {
            const caretElement = getCaretElement(x.id)
            controlCaret(x.id, caretElement, true)
        })

        getNodeColumnList(translateCandidates, lineage.relations)

        chp.value.expandedNodes = translateCandidates
    }

    // getColumnLineage
    const getColumnLineage = (portId) => {
        if (lineageStore.hasColumnLineage(portId)) {
            const lineage = lineageStore.getColumnsLineage(portId)
            controlTranslate(portId, lineage)
            return
        }
        const { depth, direction, hideProcess } = config.value
        const portConfig = computed(() => ({
            depth,
            guid: portId,
            direction,
            hideProcess,
        }))
        const { data } = useFetchLineage(portConfig, true)

        watch(data, () => {
            if (!data.value?.relations.length) {
                toggleNodesEdges(graph, true)
                loaderCords.value = {}
                message.info('No lineage data available for selected column')
                return
            }

            let lineageData = data.value

            const { relations, guidEntityMap } = lineageData
            const powerBiDatasets = Object.values(guidEntityMap)
                .filter((x) => x.typeName.toLowerCase() === 'powerbidataset')
                .map((x) => x.guid)
            if (powerBiDatasets.length) {
                const newRelations = []
                relations.forEach((x) => {
                    const { fromEntityId, toEntityId, processId } = x
                    let newFromEntityId = fromEntityId
                    let newToEntityId = fromEntityId
                    if (powerBiDatasets.includes(fromEntityId)) {
                        newFromEntityId = `${fromEntityId}-invisiblePort`
                    }
                    if (powerBiDatasets.includes(toEntityId)) {
                        newToEntityId = `${toEntityId}-invisiblePort`
                    }
                    const newRelation = {
                        fromEntityId: newFromEntityId,
                        toEntityId: newToEntityId,
                        processId,
                    }
                    newRelations.push(newRelation)
                })
                lineageData = { ...lineageData, relations: newRelations }
            }

            lineageStore.setColumnsLineage(portId, lineageData)
            controlTranslate(portId, lineageData)
        })
    }

    // controlEdgeHighlight
    const controlEdgeHighlight = (edge, reset, animate = false) => {
        if (!edge) return
        edge.attr('line/stroke', reset ? '#c7c7c7' : '#5277d7')
        edge.attr('line/strokeWidth', reset ? 1.6 : 3)
        edge.attr('line/targetMarker/stroke', reset ? '#c7c7c7' : '#5277d7')
        edge.attr('line/targetMarker/height', reset ? 0.1 : 12)
        edge.attr('line/targetMarker/width', reset ? 0.1 : 12)
        edge.toFront()

        if (animate)
            edge.attr('line/style/animation', 'ant-line 30s infinite linear')
        else edge.attr('line/style/animation', 'unset')

        const s = edge.getSourcePoint()
        const t = edge.getTargetPoint()

        if (s.x < t.x) edge.attr('line/strokeDasharray', reset ? 0 : 5)
        else edge.attr('line/stroke', reset ? '#aaaaaa' : '#5277d7')
    }

    // getEventPath
    const getEventPath = (e) => {
        const path = (e.composedPath && e.composedPath()) || e.path
        const target = e?.target

        if (path != null)
            return path.indexOf(window) < 0 ? path.concat(window) : path
        if (target === window) return [window]

        function getParents(node, memo = []) {
            const parentNode = node?.parentNode
            if (!parentNode) return memo
            return getParents(parentNode, memo.concat(parentNode))
        }

        return [target].concat(getParents(target), window)
    }

    // handleToggleOfActiveNode
    const handleToggleOfActiveNode = (node) => {
        const ports = node.getPorts()
        ports.shift()
        activeNodesToggled.value[node.id] = { ports, newEdgesId: [], edges: [] }

        const graphEdges = graph.value.getEdges()
        const newEdgesIdSet = new Set()

        ports.forEach((port) => {
            const edges = graphEdges.filter((edge) => edge.id.includes(port.id))

            edges.forEach((edge) => {
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
                createRelations([newRelation])
            })
            activeNodesToggled.value[node.id].edges.push(...edges)
        })

        activeNodesToggled.value[node.id].newEdgesId = Array.from(newEdgesIdSet)
    }

    // registerCaretListeners
    const registerCaretListeners = () => {
        caretsArray.forEach((x) => {
            x.addEventListener('mousedown', (e) => {
                e.stopPropagation()

                loaderCords.value = { x: e.clientX, y: e.clientY }

                const ele = getEventPath(e).find((x) =>
                    x.getAttribute('data-cell-id')
                )
                const nodeId = ele.getAttribute('data-cell-id')
                const graphNodes = graph.value.getNodes()
                const node = graphNodes.find((x) => x.id === nodeId)

                controlCaret(nodeId, x)

                if (!isExpandedNode(nodeId)) {
                    getNodeColumnList([node])
                }

                if (isExpandedNode(nodeId)) {
                    if (!activeNodesToggled.value[node.id]) {
                        handleToggleOfActiveNode(node)
                        const ports = node.getPorts()
                        ports.shift()
                        node.removePorts(ports)
                    } else {
                        const { edges, ports } =
                            activeNodesToggled.value[node.id]
                        node.addPorts(ports)
                        edges.forEach((edge) => {
                            const [_, processId, sourceTarget] =
                                edge.id.split('/')
                            const [source, target] = sourceTarget.split('@')
                            const relation = {
                                fromEntityId: source,
                                toEntityId: target,
                                processId,
                            }
                            createRelations([relation])
                        })

                        activeNodesToggled.value[node.id].newEdgesId.forEach(
                            (edgeId) => {
                                const cell = graph.value.getCellById(edgeId)
                                if (cell) cell.remove()
                            }
                        )
                        delete activeNodesToggled.value[node.id]
                    }
                    translateExpandedNodesToDefault(node)
                    loaderCords.value = {}
                }
            })
        })
    }
    registerCaretListeners()

    // removeCHPEdges
    const removeCHPEdges = () => {
        const graphEdges = graph.value.getEdges()
        const edges = graphEdges.filter((x) => x.id.includes(chp.value.portId))
        edges.forEach((edge) => {
            const cell = graph.value.getCellById(edge.id)
            cell.remove()
        })
    }

    // selectPort
    const selectPort = (node, e, portId) => {
        resetPortStyle(chp.value.node, chp.value.portId)

        if (chp.value.portId) removeCHPEdges()
        activeNodesToggled.value = {}
        chp.value.expandedNodes.forEach((x) => {
            if (x.id === node.id) return
            const ports = x.getPorts()
            if (ports.length > 1) {
                ports.shift()
                const portsToRemove = ports.filter((x) => x.id !== portId)
                x.removePorts(portsToRemove)
            }
            translateExpandedNodesToDefault(x)
        })
        chp.value.node = getPortNode(portId)
        chp.value.portId = portId
        chp.value.expandedNodes = []
        const nodePorts = node.getPorts()
        nodePorts.shift()
        nodePorts.forEach((port) => {
            if (port.id === portId) setPortStyle(node, portId, 'select')
            else resetPortStyle(node, port.id)
        })
        loaderCords.value = { x: e.clientX, y: e.clientY }
        if (!chp.value.portId.includes('ctaPort')) getColumnLineage(portId)
    }

    // deselectPort
    const deselectPort = () => {
        resetPortStyle(chp.value.node, chp.value.portId)

        if (chp.value.portId) removeCHPEdges()
        activeNodesToggled.value = {}
        chp.value.expandedNodes.forEach((x) => {
            const caretElement = getCaretElement(x.id)
            controlCaret(x.id, caretElement)
            const portsToRemove = x.getPorts()
            if (portsToRemove.length > 1) {
                portsToRemove.shift()
                x.removePorts(portsToRemove)
            }
            translateExpandedNodesToDefault(x)
        })
        chp.value.node = null
        chp.value.portId = ''
        chp.value.expandedNodes = []
        toggleNodesEdges(graph, true)
    }

    /** EVENTS */
    // PORT - CLICK
    graph.value.on('port:click', ({ e, node }) => {
        e.stopPropagation()
        const ele = getEventPath(e).find((x) => x.getAttribute('port'))
        const portId = ele.getAttribute('port')

        if (chp.value.portId === portId) {
            deselectPort()
            onCloseDrawer()
        } else {
            selectPort(node, e, portId)
            if (portId.includes('ctaPort')) {
                setPortStyle(node, portId, 'select')
                if (drawerActiveKey.value === 'Relations') {
                    resetPortStyle(node, portId)
                    onCloseDrawer()
                    return
                }
                onSelectAsset(node.store.data.entity)
                setTimeout(() => {
                    drawerActiveKey.value = 'Relations'
                    loaderCords.value = {}
                }, 500)
                return
            }
            const port = node.getPort(portId)
            onSelectAsset(port.entity)
        }
    })

    // EDGE - CLICK
    graph.value.on('edge:click', ({ e, edge, cell }) => {
        if (chp.value.portId) return
        loaderCords.value = { x: e.clientX, y: e.clientY }

        if (edge.id.includes('port')) {
            loaderCords.value = {}
            return
        }
        if (che.value === edge.id) {
            che.value = ''
            onCloseDrawer()
            controlEdgeHighlight(edge, true)
            highlight(null)
            return
        }
        if (che.value) {
            controlEdgeHighlight(edge, true)
            highlight(null)
        }
        che.value = edge.id
        controlEdgeHighlight(edge, false)
        const processId = edge.id.split('/')[0]
        const { data } = fetchAsset(processId)
        watch(data, () => {
            onSelectAsset(data.value)
            const target = edge.id.split('/')[1].split('@')[1]
            highlight(target, false)
            loaderCords.value = {}
        })
    })

    // EDGE - MOUSEENTER
    graph.value.on('edge:mouseenter', ({ cell, edge }) => {
        if (chp.value.portId) return
        if (edge.id.includes('port')) {
            loaderCords.value = {}
            return
        }
        if (che.value === edge.id) return
        if (!edgesHighlighted.value.includes(edge.id))
            controlEdgeHighlight(edge, false, true)
        edgesHighlighted.value.forEach((id) => {
            const edgeCell = graph.value.getCellById(id)
            edgeCell.toFront()
        })
    })

    // EDGE - MOUSELEAVE
    graph.value.on('edge:mouseleave', ({ cell, edge }) => {
        if (chp.value.portId) return
        if (edge.id.includes('port')) {
            loaderCords.value = {}
            return
        }
        if (che.value === edge.id) return
        if (!edgesHighlighted.value.includes(edge.id))
            controlEdgeHighlight(edge, true)
        edgesHighlighted.value.forEach((id) => {
            const edgeCell = graph.value.getCellById(id)
            edgeCell.toFront()
        })
    })

    // NODE - MOUSEUP
    graph.value.on('node:mouseup', ({ e, node }) => {
        if (chp.value.portId) deselectPort()
        if (che.value) {
            const cheCell = graph.value.getCellById(che.value)
            controlEdgeHighlight(cheCell, true)
            che.value = ''
        }

        loaderCords.value = { x: e.clientX, y: e.clientY }
        onSelectAsset(node.store.data.entity)
        highlight(node?.id)
    })

    // BLANK - CLICK
    graph.value.on('blank:click', () => {
        if (chp.value.portId) return
        onSelectAsset(baseEntity.value)
        onCloseDrawer()
        che.value = ''
        highlight(null)
    })

    // BLANK - MOUSEWHEEL
    graph.value.on('blank:mousewheel', () => {
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })

    // CELL - MOUSEWHEEL
    graph.value.on('cell:mousewheel', () => {
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })

    // EDGE ADDED - Style backward pointing edges
    graph.value.on('edge:added', ({ edge }) => {
        styleReverseEdge(edge)
    })

    // Set style of present edges which point backwards
    graph.value.getEdges().forEach((edge) => {
        styleReverseEdge(edge)
    })

    /** WATCHERS */
    watch(assetGuidToHighlight, (newVal) => {
        if (!newVal) highlight(null)
        else highlight(newVal)
    })

    watch(resetSelections, (newVal) => {
        if (newVal) {
            onSelectAsset(baseEntity.value, false, false)
            styleReverseEdge(graph.value.getCellById(che.value))
            che.value = ''
            drawerActiveKey.value = 'Info'
            if (highlightedNode.value) highlight(null)
            if (chp.value.portId) deselectPort()

            resetSelections.value = false
        }
    })
}
