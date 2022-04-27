/* eslint-disable no-nested-ternary */
import {
    getNodeSourceImage,
    getSource,
    getSchema,
    getNodeTypeText,
} from './util.js'
import {
    iconVerified,
    iconDraft,
    iconDeprecated,
    iconCaretDown,
    iconCaretUp,
    iconLoader,
    iconLoaderFixed,
    iconPrimary,
    iconForeign,
    iconInformation,
    iconIssue,
    iconWarning,
    iconExpand,
    iconCollapse,
    array,
    boolean,
    date,
    noIcon,
    expand,
    float1,
    geography,
    number,
    string,
    struct,
    variant,
    blob,
    spatial,
    bits,
    super1,
    lookup,
    enum1,
    percent,
    tableauCalculatedField,
    tableauDatasourceField,
} from './icons'
import { dataTypeCategoryList } from '~/constant/dataType'
import useAssetInfo from '~/composables/discovery/useAssetInfo'

interface EdgeStyle {
    stroke?: string
    arrowSize?: number
}

const announcementTypeIcons = {
    information: iconInformation,
    issue: iconIssue,
    warning: iconWarning,
}

const certificateStatusIcons = {
    VERIFIED: iconVerified,
    DRAFT: iconDraft,
    DEPRECATED: iconDeprecated,
}

const portDataTypeIcons = {
    array,
    boolean,
    date,
    noIcon,
    expand,
    float1,
    geography,
    number,
    string,
    struct,
    variant,
    blob,
    spatial,
    bits,
    super1,
    lookup,
    enum1,
    percent,
}

const biPortDataTypeIcons = {
    TableauCalculatedField: tableauCalculatedField,
    TableauDatasourceField: tableauDatasourceField,
}

const columnKeyTypeIcons = {
    isPrimary: iconPrimary,
    isForeign: iconForeign,
}

const portsLabelMap = {
    Table: 'columns',
    View: 'columns',
    MaterialisedView: 'columns',
    TableauDatasource: 'fields',
}

const getPortsCTALabel = (typeName, portsCount, highlightPorts) => {
    const label = portsLabelMap[typeName]
    return portsCount || portsCount === 0
        ? `${portsCount} ${label}`
        : // : highlightPorts
          // ? `${label}`
          `view ${label}`
}

