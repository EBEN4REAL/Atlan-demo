import {
    getNodeSourceImage,
    getSource,
    getSchema,
    getNodeTypeText,
} from './util.js'
import { iconVerified, iconDraft, iconDeprecated } from './icons'
import { iconCaretDownB64, iconPrimaryB64, iconForeignB64 } from './iconsBase64'
import { dataTypeCategoryList } from '~/constant/dataType'
import useAssetInfo from '~/composables/discovery/useAssetInfo'

interface EdgeStyle {
    stroke?: string
    arrowSize?: number
}

export default function useGraph(graph) {
    const createNodeData = (entity, baseEntityGuid, dataObj = {}) => {
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
        const isVpNode = typeName === 'vpNode'
        const isNodeWithColumns = ['Table', 'View'].includes(typeName)

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
            columnLineageCount: 0,
            isSelectedNode: null,
            isHighlightedNode: null,
            isGrayed: null,
            hiddenCount: 0,
            nodeHeight: isNodeWithColumns ? 121 : 70,
            ...dataObj,
        }

        const nodeData = {
            id: guid,
            typeName,
            source,
            isBase,
            entity,
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
                    <div style="height: ${
                        data?.nodeHeight
                    }px" id="node-${guid}" class="lineage-node group ${
                        isVpNode ? 'isVpNode' : ''
                    }   
                    ${isNodeWithColumns ? 'isNodeWithColumns' : ''}
                    ${isBase ? 'isBase' : ''} 
                    ${data?.isSelectedNode === data?.id ? 'isSelectedNode' : ''}
                    ${
                        data?.isHighlightedNode === data?.id
                            ? 'isHighlightedNode'
                            : ''
                    }
                    ${data?.isGrayed === data?.id ? 'isGrayed' : ''} 
                    ">
                        <div class=" ${isBase ? 'inscr' : 'hidden'}">BASE</div>
                        ${
                            isVpNode
                                ? `<span class="font-bold text-primary leading-none">Load ${
                                      totalHidden > 4 ? 4 : totalHidden
                                  } more</span>${
                                      totalHidden > 4
                                          ? `<span class="text-gray-500 leading-none">(out of ${totalHidden})</span>`
                                          : ''
                                  }`
                                : `<div class="popover  group-hover:opacity-100 group-hover:delay-1000">
                                ${displayText}
                            </div>
                            <div>
                                <div class="node-text">
                                    <div class="flex items-center gap-x-1">
                                        <span class="truncate node-title">${displayText}</span>
                                        <span class="flex-none mr-1">${status}</span>
                                    </div>
                                </div>
                                <div class="node-meta">
                                    <span class="mb-0.5">${img}</span>
                                    <div class="truncate node-meta__text isTypename">${typeNameComputed}</div>
                                    <div class="node-meta__text node-schema">
                                        ${
                                            ['Table', 'View'].includes(
                                                typeName
                                            ) && schemaName
                                                ? 'in'
                                                : ''
                                        }
                                    </div>
                                    <div class="node-meta__text node-schema text-gray  truncate ${
                                        isNodeWithColumns ? '' : 'hidden'
                                    }">
                                        ${schemaName || ''}
                                    </div>
                                </div>
                            </div>`
                        }

                    </div>
                </div>`
                },
                shouldComponentUpdate(node) {
                    graph.value.freeze('shouldComponentUpdate')
                    graph.value.getEdges().forEach((edge) => edge.setZIndex(0))
                    graph.value.unfreeze('shouldComponentUpdate')

                    return node.hasChanged('data')
                },
            },
            ports: {
                groups: {
                    ctaPortLeft: {
                        position: { name: 'left' },
                        markup: [
                            {
                                tagName: 'circle',
                                selector: 'portBody',
                            },
                            {
                                tagName: 'image',
                                selector: 'portImage',
                            },
                        ],
                        attrs: {
                            portBody: {
                                r: 14,
                                strokeWidth: 1.5,
                                stroke: '#B2B8C7',
                                fill: '#ffffff',
                                event: 'port:click',
                            },
                            portImage: {
                                ref: 'portBody',
                                refX: 5,
                                refY: 5,
                                event: 'port:click',
                            },
                        },
                    },
                    ctaPortRight: {
                        position: { name: 'right' },
                        markup: [
                            {
                                tagName: 'circle',
                                selector: 'portBody',
                            },
                            {
                                tagName: 'image',
                                selector: 'portImage',
                            },
                        ],
                        attrs: {
                            portBody: {
                                r: 14,
                                strokeWidth: 1.5,
                                stroke: '#B2B8C7',
                                fill: '#ffffff',
                                event: 'port:click',
                            },
                            portImage: {
                                ref: 'portBody',
                                refX: 4,
                                refY: 4,
                                event: 'port:click',
                            },
                        },
                    },
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
                            {
                                tagName: 'image',
                                selector: 'portImageLoader',
                            },
                            {
                                tagName: 'image',
                                selector: 'portImageRight',
                            },
                        ],
                        attrs: {
                            portBody: {
                                width: 247,
                                height: 40,
                                strokeWidth: 1,
                                stroke: '#E0E4EB',
                                fill: '#ffffff',
                                event: 'port:click',
                                x: 10,
                            },
                            portNameLabel: {
                                ref: 'portBody',
                                refX: 44,
                                refY: 13,
                                fontSize: 16,
                                fill: '#374151',
                                event: 'port:click',
                            },
                            portImage: {
                                ref: 'portBody',
                                refX: 20,
                                refY: 12,
                                event: 'port:click',
                            },
                            portImageLoader: {
                                ref: 'portBody',
                                refX: 220,
                                refY: 10,
                                event: 'port:click',
                                href: '',
                                width: 22,
                                height: 22,
                            },
                            portImageRight: {
                                ref: 'portBody',
                                refX: 180,
                                refY: 10,
                                event: 'port:click',
                                href: '',
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
                    {
                        id: `${guid}-viewPort`,
                        group: 'columnList',
                        attrs: {
                            portBody: {
                                x: 1,
                                width: 266,
                                height: 38,
                                fill: '#F9FAFB',
                                stroke: '#f9fafb00',
                            },
                            portNameLabel: {
                                text: `view columns`,
                                refX: 22,
                                fill: '#3c71df',
                                refY: 12,
                            },
                            portImage: {
                                refX: 120,
                                refY: 10,
                                href: iconCaretDownB64,
                            },
                        },
                    },
                ],
            },
        }

        if (!isNodeWithColumns) nodeData.ports.items = [nodeData.ports.items[0]]

        return { nodeData }
    }

    const addNode = async (entity, data = {}) => {
        const graphNodes = graph.value.getNodes()
        const baseEntityGuid = graphNodes.find((x) => x.store.data.isBase).id
        const { nodeData } = createNodeData(entity, baseEntityGuid, data)
        graph.value.addNode(nodeData)
    }

    const createCTAPortData = () => {
        const portData = {
            id: '',
            group: '',
            zIndex: 999,
            attrs: { portImage: {}, portBody: {} },
            position: { name: '' },
        }

        return { portData }
    }

    const createShowMorePortData = (node) => {
        const portData = {
            id: `${node.id}-showMorePort`,
            group: 'columnList',
            attrs: {
                portBody: {
                    rx: 4,
                },
                portNameLabel: {
                    text: 'Show more columns',
                    fill: '#3c71df',
                },
            },
        }

        return { portData }
    }

    const createPortData = (item) => {
        const { isPrimary, isForeign } = item.attributes

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
                portImageRight: {
                    height: isPrimary ? 20 : 17,
                    // eslint-disable-next-line no-nested-ternary
                    href: isPrimary
                        ? iconPrimaryB64
                        : isForeign
                        ? iconForeignB64
                        : '',
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
                        fill: relation?.type === 'related' ? '#374151' : 'none',
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

    const addEdge = (relation, styles: EdgeStyle = {}, data = {}) => {
        const graphEdges = graph.value.getEdges()
        const edge = graphEdges.find((x) => x.id === relation.id)
        if (edge) return edge

        const { edgeData } = createEdgeData(relation, data, styles)

        const createdEdge = graph.value.addEdge(edgeData)

        return createdEdge
    }

    return {
        createNodeData,
        addNode,
        createCTAPortData,
        createPortData,
        createShowMorePortData,
        createEdgeData,
        addEdge,
    }
}
