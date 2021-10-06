import { ref } from 'vue'

export default function useComputeGraph(
    graph,
    graphLayout,
    workflowData,
    reload
) {
    const edges = ref([])
    const nodes = ref([])

    if (reload) {
        nodes.value = []
        edges.value = []
    }

    const model = ref(null)

    const { name: baseEntity } = workflowData.value.metadata

    /* Nodes ( Sources and Targets ) */
    const { nodes: n } = workflowData.value.status
    Object.values(n).forEach((v) => {
        if (v.type !== 'TaskGroup') {
            const { id, phase, displayName } = v
            let displayNameTrunc
            if (displayName.length > 25)
                displayNameTrunc = `${displayName.slice(
                    0,
                    12
                )}...${displayName.slice(-13, -1)}`
            else displayNameTrunc = displayName

            const isBase = baseEntity === id
            const nodeData = {
                id,
                phase,
                displayName,
                isBase,
                width: 64,
                height: 64,
                shape: 'html',
                html: {
                    render() {
                        return `
                        <div class=" workflow-node ${
                            phase === 'Succeeded' ? 'succeeded' : 'failed'
                        }">
                            ${phase === 'Succeeded' ? 'S' : 'F'}
                            <span class="node-desc">
                                <span class="node-desc__item">
                                    ${displayNameTrunc}
                                </span>
                            </span>
                        </div>`
                    },
                },
            }
            nodes.value.push(nodeData)
        }
    })

    /* Edges */
    const relations = []
    const taskGroups = []
    let exitId = ''

    Object.values(n).forEach((v) => {
        const { id, type, displayName, children } = v
        if (type === 'TaskGroup') taskGroups.push({ id, children })
        if (displayName.includes('onExit')) exitId = id
    })

    Object.entries(n).forEach(([k, v]) => {
        const { type, children, outboundNodes } = v

        if (!children || type === 'TaskGroup') return

        if (k === baseEntity)
            outboundNodes.forEach((x) => {
                const relation = {}
                relation.fromEntityId = x
                relation.toEntityId = exitId
                relations.push(relation)
            })

        children.forEach((x) => {
            const taskGroup = taskGroups.find((y) => y.id === x)
            if (taskGroup) {
                const taskGroupParent = Object.values(n).find((z) =>
                    z.children ? z.children.includes(x) : false
                )
                taskGroup.children.forEach((i) => {
                    const relation = {}
                    relation.fromEntityId = taskGroupParent.id
                    relation.toEntityId = i
                    relations.push(relation)
                })
                return
            }
            const relation = {}
            relation.fromEntityId = k
            relation.toEntityId = x
            relations.push(relation)
        })
    })

    relations.forEach((relation) => {
        const stroke = '#ccd6dd'
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

    /* Center */
    const cell = graph.value.getCellById(baseEntity)
    if (cell) graph.value.centerCell(cell)

    graph.value.centerPoint(900, 800)

    /* Zoom */
    graph.value.zoom(-0.4)
}
