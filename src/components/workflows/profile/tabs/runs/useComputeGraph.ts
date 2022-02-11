import { computed, ref } from 'vue'
import { timeDiffCalc } from '~/utils/date'

export default function useComputeGraph(
    graph,
    graphLayout,
    workflowData,
    currZoom,
    lastZoom,
    currentScroll,
    isFull: boolean
) {
    interface PrepareNode {
        nodeName: string
        children: string[]
        parent: string
    }

    const edges = ref([])
    const nodes = ref([])
    const model = ref(null)

    const name = workflowData?.value?.metadata?.name
    // const workflowStatus = workflowData?.value?.metadata?.name
    // const sourceNodes = workflowData.value?.status?.nodes

    const sourceNodes = computed(() => workflowData.value?.status?.nodes)

    const getChildren = (nodeId: string): string[] => {
        if (nodeId) {
            if (
                !sourceNodes.value[nodeId] ||
                !sourceNodes.value[nodeId].children
            ) {
                return []
            }
            return sourceNodes.value[nodeId].children.filter(
                (child) => sourceNodes.value[child]
            )
        }
        return []
    }

    const getNode = (nodeId) => {
        if (sourceNodes.value) {
            return sourceNodes.value[nodeId]
        }
        return {}
    }

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
        const {
            id,
            phase,
            displayName,
            startedAt,
            finishedAt,
            type,
            name: nodeName,
        } = getNode(item?.nodeName)

        let displayNameTrunc = displayName

        let width = 140
        let height = 40
        let isStart = false
        let isConfig = false

        if (nodeName === `${rootNodeName}`) {
            displayNameTrunc = 'START'
            width = 140
            isStart = true
        }

        if (item.parent === `${rootNodeName}`) {
            displayNameTrunc = 'Config'
            width = 140
            isConfig = true
        }

        return {
            startedAt: new Date(startedAt),
            finishedAt: new Date(finishedAt),
            timecalc: timeDiffCalc(new Date(startedAt), new Date(finishedAt)),
            id: item?.nodeName,
            displayName,
            name: nodeName,
            phase,
            type,
            zIndex: 10,

            width,
            height,
            shape: 'html',
            data: getNode(item?.nodeName),
            html: {
                render(node) {
                    const data = node.getData() as any

                    if (isStart) {
                        return ` <div class="text-xl flex items-center justify-center w-full h-full  leading-none text-primary  font-bold text-gray-700 ">${displayNameTrunc}</div>`
                    }
                    if (isConfig) {
                        return ` <div class="rounded bg-white shadow flex items-center justify-center w-full h-full border border-primary leading-none text-primary  font-semibold ">${displayNameTrunc}</div>`
                    }

                    return `
                            <div class="flex items-center  bg-white  w-full h-full shadow-lg group   ${
                                data?.isSelectedNode === data?.id
                                    ? 'isSelectedNode'
                                    : ''
                            } ${phase} ${type}">

                         
                         
                               <div class="flex items-center justify-between  group w-full h-full bg-transparent rounded  cursor-pointer ${phase} ${
                        phase === 'Succeeded' ? 'block' : 'hidden'
                    } ${
                        type === 'Pod'
                            ? 'border-l-4 border-r border-t border-b border-green-500'
                            : 'border border-primary'
                    }">
                               <div class="font-bold pl-3 truncate ${
                                   type === 'Pod'
                                       ? 'text-green-500'
                                       : 'text-gray-700'
                               }">${displayNameTrunc}</div>
                               <div class="pr-2">
                               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 18 18" fill="none" class="__web-inspector-hide-shortcut__">
<path d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="#00A680"/>
<path d="M5.25 9L7.75 11.5L12.75 6.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></div>

                               </div>
                               <div class="flex items-center justify-between  w-full h-full bg-transparent rounded cursor-pointer ${phase} ${
                        ['Failed', 'Error'].includes(phase) ? 'block' : 'hidden'
                    }   ${
                        type === 'Pod'
                            ? 'border-l-4 border-r border-t border-b border-red-500'
                            : 'border border-primary'
                    }"">
              
                               <div class="   font-bold px-3 truncate ${
                                   type === 'Pod'
                                       ? 'text-red-500'
                                       : 'text-gray-700'
                               }">${displayNameTrunc}</div>
                               <div class="pr-2">
                               <svg  xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 18 18" fill="none">
<path d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="#E04F1A"/>
<path d="M5.49988 12.5L12.5001 5.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.49988 5.5L12.4999 12.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></div>
                               
                               </div>  
                               <div class="flex items-center justify-between border w-full h-full bg-transparent rounded border-gray-500 ${phase} ${
                        ['Omitted', 'Skipped', 'Queued'].includes(phase)
                            ? 'block'
                            : 'hidden'
                    }">
                             
                            <div class=" font-bold text-gray-500 pl-2 truncate">${displayNameTrunc}</div>
                            <div class="pr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
<path d="M14.6807 8.03763C15.4216 8.46535 15.4216 9.53465 14.6807 9.96237L9.68012 12.8495C8.93929 13.2772 8.01325 12.7425 8.01325 11.8871L8.01326 6.1129C8.01326 5.25747 8.93929 4.72282 9.68012 5.15054L14.6807 8.03763Z" fill="#6F7590"/>
<path d="M9.43112 8.03763C10.1719 8.46535 10.1719 9.53465 9.43112 9.96237L4.43052 12.8495C3.68969 13.2772 2.76365 12.7425 2.76365 11.8871L2.76365 6.1129C2.76365 5.25747 3.68969 4.72282 4.43052 5.15054L9.43112 8.03763Z" fill="#6F7590"/>
</svg></div>
                            </div>   
                            <div class="flex items-center justify-between border w-full h-full bg-transparent rounded border-gray-500 ${phase} ${
                        ['Pending'].includes(phase) ? 'block' : 'hidden'
                    }">
                                     
                                    <div class=" font-bold text-gray-500 pl-2 truncate">${displayNameTrunc}</div>
                                    <div class="pr-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
<path d="M11.5993 2.28943H6.32862C5.48759 2.28943 4.94747 3.18284 5.33827 3.92755L7.7274 8.48027C7.89817 8.8057 7.89817 9.19425 7.7274 9.51968L5.33827 14.0724C4.94747 14.8171 5.48759 15.7105 6.32862 15.7105H11.6714C12.5125 15.7105 13.0526 14.8171 12.6618 14.0724L10.2691 9.5126C10.1004 9.19111 10.0983 8.80773 10.2633 8.48438L12.5954 3.9164C12.9753 3.17225 12.4348 2.28943 11.5993 2.28943Z" stroke="#EFAC00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.5 11.4999H7.50003L5.21146 14.1443L6.21138 15.1443L12 15.4999L12.5001 14.1443L10.5 11.4999Z" fill="#EFAC00"/>
</svg>
                                 </div>
                                    </div>  
                            <div class="flex items-center bg-primary-menu justify-between border-primary border-l-4 w-full h-full bg-transparent rounded border-r border-t border-b truncate ${
                                ['Running'].includes(phase) ? 'block' : 'hidden'
                            }">
                          
                         
                           
                         <div class=" font-bold pl-2 truncate">${displayNameTrunc}</div>
                         <div class="pr-2">
                         <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                         <path fill-rule="evenodd" clip-rule="evenodd" d="M9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15ZM9 13C11.2091 13 13 11.2091 13 9C13 6.79086 11.2091 5 9 5C6.79086 5 5 6.79086 5 9C5 11.2091 6.79086 13 9 13Z" fill="#BDCDF4"/>
                         <path fill-rule="evenodd" clip-rule="evenodd" d="M13.8778 12.4939C14.6076 11.475 15 10.2533 15 9L9 9H13C13 9.83556 12.7383 10.6501 12.2518 11.3294C11.7652 12.0087 11.0781 12.5185 10.287 12.7873C9.49582 13.0561 8.64037 13.0705 7.84067 12.8283C7.04098 12.5861 6.3372 12.0996 5.82812 11.4371C5.31905 10.7745 5.03024 9.96913 5.00225 9.13404C4.97425 8.29895 5.20846 7.47606 5.67202 6.78087C6.13557 6.08569 6.80518 5.55313 7.58686 5.25794C8.36812 4.96291 9.22212 4.9198 10.0291 5.13465L10.5436 3.20197C9.33258 2.87954 8.05095 2.94443 6.87865 3.38753C5.70634 3.83062 4.70221 4.62969 4.00719 5.67256C3.31217 6.71544 2.96115 7.94977 3.00341 9.2023C3.04566 10.4548 3.47907 11.6627 4.2428 12.6564C5.00652 13.65 6.06222 14.3796 7.26173 14.7427C8.46123 15.1058 9.74432 15.0841 10.9309 14.6808C12.1175 14.2775 13.148 13.5127 13.8778 12.4939Z" fill="#5277D7"/>
                         </svg>
                         </div>
                         
                         
                     
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

            if (isFull) {
                if (!consideredChildren.has(item?.nodeName)) {
                    nodes.value.push(newNode(item, rootNodeName))
                }

                let source = previousCollapsed

                const found = nodes.value.find((i) => i.id === item?.parent)
                if (found) {
                    source = found?.id
                }

                if (source && source !== item?.nodeName) {
                    const edge = {
                        id: `${source}@${getNode(item?.nodeName).name}`,
                        source,
                        target: item?.nodeName,
                        router: { name: 'metro' },
                        connector: { name: 'rounded' },

                        attrs: {
                            line: {
                                stroke: '#666',
                                strokeWidth: 1,
                                targetMarker: {
                                    name: 'block',
                                    targetMarker: 'classic',
                                    stroke: '#666',
                                    fill: '#666',

                                    width: 5,
                                    height: 5,
                                },
                            },
                        },
                    }

                    edges.value.push(edge)
                    previousCollapsed = item?.nodeName
                }
            } else if (isFirstLevel(name)) {
                if (!consideredChildren.has(item?.nodeName)) {
                    nodes.value.push(newNode(item, rootNodeName))
                }

                let source = previousCollapsed
                const found = nodes.value.find((i) => i.id === item?.parent)
                if (found) {
                    source = found?.id
                }

                if (
                    source &&
                    source !== item?.nodeName &&
                    !item?.children.includes(source)
                ) {
                    const edge = {
                        id: `${source}@${getNode(item?.nodeName).name}`,
                        source,
                        target: item?.nodeName,
                        router: { name: 'oneSide', args: { side: 'bottom' } },
                        connector: { name: 'smooth' },

                        attrs: {
                            line: {
                                stroke: '#666',
                                strokeWidth: 1,
                                targetMarker: {
                                    name: 'block',
                                    targetMarker: 'classic',
                                    stroke: '#666',
                                    fill: '#666',

                                    width: 5,
                                    height: 5,
                                },
                            },
                        },
                    }

                    edges.value.push(edge)
                }

                previousCollapsed = item?.nodeName
            }

            // If we have already considered the children of this node, don't consider them again

            consideredChildren.add(item.nodeName)

            const node = getNode(item?.nodeName)
            if (!node) {
                continue
            }
            pushChildren(node.id, queue)
        }
    }

    const init = (reset = true) => {
        if (graph.value) {
            const workflowRoot: PrepareNode = {
                nodeName: name,
                parent: '',
                children: getChildren(name),
            }
            traverse(workflowRoot)
            /* Render */
            model.value = graphLayout.value?.layout({
                edges: edges.value,
                nodes: nodes.value,
            })
            graph.value?.fromJSON(model.value)

            console.log('Reset', reset, nodes)
            if (reset) {
                lastZoom.value = 0.3
                graph.value.zoom(-0.3)
                currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
                // graph.value.zoomToFit({ maxScale: 1 })

                const cell = graph.value.getCellById(
                    `${workflowData.value.metadata?.name}`
                )

                if (cell)
                    graph.value.centerCell(cell, { padding: { top: -300 } })

                currentScroll.value = graph.value.getScrollbarPosition()
            } else {
                console.log(sourceNodes)
                // console.log(currentScroll.value)
                // console.log(lastZoom.value)
                // graph.value.zoom(1 - lastZoom.value)
                // currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
            }
        }
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