export default function useGraph(graph) {
    const createNodeData = (entity, baseEntityGuid, dataObj = {}) => {
        const { title } = useAssetInfo()
        const { guid, typeName, attributes } = entity
        const typeNameComputed = getNodeTypeText[typeName] || typeName
        const certificateStatus = attributes?.certificateStatus
        const announcementType = attributes?.announcementType
        const status = certificateStatusIcons[certificateStatus] || ''
        const flag = announcementTypeIcons[announcementType] || ''
        const displayText = title(entity)
        const source = getSource(entity)
        const schemaName = getSchema(entity)
        const img = getNodeSourceImage[source]
        const isBase = guid === baseEntityGuid
        const isVpNode = typeName === 'vpNode'
        const isNodeWithPorts = [
            'Table',
            'View',
            'MaterialisedView',
            'TableauDatasource',
        ].includes(typeName)

        const computedData = {
            id: guid,
            ports: [],
            portsCount: null,
            portsListExpanded: false,
            portsListLoading: false,
            portItemLoading: false,
            portShowMoreLoading: false,
            selectedPortId: '',
            isSelectedNode: false,
            isHighlightedNode: false,
            isGrayed: false,
            highlightPorts: false,
            hiddenCount: 0,
            ctaPortRightIcon: '',
            ctaPortRightId: '',
            ctaPortRightLoading: false,
            ctaPortLeftIcon: '',
            ctaPortLeftId: '',
            ctaPortLeftLoading: false,
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
            height: isVpNode ? 50 : 100,
            shape: 'html',
            data: computedData,
            html: {
                render(node) {
                    const data = node.getData() as any
                    const totalHidden = isVpNode
                        ? data?.hiddenCount || entity.attributes.hiddenCount
                        : 0

                    const portsList = () => {
                        let res = ''
                        data?.ports.forEach((port) => {
                            if (port.typeName !== 'showMorePort') {
                                const {
                                    isPrimary,
                                    isForeign,
                                    announcementType: aType,
                                } = port.attributes

                                const text =
                                    port.displayText.charAt(0).toUpperCase() +
                                    port.displayText.slice(1).toLowerCase()

                                const dataType = port.attributes?.dataType
                                const portTypeName = port.typeName

                                const dataTypeComputed =
                                    dataTypeCategoryList.find((d) =>
                                        d.type.includes(dataType?.toUpperCase())
                                    )?.imageText

                                const biDataTypeIcon =
                                    biPortDataTypeIcons[portTypeName]

                                const isSelectedPort =
                                    data?.selectedPortId === port.guid
                                const isHighlightedPort = data?.highlightPorts

                                res += `
                                <div id="${port.guid}" iscolitem="${
                                    port.guid
                                }" class="node-port flex justify-between items-center relative 
                                ${isSelectedPort ? 'selected-port' : ''}
                                ${isHighlightedPort ? 'highlighted-port' : ''}">
                                    <div class="flex items-center truncate">
                                        ${
                                            portDataTypeIcons[
                                                dataTypeComputed
                                            ] || biDataTypeIcon
                                        }
                                        <span title="${text}" class="truncate flex-grow-0 flex-shrink">${text}</span> 
                                    </div>
                                    <div class="flex items-center">
                                        ${
                                            isPrimary
                                                ? `<span class="ml-2">
                                                    ${columnKeyTypeIcons.isPrimary}
                                                  </span>`
                                                : ''
                                        }
                                        ${
                                            isForeign
                                                ? `<span class= "ml-2" >
                                                    ${columnKeyTypeIcons.isForeign}
                                                    </span>`
                                                : ''
                                        }
                                        ${
                                            aType
                                                ? `<span class="ml-2 node-announcement">
                                                    ${announcementTypeIcons[aType]}
                                                   </span>`
                                                : ''
                                        }
                                    </div>
                                    ${
                                        data?.portItemLoading && isSelectedPort
                                            ? `<div class="absolute right-2 w-5 h-5">
                                            ${iconLoader}
                                        </div>`
                                            : ''
                                    }
                                </div>`
                            } else
                                res += `
                                <div iscolshowmore="true" class="node-port flex justify-center text-new-blue-400 items-center pl-2">
                                    <span> Show more ${
                                        portsLabelMap[typeName]
                                    } </span>
                                    ${
                                        data?.portShowMoreLoading
                                            ? `<div class="w-5 h-5 ml-2">
                                        ${iconLoader}
                                    </div>`
                                            : ''
                                    }
                                 </div>`
                        })
                        return res
                    }

                    // prettier-ignore
                    return `
                <div class="flex items-center">
                    <div  
                        id="node-${guid}"
                        class="lineage-node 
                        ${isVpNode ? 'isVpNode' : ''}   
                        ${isNodeWithPorts ? 'isNodeWithPorts' : ''}
                        ${data?.portsListExpanded ? 'isExpandedNode' : ''}
                        ${isBase ? 'isBase' : ''} 
                        ${data?.isSelectedNode ? 'isSelectedNode' : ''}
                        ${data?.isHighlightedNode ? 'isHighlightedNode' : ''}
                        ${data?.isGrayed ? 'isGrayed' : ''} ">
                        
                        <div class=" ${isBase ? 'inscr' : 'hidden'}">BASE</div>

                        ${
                            isVpNode
                                ? `<span class="font-bold text-primary leading-none">Load 
                                    ${
                                        totalHidden > 4 ? 4 : totalHidden
                                    } more</span>
                                    ${
                                        totalHidden > 4
                                            ? `<span class="text-gray-500 leading-none">(out of 
                                            ${totalHidden})</span>`
                                            : ''
                                    }`
                                : `
                            <div class="lineage-node__content">
                                <div class="node-text group">
                                    <div class="flex items-center gap-x-1">
                                        <span title="${displayText}" class="truncate node-title">${displayText}</span>
                                        <span class="flex-none ml-1">${status}</span>
                                        <span class="flex-none ml-1 node-announcement">${flag}</span>

                                    </div>
                                </div>
                                <div class="node-meta">
                                    <span class="mb-0.5">${img}</span>
                                    <div class="truncate node-meta__text isTypename">
                                        ${typeNameComputed}
                                    </div>
                                    <div class="node-meta__text node-schema">
                                        ${
                                            isNodeWithPorts && schemaName
                                                ? 'in'
                                                : ''
                                        }
                                    </div>
                                    <div class="node-meta__text node-schema text-gray  truncate 
                                        ${isNodeWithPorts ? '' : 'hidden'}">
                                        ${schemaName || ''}
                                    </div>
                                </div>  
                            </div>
                            <div class="lineage-node__ports 
                                    ${isNodeWithPorts ? '' : 'hidden'}">
                                <div iscollist="true" class="lineage-node__ports-cta">
                                    <div class="flex items-center">
                                        <span class="mr-2">
                                            ${getPortsCTALabel(
                                                typeName,
                                                data?.portsCount,
                                                data?.highlightPorts
                                            )}
                                        </span>
                                        <span>
                                            ${
                                                data?.portsListExpanded
                                                    ? iconCaretUp
                                                    : iconCaretDown
                                            } 
                                        </span>
                                    </div>
                                    <div class="w-5 h-5">
                                        ${
                                            data?.portsListLoading
                                                ? iconLoader
                                                : ''
                                        }
                                    </div>
                                </div>
                                <div class="lineage-node__ports-list 
                                    ${data?.ports.length ? '' : 'hidden'}">
                                        ${portsList()}
                                </div>
                            </div>
                            ${
                                data?.ctaPortLeftIcon
                                    ? `<div isctaleft="${
                                          data?.ctaPortLeftId
                                      }" class="ctaPortLeft">
                               ${
                                   data?.ctaPortLeftLoading
                                       ? iconLoaderFixed
                                       : data?.ctaPortLeftIcon === 'col'
                                       ? iconCollapse
                                       : iconExpand
                               }
                            </div>`
                                    : ''
                            }
                            ${
                                data?.ctaPortRightIcon
                                    ? `<div isctaright="${
                                          data?.ctaPortRightId
                                      }" class="ctaPortRight">
                                ${
                                    data?.ctaPortRightLoading
                                        ? iconLoaderFixed
                                        : data?.ctaPortRightIcon === 'col'
                                        ? iconCollapse
                                        : iconExpand
                                }
                            </div>`
                                    : ''
                            }
                            `
                        }
                    </div>
                </div>`
                },
                shouldComponentUpdate(node) {
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
                        ],
                        attrs: {
                            portBody: {
                                r: 14,
                                strokeWidth: 0,
                                stroke: '#000000',
                                fill: '#000000',
                                width: 1,
                                height: 1,
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
                        ],
                        attrs: {
                            portBody: {
                                r: 14,
                                strokeWidth: 0,
                                stroke: '#000000',
                                fill: '#000000',
                                width: 1,
                                height: 1,
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
                                height: 70,
                                strokeWidth: 1,
                                stroke: 'none',
                                fill: 'none',
                                y: isVpNode ? -40 : -50,
                                x: 1,
                            },
                        },
                    },
                    portsList: {
                        markup: [
                            {
                                tagName: 'rect',
                                selector: 'portBody',
                            },
                        ],
                        attrs: {
                            portBody: {
                                width: 268,
                                height: 42,
                                strokeWidth: 1,
                                stroke: '#000000',
                                fill: '#000000',
                                x: 1,
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

        if (!isNodeWithPorts) nodeData.ports.items = [nodeData.ports.items[0]]

        return { nodeData }
    }

    const addNode = async (entity, data = {}) => {
        const graphNodes = graph.value.getNodes()
        const baseEntityGuid = graphNodes.find((x) => x.store.data.isBase).id
        const { nodeData } = createNodeData(entity, baseEntityGuid, data)
        graph.value.addNode(nodeData)
    }

    const createEdgeData = (relation, data = {}, styles: EdgeStyle = {}) => {
        const isDup = data?.isDup
        const isCyclicEdge = data?.isCyclicEdge
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
        createEdgeData,
        addEdge,
    }
}
