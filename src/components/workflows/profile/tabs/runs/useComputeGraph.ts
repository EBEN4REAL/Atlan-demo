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

    const newNode = (item, rootNodeName) => {
        const { id, phase, displayName, startedAt, finishedAt, type } = getNode(
            item?.nodeName
        )
        let displayNameTrunc = displayName

        let width = 190
        let height = 55
        let isStart = false

        console.log(rootNodeName)
        console.log(rootNodeName)

        if (name === `${rootNodeName}.run`) {
            displayNameTrunc = 'START'
            width = 55
            isStart = true
        }

        return {
            startedAt: new Date(startedAt),
            finishedAt: new Date(finishedAt),
            timecalc: timeDiffCalc(new Date(startedAt), new Date(finishedAt)),
            id: item?.nodeName,
            phase,
            type,
            width,
            height,
            shape: 'html',
            data: {
                id,
            },
            html: {
                render(node) {
                    const data = node.getData() as any

                    if (isStart) {
                        return ` <div class="start-node leading-none text-primary mb-1 ml-2 font-semibold">${displayNameTrunc}</div>`
                    }

                    return `
                            <div class="monitor-node flex items-center bg-white border-primary ${
                                data?.isSelectedNode === data?.id
                                    ? 'isSelectedNode'
                                    : ''
                            } ${phase} ${type}">
                                <div>
                                

<svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 ${
                        phase === 'Succeeded' && !isStart ? 'block' : 'hidden'
                    }">
<path d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="#00A680"/>
<path d="M5.25 9L7.75 11.5L12.75 6.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

<svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 ${
                        ['Failed', 'Error'].includes(phase) && !isStart
                            ? 'block'
                            : 'hidden'
                    }">
<path d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="#E04F1A"/>
<path d="M5.49988 12.5L12.5001 5.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.49988 5.5L12.4999 12.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
    }

    const traverse = (root: PrepareNode): void => {
        const queue: PrepareNode[] = [root]
        const consideredChildren: Set<string> = new Set<string>()
        let previousCollapsed: string = ''

        const rootNodeName = getNode(root?.nodeName)?.name

        while (queue.length > 0) {
            const item = queue.pop()

            const name = getNode(item?.nodeName).name

            if (isFirstLevel(name) && item.parent) {
                nodes.value.push(newNode(item, rootNodeName))
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
