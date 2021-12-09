import { ref } from 'vue'
import { getNodeSourceImage } from './util.js'
import { useAPIPromise } from '~/services/api/useAPIPromise'
import { map as entityMap } from '~/services/meta/entity/key'
import {
    iconVerified,
    iconDraft,
    iconDeprecated,
    iconProcess,
    iconEllipse,
} from './icons'

const getSource = (entity) => {
    const item = entity.attributes.qualifiedName.split('/')
    if (item[0] === 'default') return item[1]
    return item[0]
}
const getEntity = async (guid: string) => {
    const { entity } = await useAPIPromise(
        entityMap.GET_ENTITY({ guid }),
        'GET',
        {}
    )
    return entity
}

export default function useGraph() {
    const createNodeData = async (entity, baseEntityGuid, dataObj = {}) => {
        const { guid, typeName } = entity
        const isProcess = ['Process', 'ColumnProcess', 'AtlanProcess'].includes(
            typeName
        )
        const isBase = guid === baseEntityGuid
        const source = getSource(entity)
        const img = getNodeSourceImage[source]

        const enrichedEntity = !isProcess ? await getEntity(guid) : entity
        const { attributes } = enrichedEntity
        let { displayText } = enrichedEntity
        const { schemaName, certificateStatus } = attributes

        let certificateIcon = ''
        if (certificateStatus === 'VERIFIED') certificateIcon = iconVerified
        else if (certificateStatus === 'DEPRECATED')
            certificateIcon = iconDeprecated
        else if (certificateStatus === 'DRAFT') certificateIcon = iconDraft

        if (!displayText) displayText = attributes.name

        const computedData = {
            id: guid,
            isHighlightedNode: null,
            isHighlightedNodePath: null,
            isGrayed: false,
            ...dataObj,
        }

        const columns = enrichedEntity.relationshipAttributes.columns.map(
            (x, index) => {
                const text =
                    x.displayText.charAt(0).toUpperCase() +
                    x.displayText.slice(1).toLowerCase()
                return {
                    id: `${guid}-port-${index + 1}`,
                    group: 'columnList',
                    attrs: {
                        portNameLabel: {
                            text,
                        },
                        portImage: {
                            'xlink:href': 'https://svgshare.com/i/cdx.svg',
                            width: 16,
                            height: 16,
                        },
                    },
                }
            }
        )

        const nodeData = {
            id: guid,
            typeName,
            source,
            isBase,
            entity: enrichedEntity,
            isProcess,
            width: isProcess ? 60 : 270,
            height: 70,
            shape: 'html',
            data: computedData,
            html: {
                render(node) {
                    const data = node.getData() as any

                    return !isProcess
                        ? `<div class="lineage-node group ${
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
                                <span class=" ${isBase ? 'inscr' : 'hidden'}">
                                    <span class="inscr-item">BASE</span>
                                </span>
                                <div>
                                    <div class="node-text group-hover:underline">
                                        <div class="truncate">${displayText}</div>
                                         ${certificateIcon}
                                    </div>
                                    <div class="node-meta">
                                        <img class="node-meta__source" src="${img}" />
                                        <div class="node-meta__text truncate">${typeName}</div>
                                        ${
                                            typeName === 'AtlanTable'
                                                ? iconEllipse
                                                : ''
                                        }
                                       <div class="node-meta__text text-truncate ${
                                           typeName === 'AtlanTable'
                                               ? ''
                                               : 'd-none'
                                       }">${schemaName || ''}</div>
                                    </div>
                                </div>       
                            </div>`
                        : `<div class="lineage-process ${
                              data?.isHighlightedNode === data?.id
                                  ? 'isHighlightedNode'
                                  : ''
                          } ${
                              data?.isHighlightedNodePath === data?.id
                                  ? 'isHighlightedNodePath'
                                  : ''
                          }
                          ${data?.isGrayed ? 'isGrayed' : ''}"> ${iconProcess}
                        </div>`
                },
                shouldComponentUpdate(node: Cell) {
                    return node.hasChanged('data')
                },
            },
            ports: {
                groups: {
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
                                magnet: true,
                                y: -10,
                            },
                            portNameLabel: {
                                ref: 'portBody',
                                refX: 36,
                                refY: 12,
                                fontSize: 16,
                                fill: '#3e4359',
                            },
                            portImage: {
                                ref: 'portBody',
                                refX: 12,
                                refY: 12,
                            },
                        },
                        position: 'erPortPosition',
                    },
                },
                items: [
                    {
                        id: `${guid}-port-0`,
                        group: 'columnList',
                        zIndex: 0,
                    },
                    ...columns,
                ],
            },
        }

        if (isProcess) delete nodeData.ports

        return { nodeData, enrichedEntity, isProcess }
    }

    const addNode = async (graph, entity, data = {}) => {
        const graphNodes = graph.value.getNodes()
        const baseEntityGuid = graphNodes.find((x) => x.store.data.isBase).id
        const { nodeData } = await createNodeData(entity, baseEntityGuid)
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

    const createEdgeData = (relation) => {
        const stroke = '#C7C7C7'
        const edgeData = {
            id: `${relation.fromEntityId}@${relation.toEntityId}`,
            source: {
                cell: relation.fromEntityId,
                port: `${relation.fromEntityId}-port-2`, // TODO: use dynamic relations
            },
            target: {
                cell: relation.toEntityId,
                port: `${relation.toEntityId}-port-4`, // TODO: use dynamic relations
            },
            router: {
                name: 'metro',
            },
            connector: { name: 'rounded' },
            attrs: {
                line: {
                    stroke,
                    strokeWidth: 1.6,
                    targetMarker: {
                        name: 'block',
                        stroke,
                        width: 7,
                        height: 7,
                    },
                },
            },
        }

        return {
            edgeData,
        }
    }

    const addEdge = (graph, relation, data = {}) => {
        const { edgeData } = createEdgeData(relation)
        graph.value.addEdge(edgeData)
        if (Object.keys(data).length) {
            const cell = graph.value.getCellById(edgeData.id)
            cell.setData(data)
        }
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

    return {
        createNodeData,
        addNode,
        removeNode,
        createEdgeData,
        addEdge,
        removeEdge,
    }
}
