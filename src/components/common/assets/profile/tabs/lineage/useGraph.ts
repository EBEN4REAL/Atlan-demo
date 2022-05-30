/* eslint-disable no-nested-ternary */
/** COMPOSABLES */
import useAssetInfo from '~/composables/discovery/useAssetInfo'

/** CONSTANTS */
import { dataTypeCategoryList } from '~/constant/dataType'

/** UTILS */
import {
    SQLAssets,
    getNodeSourceImage,
    getSource,
    getSchema,
    getDatabase,
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
    lookerField,
} from './icons'

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
    LookerField: lookerField,
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
    LookerExplore: 'fields',
    LookerView: 'fields',
}

const getPortsCTALabel = (typeName, portsCount) => {
    const label = portsLabelMap[typeName]
    return portsCount || portsCount === 0
        ? `${portsCount} ${label}`
        : `view ${label}`
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
        const databaseName = getDatabase(entity)
        const img = getNodeSourceImage[source]
        const isBase = guid === baseEntityGuid
        const isVpNode = typeName === 'vpNode'
        const isSQLNode = SQLAssets.includes(typeName)
        const isNodeWithPorts = [
            'Table',
            'View',
            'MaterialisedView',
            'TableauDatasource',
            'LookerExplore',
            'LookerView',
        ].includes(typeName)

        const computedData = {
            id: guid,
            hasPorts: !!isNodeWithPorts,
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
            highlightPorts: [],
            mode: '',
            modeId: '',
            count: 0,
            hiddenEntities: [],
            ctaRightIcon: '',
            ctaRightId: '',
            ctaRightLoading: false,
            ctaLeftIcon: '',
            ctaLeftId: '',
            ctaLeftLoading: false,
            disableCta: false,
            showDatabase: true,
            showSchema: true,
            showAnnouncement: true,
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
                    const totalHidden = isVpNode ? data?.count : 0

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
                                const isHighlightedPort =
                                    data?.highlightPorts.includes(port.guid)

                                res += `
                                <div id="${port.guid}" isportitem="${
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
                                            aType && data?.showAnnouncement
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
                                <div isportshowmore="true" class="node-port flex justify-center text-new-blue-400 items-center pl-2">
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
                                        <span class=" ${
                                            !status
                                                ? 'w-0 hidden'
                                                : 'flex-none ml-1'
                                        }">${status}</span>
                                        ${
                                            data?.showAnnouncement && flag
                                                ? `<span class=" node-announcement ${
                                                      !flag
                                                          ? 'w-0 hidden'
                                                          : 'flex-none ml-1'
                                                  }">${flag}</span>`
                                                : ''
                                        }                                        
                                    </div>
                                </div>
                                <div class="node-meta">
                                    <span class="mb-0.5">${img}</span>
                                    <div class="truncate node-meta__text isTypename">
                                        ${typeNameComputed}
                                    </div>
                                    <div class="node-meta__text">
                                        ${
                                            isSQLNode &&
                                            ((data?.showDatabase &&
                                                databaseName) ||
                                                (data?.showSchema &&
                                                    schemaName))
                                                ? 'in'
                                                : ''
                                        }
                                    </div>
                                      ${
                                          data?.showDatabase &&
                                          databaseName &&
                                          isSQLNode
                                              ? `<div title="Database: ${databaseName}" class="node-meta__text node-database text-gray truncate">
                                                    ${databaseName || ''} 
                                               </div>`
                                              : ''
                                      }
                                    ${
                                        data?.showDatabase &&
                                        databaseName &&
                                        data?.showSchema &&
                                        schemaName &&
                                        isSQLNode
                                            ? '<div>/</div>'
                                            : ''
                                    }
                                    ${
                                        data?.showSchema &&
                                        schemaName &&
                                        isSQLNode
                                            ? `<div title="Schema: ${schemaName}" class="node-meta__text node-schema text-gray truncate">
                                                  ${schemaName || ''}
                                                </div>`
                                            : ''
                                    }
                                </div>  
                            </div>
                            <div class="lineage-node__ports 
                                    ${isNodeWithPorts ? '' : 'hidden'}">
                                <div isportlist="true" class="lineage-node__ports-cta ${
                                    data?.highlightPorts.length ||
                                    data?.selectedPortId
                                        ? 'opacity-30 cursor-not-allowed'
                                        : ''
                                }">
                                    <div class="flex items-center">
                                        <span class="mr-2">
                                            ${getPortsCTALabel(
                                                typeName,
                                                data?.portsCount
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
                                data?.ctaLeftIcon && !data?.disableCta
                                    ? `<div isctaleft="${
                                          data?.ctaLeftId
                                      }" class="ctaLeft">
                               ${
                                   data?.ctaLeftLoading
                                       ? iconLoaderFixed
                                       : data?.ctaLeftIcon === 'col'
                                       ? iconCollapse
                                       : iconExpand
                               }
                            </div>`
                                    : ''
                            }
                            ${
                                data?.ctaRightIcon && !data?.disableCta
                                    ? `<div isctaright="${
                                          data?.ctaRightId
                                      }" class="ctaRight">
                                ${
                                    data?.ctaRightLoading
                                        ? iconLoaderFixed
                                        : data?.ctaRightIcon === 'col'
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
        const stroke = styles?.stroke || '#B2B8C7'

        const edgeData = {
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
                            text: 'process',
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
