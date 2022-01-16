import { ref } from 'vue'
import { timeDiffCalc } from '~/utils/date'

export default function useComputeGraph(
    graph,
    graphLayout,
    workflowData,
    currZoom
) {
    interface PrepareNode {
        nodeName: string
        children: string[]
        parent: string
    }

    const edges = ref([])
    const nodes = ref([])
    const model = ref(null)

    const name = workflowData.value.metadata?.name
    const sourceNodes = workflowData.value?.status?.nodes

    const getChildren = (nodeId: string): string[] => {
        if (nodeId) {
            if (!sourceNodes[nodeId] || !sourceNodes[nodeId].children) {
                return []
            }
            return sourceNodes[nodeId].children.filter(
                (child) => sourceNodes[child]
            )
        }
        return []
    }

    const getNode = (nodeId: string) => sourceNodes[nodeId]

    const isFirstLevel = (name): boolean => {
        if (name) {
            const split = name.split('.')
            if (split.length < 4) {
                return true
            }
        }
        return false
    }

    const pushChildren = (nodeId: string, queue: PrepareNode[]): void => {
        const children: string[] = getChildren(nodeId)
        if (!children) {
            return
        }
        children.map((child) =>
            queue.push({
                nodeName: child,
                parent: nodeId,
                children: getChildren(child),
            })
        )
    }

    const traverse = (root: PrepareNode): void => {
        const queue: PrepareNode[] = [root]
        const consideredChildren: Set<string> = new Set<string>()
        let previousCollapsed: string = ''

        while (queue.length > 0) {
            const item = queue.pop()

            const name = getNode(item?.nodeName).name

            if (isFirstLevel(name)) {
                const { id, phase, displayName, startedAt, finishedAt, type } =
                    getNode(item?.nodeName)

                let displayNameTrunc = displayName
                const newNode = {
                    startedAt: new Date(startedAt),
                    finishedAt: new Date(finishedAt),
                    timecalc: timeDiffCalc(
                        new Date(startedAt),
                        new Date(finishedAt)
                    ),
                    id: item?.nodeName,
                    phase,
                    type,
                    width: 190,
                    height: [
                        'Running',
                        'Omitted',
                        'Pending',
                        'Skipped',
                    ].includes(phase)
                        ? 55
                        : 55,
                    shape: 'html',
                    data: {
                        id,
                    },
                    html: {
                        render(node) {
                            const data = node.getData() as any
                            return `
                                    <div class="monitor-node flex items-center bg-white border-primary ${
                                        data?.isSelectedNode === data?.id
                                            ? 'isSelectedNode'
                                            : ''
                                    } ${phase} ${type}">
                                        <div>
                                        
    <svg width="24" height="24" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="#F3F3F3"/>
    <circle cx="5" cy="9" r="1" fill="#6F7590"/>
    <circle cx="9" cy="9" r="1" fill="#6F7590"/>
    <circle cx="13" cy="9" r="1" fill="#6F7590"/>
    </svg>
    
                                          
    
                                        </div>
                                        <div>
                                            <div class="leading-none text-primary mb-1 ml-2 font-semibold">${displayNameTrunc}</div>
                        
                                        </div>
                                    </div>`
                        },
                        shouldComponentUpdate(node) {
                            return node.hasChanged('data')
                        },
                    },
                }
                nodes.value.push(newNode)
                const stroke = '#aaaaaa'

                if (previousCollapsed) {
                    const edge = {
                        id: `${item.parent}@${getNode(item?.nodeName).name}`,
                        source: previousCollapsed,
                        target: item?.nodeName,
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
                }

                previousCollapsed = item?.nodeName
            }

            // If we have already considered the children of this node, don't consider them again
            if (consideredChildren.has(item.nodeName)) {
                continue
            }
            consideredChildren.add(item.nodeName)

            const node = getNode(item?.nodeName)
            if (!node || node.phase === 'OMITTED') {
                continue
            }
            pushChildren(node.id, queue)
        }
    }

    const init = () => {
        const workflowRoot: PrepareNode = {
            nodeName: name,
            parent: '',
            children: getChildren(name),
        }
        traverse(workflowRoot)
        /* Render */
        model.value = graphLayout.value.layout({
            edges: edges.value,
            nodes: nodes.value,
        })
        graph.value.fromJSON(model.value)

        const cell = graph.value.getCellById(workflowData.value.metadata?.name)
        if (cell) graph.value.centerCell(cell)

        graph.value.zoom(-0.4)
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    }

    if (name) {
        init()
    }

    /* Center Base */

    /* Zoom */

    return {
        model,
        edges,
        nodes,
        init,
        getNode,
    }
}
