import { ref } from 'vue'
import { getNodeSourceImage } from './util.js'
import { iconProcess, iconEllipse, iconCaretDown } from './icons'
import { dataTypeCategoryList } from '~/constant/dataType'

const getSource = (entity) => {
    const item = entity.attributes.qualifiedName.split('/')
    if (item[0] === 'default') return item[1]
    return item[0]
}
const getSchema = (entity) => {
    const item = entity.attributes.qualifiedName.split('/')
    if (item[0] === 'default') return item[4]
    return item[3]
}

export default function useGraph() {
    const createNodeData = async (entity, baseEntityGuid, dataObj = {}) => {
        const { guid, typeName, attributes } = entity
        let { displayText } = entity
        const source = getSource(entity)
        const schemaName = getSchema(entity)
        const img = getNodeSourceImage[source]
        const isBase = guid === baseEntityGuid
        const isProcess = ['Process', 'ColumnProcess'].includes(typeName)

        if (!displayText) displayText = attributes.name

        const computedData = {
            id: guid,
            isHighlightedNode: null,
            isHighlightedNodePath: null,
            isGrayed: false,
            ...dataObj,
        }

        const nodeData = {
            id: guid,
            typeName,
            source,
            isBase,
            entity,
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
                                        <span class="z-50 relative block">
                                            <span class=" absolute right-0 caret-bg text-white flex justify-end w-10"> ${iconCaretDown}</span>
                                        </span>
                                        <div class="truncate">${displayText}</div>
                                        
                                    </div>
                                    <div class="node-meta">
                                        <img class="node-meta__source" src="${img}" />
                                        <div class="node-meta__text truncate">${typeName}</div>
                                        ${
                                            ['Table', 'View'].includes(typeName)
                                                ? iconEllipse
                                                : ''
                                        }
                                       <div class="node-meta__text  truncate ${
                                           ['Table', 'View'].includes(typeName)
                                               ? ''
                                               : 'hidden'
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
                                height: 69,
                                strokeWidth: 1,
                                stroke: '#e6e6eb',
                                fill: '#ffffff',
                                event: 'port:click',
                                y: -34,
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
                                y: -9.5,
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

        if (isProcess) delete nodeData.ports

        return { nodeData, entity, isProcess }
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

    const createPortData = (item) => {
        const text =
            item.displayText.charAt(0).toUpperCase() +
            item.displayText.slice(1).toLowerCase()
        const dataType = dataTypeCategoryList.find((d) =>
            d.type.includes(item.attributes?.dataType?.toUpperCase())
        )?.imageText
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

    const createEdgeData = (relation) => {
        const stroke = relation.stroke
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
            connector: { name: 'rounded' },
            attrs: {
                line: {
                    stroke,
                    strokeWidth: 1.6,
                    targetMarker: {
                        name: 'block',
                        stroke,
                        width: 8,
                        height: 8,
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

    const toggleNodesEdges = (graph, visible) => {
        const graphEdges = graph.value.getEdges()
        graphEdges.forEach((x) => {
            if (x.id.includes('processIdGoesHere')) return
            const cell = graph.value.getCellById(x.id)
            cell.setVisible(visible)
        })
    }

    return {
        createNodeData,
        addNode,
        removeNode,
        createPortData,
        createEdgeData,
        addEdge,
        removeEdge,
        toggleNodesEdges,
    }
}
