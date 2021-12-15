import { watch, ref } from 'vue'
import { dataTypeCategoryList } from '~/constant/dataType'
import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
import {
    AssetAttributes,
    AssetRelationAttributes,
    InternalAttributes,
    SQLAttributes,
} from '~/constant/projection'
import useUpdateGraph from './useUpdateGraph'
import useGetNodes from './useGetNodes'

const { highlightNodes, highlightEdges } = useUpdateGraph()

export default function useEventGraph(
    graph,
    baseEntity,
    lineageWithProcess,
    assetGuidToHighlight,
    highlightedNode,
    loaderCords,
    currZoom,
    onSelectAsset,
    resetSelections
) {
    const edgesHighlighted = ref([])

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

    const highlight = (guid, styleHighlightedNode = true) => {
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

    const columns = ref({})
    const nodesWithPorts = ref({})
    const nodesTranslated = ref([])

    const controlPorts = (node) => {
        if (!nodesWithPorts.value[node.id]) {
            const ports = columns.value[node.id].map((x) => {
                const text =
                    x.displayText.charAt(0).toUpperCase() +
                    x.displayText.slice(1).toLowerCase()
                const dataType = dataTypeCategoryList.find((d) =>
                    d.type.includes(x.attributes.dataType.toUpperCase())
                )?.imageText

                return {
                    id: x.guid,
                    group: 'columnList',
                    attrs: {
                        portBody: {},
                        portNameLabel: {
                            text,
                        },
                        portImage: {
                            href: `/dataType/${dataType}.svg`,
                            width: 16,
                            height: 16,
                        },
                    },
                }
            })
            node.addPorts(ports)

            const { x, y } = node.position()
            const nodesToTranslate = graph.value.getNodes().filter((n) => {
                const { x: x2 } = n.position()
                if (x === x2 && n.id !== node.id) return n
                return false
            })

            nodesToTranslate.forEach((nodeToTranslate) => {
                const { x: x2, y: y2 } = nodeToTranslate.position()
                if (y2 > y) {
                    const cell = graph.value.getCellById(nodeToTranslate.id)
                    cell.setData({ prevY: y2 })
                    const newY = y2 + ports.length * 40
                    nodeToTranslate.position(x2, newY)
                    if (nodesTranslated.value[node.id])
                        nodesTranslated.value[node.id].push(nodeToTranslate)
                    else nodesTranslated.value[node.id] = [nodeToTranslate]
                }
            })
            nodesWithPorts.value[node.id] = true
        } else {
            const ports = node.getPorts()
            ports.shift()
            node.removePorts(ports)
            const nodesToTranslate = nodesTranslated.value?.[node.id] || []
            nodesToTranslate.forEach((nodeToTranslate) => {
                const { x: x1 } = nodeToTranslate.position()
                const data = nodeToTranslate.getData()
                nodeToTranslate.position(x1, data.prevY)
                nodesTranslated.value[node.id] = []
            })
            nodesWithPorts.value[node.id] = false
        }
    }

    const getColumnsList = (node, asset) => {
        if (columns.value[asset.guid]) {
            controlPorts(node)
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

        watch(list, () => {
            columns.value[asset.guid] = list.value
            controlPorts(node)
            loaderCords.value = {}
        })
    }

    const chp = ref({}) // chp -> currentHilightedPort
    graph.value.on('port:click', ({ e, node }) => {
        e.stopPropagation()
        const ele = e.originalEvent.path.find((x) => x.getAttribute('port'))
        const portId = ele.getAttribute('port')
        if (chp.value[node.id] && node.getPort(chp.value[node.id]))
            node.setPortProp(chp.value[node.id], 'attrs/portBody', {
                fill: '#ffffff',
            })
        if (chp.value[node.id] !== portId)
            node.setPortProp(portId, 'attrs/portBody', {
                fill: '#e5ecff',
            })
        if (chp.value[node.id])
            chp.value[node.id] = chp.value[node.id] !== portId ? portId : ''
        else chp.value = { ...chp.value, ...{ [node.id]: portId } }
    })

    const che = ref('') // che -> currentHilightedEdge
    const controlEdgeHighlight = (cell, reset, animate = false) => {
        if (!cell) return
        cell.attr('line/stroke', reset ? '#c7c7c7' : '#5277d7')
        cell.attr('line/strokeWidth', reset ? 1.6 : 2)
        cell.attr('line/strokeDasharray', reset ? 0 : 5)
        cell.attr('line/targetMarker/stroke', reset ? '#c7c7c7' : '#5277d7')
        cell.toFront()
        if (animate)
            cell.attr('line/style/animation', 'ant-line 30s infinite linear')
        else cell.attr('line/style/animation', 'unset')
    }
    const cheCell = graph.value.getCellById(che.value)
    graph.value.on('edge:click', ({ edge, cell }) => {
        if (che.value === edge.id) {
            che.value = ''
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
    graph.value.on('edge:mouseenter', ({ cell, edge }) => {
        if (che.value === edge.id) return
        if (!edgesHighlighted.value.includes(edge.id))
            controlEdgeHighlight(cell, false, true)
        edgesHighlighted.value.forEach((id) => {
            const edgeCell = graph.value.getCellById(id)
            edgeCell.toFront()
        })
    })
    graph.value.on('edge:mouseleave', ({ cell, edge }) => {
        if (che.value === edge.id) return
        if (!edgesHighlighted.value.includes(edge.id))
            controlEdgeHighlight(cell, true)
        edgesHighlighted.value.forEach((id) => {
            const edgeCell = graph.value.getCellById(id)
            edgeCell.toFront()
        })
    })

    const isNodeClicked = ref(false)
    graph.value.on('node:mouseup', ({ e, node }) => {
        loaderCords.value = { x: e.clientX, y: e.clientY }
        isNodeClicked.value = true
        const nodeClickAction = () => {
            if (!isNodeClicked.value) return
            onSelectAsset(node.store.data.entity)
            highlight(node?.id)
            che.value = ''
        }
        setTimeout(nodeClickAction, 300)
    })
    graph.value.on('node:dblclick', ({ node }) => {
        isNodeClicked.value = false
        getColumnsList(node, node.store.data.entity)
    })
    graph.value.on('blank:click', () => {
        onSelectAsset(baseEntity.value)
        che.value = ''
        highlight(null)
    })

    graph.value.on('blank:mousewheel', () => {
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })
    graph.value.on('cell:mousewheel', () => {
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })
}
