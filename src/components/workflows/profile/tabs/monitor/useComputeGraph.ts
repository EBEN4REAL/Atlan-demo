import { ref } from 'vue'
import { timeDiffCalc } from '~/utils/date'

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
    const { name: baseEntity } = workflowData.value.workflow.metadata

    /* Nodes ( Sources and Targets ) */
    const { nodes: n } = workflowData.value.workflow.status
    Object.values(n).forEach((v) => {
        if (v.type !== 'TaskGroup') {
            const { id, phase, displayName, startedAt, finishedAt } = v

            let displayNameTrunc
            if (displayName.length > 16)
                displayNameTrunc = `${displayName.slice(0, 16)}...`
            else displayNameTrunc = displayName

            const isBase = baseEntity === id
            const nodeData = {
                id,
                phase,
                displayName,
                isBase,
                width: 190,
                height: 55,
                shape: 'html',
                data: {
                    id,
                },
                html: {
                    render(node) {
                        const data = node.getData() as any

                        return `
                        <div class="monitor-node flex items-center ${
                            data?.isSelectedNode === data?.id
                                ? 'isSelectedNode'
                                : ''
                        } ${phase}">
                            <div>
                                <svg width="22" height="22" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-3 ${
                                    phase === 'Succeeded' ? 'block' : 'hidden'
                                }">
                                    <path d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="#00A680"/>
                                    <path d="M5.25 9L7.75 11.5L12.75 6.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>


                                <svg width="22" height="22" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-3 ${
                                    phase === 'Failed' ? 'block' : 'hidden'
                                }">
                                    <path d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="#E04F1A"/>
                                    <path d="M5.49988 12.5L12.5001 5.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M5.49988 5.5L12.4999 12.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>

                                <svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-3 ${
                                    phase === 'Skipped' ? 'block' : 'hidden'
                                }">
                                    <path d="M14.6807 8.03763C15.4216 8.46535 15.4216 9.53465 14.6807 9.96237L9.68013 12.8495C8.9393 13.2772 8.01326 12.7425 8.01326 11.8871L8.01326 6.1129C8.01326 5.25747 8.9393 4.72282 9.68013 5.15054L14.6807 8.03763Z" fill="#6F7590"/>
                                    <path d="M9.43112 8.03763C10.1719 8.46535 10.1719 9.53465 9.43112 9.96237L4.43052 12.8495C3.68969 13.2772 2.76365 12.7425 2.76365 11.8871L2.76365 6.1129C2.76365 5.25747 3.68969 4.72282 4.43052 5.15054L9.43112 8.03763Z" fill="#6F7590"/>
                                </svg>

                                <svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-3 ${
                                    phase === 'Omitted' ? 'block' : 'hidden'
                                }">
                                    <path d="M11.5993 2.28946H6.32862C5.48759 2.28946 4.94747 3.18287 5.33827 3.92758L7.7274 8.4803C7.89817 8.80573 7.89817 9.19428 7.7274 9.51971L5.33827 14.0724C4.94747 14.8171 5.48759 15.7106 6.32862 15.7106H11.6714C12.5125 15.7106 13.0526 14.8172 12.6618 14.0725L10.2691 9.51263C10.1004 9.19114 10.0983 8.80777 10.2633 8.48441L12.5954 3.91643C12.9753 3.17228 12.4348 2.28946 11.5993 2.28946Z" stroke="#EFAC00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M10.5 11.4999H7.50003L5.21146 14.1444L6.21139 15.1444L12 15.4999L12.5001 14.1444L10.5 11.4999Z" fill="#EFAC00"/>
                                </svg>


                            </div>
                            <div>
                                <div>${displayNameTrunc}</div>
                                <div class="text-gray-500">${timeDiffCalc(
                                    new Date(startedAt),
                                    new Date(finishedAt)
                                )} </div>                           
                            </div>
                        </div>`
                    },
                    shouldComponentUpdate(node) {
                        return node.hasChanged('data')
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

    /* Center Base */
    const cell = graph.value.getCellById(baseEntity)
    if (cell) graph.value.centerCell(cell)
    graph.value.centerPoint(null, 800, { padding: { right: 400 } })

    /* Zoom */
    graph.value.zoom(-0.4)
    currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`

    return { model, edges, nodes }
}
