import { ref } from 'vue'
import { getNodeSourceImage, getNodeTypeText } from './util.js'
import useUpdateGraph from './useUpdateGraph'

const { updateEdgesStroke } = useUpdateGraph()

const getType = (entity) => getNodeTypeText[entity.typeName]
const getSource = (entity) => entity.attributes.qualifiedName.split('/')[0]

export default function useComputeGraph(
    graph,
    graphLayout,
    lineageData,
    showProcess,
    searchItems,
    reload
) {
    const edges = ref([])
    const nodes = ref([])

    if (reload) {
        nodes.value = []
        edges.value = []
    }

    const model = ref(null)
    const { baseEntityGuid, relations } = lineageData.value
    const guidEntityMap = Object.values(lineageData.value.guidEntityMap)

    /* Nodes ( Sources and Targets ) */
    guidEntityMap.forEach((entity) => {
        const { guid, displayText } = entity
        const source = getSource(entity)
        const type = getType(entity)
        const isBase = guid === baseEntityGuid
        const isProcess = type === 'Process'
        const img = getNodeSourceImage[source]

        if (isProcess && !showProcess.value) return

        const searchItem = entity
        searchItems.value.push(searchItem)

        const nodeData = {
            id: guid,
            type,
            source,
            isBase,
            x: 40,
            y: 40,
            width: isProcess ? 32 : 220,
            height: 32,
            shape: 'html',
            html: {
                render() {
                    return !isProcess
                        ? `<div class="lineage-node">
                                    <span class="node-type">
                                        <span class="node-type__item">${type}</span>
                                    </span>
                                    <span class=" ${
                                        isBase ? 'node-isbase' : 'hidden'
                                    }">
                                        <span class="node-isbase__item">BASE</span>
                                    </span>
                                    <img class="node-source" src="${img}" />
                                    <span class="node-text">${displayText}</span>
                                </div>`
                        : `<div class="lineage-process"> P </div>`
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
            return entity.typeName === 'AtlanProcess'
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
                    strokeWidth: 2,
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

    /* Center Base */
    const cell = graph.value.getCellById(baseEntityGuid)
    if (cell) graph.value.centerCell(cell)

    /* Zoom */
    graph.value.zoom(-0.4)

    return { model, edges, nodes, baseEntityGuid }
}
