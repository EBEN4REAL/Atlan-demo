import { watch, ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import useLineageStore from '~/store/lineage'
import useLineageService from '~/services/meta/lineage/lineage_service'
import useUpdateGraph from './useUpdateGraph'
import useGetNodes from './useGetNodes'
import useGraph from './useGraph'
import fetchColumns from './fetchColumns'
import fetchAsset from './fetchAsset'

const { highlightNodes, highlightEdges } = useUpdateGraph()
const { useFetchLineage } = useLineageService()
const { createPortData, toggleNodesEdges, addEdge } = useGraph()
const lineageStore = useLineageStore()
lineageStore.nodesColumnList = {}
lineageStore.nodesPortList = {}
lineageStore.columnsLineage = {}

export default function useEventGraph(
    graph,
    baseEntity,
    assetGuidToHighlight,
    highlightedNode,
    loaderCords,
    currZoom,
    resetSelections,
    config,
    onSelectAsset,
    onCloseDrawer
) {
    /** DATA */
    const edgesHighlighted = ref([])
    const nodesTranslated = ref([])
    const che = ref('') // che -> currentHilightedEdge
    const chp = ref({ portId: '', node: null, expandedNodes: [] }) // chp -> currentHilightedPort
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
            const { x: x3 } = nodeToTranslate.position()
            const justBefore = graph.value.getNodes().find((n) => {
                const { x: xq } = n.position()
                const orderDiff =
                    nodeToTranslate.store.data._order - n.store.data._order
                if (xq === x3 && orderDiff === 1) return n
                return false
            })

            const { y: y2 } = justBefore.position()
            const justBeforePortsLength = justBefore.getPorts().length - 1
            const portsLengthTotal = justBeforePortsLength * 40
            const newY = y2 + 130.5 + portsLengthTotal

            nodeToTranslate.position(x3, newY)

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
            const { x: x1 } = nodeToTranslate.position()
            const justBefore = graph.value.getNodes().find((n) => {
                const { x: xq } = n.position()
                const orderDiff =
                    nodeToTranslate.store.data._order - n.store.data._order
                if (xq === x1 && orderDiff === 1) return n
                return false
            })

            const { y: y2 } = justBefore.position()
            const justBeforePortsLength = justBefore.getPorts().length - 1
            const portsLengthTotal = justBeforePortsLength * 40
            const newY = y2 + 130.5 + portsLengthTotal

            nodeToTranslate.position(x1, newY)
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
    const controlPorts = (node, columns, override = false) => {
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
                    setPortStyle(node, port.id, 'highlight')
                })
            }
            if (!lineageStore.hasPortList(node.id))
                lineageStore.setNodesPortList(node.id, ports)
            translateSubsequentNodes(node)
        } else {
            const ports = node.getPorts()
            ports.shift()
            node.removePorts(ports)
            translateExpandedNodesToDefault(node)
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
        let viewQualifiedName = ['def']
        let tableQualifiedName = ['def']

        nodes.forEach((node) => {
            if (lineageStore.hasColumnList(node.id)) {
                const columnList = lineageStore.getNodesColumnList(node.id)
                const override = allRelations.length ? true : false
                controlPorts(node, columnList, override)
                const rel = getValidPortRelations(allRelations)
                createRelations(rel)
                loaderCords.value = {}
                return
            }

            const asset = node.store.data.entity
            const { typeName, attributes } = asset
            if (typeName.toLowerCase() === 'view')
                viewQualifiedName.push(attributes.qualifiedName)
            else if (typeName.toLowerCase() === 'table')
                tableQualifiedName.push(attributes.qualifiedName)
        })

        if (tableQualifiedName.length === 1 && viewQualifiedName.length === 1)
            return

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
                    const override = allRelations.length ? true : false
                    controlPorts(node, columns, override)
                    if (!lineageStore.hasColumnList(node.id))
                        lineageStore.setNodesColumnList(node.id, columns)
                    const rel = getValidPortRelations(allRelations)
                    createRelations(rel)
                })
                loaderCords.value = {}
            },
            { deep: true }
        )
    }

    // controlTranslate
    const controlTranslate = (portId, lineage) => {
        const translateCandidatesSet = new Set()
        Object.entries(lineage.guidEntityMap).forEach(([k, v]) => {
            if (k !== portId) {
                const qn = v.attributes.qualifiedName.split('/')
                const parentName = qn[qn.length - 2]
                const graphNodes = graph.value.getNodes()
                const parentNode = graphNodes.find(
                    (x) => x.store.data.entity.displayText === parentName
                )
                if (parentNode) translateCandidatesSet.add(parentNode)
            }
        })
        toggleNodesEdges(graph, false)

        const translateCandidates = Array.from(translateCandidatesSet)

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
        translateCandidates.forEach((candidate) => {
            translateSubsequentNodes(candidate)
        })
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
            lineageStore.setColumnsLineage(portId, data.value)
            controlTranslate(portId, data.value)
        })
    }

    // controlEdgeHighlight
    const controlEdgeHighlight = (cell, reset, animate = false) => {
        if (!cell) return
        cell.attr('line/stroke', reset ? '#c7c7c7' : '#5277d7')
        cell.attr('line/strokeWidth', reset ? 1.6 : 3)
        cell.attr('line/strokeDasharray', reset ? 0 : 5)
        cell.attr('line/targetMarker/stroke', reset ? '#c7c7c7' : '#5277d7')
        cell.toFront()
        if (animate)
            cell.attr('line/style/animation', 'ant-line 30s infinite linear')
        else cell.attr('line/style/animation', 'unset')
    }

    // getEventPath
    const getEventPath = (e) => {
        let path = (e.composedPath && e.composedPath()) || e.path
        let target = e.target

        if (path != null)
            return path.indexOf(window) < 0 ? path.concat(window) : path
        if (target === window) return [window]

        function getParents(node, memo) {
            memo = memo || []
            let parentNode = node.parentNode
            if (!parentNode) return memo
            else return getParents(parentNode, memo.concat(parentNode))
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

    // selectPort
    const selectPort = (node, e, portId) => {
        resetPortStyle(chp.value.node, chp.value.portId)
        chp.value.expandedNodes.forEach((x) => {
            if (x.id === node.id) return
            const ports = x.getPorts()
            ports.shift()
            const portsToRemove = ports.filter((x) => x.id !== portId)
            x.removePorts(portsToRemove)
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
        getColumnLineage(portId)
    }

    // deselectPort
    const deselectPort = () => {
        resetPortStyle(chp.value.node, chp.value.portId)
        chp.value.expandedNodes.forEach((x) => {
            const caretElement = getCaretElement(x.id)
            controlCaret(x.id, caretElement)
            const portsToRemove = x.getPorts()
            portsToRemove.shift()
            x.removePorts(portsToRemove)
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
            const port = node.getPort(portId)
            onSelectAsset(port.entity)
        }
    })

    // EDGE - CLICK
    const cheCell = graph.value.getCellById(che.value)
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
            controlEdgeHighlight(cheCell, true)
            highlight(null)
            return
        }
        if (che.value) {
            controlEdgeHighlight(cheCell, true)
            highlight(null)
        }
        che.value = edge.id
        controlEdgeHighlight(cell, false)
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
            controlEdgeHighlight(cell, false, true)
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
            controlEdgeHighlight(cell, true)
        edgesHighlighted.value.forEach((id) => {
            const edgeCell = graph.value.getCellById(id)
            edgeCell.toFront()
        })
    })

    // NODE - MOUSEUP
    graph.value.on('node:mouseup', ({ e, node }) => {
        if (chp.value.portId) deselectPort()

        loaderCords.value = { x: e.clientX, y: e.clientY }
        onSelectAsset(node.store.data.entity)
        highlight(node?.id)
        che.value = ''
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

    /** WATCHERS */
    watch(assetGuidToHighlight, (newVal) => {
        if (!newVal) highlight(null)
        else highlight(newVal)
    })

    watch(resetSelections, (newVal) => {
        if (newVal) {
            onSelectAsset(baseEntity.value, false, false)
            che.value = ''
            if (highlightedNode.value) highlight(null)
            resetSelections.value = false
        }
    })
}
