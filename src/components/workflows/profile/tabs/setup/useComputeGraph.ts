import { ref } from 'vue'

export default function useComputeGraph(
    graph,
    graphLayout,
    workflowData,
    currZoom,
    reload
) {
    const edges = ref([])
    const nodes = ref([])

    if (reload) {
        nodes.value = []
        edges.value = []
    }

    const model = ref(null)
    let baseNodeId = ''

    /* Nodes ( Sources and Targets ) */
    const tasks = workflowData.value
    tasks.forEach((v) => {
        const id = v.name
        let IdTrunc
        if (id.length > 16) IdTrunc = `${id.slice(0, 16)}...`
        else IdTrunc = id

        const nodeData = {
            id,
            displayName: id,
            width: 190,
            height: 40,
            shape: 'html',
            data: {
                id,
            },
            html: {
                render(node) {
                    const data = node.getData() as any

                    return `
                        <div class="setup-node ${
                            data?.isSelectedNode === data?.id
                                ? 'isSelectedNode'
                                : ''
                        }">
                            ${IdTrunc}
                        </div>`
                },
                shouldComponentUpdate(node) {
                    return node.hasChanged('data')
                },
            },
        }
        nodes.value.push(nodeData)
    })

    /* Edges */
    const relations = []
    tasks.forEach((x) => {
        if (x.dependencies) {
            x.dependencies.forEach((y) => {
                const relation = {}
                relation.fromEntityId = y
                relation.toEntityId = x.name
                relations.push(relation)
            })
        } else {
            baseNodeId = x.name
        }
    })

    relations.forEach((relation) => {
        const stroke = '#aaaaaa'
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
                        width: 9,
                        height: 9,
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

    if (!reload) {
        /* Center Base */
        const cell = graph.value.getCellById(baseNodeId)
        if (cell) graph.value.centerCell(cell)
        graph.value.centerPoint(null, 600, { padding: { right: 400 } })
    }

    /* Zoom */
    graph.value.zoom(-0.4)
    currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`

    return { model, edges, nodes }
}
