import { ref } from 'vue'
import { getNodeSourceImage, getNodeTypeText } from './util.js'
import useUpdateGraph from './useUpdateGraph'
import { useAPIPromise } from '~/services/api/useAPIPromise'
import { map as entityMap } from '~/services/meta/entity/key'
import {
    iconVerified,
    iconDraft,
    iconDeprecated,
    iconProcess,
    iconEllipse,
} from './icons'

const { updateEdgesData } = useUpdateGraph()
const getType = (entity) => getNodeTypeText[entity.typeName]
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

export default async function useComputeGraph(
    graph,
    graphLayout,
    lineageData,
    showProcess,
    searchItems,
    currZoom,
    reload,
    isComputationDone
) {
    const edges = ref([])
    const nodes = ref([])
    searchItems.value = []

    if (reload) {
        nodes.value = []
        edges.value = []
    }

    const model = ref(null)
    const { relations, baseEntityGuid } = lineageData.value
    let baseEntity = null

    if (!relations.length) baseEntity = await getEntity(baseEntityGuid)

    const guidEntityMap = !relations.length
        ? [baseEntity]
        : Object.values(lineageData.value.guidEntityMap)

    /* Nodes ( Sources and Targets ) */
    await Promise.all(
        guidEntityMap.map(async (entity) => {
            const { guid } = entity
            const type = getType(entity)
            const isProcess = type === 'Process'
            const isBase = guid === baseEntityGuid
            const source = getSource(entity)
            const img = getNodeSourceImage[source]

            if (isProcess && !showProcess.value) return

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

            const searchItem = enrichedEntity
            searchItems.value.push(searchItem)

            const nodeData = {
                id: guid,
                type,
                source,
                isBase,
                entity: enrichedEntity,
                isProcess,
                width: isProcess ? 60 : 270,
                height: 60,
                shape: 'html',
                data: {
                    id: guid,
                    isHighlightedNode: null,
                    isHighlightedNodePath: null,
                    isGrayed: false,
                },
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
                                        <div class="node-meta__text truncate">${type}</div>
                                        ${iconEllipse}
                                        <div class="node-meta__text truncate">${schemaName}</div>
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
            }

            nodes.value.push(nodeData)
        })
    )

    /* Edges */
    let computedRelations
    if (!showProcess.value) {
        const result = []
        const getEntity = (x) => guidEntityMap.find((y) => y.guid === x)
        const isProcess = (x) => {
            const entity = getEntity(x)
            return ['Process', 'ColumnProcess'].includes(entity.typeName)
        }
        relations.forEach((relation) => {
            // const x = relation.fromEntityId
            const y = relation.toEntityId
            if (isProcess(y)) {
                const newFrom = relation.fromEntityId
                const newToObj = relations.find((x) => x.fromEntityId === y)
                const newTo = newToObj.toEntityId
                const newRelationObj = {
                    fromEntityId: newFrom,
                    toEntityId: newTo,
                }
                result.push(newRelationObj)
            }
        })
        computedRelations = result
    } else {
        computedRelations = [...relations]
    }
    computedRelations.forEach((relation) => {
        const stroke = '#AAAAAA'
        const edge = {
            id: `${relation.fromEntityId}@${relation.toEntityId}`,
            source: relation.fromEntityId,
            target: relation.toEntityId,
            router: { name: 'metro' },
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
        edges.value.push(edge)
    })

    /* Render */
    model.value = graphLayout.value.layout({
        edges: edges.value,
        nodes: nodes.value,
    })
    graph.value.fromJSON(model.value)

    // Highlight Edges
    updateEdgesData(graph, [], baseEntityGuid)

    /* Zoom */
    graph.value.zoomToFit({ padding: 12 })
    graph.value.scale(0.7)
    currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`

    isComputationDone.value = true

    return { baseEntityGuid }
}
