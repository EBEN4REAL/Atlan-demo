import { ref } from 'vue'
import { timeDiffCalc } from '~/utils/date'

export default function useComputeGraph(
    graph,
    graphLayout,
    workflowData,
    currZoom
) {
    const edges = ref([])
    const nodes = ref([])
    const model = ref(null)

    const name = workflowData.value.metadata?.name

    if (name) {
        const { nodes: sourceNodes } = workflowData.value?.status

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

        interface PrepareNode {
            nodeName: string
            children: string[]
            parent: string
        }
        const getCollapsedNodeName = (
            parent: string,
            message: string,
            type: string
        ): string =>
            JSON.stringify({
                kind: 'collapsed',
                parent,
                message,
                type,
            })

        const isCollapsedNode = (id: string): boolean => {
            try {
                return JSON.parse(id).kind === 'collapsed'
            } catch (e) {
                return false
            }
        }

        const getNodeParent = (id: string): string => {
            try {
                return JSON.parse(id).parent
            } catch (e) {
                return ''
            }
        }

        const pushChildren = (
            nodeId: string,
            isExpanded: boolean,
            queue: PrepareNode[]
        ): void => {
            const children: string[] = getChildren(nodeId)
            if (!children) {
                return
            }

            if (children.length > 3 && !isExpanded) {
                // Node will be collapsed
                queue.push({
                    nodeName: children[0],
                    parent: nodeId,
                    children: getChildren(children[0]),
                })
                const newChildren: string[] = children
                    .slice(1, children.length - 1)
                    .map((v) => [v])
                    .reduce((a, b) => a.concat(b), [])

                queue.push({
                    nodeName: getCollapsedNodeName(
                        nodeId,
                        `${children.length - 2} hidden nodes`,
                        getNode(children[0]).type
                    ),
                    parent: nodeId,
                    children: newChildren,
                })
                queue.push({
                    nodeName: children[children.length - 1],
                    parent: nodeId,
                    children: getChildren(children[children.length - 1]),
                })
            } else {
                // Node will not be collapsed
                children.map((child) =>
                    queue.push({
                        nodeName: child,
                        parent: nodeId,
                        children: getChildren(child),
                    })
                )
            }
        }

        const traverse = (root: PrepareNode): void => {
            const queue: PrepareNode[] = [root]
            const consideredChildren: Set<string> = new Set<string>()
            let previousCollapsed: string = ''

            while (queue.length > 0) {
                const item = queue.pop()

                if (isCollapsedNode(item?.nodeName)) {
                    console.log('collapsed node', item?.nodeName)
                    console.log('collapsed node', previousCollapsed)
                    console.log(
                        'collapsed node',
                        getNode(getNodeParent(item?.nodeName))
                    )
                    if (
                        item?.nodeName !== previousCollapsed &&
                        getNode(getNodeParent(item?.nodeName))
                    ) {
                        console.log('new node')
                        const {
                            id,
                            phase,
                            displayName,
                            startedAt,
                            finishedAt,
                            type,
                        } = getNode(getNodeParent(item?.nodeName))

                        let displayNameTrunc = 'Collapsed'
                        // if (displayName.length > 12)
                        //     displayNameTrunc = `${displayName.slice(0, 12)}...`
                        // else displayNameTrunc = displayName

                        const newNode = {
                            startedAt: new Date(startedAt),
                            finishedAt: new Date(finishedAt),
                            timecalc: timeDiffCalc(
                                new Date(startedAt),
                                new Date(finishedAt)
                            ),
                            id: item?.nodeName,
                            phase,
                            displayName: 'Collapsed',
                            type,
                            width: 160,
                            height: [
                                'Running',
                                'Omitted',
                                'Pending',
                                'Skipped',
                            ].includes(phase)
                                ? 39
                                : 45,
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
                                    } ${phase} ${type}">
                                        <div>
                                        <svg width="30" height="30" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 animate-spin ${
                                            phase === 'Running'
                                                ? 'block'
                                                : 'hidden'
                                        }">
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15ZM9 13C11.2091 13 13 11.2091 13 9C13 6.79086 11.2091 5 9 5C6.79086 5 5 6.79086 5 9C5 11.2091 6.79086 13 9 13Z" fill="#BDCDF4"/>
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.8778 12.4939C14.6076 11.475 15 10.2533 15 9L9 9H13C13 9.83556 12.7383 10.6501 12.2518 11.3294C11.7652 12.0087 11.0781 12.5185 10.287 12.7873C9.49582 13.0561 8.64037 13.0705 7.84067 12.8283C7.04098 12.5861 6.3372 12.0996 5.82812 11.4371C5.31905 10.7745 5.03024 9.96913 5.00225 9.13404C4.97425 8.29895 5.20846 7.47606 5.67202 6.78087C6.13557 6.08569 6.80518 5.55313 7.58686 5.25794C8.36812 4.96291 9.22212 4.9198 10.0291 5.13465L10.5436 3.20197C9.33258 2.87954 8.05095 2.94443 6.87865 3.38753C5.70634 3.83062 4.70221 4.62969 4.00719 5.67256C3.31217 6.71544 2.96115 7.94977 3.00341 9.2023C3.04566 10.4548 3.47907 11.6627 4.2428 12.6564C5.00652 13.65 6.06222 14.3796 7.26173 14.7427C8.46123 15.1058 9.74432 15.0841 10.9309 14.6808C12.1175 14.2775 13.148 13.5127 13.8778 12.4939Z" fill="#5277D7"/>
                                            </svg>
    
                                            <svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 ${
                                                phase === 'Succeeded'
                                                    ? 'block'
                                                    : 'hidden'
                                            }">
                                                <path d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="#00A680"/>
                                                <path d="M5.25 9L7.75 11.5L12.75 6.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
    
                                            <svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 ${
                                                ['Failed', 'Error'].includes(
                                                    phase
                                                )
                                                    ? 'block'
                                                    : 'hidden'
                                            }">
                                                <path d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="#E04F1A"/>
                                                <path d="M5.49988 12.5L12.5001 5.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M5.49988 5.5L12.4999 12.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
    
                                            <svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 ${
                                                ['Omitted', 'Skipped'].includes(
                                                    phase
                                                )
                                                    ? 'block'
                                                    : 'hidden'
                                            }">
                                                <path d="M14.6807 8.03763C15.4216 8.46535 15.4216 9.53465 14.6807 9.96237L9.68013 12.8495C8.9393 13.2772 8.01326 12.7425 8.01326 11.8871L8.01326 6.1129C8.01326 5.25747 8.9393 4.72282 9.68013 5.15054L14.6807 8.03763Z" fill="#6F7590"/>
                                                <path d="M9.43112 8.03763C10.1719 8.46535 10.1719 9.53465 9.43112 9.96237L4.43052 12.8495C3.68969 13.2772 2.76365 12.7425 2.76365 11.8871L2.76365 6.1129C2.76365 5.25747 3.68969 4.72282 4.43052 5.15054L9.43112 8.03763Z" fill="#6F7590"/>
                                            </svg>
    
                                            <svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 ${
                                                phase === 'Pending'
                                                    ? 'block'
                                                    : 'hidden'
                                            }">
                                                <path d="M11.5993 2.28946H6.32862C5.48759 2.28946 4.94747 3.18287 5.33827 3.92758L7.7274 8.4803C7.89817 8.80573 7.89817 9.19428 7.7274 9.51971L5.33827 14.0724C4.94747 14.8171 5.48759 15.7106 6.32862 15.7106H11.6714C12.5125 15.7106 13.0526 14.8172 12.6618 14.0725L10.2691 9.51263C10.1004 9.19114 10.0983 8.80777 10.2633 8.48441L12.5954 3.91643C12.9753 3.17228 12.4348 2.28946 11.5993 2.28946Z" stroke="#EFAC00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M10.5 11.4999H7.50003L5.21146 14.1444L6.21139 15.1444L12 15.4999L12.5001 14.1444L10.5 11.4999Z" fill="#EFAC00"/>
                                            </svg>
    
                                        </div>
                                        <div>
                                            <div class="leading-none text-gray-700 mb-1">${displayNameTrunc}</div>
                                            <div class="text-gray-500 leading-none text-xs ${
                                                [
                                                    'Running',
                                                    'Omitted',
                                                    'Pending',
                                                    'Skipped',
                                                ].includes(phase)
                                                    ? 'hidden'
                                                    : 'block'
                                            }">${timeDiffCalc(
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

                        nodes.value.push(newNode)

                        const stroke = '#aaaaaa'
                        // const edge = {
                        //     id: `${item.parent}@${getNodeParent(
                        //         item?.nodeName
                        //     )}`,
                        //     source: item.parent,
                        //     target: item?.nodeName,
                        //     router: { name: 'metro' },
                        //     connector: { name: 'rounded' },
                        //     attrs: {
                        //         line: {
                        //             stroke,
                        //             strokeWidth: 2,
                        //             targetMarker: {
                        //                 name: 'block',
                        //                 stroke,
                        //                 width: 9,
                        //                 height: 9,
                        //             },
                        //         },
                        //     },
                        // }
                        // edges.value.push(edge)
                        previousCollapsed = item.nodeName

                        console.log('collapse node', newNode)
                    }
                    continue
                }
                const child = sourceNodes[item.nodeName]
                if (!child) {
                    continue
                }
                const isExpanded: boolean = false
                const { id, phase, displayName, startedAt, finishedAt, type } =
                    getNode(item?.nodeName)

                let displayNameTrunc
                if (displayName.length > 12)
                    displayNameTrunc = `${displayName.slice(0, 12)}...`
                else displayNameTrunc = displayName

                const newNode = {
                    startedAt: new Date(startedAt),
                    finishedAt: new Date(finishedAt),
                    timecalc: timeDiffCalc(
                        new Date(startedAt),
                        new Date(finishedAt)
                    ),
                    id,
                    phase,
                    displayName,
                    type,
                    width: 160,
                    height: [
                        'Running',
                        'Omitted',
                        'Pending',
                        'Skipped',
                    ].includes(phase)
                        ? 39
                        : 45,
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
                            } ${phase} ${type}">
                                <div>
                                    <svg width="30" height="30" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 animate-spin ${
                                        phase === 'Running' ? 'block' : 'hidden'
                                    }">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15ZM9 13C11.2091 13 13 11.2091 13 9C13 6.79086 11.2091 5 9 5C6.79086 5 5 6.79086 5 9C5 11.2091 6.79086 13 9 13Z" fill="#BDCDF4"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.8778 12.4939C14.6076 11.475 15 10.2533 15 9L9 9H13C13 9.83556 12.7383 10.6501 12.2518 11.3294C11.7652 12.0087 11.0781 12.5185 10.287 12.7873C9.49582 13.0561 8.64037 13.0705 7.84067 12.8283C7.04098 12.5861 6.3372 12.0996 5.82812 11.4371C5.31905 10.7745 5.03024 9.96913 5.00225 9.13404C4.97425 8.29895 5.20846 7.47606 5.67202 6.78087C6.13557 6.08569 6.80518 5.55313 7.58686 5.25794C8.36812 4.96291 9.22212 4.9198 10.0291 5.13465L10.5436 3.20197C9.33258 2.87954 8.05095 2.94443 6.87865 3.38753C5.70634 3.83062 4.70221 4.62969 4.00719 5.67256C3.31217 6.71544 2.96115 7.94977 3.00341 9.2023C3.04566 10.4548 3.47907 11.6627 4.2428 12.6564C5.00652 13.65 6.06222 14.3796 7.26173 14.7427C8.46123 15.1058 9.74432 15.0841 10.9309 14.6808C12.1175 14.2775 13.148 13.5127 13.8778 12.4939Z" fill="#5277D7"/>
                                    </svg>
    
                                    <svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 ${
                                        phase === 'Succeeded'
                                            ? 'block'
                                            : 'hidden'
                                    }">
                                        <path d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="#00A680"/>
                                        <path d="M5.25 9L7.75 11.5L12.75 6.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
    
                                    <svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 ${
                                        ['Failed', 'Error'].includes(phase)
                                            ? 'block'
                                            : 'hidden'
                                    }">
                                        <path d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="#E04F1A"/>
                                        <path d="M5.49988 12.5L12.5001 5.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M5.49988 5.5L12.4999 12.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
    
                                    <svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 ${
                                        ['Omitted', 'Skipped'].includes(phase)
                                            ? 'block'
                                            : 'hidden'
                                    }">
                                        <path d="M14.6807 8.03763C15.4216 8.46535 15.4216 9.53465 14.6807 9.96237L9.68013 12.8495C8.9393 13.2772 8.01326 12.7425 8.01326 11.8871L8.01326 6.1129C8.01326 5.25747 8.9393 4.72282 9.68013 5.15054L14.6807 8.03763Z" fill="#6F7590"/>
                                        <path d="M9.43112 8.03763C10.1719 8.46535 10.1719 9.53465 9.43112 9.96237L4.43052 12.8495C3.68969 13.2772 2.76365 12.7425 2.76365 11.8871L2.76365 6.1129C2.76365 5.25747 3.68969 4.72282 4.43052 5.15054L9.43112 8.03763Z" fill="#6F7590"/>
                                    </svg>
    
                                    <svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 ${
                                        phase === 'Pending' ? 'block' : 'hidden'
                                    }">
                                        <path d="M11.5993 2.28946H6.32862C5.48759 2.28946 4.94747 3.18287 5.33827 3.92758L7.7274 8.4803C7.89817 8.80573 7.89817 9.19428 7.7274 9.51971L5.33827 14.0724C4.94747 14.8171 5.48759 15.7106 6.32862 15.7106H11.6714C12.5125 15.7106 13.0526 14.8172 12.6618 14.0725L10.2691 9.51263C10.1004 9.19114 10.0983 8.80777 10.2633 8.48441L12.5954 3.91643C12.9753 3.17228 12.4348 2.28946 11.5993 2.28946Z" stroke="#EFAC00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M10.5 11.4999H7.50003L5.21146 14.1444L6.21139 15.1444L12 15.4999L12.5001 14.1444L10.5 11.4999Z" fill="#EFAC00"/>
                                    </svg>
    
                                </div>
                                <div>
                                    <div class="leading-none text-gray-700 mb-1">${displayNameTrunc}</div>
                                    <div class="text-gray-500 leading-none text-xs ${
                                        [
                                            'Running',
                                            'Omitted',
                                            'Pending',
                                            'Skipped',
                                        ].includes(phase)
                                            ? 'hidden'
                                            : 'block'
                                    }">${timeDiffCalc(
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

                nodes.value.push(newNode)

                if (item.parent) {
                    const edge = {
                        id: `${item.parent}@${item.nodeName}`,
                        source: item.parent,
                        target: item.nodeName,
                        router: { name: 'metro' },
                        connector: { name: 'rounded' },
                        attrs: {
                            line: {
                                strokeWidth: 2,
                                targetMarker: {
                                    name: 'block',

                                    width: 9,
                                    height: 9,
                                },
                            },
                        },
                    }
                    edges.value.push(edge)
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

                pushChildren(node.id, isExpanded, queue)
            }
        }

        const workflowRoot: PrepareNode = {
            nodeName: name,
            parent: '',
            children: getChildren(name),
        }

        // Traverse the workflow from the root node
        traverse(workflowRoot)

        /* Render */
        model.value = graphLayout.value.layout({
            edges: edges.value,
            nodes: nodes.value,
        })
        graph.value.fromJSON(model.value)

        /* Center Base */
        const cell = graph.value.getCellById(workflowData.value?.metadata)
        if (cell) graph.value.centerCell(cell)
        graph.value.centerPoint(null, 800, { padding: { right: 400 } })

        /* Zoom */
        graph.value.zoom(-0.4)
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    }

    // const workflowRoot: PrepareNode = {
    //     nodeName: workflowData.metadata?.name,
    //     parent: '',
    //     children: getChildren(workflowData.metadata?.name),
    // }

    // traverse(workflowRoot)

    // if (workflowData.value?.metadata) {
    //     console.log(workflowData)
    //     const { name: baseEntity } = workflowData.value?.metadata

    //     /* Nodes ( Sources and Targets ) */
    //     const { nodes: n } = workflowData.value?.status
    //     Object.values(n).forEach((v) => {
    //         if (v.type !== 'TaskGroup') {
    //             const { id, phase, displayName, startedAt, finishedAt, type } =
    //                 v

    //             let displayNameTrunc
    //             if (displayName.length > 12)
    //                 displayNameTrunc = `${displayName.slice(0, 12)}...`
    //             else displayNameTrunc = displayName

    //             const isBase = baseEntity === id
    //             const nodeData = {
    //                 startedAt: new Date(startedAt),
    //                 finishedAt: new Date(finishedAt),
    //                 timecalc: timeDiffCalc(
    //                     new Date(startedAt),
    //                     new Date(finishedAt)
    //                 ),
    //                 id,
    //                 phase,
    //                 displayName,
    //                 isBase,
    //                 type,
    //                 width: 160,
    //                 height: [
    //                     'Running',
    //                     'Omitted',
    //                     'Pending',
    //                     'Skipped',
    //                 ].includes(phase)
    //                     ? 39
    //                     : 45,
    //                 shape: 'html',
    //                 data: {
    //                     id,
    //                 },
    //                 html: {
    //                     render(node) {
    //                         const data = node.getData() as any

    //                         return `
    //                         <div class="monitor-node flex items-center ${
    //                             data?.isSelectedNode === data?.id
    //                                 ? 'isSelectedNode'
    //                                 : ''
    //                         } ${phase} ${type}">
    //                             <div>
    //                                 <svg width="30" height="30" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 animate-spin ${
    //                                     phase === 'Running' ? 'block' : 'hidden'
    //                                 }">
    //                                     <path fill-rule="evenodd" clip-rule="evenodd" d="M9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3C5.68629 3 3 5.68629 3 9C3 12.3137 5.68629 15 9 15ZM9 13C11.2091 13 13 11.2091 13 9C13 6.79086 11.2091 5 9 5C6.79086 5 5 6.79086 5 9C5 11.2091 6.79086 13 9 13Z" fill="#BDCDF4"/>
    //                                     <path fill-rule="evenodd" clip-rule="evenodd" d="M13.8778 12.4939C14.6076 11.475 15 10.2533 15 9L9 9H13C13 9.83556 12.7383 10.6501 12.2518 11.3294C11.7652 12.0087 11.0781 12.5185 10.287 12.7873C9.49582 13.0561 8.64037 13.0705 7.84067 12.8283C7.04098 12.5861 6.3372 12.0996 5.82812 11.4371C5.31905 10.7745 5.03024 9.96913 5.00225 9.13404C4.97425 8.29895 5.20846 7.47606 5.67202 6.78087C6.13557 6.08569 6.80518 5.55313 7.58686 5.25794C8.36812 4.96291 9.22212 4.9198 10.0291 5.13465L10.5436 3.20197C9.33258 2.87954 8.05095 2.94443 6.87865 3.38753C5.70634 3.83062 4.70221 4.62969 4.00719 5.67256C3.31217 6.71544 2.96115 7.94977 3.00341 9.2023C3.04566 10.4548 3.47907 11.6627 4.2428 12.6564C5.00652 13.65 6.06222 14.3796 7.26173 14.7427C8.46123 15.1058 9.74432 15.0841 10.9309 14.6808C12.1175 14.2775 13.148 13.5127 13.8778 12.4939Z" fill="#5277D7"/>
    //                                 </svg>

    //                                 <svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 ${
    //                                     phase === 'Succeeded'
    //                                         ? 'block'
    //                                         : 'hidden'
    //                                 }">
    //                                     <path d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="#00A680"/>
    //                                     <path d="M5.25 9L7.75 11.5L12.75 6.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    //                                 </svg>

    //                                 <svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 ${
    //                                     ['Failed', 'Error'].includes(phase)
    //                                         ? 'block'
    //                                         : 'hidden'
    //                                 }">
    //                                     <path d="M0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9Z" fill="#E04F1A"/>
    //                                     <path d="M5.49988 12.5L12.5001 5.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    //                                     <path d="M5.49988 5.5L12.4999 12.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    //                                 </svg>

    //                                 <svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 ${
    //                                     ['Omitted', 'Skipped'].includes(phase)
    //                                         ? 'block'
    //                                         : 'hidden'
    //                                 }">
    //                                     <path d="M14.6807 8.03763C15.4216 8.46535 15.4216 9.53465 14.6807 9.96237L9.68013 12.8495C8.9393 13.2772 8.01326 12.7425 8.01326 11.8871L8.01326 6.1129C8.01326 5.25747 8.9393 4.72282 9.68013 5.15054L14.6807 8.03763Z" fill="#6F7590"/>
    //                                     <path d="M9.43112 8.03763C10.1719 8.46535 10.1719 9.53465 9.43112 9.96237L4.43052 12.8495C3.68969 13.2772 2.76365 12.7425 2.76365 11.8871L2.76365 6.1129C2.76365 5.25747 3.68969 4.72282 4.43052 5.15054L9.43112 8.03763Z" fill="#6F7590"/>
    //                                 </svg>

    //                                 <svg width="26" height="26" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-2 ${
    //                                     phase === 'Pending' ? 'block' : 'hidden'
    //                                 }">
    //                                     <path d="M11.5993 2.28946H6.32862C5.48759 2.28946 4.94747 3.18287 5.33827 3.92758L7.7274 8.4803C7.89817 8.80573 7.89817 9.19428 7.7274 9.51971L5.33827 14.0724C4.94747 14.8171 5.48759 15.7106 6.32862 15.7106H11.6714C12.5125 15.7106 13.0526 14.8172 12.6618 14.0725L10.2691 9.51263C10.1004 9.19114 10.0983 8.80777 10.2633 8.48441L12.5954 3.91643C12.9753 3.17228 12.4348 2.28946 11.5993 2.28946Z" stroke="#EFAC00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    //                                     <path d="M10.5 11.4999H7.50003L5.21146 14.1444L6.21139 15.1444L12 15.4999L12.5001 14.1444L10.5 11.4999Z" fill="#EFAC00"/>
    //                                 </svg>

    //                             </div>
    //                             <div>
    //                                 <div class="leading-none text-gray-700 mb-1">${displayNameTrunc}</div>
    //                                 <div class="text-gray-500 leading-none text-xs ${
    //                                     [
    //                                         'Running',
    //                                         'Omitted',
    //                                         'Pending',
    //                                         'Skipped',
    //                                     ].includes(phase)
    //                                         ? 'hidden'
    //                                         : 'block'
    //                                 }">${timeDiffCalc(
    //                             new Date(startedAt),
    //                             new Date(finishedAt)
    //                         )} </div>
    //                             </div>
    //                         </div>`
    //                     },
    //                     shouldComponentUpdate(node) {
    //                         return node.hasChanged('data')
    //                     },
    //                 },
    //             }
    //             nodes.value.push(nodeData)
    //         }
    //     })

    //     /* Edges */
    //     const relations = []
    //     const taskGroups = []
    //     let exitId = ''

    //     Object.values(n).forEach((v) => {
    //         const { id, type, displayName, children } = v
    //         if (type === 'TaskGroup') taskGroups.push({ id, children })
    //         if (displayName.includes('onExit')) exitId = id
    //     })

    //     Object.entries(n).forEach(([k, v]) => {
    //         const { type, children, outboundNodes } = v

    //         if (!children || type === 'TaskGroup') return

    //         if (k === baseEntity && outboundNodes && exitId)
    //             outboundNodes.forEach((x) => {
    //                 const relation = {}
    //                 relation.fromEntityId = x
    //                 relation.toEntityId = exitId
    //                 relations.push(relation)
    //             })

    //         children.forEach((x) => {
    //             const taskGroup = taskGroups.find((y) => y.id === x)
    //             if (taskGroup) {
    //                 const taskGroupParent = Object.values(n).find((z) =>
    //                     z.children ? z.children.includes(x) : false
    //                 )
    //                 taskGroup.children.forEach((i) => {
    //                     const relation = {}
    //                     relation.fromEntityId = taskGroupParent.id
    //                     relation.toEntityId = i
    //                     relations.push(relation)
    //                 })
    //                 return
    //             }
    //             const relation = {}
    //             relation.fromEntityId = k
    //             relation.toEntityId = x
    //             relations.push(relation)
    //         })
    //     })

    //     relations.forEach((relation) => {
    //         const stroke = '#aaaaaa'
    //         const edge = {
    //             id: `${relation.fromEntityId}@${relation.toEntityId}`,
    //             source: relation.fromEntityId,
    //             target: relation.toEntityId,
    //             router: { name: 'metro' },
    //             connector: { name: 'rounded' },
    //             attrs: {
    //                 line: {
    //                     stroke,
    //                     strokeWidth: 2,
    //                     targetMarker: {
    //                         name: 'block',
    //                         stroke,
    //                         width: 9,
    //                         height: 9,
    //                     },
    //                 },
    //             },
    //         }
    //         edges.value.push(edge)
    //     })

    //     /* Render */
    //     model.value = graphLayout.value.layout({
    //         edges: edges.value,
    //         nodes: nodes.value,
    //     })
    //     graph.value.fromJSON(model.value)

    //     /* Center Base */
    //     const cell = graph.value.getCellById(baseEntity)
    //     if (cell) graph.value.centerCell(cell)
    //     graph.value.centerPoint(null, 800, { padding: { right: 400 } })

    //     /* Zoom */
    //     graph.value.zoom(-0.4)
    //     currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    // }

    return { model, edges, nodes }
}
