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
    empty,
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
} from './icons'
import { dataTypeCategoryList } from '~/constant/dataType'
import useAssetInfo from '~/composables/discovery/useAssetInfo'

interface EdgeStyle {
    stroke?: string
    arrowSize?: number
}

const columnDataTypeIcons = {
    array,
    boolean,
    date,
    empty,
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

const columnAnnouncementTypeIcons = {
    information: iconInformation,
    issue: iconIssue,
    warning: iconWarning,
}

const columnKeyTypeIcons = {
    isPrimary: iconPrimary,
    isForeign: iconForeign,
}

export default function useGraph(graph) {
    const createNodeData = (entity, baseEntityGuid, dataObj = {}) => {
        const { title } = useAssetInfo()
        const { guid, typeName, attributes } = entity
        const typeNameComputed = getNodeTypeText[typeName] || typeName
        const certificateStatus = attributes?.certificateStatus
        const announcementType = attributes?.announcementType
        let status = ''
        let flag = ''
        const displayText = title(entity)
        const source = getSource(entity)
        const schemaName = getSchema(entity)
        const img = getNodeSourceImage[source]
        const isBase = guid === baseEntityGuid
        const isVpNode = typeName === 'vpNode'
        const isNodeWithColumns = [
            'Table',
            'View',
            'MaterialisedView',
        ].includes(typeName)

        switch (certificateStatus) {
            case 'VERIFIED':
                status = iconVerified
                break
            case 'DRAFT':
                status = iconDraft
                break
            case 'DEPRECATED':
                status = iconDeprecated
                break
            default:
                status = ''
        }

        switch (announcementType) {
            case 'information':
                flag = iconInformation
                break
            case 'issue':
                flag = iconIssue
                break
            case 'warning':
                flag = iconWarning
                break
            default:
                flag = ''
        }

        const computedData = {
            id: guid,
            columns: [],
            columnsCount: null,
            columnsListExpanded: false,
            columnListLoading: false,
            columnItemLoading: false,
            columnShowMoreLoading: false,
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

                    const columnsList = () => {
                        let res = ''
                        data?.columns.forEach((column) => {
                            if (column.typeName !== 'showMorePort') {
                                const {
                                    isPrimary,
                                    isForeign,
                                    announcementType: aType,
                                } = column.attributes

                                const text =
                                    column.displayText.charAt(0).toUpperCase() +
                                    column.displayText.slice(1).toLowerCase()

                                const dataType = dataTypeCategoryList.find(
                                    (d) =>
                                        d.type.includes(
                                            column.attributes?.dataType?.toUpperCase()
                                        )
                                )?.imageText

                                const isSelectedPort =
                                    data?.selectedPortId === column.guid
                                const isHighlightedPort = data?.highlightPorts

                                res += `
                                <div id="${column.guid}" iscolitem="${
                                    column.guid
                                }" class="node-column flex justify-between items-center relative 
                                ${isSelectedPort ? 'selected-port' : ''}
                                ${isHighlightedPort ? 'highlighted-port' : ''}">
                                    <div class="flex items-center truncate">
                                        ${columnDataTypeIcons[dataType]}
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
                                                ? `<span class="ml-2">
                                                    ${columnAnnouncementTypeIcons[aType]}
                                                   </span>`
                                                : ''
                                        }
                                    </div>
                                    ${
                                        data?.columnItemLoading &&
                                        isSelectedPort
                                            ? `<div class="absolute right-2 w-5 h-5">
                                            ${iconLoader}
                                        </div>`
                                            : ''
                                    }
                                </div>`
                            } else
                                res += `
                                <div iscolshowmore="true" class="node-column flex justify-center text-new-blue-400 items-center pl-2">
                                    <span> Show more columns </span>
                                    ${
                                        data?.columnShowMoreLoading
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
                        ${isNodeWithColumns ? 'isNodeWithColumns' : ''}
                        ${data?.columnsListExpanded ? 'isExpandedNode' : ''}
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
                                        <span class="flex-none ml-1">${flag}</span>

                                    </div>
                                </div>
                                <div class="node-meta">
                                    <span class="mb-0.5">${img}</span>
                                    <div class="truncate node-meta__text isTypename">
                                        ${typeNameComputed}
                                    </div>
                                    <div class="node-meta__text node-schema">
                                        ${
                                            isNodeWithColumns && schemaName
                                                ? 'in'
                                                : ''
                                        }
                                    </div>
                                    <div class="node-meta__text node-schema text-gray  truncate 
                                        ${isNodeWithColumns ? '' : 'hidden'}">
                                        ${schemaName || ''}
                                    </div>
                                </div>  
                            </div>
                            <div class="lineage-node__columns 
                                    ${isNodeWithColumns ? '' : 'hidden'}">
                                <div iscollist="true" class="lineage-node__columns-cta">
                                    <div class="flex items-center">
                                        <span class="mr-2">
                                            ${
                                                data?.columnsCount ||
                                                data?.columnsCount === 0
                                                    ? `${data?.columnsCount} columns`
                                                    : data?.highlightPorts ? 'columns' : 'view columns'
                                            }
                                        </span>
                                        <span>
                                            ${
                                                data?.columnsListExpanded
                                                    ? iconCaretUp
                                                    : iconCaretDown
                                            } 
                                        </span>
                                    </div>
                                    <div class="w-5 h-5">
                                        ${
                                            data?.columnListLoading
                                                ? iconLoader
                                                : ''
                                        }
                                    </div>
                                </div>
                                <div class="lineage-node__columns-list 
                                    ${data?.columns.length ? '' : 'hidden'}">
                                        ${columnsList()}
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
                    columnList: {
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

        if (!isNodeWithColumns) nodeData.ports.items = [nodeData.ports.items[0]]

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
