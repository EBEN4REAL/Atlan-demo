import { ref } from 'vue'
import { getNodeSourceImage, getNodeTypeText } from './util.js'
import useUpdateGraph from './useUpdateGraph'
import { useAPIPromise } from '~/services/api/useAPIPromise'
import { map as entityMap } from '~/services/meta/entity/key'

const { updateEdgesStroke } = useUpdateGraph()

const getType = (entity) => getNodeTypeText[entity.typeName]
const getSource = (entity) => {
    const item = entity.attributes.qualifiedName.split('/')
    if (item[0] === 'default') return item[1]
    return item[0]
}

export default async function useComputeGraph(
    graph,
    graphLayout,
    lineageData,
    showProcess,
    searchItems,
    currZoom,
    reload
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

    if (!relations.length) {
        const { entity } = await useAPIPromise(
            entityMap.GET_ENTITY({ guid: baseEntityGuid }),
            'GET',
            {}
        )
        baseEntity = entity
    }

    const guidEntityMap = !relations.length
        ? [baseEntity]
        : Object.values(lineageData.value.guidEntityMap)

    /* Nodes ( Sources and Targets ) */
    guidEntityMap.forEach((entity) => {
        const { guid, attributes } = entity
        let { displayText } = entity
        const source = getSource(entity)
        const type = getType(entity)
        const isBase = guid === baseEntityGuid
        const isProcess = type === 'Process'
        const img = getNodeSourceImage[source]

        if (!displayText) displayText = attributes.name

        let displayTextTrunc
        if (displayText.length > 25)
            displayTextTrunc = `${displayText.slice(0, 25)}...`
        else displayTextTrunc = displayText

        if (isProcess && !showProcess.value) return

        const searchItem = entity
        searchItems.value.push(searchItem)

        const nodeData = {
            id: guid,
            type,
            source,
            isBase,
            entity,
            width: 270,
            height: 60,
            shape: 'html',
            data: {
                id: guid,
            },
            html: {
                render(node) {
                    const data = node.getData() as any

                    return !isProcess
                        ? `<div class="lineage-node ${
                              data?.isHighlightedNode === data?.id
                                  ? 'isHighlightedNode'
                                  : ''
                          }
                          ${
                              data?.isHighlightedNodePath === data?.id
                                  ? 'isHighlightedNodePath'
                                  : ''
                          }
                          ${isBase ? 'isBase' : ''}
                          ">
                                    <img class="node-source" src="${img}" />
                                    <div>
                                        <div class="node-text">${displayTextTrunc}</div>
                                        <div class="node-text type">${type}</div>
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
                          }"> <svg width="23" height="23" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.5 3.4375L0.625 5L2.5 6.5625" stroke="#64748B" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M7.5 3.4375L9.375 5L7.5 6.5625" stroke="#64748B" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M6.25 1.5625L3.75 8.4375" stroke="#64748B" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>`
                },
                shouldComponentUpdate(node: Cell) {
                    return node.hasChanged('data')
                },
            },
        }

        nodes.value.push(nodeData)
    })

    /* Edges */
    let computedRelations
    if (!showProcess.value) {
        const result = []
        const getEntity = (x) => guidEntityMap.find((y) => y.guid === x)
        const isProcess = (x) => {
            const entity = getEntity(x)
            return entity.typeName === 'Process'
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
        const stroke = 'gray'
        const edge = {
            id: `${relation.fromEntityId}@${relation.toEntityId}`,
            source: relation.fromEntityId,
            target: relation.toEntityId,
            router: { name: 'metro' },
            connector: { name: 'rounded' },
            attrs: {
                line: {
                    stroke,
                    strokeWidth: 1.7,
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
    const edgesToHighlight = edges.value.map((i) => i.id)
    updateEdgesStroke(
        graph,
        model,
        edges,
        edgesToHighlight,
        baseEntityGuid,
        true
    )

    /* Zoom */
    graph.value.zoomToFit({ padding: 12 })
    graph.value.scale(0.7)
    currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`

    return { model, edges, nodes, baseEntityGuid }
}
