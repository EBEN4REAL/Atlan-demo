import { watch, ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import useLineageService from '~/services/meta/lineage/lineage_service'
import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
import {
    AssetAttributes,
    AssetRelationAttributes,
    InternalAttributes,
    SQLAttributes,
} from '~/constant/projection'
import useUpdateGraph from './useUpdateGraph'
import useGetNodes from './useGetNodes'
import useGraph from './useGraph'

const { highlightNodes, highlightEdges } = useUpdateGraph()
const { useFetchLineage } = useLineageService()
const { createPortData, toggleNodesEdges, addEdge } = useGraph()

export default function useEventGraph(
    graph,
    baseEntity,
    lineageWithProcess,
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
    const isNodeClicked = ref(false)
    const nodesColumns = ref({})
    const nodesPorts = ref({})
    const edgesHighlighted = ref([])
    const nodesTranslated = ref([])
    const che = ref('') // che -> currentHilightedEdge
    const chp = ref({ portId: '', expandedNodes: [] }) // chp -> currentHilightedPort

    /** WATCHERS */
    watch(assetGuidToHighlight, (newVal) => {
        if (!newVal) highlight(null)
        else highlight(newVal)
    })

    watch(resetSelections, (newVal) => {
        if (newVal) {
            onSelectAsset(baseEntity.value, false, false)
            che.value = ''
            highlight(null)
            resetSelections.value = false
        }
    })

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
        if (guid === highlightedNode.value) onCloseDrawer()

        highlightedNode.value =
            guid && guid !== highlightedNode.value ? guid : ''
        const { nodesToHighlight } = getHighlights(highlightedNode)
        highlightEdges(graph, nodesToHighlight, edgesHighlighted)
        highlightNodes(
            graph,
            styleHighlightedNode ? highlightedNode : '',
            nodesToHighlight
        )
        assetGuidToHighlight.value = ''
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
        nodesTranslated.value[x.id] = []
    }

    // portExist
    const portExist = (id) => graph.value.getNodes().some((x) => x.hasPort(id))

    // getPortNode
    const getPortNode = (id) =>
        graph.value.getNodes().find((x) => x.hasPort(id))

    // isNodeExpanded
    const isNodeExpanded = (id) =>
        chp.value.expandedNodes.some((x) => x.id === id)

    // controlPorts
    const controlPorts = (node) => {
        if (!nodesPorts.value?.[node.id]?.length) {
            const ports = nodesColumns.value[node.id].map((x) => {
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

            translateSubsequentNodes(node)

            nodesPorts.value[node.id] = ports
        } else {
            const ports = node.getPorts()
            ports.shift()
            node.removePorts(ports)
            translateExpandedNodesToDefault(node)
            nodesPorts.value[node.id] = []
        }
    }

    // createRelations
    const createRelations = (relations) => {
        const graphNodes = graph.value.getNodes()
        relations.forEach((x) => {
            const sourceCell = graphNodes.find((y) =>
                y.hasPort(x.fromEntityId)
            ).id
            const targetCell = graphNodes.find((y) =>
                y.hasPort(x.toEntityId)
            ).id
            const relation = {
                id: `processIdGoesHere/${x.fromEntityId}@${x.toEntityId}`,
                sourceCell,
                sourcePort: x.fromEntityId,
                targetCell,
                targetPort: x.toEntityId,
                stroke: '#5277d7',
            }
            addEdge(graph, relation)
        })
    }

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

    // getNodeColumnList
    const getNodeColumnList = (node, asset, allRelations = []) => {
        if (nodesColumns.value[asset.guid]) {
            controlPorts(node)
            const rel = getValidPortRelations(allRelations)
            createRelations(rel)
            loaderCords.value = {}
            return
        }

        const { typeName, attributes: attr } = asset
        const facets = ref({})
        const dependentKey = ref('LINEAGE_COLUMNS')
        const aggregations = ref(['dataType'])
        const limit = ref(20)
        const offset = ref(0)
        const preference = ref({ sort: 'order-asc' })
        const relationAttributes = ref([...AssetRelationAttributes])
        const attributes = ref([
            ...InternalAttributes,
            ...AssetAttributes,
            ...SQLAttributes,
        ])

        facets.value[`${typeName.toLowerCase()}QualifiedName`] =
            attr.qualifiedName

        const { list } = useDiscoverList({
            isCache: false,
            dependentKey,
            facets,
            aggregations,
            preference,
            limit,
            offset,
            attributes,
            relationAttributes,
        })

        watch(
            list,
            () => {
                nodesColumns.value[asset.guid] = list.value
                controlPorts(node)
                const rel = getValidPortRelations(allRelations)
                createRelations(rel)
                loaderCords.value = {}
            },
            { deep: true }
        )
    }

    // getColumnLineage
    const getColumnLineage = (portId) => {
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
                loaderCords.value = {}
                message.info('No lineage data available for selected column')
                return
            }
            const translateCandidatesSet = new Set()
            Object.entries(data.value.guidEntityMap).forEach(([k, v]) => {
                if (k !== portId) {
                    toggleNodesEdges(graph, false)
                    const qn = v.attributes.qualifiedName.split('/')
                    const parentName = qn[qn.length - 2]
                    const graphNodes = graph.value.getNodes()
                    const parentNode = graphNodes.find(
                        (x) => x.store.data.entity.displayText === parentName
                    )
                    if (parentNode) translateCandidatesSet.add(parentNode)
                }
            })

            const translateCandidates = Array.from(translateCandidatesSet)
            translateCandidates.sort(
                (a, b) =>
                    Number(a.store.data._order) - Number(b.store.data._order)
            )

            translateCandidates.forEach((x) => {
                if (nodesPorts.value?.[x.id]) nodesPorts.value[x.id] = []
                getNodeColumnList(x, x.store.data.entity, data.value.relations)
            })

            chp.value.expandedNodes = translateCandidates
            translateCandidates.forEach((candidate) => {
                translateSubsequentNodes(candidate)
            })
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

    /** EVENTS */
    // PORT - CLICK
    graph.value.on('port:click', ({ e, node }) => {
        e.stopPropagation()

        const ele = getEventPath(e).find((x) => x.getAttribute('port'))
        const portId = ele.getAttribute('port')
        if (chp.value.portId === portId) {
            // if current port - deselect
            node.setPortProp(chp.value.portId, 'attrs/portBody', {
                fill: '#ffffff',
            })
            chp.value.expandedNodes.forEach((x) => {
                // remove ports of all interlinked nodes
                nodesPorts.value[x.id] = []
                const portsToRemove = x.getPorts()
                portsToRemove.shift()
                x.removePorts(portsToRemove)
                translateExpandedNodesToDefault(x)
            })
            chp.value.portId = ''
            chp.value.expandedNodes = []
            toggleNodesEdges(graph, true)
        } else {
            // if new port
            const chpNode = graph.value
                .getNodes()
                .find((x) => x.hasPort(chp.value.portId))
            if (chpNode) {
                chp.value.expandedNodes.push(chpNode)
                chpNode.setPortProp(chp.value.portId, 'attrs/portBody', {
                    fill: '#ffffff',
                })
            }
            chp.value.expandedNodes.forEach((x) => {
                if (x.id === node.id) return
                nodesPorts.value[x.id] = []
                const ports = x.getPorts()
                ports.shift()
                const portsToRemove = ports.filter((x) => x.id !== portId)
                x.removePorts(portsToRemove)
                translateExpandedNodesToDefault(x)
            })
            chp.value.portId = portId
            chp.value.expandedNodes = []
            node.setPortProp(portId, 'attrs/portBody', {
                fill: '#e5ecff',
            })
            loaderCords.value = { x: e.clientX, y: e.clientY }
            getColumnLineage(portId)
        }
    })

    // EDGE - CLICK
    const cheCell = graph.value.getCellById(che.value)
    graph.value.on('edge:click', ({ edge, cell }) => {
        if (edge.id.includes('processIdGoesHere')) return
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
        const processEntity = lineageWithProcess.value.guidEntityMap[processId]
        onSelectAsset(processEntity)
        const target = edge.id.split('/')[1].split('@')[1]
        highlight(target, false)
    })

    // EDGE - MOUSEENTER
    graph.value.on('edge:mouseenter', ({ cell, edge }) => {
        if (chp.value.portId) return
        if (edge.id.includes('processIdGoesHere')) return
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
        if (edge.id.includes('processIdGoesHere')) return
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
        loaderCords.value = { x: e.clientX, y: e.clientY }
        const chpNode = getPortNode(chp.value.portId)
        if (isNodeExpanded(node.id) || chpNode?.id === node.id) {
            loaderCords.value = {}
            return
        }
        isNodeClicked.value = true
        const nodeClickAction = () => {
            if (!isNodeClicked.value) return
            if (chp.value.portId) {
                loaderCords.value = {}
                return
            }
            onSelectAsset(node.store.data.entity)
            highlight(node?.id)
            che.value = ''
        }
        setTimeout(nodeClickAction, 300)
    })

    // NODE - DBLCLICK
    graph.value.on('node:dblclick', ({ node }) => {
        const chpNode = getPortNode(chp.value.portId)
        if (isNodeExpanded(node.id) || chpNode?.id === node.id) {
            loaderCords.value = {}
            return
        }
        isNodeClicked.value = false
        getNodeColumnList(node, node.store.data.entity)
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
}
