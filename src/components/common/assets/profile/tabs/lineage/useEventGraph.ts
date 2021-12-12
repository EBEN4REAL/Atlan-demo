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
    showProcess,
    assetGuidToHighlight,
    highlightedNode,
    loaderCords,
    currZoom,
    onSelectAsset
) {
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

    const highlight = (guid) => {
        highlightedNode.value =
            guid && guid !== highlightedNode.value ? guid : ''
        const { nodesToHighlight } = getHighlights(highlightedNode)
        highlightEdges(graph, nodesToHighlight)
        highlightNodes(graph, highlightedNode, nodesToHighlight)
        assetGuidToHighlight.value = ''
        loaderCords.value = {}
    }

    watch(assetGuidToHighlight, (newVal) => {
        if (!newVal) return
        highlight(newVal)
    })

    watch(showProcess, () => {
        onSelectAsset(baseEntity.value)
        highlight(null)
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
                    d.type.includes(x.attributes.dataType)
                )?.imageText

                return {
                    id: `${node.id}-port-${x.guid}`,
                    group: 'columnList',
                    attrs: {
                        portBody: {},
                        portNameLabel: {
                            text,
                        },
                        portImage: {
                            href: `/src/assets/images/dataType/${dataType}.svg`,
                            width: 16,
                            height: 16,
                        },
                    },
                }
            })
            node.addPorts(ports)

            const nodesToTranslate = []
            const target = graph.value
                .getOutgoingEdges(node.id)?.[0]
                .id.split('@')[1]
            const source = graph.value
                .getIncomingEdges(node.id)?.[0]
                .id.split('@')[0]

            if (target) {
                const incomingEdges = graph.value.getIncomingEdges(target)
                incomingEdges.forEach((x) => {
                    const s = x.id.split('@')[0]
                    if (s !== node.id) nodesToTranslate.push(s)
                })
            } else if (source) {
                const outgoingEdges = graph.value.getOutgoingEdges(source)
                outgoingEdges.forEach((x) => {
                    const t = x.id.split('@')[1]
                    if (t !== node.id) nodesToTranslate.push(t)
                })
            }

            nodesToTranslate.forEach((nodeId) => {
                const nodeOrderNo = node.store.data._order
                const nodeToTranslate = graph.value
                    .getNodes()
                    .find((n) => n.id === nodeId)
                if (nodeOrderNo < nodeToTranslate.store.data._order) {
                    const { x, y } = nodeToTranslate.position()
                    const cell = graph.value.getCellById(nodeId)
                    cell.setData({ prevY: y })
                    const newY = y + ports.length * 40
                    nodeToTranslate.position(x, newY)
                    if (nodesTranslated.value[node.id])
                        nodesTranslated.value[node.id].push(nodeToTranslate.id)
                    else nodesTranslated.value[node.id] = [nodeToTranslate.id]
                }
            })
            nodesWithPorts.value[node.id] = true
        } else {
            const ports = node.getPorts()
            ports.shift()
            node.removePorts(ports)
            const nodesToTranslate = nodesTranslated.value?.[node.id] || []
            nodesToTranslate.forEach((nodeId) => {
                const nodeToTranslate = graph.value
                    .getNodes()
                    .find((n) => n.id === nodeId)
                const { x } = nodeToTranslate.position()
                const data = nodeToTranslate.getData()
                nodeToTranslate.position(x, data.prevY)
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

    const isNodeClicked = ref(false)
    graph.value.on('node:mouseup', ({ e, node }) => {
        loaderCords.value = { x: e.clientX, y: e.clientY }
        isNodeClicked.value = true
        const nodeClickAction = () => {
            if (!isNodeClicked.value) return
            onSelectAsset(node.store.data.entity)
            highlight(node?.id)
        }
        setTimeout(nodeClickAction, 300)
    })
    graph.value.on('node:dblclick', ({ node }) => {
        isNodeClicked.value = false
        getColumnsList(node, node.store.data.entity)
    })
    graph.value.on('blank:click', () => {
        onSelectAsset(baseEntity.value)
        highlight(null)
    })

    const chp = ref({}) // chp -> currentHilightedPort
    graph.value.on('port:click', ({ e, node }) => {
        e.stopPropagation()
        const ele = e.originalEvent.path.find((x) => x.getAttribute('port'))
        const portId = ele.getAttribute('port')
        if (chp.value[node.id] && node.getPort(chp.value[node.id])) {
            node.setPortProp(chp.value[node.id], 'attrs/portBody', {
                fill: '#ffffff',
            })
        }
        node.setPortProp(portId, 'attrs/portBody', {
            fill: '#e5ecff',
        })
        if (chp.value[node.id]) {
            chp.value[node.id] = portId
        } else {
            chp.value = { ...chp.value, ...{ [node.id]: portId } }
        }
    })

    graph.value.on('blank:mousewheel', () => {
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })
    graph.value.on('cell:mousewheel', () => {
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })
}
