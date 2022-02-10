import { ref } from 'vue'
import {
    getNodeSourceImage,
    getSource,
    getSchema,
    getNodeTypeText,
} from './util.js'
import {
    iconPlus,
    iconCaretDown,
    iconVerified,
    iconDraft,
    iconDeprecated,
} from './icons'
import { dataTypeCategoryList } from '~/constant/dataType'
import useAssetInfo from '~/composables/discovery/useAssetInfo'

interface EdgeStyle {
    stroke?: string
    arrowSize?: number
}

const checkIfLeafNode = (relations, id) => {
    let res = true
    relations.forEach((x) => {
        if (x.fromEntityId === id) res = false
    })
    return res
}

const checkIfRootNode = (relations, id) => {
    let res = true
    relations.forEach((x) => {
        if (x.toEntityId === id) res = false
    })
    return res
}

const hasCTA = (relations, childrenCounts, id) => {
    let res = false
    const isRootNode = checkIfRootNode(relations, id)
    const isLeafNode = checkIfLeafNode(relations, id)
    if (isRootNode) res = !!childrenCounts?.[id]?.INPUT
    if (isLeafNode) res = !!childrenCounts?.[id]?.OUTPUT
    return res
}

export default function useGraph() {
    const createNodeData = (
        entity,
        relations,
        childrenCounts,
        baseEntityGuid,
        dataObj = {}
    ) => {
        const { title } = useAssetInfo()
        const { guid, typeName, attributes } = entity
        const typeNameComputed = getNodeTypeText[typeName] || typeName
        const certificateStatus = attributes?.certificateStatus
        let status = ''
        const displayText = title(entity)
        const source = getSource(entity)
        const schemaName = getSchema(entity)
        const img = getNodeSourceImage[source]
        const isBase = guid === baseEntityGuid
        const isRootNode = checkIfRootNode(relations, guid)
        const isLeafNode = checkIfLeafNode(relations, guid)
        const isCtaNode = hasCTA(relations, childrenCounts, guid)
        const isVpNode = typeName === 'vpNode'

        if (certificateStatus) {
            switch (certificateStatus) {
                case 'VERIFIED':
                    status = iconVerified
                    break
                case 'DRAFT':
                    status = iconDraft
                    break
                default:
                    status = iconDeprecated
            }
        }

        const computedData = {
            id: guid,
            isHighlightedNode: null,
            isHighlightedNodePath: null,
            isGrayed: false,
            updatedDisplayText: '',
            ...dataObj,
        }

        const nodeData = {
            id: guid,
            typeName,
            source,
            isBase,
            entity,
            isCtaNode,
            isVpNode,
            width: 270,
            height: isVpNode ? 50 : 70,
            shape: 'html',
            data: computedData,
            html: {
                render(node) {
                    const data = node.getData() as any

                    return `
    <div class="flex items-center">
        <div id="${guid}" class="lineage-node group ${
                        isVpNode ? 'isVpNode' : ''
                    } ${
                        data?.isHighlightedNode === data?.id
                            ? 'isHighlightedNode'
                            : ''
                    }
                            ${
                                data?.isHighlightedNodePath === data?.id
                                    ? 'isHighlightedNodePath'
                                    : ''
                            }
                            ${data?.isGrayed ? 'isGrayed' : ''}
                            ${isBase ? 'isBase' : ''}
                            ">
                        <div class=" ${isBase ? 'inscr' : 'hidden'}">BASE</div>
                        <div class="${
                            isVpNode ? 'hidden' : ''
                        } popover group-hover:visible group-hover:bottom-20 group-hover:opacity-100 group-hover:delay-1000">
                            ${displayText}
                        </div>
                        <div>
                            <div class="node-text">
                                <span class="relative z-50 block ">
                                    <span class="absolute right-0 justify-end hidden w-6 text-white group-hover:flex caret-bg">${
                                        ['Table', 'View'].includes(typeName)
                                            ? iconCaretDown
                                            : ''
                                    }
                                    </span>
                                </span>
                                <div class="flex items-center gap-x-1">
                                    <span class="truncate node-title group-hover:underline">${
                                        data?.updatedDisplayText || displayText
                                    }</span>
                                    <span class="flex-none mr-1">${status}</span>
                                </div>
                            </div>
                            <div class="node-meta ${isVpNode ? 'hidden' : ''}">
                                <img class="node-meta__source" src="${img}" />
                                <div class="truncate node-meta__text isTypename">${typeNameComputed}</div>
                                <div class="node-meta__text">
                                    ${
                                        ['Table', 'View'].includes(typeName) &&
                                        schemaName
                                            ? 'in'
                                            : ''
                                    }
                                </div>
                                <div class="node-meta__text text-gray  truncate ${
                                    ['Table', 'View'].includes(typeName)
                                        ? ''
                                        : 'hidden'
                                }">
                                    ${schemaName || ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="node-${guid}-loadCTA" style="position: absolute;z-index: 99;" class="${
                        (isRootNode || isLeafNode) && isCtaNode
                            ? 'flex'
                            : 'hidden'
                    } ${
                        isRootNode ? 'l-m20px' : 'r-m20px'
                    } node-loadCTA h-6 w-6 bg-gray-400 text-white rounded-full  justify-center items-center cursor-pointer">
                        ${iconPlus}
                    </div>
                </div>`
                },
                shouldComponentUpdate(node) {
                    return node.hasChanged('data')
                },
            },
            ports: {
                groups: {
                    invisiblePort: {
                        markup: [
                            {
                                tagName: 'rect',
                                selector: 'portBody',
                            },
                        ],
                        attrs: {
                            portBody: {
                                width: 268,
                                height: 60,
                                strokeWidth: 1,
                                stroke: 'none',
                                fill: 'none',
                                event: 'port:click',
                                y: -30,
                                x: 1,
                            },
                        },
                    },
                    ctaPort: {
                        markup: [
                            {
                                tagName: 'rect',
                                selector: 'portBody',
                            },
                            {
                                tagName: 'text',
                                selector: 'portNameLabel',
                            },
                        ],
                        attrs: {
                            portBody: {
                                width: 268,
                                height: 40,
                                strokeWidth: 1,
                                stroke: '#e6e6eb',
                                fill: '#ffffff',
                                event: 'port:click',
                                y: -11,
                            },
                            portNameLabel: {
                                ref: 'portBody',
                                refX: 36,
                                refY: 12,
                                fontSize: 16,
                                fill: '#3e4359',
                                event: 'port:click',
                            },
                        },
                        position: 'erPortPosition',
                    },
                    columnList: {
                        markup: [
                            {
                                tagName: 'rect',
                                selector: 'portBody',
                            },
                            {
                                tagName: 'text',
                                selector: 'portNameLabel',
                            },
                            {
                                tagName: 'image',
                                selector: 'portImage',
                            },
                        ],
                        attrs: {
                            portBody: {
                                width: 268,
                                height: 40,
                                strokeWidth: 1,
                                stroke: '#e6e6eb',
                                fill: '#ffffff',
                                event: 'port:click',
                                y: -11,
                            },
                            portNameLabel: {
                                ref: 'portBody',
                                refX: 36,
                                refY: 12,
                                fontSize: 16,
                                fill: '#3e4359',
                                event: 'port:click',
                            },
                            portImage: {
                                ref: 'portBody',
                                refX: 12,
                                refY: 12,
                                event: 'port:click',
                            },
                        },
                        position: 'erPortPosition',
                    },
                },
                items: [
                    {
                        id: `${guid}-invisiblePort`,
                        group: 'invisiblePort',
                        zIndex: 0,
                    },
                ],
            },
        }

        return { nodeData }
    }

    const addNode = async (
        graph,
        relations,
        childrenCounts,
        entity,
        data = {}
    ) => {
        const graphNodes = graph.value.getNodes()
        const baseEntityGuid = graphNodes.find((x) => x.store.data.isBase).id
        const { nodeData } = createNodeData(
            entity,
            relations,
            childrenCounts,
            baseEntityGuid,
            data
        )
        graph.value.addNode(nodeData)
    }

    const removeNode = (graph, type, removedNodes) => {
        const removedNode = ref({})
        const graphNodes = graph.value.getNodes()
        const graphEdges = graph.value.getEdges()

        graphNodes.forEach((x) => {
            if (x.store.data[type]) {
                if (!removedNodes.value[type]) removedNodes.value[type] = []

                const edges = graphEdges
                    .filter((y) => y.id.includes(x.id))
                    .map((z) => z.id)

                const { data } = x.store

                removedNode.value = {
                    data,
                    edges,
                }

                removedNodes.value[type].push(removedNode.value)

                const cell = graph.value.getCellById(x.id)
                cell.remove()
            }
        })

        return {
            removedNode,
        }
    }

    const createPortData = (item) => {
        let text =
            item.displayText.charAt(0).toUpperCase() +
            item.displayText.slice(1).toLowerCase()
        const dataType = dataTypeCategoryList.find((d) =>
            d.type.includes(item.attributes?.dataType?.toUpperCase())
        )?.imageText

        if (text.length > 23) text = `${text.slice(0, 23)}...`

        const portData = {
            id: item.guid,
            group: 'columnList',
            entity: item,
            attrs: {
                portBody: {},
                portNameLabel: {
                    text,
                },
                portImage: {
                    href: `/dataType/${dataType || 'empty'}.svg`,
                    width: 16,
                    height: 16,
                },
            },
        }
        return { portData }
    }

    const createCustomPortData = (nodeId, text) => {
        const portData = {
            id: `${nodeId}-ctaPort`,
            group: 'columnList',
            attrs: {
                portNameLabel: {
                    text,
                    x: '1.3em',
                    fill: '#5277d7',
                    fontSize: 18,
                },
            },
        }
        return { portData }
    }

    const createEdgeData = (relation, data = {}, styles: EdgeStyle = {}) => {
        const stroke = styles?.stroke
        let edgeData = {
            zIndex: 0,
            id: relation.id,
            source: {
                cell: relation.sourceCell,
                port: relation.sourcePort,
            },
            target: {
                cell: relation.targetCell,
                port: relation.targetPort,
            },
            router: {
                name: 'metro',
            },
            connector: { name: 'beiz' },
            attrs: {
                line: {
                    stroke,
                    strokeWidth: 1.6,
                    targetMarker: {
                        name: 'block',
                        stroke,
                        width: styles?.arrowSize || 0.1,
                        height: styles?.arrowSize || 0.1,
                    },
                },
            },
            defaultLabel: {
                markup: [
                    {
                        tagName: 'rect',
                        selector: 'body',
                    },
                    {
                        tagName: 'text',
                        selector: 'label',
                    },
                ],
                attrs: {
                    label: {
                        fill: relation?.type === 'related' ? '#3e4359' : 'none',
                        fontSize: 14,
                        textAnchor: 'middle',
                        textVerticalAnchor: 'middle',
                        pointerEvents: 'none',
                    },
                    body: {
                        ref: 'label',
                        fill: relation?.type === 'related' ? '#fff' : 'none',
                        strokeWidth: 1,
                        rx: 10,
                        refWidth: '140%',
                        refHeight: '140%',
                        refX: '-20%',
                        refY: '-20%',
                    },
                },
                position: {
                    distance: 0.5,
                    options: {
                        // keepGradient: true,
                    },
                },
            },
            labels: [
                {
                    attrs: {
                        label: {
                            text:
                                relation?.type === 'related'
                                    ? 'related'
                                    : 'process',
                        },
                    },
                },
            ],
            data,
        }

        if (Object.keys(data).length) edgeData = { ...edgeData, data }

        return {
            edgeData,
        }
    }

    const addEdge = (graph, relation, styles: EdgeStyle = {}) => {
        const graphEdges = graph.value.getEdges()
        const exists = graphEdges.find((x) => x.id === relation.id)
        if (exists) return

        const { edgeData } = createEdgeData(relation, {}, styles)
        graph.value.addEdge(edgeData)
    }

    const removeEdge = (graph, type) => {
        const graphEdges = graph.value.getEdges()

        graphEdges.forEach((x) => {
            if (x.store.data?.[type] || x.store.data?.data?.[type]) {
                const cell = graph.value.getCellById(x.id)
                cell.remove()
            }
        })
    }

    const toggleNodesEdges = (graph, visible) => {
        const graphEdges = graph.value.getEdges()
        graph.value.freeze('toggleNodesEdges')
        graphEdges.forEach((x) => {
            const cell = graph.value.getCellById(x.id)
            cell.attr('line/stroke', visible ? '#aaaaaa' : '#dce0e5')
            cell.toBack()
        })
        graph.value.unfreeze('toggleNodesEdges')
    }

    return {
        createNodeData,
        addNode,
        removeNode,
        createPortData,
        createCustomPortData,
        createEdgeData,
        addEdge,
        removeEdge,
        toggleNodesEdges,
    }
}
