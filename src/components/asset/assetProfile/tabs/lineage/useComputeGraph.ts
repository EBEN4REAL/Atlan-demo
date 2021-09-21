import { ref } from 'vue'
import '@antv/x6-vue3-shape'
import Node from './node.vue'
import { getNodeTypeText, updateEdgesStroke } from './util.js'

const getType = (entity) => getNodeTypeText[entity.typeName]
const getSource = (entity) => entity.attributes.qualifiedName.split('/')[0]

export default function useComputeGraph(
    graph,
    graphLayout,
    lineageData,
    showProcess,
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

        const nodeData = {
            id: guid,
            type,
            width: isProcess ? 32 : 220,
            height: 32,
            shape: 'vue3-shape',
            component: {
                name: 'NodeContainer',
                template: `<node :displayText="displayText" :source="source" :type="type" :isBase="isBase" :guid="guid"></node>`,
                data() {
                    return {
                        guid,
                        displayText,
                        source,
                        type,
                        isBase,
                    }
                },
                components: {
                    Node,
                },
            },
        }

        nodes.value.push(nodeData)
    })

    /* Edges */
    relations.forEach((relation) => {
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
