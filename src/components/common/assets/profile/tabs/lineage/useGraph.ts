import {
    getNodeSourceImage,
    getSource,
    getSchema,
    getNodeTypeText,
} from './util.js'
import { iconPlus, iconVerified, iconDraft, iconDeprecated } from './icons'
import CaretDown from '~/assets/images/icons/caret-down.svg?url'

import { dataTypeCategoryList } from '~/constant/dataType'
import useAssetInfo from '~/composables/discovery/useAssetInfo'

interface EdgeStyle {
    stroke?: string
    arrowSize?: number
}

const checkNode = (relations, id, mode) => {
    const prop = mode === 'leaf' ? 'fromEntityId' : 'toEntityId'
    let res = true
    relations.forEach((x) => {
        if (x[prop] === id) res = false
    })
    return res
}

const hasCTA = (relations, childrenCounts, id) => {
    let res = false
    const isRootNode = checkNode(relations, id, 'root')
    const isLeafNode = checkNode(relations, id, 'leaf')
    if (isRootNode) res = !!childrenCounts?.[id]?.INPUT
    if (isLeafNode) res = !!childrenCounts?.[id]?.OUTPUT
    return res
}

export default function useGraph(graph) {
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
        const isRootNode = checkNode(relations, guid, 'root')
        const isLeafNode = checkNode(relations, guid, 'leaf')
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
            isSelectedNode: null,
            isHighlightedNode: null,
            isGrayed: false,
            hiddenCount: 0,
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
                    const totalHidden = isVpNode
                        ? data?.hiddenCount || entity.attributes.hiddenCount
                        : 0
                    // prettier-ignore
                    return `
                <div class="flex items-center">
                    <div id="node-${guid}" class="lineage-node group ${isVpNode ? 'isVpNode' : ''} 
                    ${data?.isSelectedNode === data?.id? 'isSelectedNode': ''}
                    ${data?.isHighlightedNode === data?.id? 'isHighlightedNode': ''}
                    ${data?.isGrayed ? 'isGrayed' : ''} ${isBase ? 'isBase' : ''}">
                        <div class=" ${isBase ? 'inscr' : 'hidden'}">BASE</div>
                        ${
                            isVpNode
                                ? `<span class="font-bold text-primary">Load ${totalHidden > 4 ? 4 : totalHidden} more</span>${totalHidden > 4 ?  `<span class="text-gray-500">(out of ${totalHidden})</span>`: ''}`
                                : `<div class="popover group-hover:visible group-hover:bottom-20 group-hover:opacity-100 group-hover:delay-1000">
                                ${displayText}
                            </div>
                            <div>
                                <div class="node-text">
                                    <span class="relative z-50 block ">
                                        <div class="absolute right-0 justify-end hidden w-6 group-hover:flex caret-bg">${
                                            ['Table', 'View'].includes(typeName)
                                                ? `<img class="node-caret h-6 w-6" src="${CaretDown}">`
                                                : ''
                                        }
                                        </div>
                                    </span>
                                    <div class="flex items-center gap-x-1">
                                        <span class="truncate node-title group-hover:underline">${displayText}</span>
                                        <span class="flex-none mr-1">${status}</span>
                                    </div>
                                </div>
                                <div class="node-meta">
                                    <img class="node-meta__source" src="${img}" />
                                    <div class="truncate node-meta__text isTypename">${typeNameComputed}</div>
                                    <div class="node-meta__text">
                                        ${
                                            ['Table', 'View'].includes(
                                                typeName
                                            ) && schemaName
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
                            </div>`
                        }

                    </div>
                    ${(isRootNode || isLeafNode) && isCtaNode
                        ?   `<div id="node-${guid}-hoPaCTA" style="position: absolute;z-index: 99;" class="${isRootNode ? 'l-m20px' : 'r-m20px'} 
                                node-hoPaCTA h-6 w-6 bg-gray-400 text-white rounded-full flex justify-center items-center cursor-pointer">
                                ${iconPlus}
                            </div>` : ''
                    } 
                    
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

    const addNode = async (relations, childrenCounts, entity, data = {}) => {
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

    const createShowMorePortData = (node) => {
        const portData = {
            id: `${node.id}-showMorePort`,
            group: 'columnList',
            attrs: {
                portBody: {
                    // event: 'showMorePort:click',
                    rx: 4,
                },
                portNameLabel: {
                    text: 'Show more columns',
                    // event: 'showMorePort:click',
                    fill: '#5277d7',
                },
            },
        }

        return { portData }
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

    const createEdgeData = (relation, data = {}, styles: EdgeStyle = {}) => {
        const isDup = data?.isDup
        const isCyclicEdge = data?.isCyclicEdge

        // const stroke = relation.id.includes('vpNode')
        //     ? '#ffffff00'
        //     : styles?.stroke

        const stroke = styles?.stroke

        const edgeData = {
            isDup,
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
            connector: { name: !isCyclicEdge ? 'beiz' : 'beizAlt' },
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
                                // eslint-disable-next-line no-nested-ternary
                                relation?.type === 'related'
                                    ? 'related'
                                    : isDup
                                    ? 'grouped-process'
                                    : 'process',
                        },
                    },
                },
            ],
            data,
        }

        return {
            edgeData,
        }
    }

    const addEdge = (relation, styles: EdgeStyle = {}) => {
        const graphEdges = graph.value.getEdges()
        const edge = graphEdges.find((x) => x.id === relation.id)
        if (edge) return edge

        const { edgeData } = createEdgeData(relation, {}, styles)

        const createdEdge = graph.value.addEdge(edgeData)

        return createdEdge
    }

    return {
        createNodeData,
        addNode,
        createPortData,
        createShowMorePortData,
        createEdgeData,
        addEdge,
    }
}
