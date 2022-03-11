/** VUE */
import { watch, ref, computed } from 'vue'
import { watchOnce, whenever } from '@vueuse/core'

/** PACKAGES */
import { message } from 'ant-design-vue'

/** COMPOSABLES */
import useLineageStore from '~/store/lineage'
import useLineageService from '~/services/meta/lineage/lineage_service'
import useUpdateGraph from './useUpdateGraph'
import useGetNodes from './useGetNodes'
import useGraph from './useGraph'
import fetchColumns from './fetchColumns'

/** CONSTANTS */
import { LineageAttributes } from '~/constant/projection'

export default function useEventGraph({
    graph,
    baseEntity,
    selectedNode,
    loaderCords,
    currZoom,
    searchItems,
    resetSelections,
    drawerActiveKey,
    preferences,
    mergedLineageData,
    sameSourceCount,
    sameTargetCount,
    nodes,
    edges,
    onSelectAsset,
    onCloseDrawer,
    addSubGraph,
    renderLayout,
}) {
    const lineageStore = useLineageStore()
    const { highlightNodes, highlightEdges, toggleNodesEdges } =
        useUpdateGraph(graph)
    const { useFetchLineage } = useLineageService()
    const { createPortData, addNode, addEdge, createEdgeData, createNodeData } =
        useGraph(graph)

    /** DATA */
    const nodesEdgesHighlighted = ref([])
    const nodesTranslated = ref([])
    const che = ref('') // currentHilightedEdge
    const chp = ref({ portId: '', node: null, expandedNodes: [] }) // currentHilightedPort
    const nodesCaretClicked = ref([])
    const activeNodesToggled = ref({})

    /** METHODS */
    // showLoader
    const showLoader = (e) => {
        if (!e) return
        loaderCords.value = { x: e.clientX, y: e.clientY }
    }

    // hideLoader
    const hideLoader = () => {
        loaderCords.value = {}
    }

    // handleError
    const handleError = (err) => {
        let msg = err.message
        const status = err?.response?.status

        if (status === 403) {
            msg = "Sorry, you don't have access to this asset"
        }
        message.error(msg)
    }

    // getNodesToHighlight
    const getNodesToHighlight = (guid) => {
        let res = []
        if (guid.value) {
            const { predecessors, successors } = useGetNodes(graph, guid.value)
            res = [guid.value, ...predecessors, ...successors]
        }
        return res
    }

    // highlightNode
    const highlightNode = (guid, styleSelectedNode = true) => {
        if (guid === selectedNode.value) {
            onCloseDrawer()
            selectedNode.value = ''
        } else if (guid) selectedNode.value = guid

        const nodesToHighlight = getNodesToHighlight(selectedNode)
        nodesEdgesHighlighted.value = highlightEdges(nodesToHighlight)
        highlightNodes(styleSelectedNode ? selectedNode : '', nodesToHighlight)
        hideLoader()
    }

    // resetSelectedNode
    const resetSelectedNode = () => {
        onCloseDrawer()
        selectedNode.value = ''
        highlightNode(null)
    }

    // getAllXPos
    const getAllXPos = () => {
        let allXPos = {}
        graph.value.getNodes().forEach((node) => {
            const { x } = node.position()
            const order = node.store.data._order
            if (allXPos[x]) allXPos[x].push(order)
            else allXPos = { ...allXPos, [x]: [order] }
        })
        Object.entries(allXPos).forEach(([x, v]) => {
            allXPos[x] = v.sort((a, b) => a - b)
        })
        return allXPos
    }

    // getNodeToTranslatePos
    const getNodeToTranslatePos = (nodeToTranslate) => {
        const { x: nttXPos } = nodeToTranslate.position()
        const allXPos = getAllXPos()
        const allXPosValue = allXPos[nttXPos]
        const nttOrder = nodeToTranslate.store.data._order
        const nttOrderIndex = allXPosValue.findIndex((x) => x === nttOrder)
        const orderOfNodeToFind = allXPosValue[nttOrderIndex - 1]

        const nodePrev = graph.value.getNodes().find((n) => {
            const { x: nXPos } = n.position()
            const nOrder = n.store.data._order
            if (nXPos !== nttXPos) return false
            return nOrder === orderOfNodeToFind
        })

        const { y: y2 } = nodePrev.position()
        const nodePrevPortsLength = nodePrev.getPorts().length - 1
        const portsLengthTotal = nodePrevPortsLength * 40
        const newY = y2 + 130.5 + portsLengthTotal

        return { nttXPos, newY }
    }

    // translateSubsequentNodes
    const translateSubsequentNodes = (node) => {
        const { x } = node.position()

        const nodesToTranslate = graph.value.getNodes().filter((n) => {
            const { x: x2 } = n.position()
            if (
                x === x2 &&
                n.store.data._order > node.store.data._order &&
                n.id !== node.id
            )
                return n
            return false
        })

        nodesToTranslate.sort(
            (a, b) => Number(a.store.data._order) - Number(b.store.data._order)
        )

        nodesToTranslate.forEach((nodeToTranslate) => {
            const { nttXPos, newY } = getNodeToTranslatePos(nodeToTranslate)

            nodeToTranslate.position(nttXPos, newY)

            if (nodesTranslated.value[node.id]) {
                const itExists = nodesTranslated.value[node.id].some(
                    (x) => x.id === nodeToTranslate.id
                )
                if (!itExists) {
                    nodesTranslated.value[node.id].push(nodeToTranslate)
                }
            } else nodesTranslated.value[node.id] = [nodeToTranslate]
        })
    }

    // translateExpandedNodesToDefault
    const translateExpandedNodesToDefault = (x) => {
        const nodesToTranslate = nodesTranslated.value?.[x.id] || []
        nodesToTranslate.forEach((nodeToTranslate) => {
            const { nttXPos, newY } = getNodeToTranslatePos(nodeToTranslate)
            nodeToTranslate.position(nttXPos, newY)
        })
    }

    // portExist
    const portExist = (id) => graph.value.getNodes().some((x) => x.hasPort(id))

    // getPortNode
    const getPortNode = (id) =>
        graph.value.getNodes().find((x) => x.hasPort(id))

    // getAllExpandedNodes
    const getAllExpandedNodes = () => {
        const chpExpandedNodes = [...chp.value.expandedNodes]
        const res = chpExpandedNodes
        if (chp.value.node) res.push(chp.value.node)
        return res
    }

    // isExpandedNode
    const isExpandedNode = (nodeId) => {
        const node = getAllExpandedNodes().find((x) => x.id === nodeId)
        return !!node
    }

    // resetPortStyle
    const resetPortStyle = (node, portId) => {
        if (!node || !portId) return
        node.setPortProp(portId, 'attrs/portBody', {
            fill: '#ffffff',
            stroke: '#e6e6eb',
        })
    }

    // setPortStyle
    const setPortStyle = (node, portId, mode = 'select') => {
        if (!node || !portId) return
        const fill = mode === 'select' ? '#F4F6FD' : '#ffffff'

        node.setPortProp(portId, 'attrs/portBody', {
            fill,
            stroke: '#5277d7',
        })
    }

    // getCaretElement
    const getCaretElement = (nodeId) => {
        const graphNodeElement = document.querySelectorAll(
            `[data-cell-id="${nodeId}"]`
        )[0]
        const caretElement = Array.from(
            graphNodeElement.querySelectorAll('*')
        ).find((y) => y.classList.contains('node-caret'))
        return caretElement
    }

    // controlCaret
    const controlCaret = (nodeId, caretEle, override = false) => {
        if (override) {
            if (!nodesCaretClicked.value.includes(nodeId)) {
                nodesCaretClicked.value.push(nodeId)
            }
            caretEle.classList.add('caret-expanded')
            return
        }

        if (nodesCaretClicked.value.includes(nodeId)) {
            const index = nodesCaretClicked.value.findIndex((x) => x === nodeId)
            nodesCaretClicked.value.splice(index, 1)
            caretEle.classList.remove('caret-expanded')
        } else {
            nodesCaretClicked.value.push(nodeId)
            caretEle.classList.add('caret-expanded')
        }
    }

    // controlPorts
    const controlPorts = (node, columns, allRelations, override = false) => {
        if (node.getPorts().length === 1 || override) {
            const ports = columns.map((x) => {
                const { portData } = createPortData(x)
                return portData
            })
            // graph.value.freeze('controlPorts')
            ports.forEach((x) => {
                if (portExist(x.id)) {
                    node.removePort(x.id)
                }
            })
            node.addPorts(ports)
            if (override) {
                const createdPorts = node.getPorts()
                createdPorts.shift()
                createdPorts.forEach((port) => {
                    const exist = allRelations.find((rel) =>
                        [rel.fromEntityId, rel.toEntityId].includes(port.id)
                    )

                    if (exist && chp.value.portId !== port.id)
                        setPortStyle(node, port.id, 'highlight')
                })
            }
            // graph.value.unfreeze('controlPorts')
            translateSubsequentNodes(node)
        }
    }

    const controlShowMorePorts = (node, enable = true) => {
        if (enable && !node.hasPort(`${node.id}-allCols`))
            node.addPort({
                id: `${node.id}-allCols`,
                group: 'columnList',
                attrs: {
                    portBody: {
                        event: 'allCols:click',
                        rx: 4,
                    },
                    portNameLabel: {
                        text: 'Show more columns',
                        event: 'allCols:click',
                        fill: '#5277d7',
                    },
                },
            })
        else if (!enable && node.hasPort(`${node.id}-allCols`))
            node.removePort(`${node.id}-allCols`)
    }

    // createPortRelations
    const createPortRelations = (relations) => {
        const graphNodes = graph.value.getNodes()
        relations.forEach((x) => {
            const { fromEntityId, toEntityId, processId } = x

            const sourceCell = graphNodes.find((y) =>
                y.hasPort(fromEntityId)
            ).id
            const targetCell = graphNodes.find((y) => y.hasPort(toEntityId)).id
            const relation = {
                id: `port/${processId}/${fromEntityId}@${toEntityId}`,
                sourceCell,
                sourcePort: fromEntityId,
                targetCell,
                targetPort: toEntityId,
            }

            const edge = addEdge(relation, {
                stroke: '#5277d7',
                arrowSize: preferences.value.showArrow ? 12 : 0.1,
            })
            edge.toFront()
        })
    }

    // getValidPortRelations
    const getValidPortRelations = (allRelations) => {
        let rel = []
        if (chp.value.portId) {
            rel = allRelations.filter((x) => {
                if (portExist(x.fromEntityId) && portExist(x.toEntityId)) {
                    return true
                }
                return false
            })
        }
        return rel
    }

    const renderColumnLineage = (
        trNodes,
        relations,
        parentMap: Map<string, any[]>
    ) => {
        if (!relations?.length) return

        // graph.value.freeze('renderColumnLineage')
        trNodes.forEach((node) => {
            if (node.getPorts().length > 1) {
                const ports = node.getPorts()
                ports.shift()
                node.removePorts(ports)
                translateExpandedNodesToDefault(node)
            }

            if (parentMap.get(node.id)?.length)
                controlPorts(node, parentMap.get(node.id), relations, true)

            controlShowMorePorts(node)

            const rel = getValidPortRelations(relations)
            createPortRelations(rel)
            translateSubsequentNodes(node)
        })
        // graph.value.unfreeze('renderColumnLineage')
    }

    const getPortsForNode = (node, isFetchMore = false) => {
        const asset = node.store.data.entity
        const { typeName, attributes } = asset

        if (lineageStore.hasColumnList(node.id) && !isFetchMore) {
            const { assets: columnList, total } =
                lineageStore.getNodesColumnList(node.id)

            controlPorts(node, columnList, [])
            if (columnList.length < total) controlShowMorePorts(node)
            translateSubsequentNodes(node)
            chp.value.expandedNodes.push(node)
            hideLoader()
            return
        }

        const viewQualifiedName = ['def']
        const tableQualifiedName = ['def']

        if (typeName.toLowerCase() === 'view')
            viewQualifiedName.push(attributes.qualifiedName)
        else if (typeName.toLowerCase() === 'table')
            tableQualifiedName.push(attributes.qualifiedName)

        if (tableQualifiedName.length === 1 && viewQualifiedName.length === 1) {
            hideLoader()
            return
        }

        let offset = 0

        if (isFetchMore) {
            if (lineageStore.hasColumnList(node.id)) {
                offset =
                    lineageStore.getNodesColumnList(node.id)?.assets?.length ||
                    0
            }
        }

        const { list, count } = fetchColumns({
            viewQualifiedName,
            tableQualifiedName,
            limit: 5,
            offset,
        })

        watchOnce(
            list,
            () => {
                const columns = list.value

                if (!columns) {
                    const caretElement = getCaretElement(node.id)
                    controlCaret(node.id, caretElement)
                    hideLoader()
                    message.info('No column with lineage found for this node')
                    return
                }

                if (isFetchMore && chp.value.portId) {
                    onCloseDrawer()
                    deselectPort()
                }

                if (!lineageStore.hasColumnList(node.id))
                    lineageStore.setNodesColumnList(node.id, columns, count)
                else {
                    const prevCols = lineageStore.getNodesColumnList(
                        node.id
                    )?.assets
                    lineageStore.setNodesColumnList(
                        node.id,
                        [...prevCols, ...columns],
                        count
                    )
                }
                const allCols = lineageStore.getNodesColumnList(node.id)?.assets
                controlShowMorePorts(node, false)
                controlPorts(node, allCols, [], true)
                translateSubsequentNodes(node)
                hideLoader()

                // debugger
                if (allCols?.length < count.value) {
                    controlShowMorePorts(node)
                }
                // Add to ExpandedNodes array only if it is not fetched again
                if (!isFetchMore) {
                    chp.value.expandedNodes.push(node)
                    // controlShowMorePorts(node)
                }
            },
            { deep: true }
        )
    }

    graph.value.on('allCols:click', ({ e, node }) => {
        e.stopPropagation()
        showLoader(e)
        getPortsForNode(node, true)
    })

    const isColumnNodeVisible = (parentName) => {
        const graphNodes = graph.value.getNodes()
        const node = graphNodes.find(
            (x) => x.store.data.entity.attributes.qualifiedName === parentName
        )
        return !!node
    }

    const isColumnNodeHidden = (portId, parentName) => {
        const portNode = getPortNode(portId)
        const sameSourceCountTargetsHidden =
            sameSourceCount.value?.[portNode.id]?.targertsHidden
        const sameTargetCountSourcesHidden =
            sameTargetCount.value?.[portNode.id]?.sourcesHidden

        const isAnHiddenTarget = sameSourceCountTargetsHidden?.find(
            (x) => x.attributes.qualifiedName === parentName
        )
        const isAnHiddenSource = sameTargetCountSourcesHidden?.find(
            (x) => x.attributes.qualifiedName === parentName
        )

        return {
            isAnHiddenTarget: !!isAnHiddenTarget,
            isAnHiddenSource: !!isAnHiddenSource,
        }
    }

    // controlTranslate
    const controlTranslate = (portId, lineage) => {
        const translateCandidates = []
        const parentMap = new Map<string, any[]>()
        const portNode = getPortNode(portId)

        const nodesToAddQn = { isAnHiddenSource: [], isAnHiddenTarget: [] }
        Object.entries(lineage.guidEntityMap).forEach(([k, v]) => {
            if (k !== portId) {
                const qnArr = v.attributes.qualifiedName.split('/')
                qnArr.pop()
                const parentName = qnArr.join('/')
                if (isColumnNodeVisible(parentName)) return
                const { isAnHiddenSource, isAnHiddenTarget } =
                    isColumnNodeHidden(portId, parentName)

                if (isAnHiddenSource)
                    nodesToAddQn.isAnHiddenSource.push(parentName)
                if (isAnHiddenTarget)
                    nodesToAddQn.isAnHiddenTarget.push(parentName)
            }
        })

        Object.entries(nodesToAddQn).forEach(([k, v]) => {
            if (!v.length) return
            const prefix = k === 'isAnHiddenSource' ? 'vpNodeST' : 'vpNodeSS'
            const vpNode = nodes.value.find(
                (x) => x.id === `${prefix}-${portNode.id}`
            )
            const { guidEntityMap: gem } = mergedLineageData.value
            const nodeIdsToAdd: string[] = Object.values(gem)
                .filter((x) => v.includes(x.attributes.qualifiedName))
                .map((x) => x.guid)
            handleVPNode(vpNode, nodeIdsToAdd)
        })

        const isDefaultMode = !(
            nodesToAddQn.isAnHiddenSource.length ||
            nodesToAddQn.isAnHiddenTarget.length
        )

        if (!isDefaultMode) {
            const node = graph.value
                .getNodes()
                .find((x) => x.id === portNode.id)
            if (lineageStore.hasColumnList(node.id)) {
                const { assets: columnList, total } =
                    lineageStore.getNodesColumnList(node.id)

                const caretElement = getCaretElement(node.id)
                controlCaret(node.id, caretElement, true)

                controlPorts(node, columnList, [])
                if (columnList.length < total) controlShowMorePorts(node)
                translateSubsequentNodes(node)

                selectPort(node, e, portId)
                const port = node.getPort(portId)
                onSelectAsset(port.entity)
                return
            }
        }

        Object.entries(lineage.guidEntityMap).forEach(([k, v]) => {
            if (k === portId) return
            const qnArr = v.attributes.qualifiedName.split('/')
            qnArr.pop()
            const parentName = qnArr.join('/')
            const graphNodes = graph.value.getNodes()
            const parentNode = graphNodes.find(
                (x) =>
                    x.store.data.entity.attributes.qualifiedName === parentName
            )
            const parentNodeExists = translateCandidates.find(
                (x) => x?.id === parentNode?.id
            )

            if (parentNode && !parentNodeExists) {
                translateCandidates.push(parentNode)
                parentMap.set(parentNode.id, [v])
            } else if (parentNode && parentMap.has(parentNode.id)) {
                parentMap.set(parentNode.id, [
                    ...parentMap.get(parentNode.id),
                    v,
                ])
            }
        })

        toggleNodesEdges(false)

        if (!translateCandidates.length) {
            toggleNodesEdges(true)
            hideLoader()
            message.info(
                'The selected column has no relations for the nodes on the graph'
            )
            return
        }

        translateCandidates.sort(
            (a, b) => Number(a.store.data._order) - Number(b.store.data._order)
        )

        translateCandidates.forEach((x) => {
            const caretElement = getCaretElement(x.id)
            controlCaret(x.id, caretElement, true)
        })

        renderColumnLineage(translateCandidates, lineage.relations, parentMap)
        hideLoader()
        chp.value.expandedNodes = translateCandidates
    }

    // getColumnLineage
    const getColumnLineage = (portId) => {
        if (lineageStore.hasColumnLineage(portId)) {
            const lineage = lineageStore.getColumnsLineage(portId)
            controlTranslate(portId, lineage)
            return
        }
        const portConfig = computed(() => ({
            depth: 20,
            guid: portId,
            direction: 'BOTH',
            attributes: ['dataType', 'qualifiedName', 'certificateStatus'],
            hideProcess: true,
        }))
        const { data, error } = useFetchLineage(portConfig, true)

        watchOnce(error, () => {
            handleError(error.value)
            hideLoader()
        })

        watchOnce(data, () => {
            if (!data.value?.relations.length) {
                toggleNodesEdges(true)
                hideLoader()
                message.info('No lineage data available for selected column')
                return
            }

            lineageStore.setColumnsLineage(portId, data.value)
            controlTranslate(portId, data.value)
        })
    }

    // Set the style of label based on the edge highlight state
    const controlLabelStyle = (edge, reset: boolean) => {
        edge.setLabels(
            edge.getLabels().map((lbl) => ({
                attrs: {
                    label: {
                        fill: reset ? 'none' : '#5277d7',
                        text: lbl.attrs.label.text,
                    },
                    body: {
                        fill: reset ? 'none' : '#fff',
                        stroke: reset ? 'none' : '#5277d7',
                    },
                },
            }))
        )
    }

    // controlEdgeHighlight
    const controlEdgeHighlight = (edge, reset: boolean) => {
        if (!edge) return

        edge.attr('line/stroke', reset ? '#aaaaaa' : '#5277d7')
        edge.attr('line/strokeWidth', reset ? 1.6 : 3)
        edge.attr('line/targetMarker/stroke', reset ? '#aaaaaa' : '#5277d7')

        // Only change arrowhead size if showArrow is false
        if (!preferences.value.showArrow) {
            edge.attr('line/targetMarker/height', reset ? 0.1 : 12)
            edge.attr('line/targetMarker/width', reset ? 0.1 : 12)
        }

        edge.attr('line/strokeDasharray', reset ? 0 : 5)

        controlLabelStyle(edge, reset)
        if (!reset) edge.setZIndex(50)
        else edge.setZIndex(15)
    }

    const controlPortEdgeHighlight = (edge, reset: boolean) => {
        if (!edge) return

        edge.attr('line/strokeWidth', reset ? 1.6 : 3)
        edge.attr('line/targetMarker/stroke', reset ? '#aaaaaa' : '#5277d7')
        edge.attr('line/targetMarker/height', reset ? 0.1 : 12)
        edge.attr('line/targetMarker/width', reset ? 0.1 : 12)
        edge.attr('line/strokeDasharray', reset ? 0 : 5)

        controlLabelStyle(edge, reset)
        if (!reset) edge.setZIndex(50)
        else edge.setZIndex(15)
    }

    const animateEdge = (edge, animate = true) => {
        if (animate)
            edge.attr('line/style/animation', 'ant-line 30s infinite linear')
        else edge.attr('line/style/animation', 'unset')
    }

    /** Reset the current highlighted port styling */
    const resetCHE = () => {
        if (che.value) {
            const edge = graph.value.getCellById(che.value)
            if (edge) {
                if (edge?.id.includes('port'))
                    controlPortEdgeHighlight(edge, true)
                else controlEdgeHighlight(edge, true)

                animateEdge(edge, false)
            }
            che.value = ''
        }
    }

    // getEventPath
    const getEventPath = (e) => {
        const path = (e.composedPath && e.composedPath()) || e.path
        const target = e?.target

        if (path != null)
            return path.indexOf(window) < 0 ? path.concat(window) : path
        if (target === window) return [window]

        function getParents(node, memo = []) {
            const parentNode = node?.parentNode
            if (!parentNode) return memo
            return getParents(parentNode, memo.concat(parentNode))
        }

        return [target].concat(getParents(target), window)
    }

    // handleToggleOfActiveNode
    const handleToggleOfActiveNode = (node) => {
        const ports = node.getPorts()
        ports.shift()
        activeNodesToggled.value[node.id] = { ports, newEdgesId: [], edges: [] }

        const graphEdges = graph.value.getEdges()
        const newEdgesIdSet = new Set()

        ports.forEach((port) => {
            const edges = graphEdges.filter((edge) => edge.id.includes(port.id))

            edges.forEach((edge) => {
                const [_, processId, sourceTarget] = edge.id.split('/')
                const [source, target] = sourceTarget.split('@')
                const invisiblePort = `${node.id}-invisiblePort`
                let newSource = source
                let newTarget = target
                if (source === port.id) newSource = invisiblePort
                if (target === port.id) newTarget = invisiblePort
                const newEdgeId = `port/${processId}/${newSource}@${newTarget}`

                newEdgesIdSet.add(newEdgeId)

                const newRelation = {
                    fromEntityId: newSource,
                    toEntityId: newTarget,
                    processId,
                }
                createPortRelations([newRelation])
            })
            activeNodesToggled.value[node.id].edges.push(...edges)
        })

        activeNodesToggled.value[node.id].newEdgesId = Array.from(newEdgesIdSet)
    }

    // getNodeLineage
    const getNodeLineage = (guid) => {
        const cell = graph.value.getCellById(guid)
        const isLeafNode = graph.value.isLeafNode(cell)
        const nodeConfig = computed(() => ({
            depth: 1,
            guid,
            direction: isLeafNode ? 'OUTPUT' : 'INPUT',
            hideProcess: true,
            entityFilters: {
                attributeName: '__state',
                operator: 'eq',
                attributeValue: 'ACTIVE',
            },
            attributes: LineageAttributes,
        }))

        const { data, error } = useFetchLineage(nodeConfig, true)

        watchOnce(error, () => {
            handleError(error.value)
            hideLoader()
        })

        watchOnce(data, async () => {
            await addSubGraph(data.value, registerAllListeners)
            const ucell = graph.value.getCellById(guid)
            graph.value.scrollToCell(ucell, { animation: { duration: 600 } })
            hideLoader()
        })
    }

    // resetState
    const resetState = () => {
        highlightNode(null)
        resetCHE()
        nodesEdgesHighlighted.value = []
        nodesTranslated.value = []
        nodesCaretClicked.value = []
        deselectPort()
    }

    const loadCTAHandler = (e) => {
        e.stopPropagation()

        resetState()

        showLoader(e)

        const ele = getEventPath(e).find((x) => x.getAttribute('data-cell-id'))
        const nodeId = ele.getAttribute('data-cell-id')

        getNodeLineage(nodeId)
    }

    // registerLoadCTAListeners
    const registerLoadCTAListeners = (remove) => {
        const loadCTAs = document.getElementsByClassName('node-loadCTA')
        const loadCTAsArray = Array.from(loadCTAs)
        loadCTAsArray.forEach((x) => {
            if (remove) x.removeEventListener('mousedown', loadCTAHandler)
            else x.addEventListener('mousedown', loadCTAHandler)
        })
    }

    const caretHandler = (e) => {
        e.stopPropagation()
        showLoader(e)

        const x = e.target
        const ele = getEventPath(e).find((x) => x.getAttribute('data-cell-id'))
        const nodeId = ele.getAttribute('data-cell-id')
        const graphNodes = graph.value.getNodes()
        const node = graphNodes.find((x) => x.id === nodeId)
        controlCaret(nodeId, x)

        if (!isExpandedNode(nodeId)) {
            getPortsForNode(node)
        }

        if (isExpandedNode(nodeId)) {
            if (!activeNodesToggled.value[node.id]) {
                handleToggleOfActiveNode(node)
                const ports = node.getPorts()
                ports.shift()
                node.removePorts(ports)
            } else {
                const { edges, ports } = activeNodesToggled.value[node.id]
                node.addPorts(ports)
                edges.forEach((edge) => {
                    const [_, processId, sourceTarget] = edge.id.split('/')
                    const [source, target] = sourceTarget.split('@')
                    const relation = {
                        fromEntityId: source,
                        toEntityId: target,
                        processId,
                    }
                    createPortRelations([relation])
                })

                activeNodesToggled.value[node.id].newEdgesId.forEach(
                    (edgeId) => {
                        const cell = graph.value.getCellById(edgeId)
                        if (cell) cell.remove()
                    }
                )
                delete activeNodesToggled.value[node.id]
            }
            translateExpandedNodesToDefault(node)
            hideLoader()
        }
    }
    // registerCaretListeners
    const registerCaretListeners = (remove) => {
        const carets = document.getElementsByClassName('node-caret')
        const caretsArray = Array.from(carets)

        caretsArray.forEach((x) => {
            if (remove) x.removeEventListener('mousedown', caretHandler)
            else x.addEventListener('mousedown', caretHandler)
        })
    }

    // registerAllListeners
    const registerAllListeners = (remove = false) => {
        registerLoadCTAListeners(remove)
        registerCaretListeners(remove)
    }

    registerAllListeners()

    // removeCHPEdges
    const removeCHPEdges = () => {
        const graphEdges = graph.value.getEdges()
        const edges = graphEdges.filter((x) => x.id.includes('port'))
        // graph.value.freeze('removeCHPEdges')
        edges.forEach((edge) => {
            const cell = graph.value.getCellById(edge.id)
            cell.remove()
        })
        // graph.value.unfreeze('removeCHPEdges')
    }

    // selectPort
    const selectPort = (node, e, portId) => {
        showLoader(e)

        resetPortStyle(chp.value.node, chp.value.portId)

        if (chp.value.portId || che.value) removeCHPEdges()
        activeNodesToggled.value = {}

        chp.value.expandedNodes.forEach((x) => {
            if (x.id === node.id) return
            const ports = x.getPorts()
            if (ports.length > 1) {
                ports.shift()
                const portsToRemove = ports.filter((x) => x.id !== portId)
                x.removePorts(portsToRemove)
            }
            translateExpandedNodesToDefault(x)
        })

        chp.value.node = getPortNode(portId)
        chp.value.portId = portId
        chp.value.expandedNodes = []

        const nodePorts = node.getPorts()
        nodePorts.shift()

        // graph.value.freeze('nodePortOp')
        nodePorts.forEach((port) => {
            if (port.id === portId) setPortStyle(node, portId, 'select')
            else resetPortStyle(node, port.id)
        })
        // graph.value.unfreeze('nodePortOp')

        const { relations } = mergedLineageData.value
        const rel = relations.find((x) => x.fromEntityId === portId)
        if (rel) {
            const relation = {
                fromEntityId: portId,
                toEntityId: `${rel.toEntityId}-invisiblePort`,
                processId: rel.processId,
            }
            createPortRelations([relation])
            hideLoader()
        } else getColumnLineage(portId)
    }

    // deselectPort
    const deselectPort = () => {
        resetPortStyle(chp.value.node, chp.value.portId)
        removeCHPEdges()

        activeNodesToggled.value = {}
        nodesCaretClicked.value = []

        // graph.value.freeze('deselectPort')
        chp.value.expandedNodes.forEach((x) => {
            if (x.id === chp.value.node.id) {
                return
            }
            const caretElement = getCaretElement(x.id)
            controlCaret(x.id, caretElement)
            const portsToRemove = x.getPorts()
            if (portsToRemove.length > 1) {
                portsToRemove.shift()
                x.removePorts(portsToRemove)
            }
            translateExpandedNodesToDefault(x)
        })
        // graph.value.unfreeze('deselectPort')

        chp.value.node = null
        chp.value.portId = ''
        chp.value.expandedNodes = []
        toggleNodesEdges(true)
    }

    // handleVPNode
    const handleVPNode = (node, nodeIdsToAdd: string[] = []) => {
        const nodeIdArr = node.id.split('-')
        nodeIdArr.splice(0, 1)
        const id = nodeIdArr.join('-')
        const identifier = node.id.split('-').splice(0, 1)[0]
        const mode = identifier.includes('vpNodeSS')
            ? 'sameSource'
            : 'sameTarget'

        const hidden =
            mode === 'sameSource'
                ? sameSourceCount.value?.[id]?.targetsHidden
                : sameTargetCount.value?.[id]?.sourcesHidden

        let nodesHidden = [...hidden]

        const handleNodeIdsToAdd = (nita) => {
            const nh = nodesHidden.filter((x) => !nita.includes(x.guid))
            const nta = nodesHidden.filter((x) => nita.includes(x.guid))
            nodesHidden = nh
            return nta
        }
        const nodesToAdd = !nodeIdsToAdd.length
            ? nodesHidden.splice(0, 4)
            : handleNodeIdsToAdd(nodeIdsToAdd)

        if (mode === 'sameSource')
            sameSourceCount.value[id].targetsHidden = nodesHidden
        if (mode === 'sameTarget')
            sameTargetCount.value[id].sourcesHidden = nodesHidden

        const { relations, childrenCounts } = mergedLineageData.value

        nodesToAdd.forEach((x) => {
            const { nodeData } = createNodeData(
                x,
                relations,
                childrenCounts,
                true
            )
            nodes.value.push(nodeData)
            if (x.typeName !== 'vpNode') searchItems.value.push(x)
            addNode(relations, childrenCounts, x)
        })

        const nodesToAddIds = nodesToAdd.map((x) => x.guid)

        const edgesToAdd = relations.filter((x) => {
            if (mode === 'sameSource')
                return nodesToAddIds.includes(x.toEntityId)
            return nodesToAddIds.includes(x.fromEntityId)
        })

        edgesToAdd.forEach((x) => {
            const { fromEntityId: from, toEntityId: to, processId } = x
            const relation = {
                id: `${processId}/${from}@${to}`,
                sourceCell: from,
                sourcePort: `${from}-invisiblePort`,
                targetCell: to,
                targetPort: `${to}-invisiblePort`,
            }
            const exists = edges.value.find((x) => x.id === relation.id)

            if (exists) return

            const { edgeData } = createEdgeData(
                relation,
                {},
                { stroke: '#aaaaaa' }
            )
            edges.value.push(edgeData)
            addEdge(relation)
        })

        nodes.value = nodes.value.filter((x) => x.id !== node.id)
        edges.value = edges.value.filter((x) => {
            if (mode === 'sameSource')
                return x.id !== `vpNodeProcessId/${id}@${node.id}`
            return x.id !== `vpNodeProcessId/${node.id}@${id}`
        })

        renderLayout(registerAllListeners)

        if (nodesHidden.length === 0) return

        // add back vp node
        const entity = node?.store?.data?.entity || node.entity
        const { nodeData } = createNodeData(
            entity,
            relations,
            childrenCounts,
            true
        )
        nodeData.data.hiddenCount = nodesHidden.length
        nodes.value.push(nodeData)
        addNode(relations, childrenCounts, nodeData.entity)

        // add back vp edge
        const from = mode === 'sameSource' ? id : node.id
        const processId = 'vpNodeProcessId'
        const to = mode === 'sameSource' ? node.id : id

        const relation = {
            id: `${processId}/${from}@${to}`,
            sourceCell: from,
            sourcePort: `${from}-invisiblePort`,
            targetCell: to,
            targetPort: `${to}-invisiblePort`,
        }

        const { edgeData } = createEdgeData(relation, {}, {})
        edges.value.push(edgeData)
        addEdge(relation)
        renderLayout(registerAllListeners)

        const cell = graph.value.getCellById(node.id)
        const updatedData = {
            hiddenCount: nodesHidden.length,
        }
        cell.updateData({ ...updatedData })
    }

    /** EVENTS */
    // PORT - CLICK
    graph.value.on('port:click', ({ e, node }) => {
        e.stopPropagation()

        if (che.value) resetCHE()
        highlightNode(null)

        const ele = getEventPath(e).find((x) => x.getAttribute('port'))
        const portId = ele.getAttribute('port')

        // If user selects the already selected port
        if (chp.value.portId === portId) {
            onCloseDrawer()
            deselectPort()
        } else {
            selectPort(node, e, portId)
            const port = node.getPort(portId)
            onSelectAsset(port.entity)
        }
    })

    /**
     * Check if an edge is clickable in the current context
     * @param edge - The edge whose interactivity is to be checked
     */
    const isEdgeClickable = (edge) => {
        // No interaction for vertical pagination edges
        if (edge.id.includes('vpNode')) return false

        // No interaction for related edges
        if (edge.id.includes('related')) return false

        // If CHE is a port edge then no interaction for normal edges
        if (che.value.includes('port') && !edge.id.includes('port'))
            return false

        // If a port is selected only let the user select port edges
        if (chp.value.portId && !edge.id.includes('port')) return false

        return true
    }

    /**
     * Check if an edge is hoverable in the current context
     * @param edge - The edge whose interactivity is to be checked
     */
    const isEdgeHoverable = (edge) => {
        // No interaction for vertical pagination edges
        if (edge.id.includes('vpNode')) return false

        // No interaction for related edges
        if (edge.id.includes('related')) return false

        // Port Edges are non hoverable
        if (edge.id.includes('port')) return false

        // No interaction when a port or edge or node is selected
        if (chp.value.portId || che.value || selectedNode.value) return false

        // // If the user hovers on already selected edge, no interaction
        // if (che.value === edge.id) return false

        if (nodesEdgesHighlighted.value.includes(edge.id)) return false

        return true
    }

    // EDGE - CLICK
    graph.value.on('edge:click', ({ e, edge, cell }) => {
        if (!isEdgeClickable(edge)) return

        animateEdge(edge, false)

        // If user clicks on selected edge
        if (che.value === edge.id) {
            if (edge.id.includes('port')) {
                const { node, portId } = chp.value
                if (node && portId) {
                    const port = node.getPort(portId)
                    onSelectAsset(port.entity)
                }
                controlPortEdgeHighlight(edge, true)
            } else {
                onCloseDrawer()
                controlEdgeHighlight(edge, true)
            }

            che.value = ''
            // highlightNode(null)
            return
        }

        // If there is an existing highlighted edge
        if (che.value) {
            resetCHE()
            highlightNode(null)
        }

        che.value = edge.id
        controlEdgeHighlight(edge, false)

        const processId = edge.id.includes('port')
            ? edge.id.split('/')[1]
            : edge.id.split('/')[0]

        onSelectAsset({ guid: processId })

        if (!edge.id.includes('port')) {
            const target = edge.id.split('/')[1].split('@')[1]
            if (selectedNode.value !== target) highlightNode(target, false)
        }
    })

    // EDGE - MOUSEENTER
    graph.value.on('edge:mouseenter', ({ cell, edge }) => {
        if (!isEdgeHoverable(edge)) return

        controlEdgeHighlight(edge, false)
        animateEdge(edge, true)

        nodesEdgesHighlighted.value.forEach((id) => {
            const edgeCell = graph.value.getCellById(id)
            edgeCell.setZIndex(50)
        })
    })

    // EDGE - MOUSELEAVE
    graph.value.on('edge:mouseleave', ({ cell, edge }) => {
        if (!isEdgeHoverable(edge)) return

        controlEdgeHighlight(edge, true)
        animateEdge(edge, false)

        nodesEdgesHighlighted.value.forEach((id) => {
            const edgeCell = graph.value.getCellById(id)
            edgeCell.setZIndex(50)
        })
    })

    // NODE - MOUSEUP
    graph.value.on('node:mouseup', ({ e, node }) => {
        if (chp.value.portId) deselectPort()
        if (che.value) resetCHE()

        if (node.id.includes('vpNode')) {
            handleVPNode(node)
            return
        }

        const { entity } = node.store.data

        if (entity.guid === selectedNode.value) {
            resetSelectedNode()
            return
        }

        onSelectAsset(entity)
        highlightNode(entity?.guid)
    })

    // BLANK - CLICK
    graph.value.on('blank:click', () => {
        resetCHE()

        if (chp.value.portId) {
            const { node, portId } = chp.value
            if (node && portId) {
                const port = node.getPort(portId)
                onSelectAsset(port.entity)
            }
        } else if (selectedNode.value) {
            resetSelectedNode()
        }
    })

    // BLANK - MOUSEWHEEL
    graph.value.on('blank:mousewheel', () => {
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })

    // CELL - MOUSEWHEEL
    graph.value.on('cell:mousewheel', () => {
        currZoom.value = `${(graph.value.zoom() * 100).toFixed(0)}%`
    })

    /** WATCHERS */
    watch(assetGuidToHighlight, (newVal) => {
        if (!newVal) highlightNode(null)
        else highlightNode(newVal)
    })

    // Trigger the callback only when the value is true
    whenever(resetSelections, () => {
        onSelectAsset(baseEntity.value, false, false)
        resetCHE()
        drawerActiveKey.value = 'Overview'
        if (selectedNode.value) highlightNode(null)
        if (chp.value.portId) deselectPort()

        resetSelections.value = false
    })

    watch(
        () => preferences.value.showArrow,
        (val) => {
            const size = val ? 12 : 0.1
            graph.value.getEdges().forEach((edge) => {
                // Should not be port edge or the current selected edge
                if (edge.id !== che.value) {
                    edge.attr('line/targetMarker/height', size)
                    edge.attr('line/targetMarker/width', size)
                }
            })
        }
    )

    return { registerAllListeners }
}