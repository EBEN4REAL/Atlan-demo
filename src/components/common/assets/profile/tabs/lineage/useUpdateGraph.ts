import useGraph from './useGraph'

const { addNode, removeNode, addEdge, removeEdge } = useGraph()

/* eslint-disable no-nested-ternary */
export default function useUpdateGraph() {
    const highlightNodes = (graph, highlightedNode, nodesToHighlight) => {
        const graphNodes = graph.value.getNodes()

        graphNodes.forEach((x) => {
            const itExists = nodesToHighlight.includes(x.id)
            const isHN = highlightedNode.value === x.id
            x.updateData({
                isHighlightedNode: itExists ? (isHN ? x.id : null) : null,
                isHighlightedNodePath: itExists ? x.id : null,
                isGrayed: !highlightedNode.value ? false : !itExists,
            })
        })
    }

    const highlightEdges = (graph, nodesToHighlight) => {
        const graphEdges = graph.value.getEdges()
        const gray = nodesToHighlight.length ? '#d9d9d9' : '#c7c7c7'
        graphEdges.forEach((x) => {
            const cell = graph.value.getCellById(x.id)
            const [source, target] = x.id.split('@')
            const itExists =
                nodesToHighlight.includes(source) &&
                nodesToHighlight.includes(target)
            x.attr('line/stroke', itExists ? '#5277d7' : gray)
            x.attr('line/targetMarker/stroke', itExists ? '#5277d7' : gray)
            if (itExists) cell.toFront()
        })
    }

    const updateProcessNodesPosition = async (graph, num) => {
        await graph.value.model.nodes
        const graphNodes = graph.value.getNodes()
        graphNodes.forEach((z) => {
            if (z.store.data?.isProcess) {
                const p = z.position()
                z.position(p.x + num, p.y)
            }
        })
    }

    const toggleProcessNodes = async (graph, showProcess, removedNodes) => {
        if (showProcess.value) {
            if (!removedNodes.value?.isProcess?.length) return
            await Promise.all(
                removedNodes.value.isProcess.map(async (x) => {
                    const { entity, data } = x.data
                    await addNode(graph, entity, data)

                    const { edges } = x
                    edges.forEach((y) => {
                        const [newSource, newTarget] = y.split('@')
                        const relation = {
                            fromEntityId: newSource,
                            toEntityId: newTarget,
                        }
                        addEdge(graph, relation)
                    })
                })
            )

            removeEdge(graph, 'isComputedEdge')
        }

        if (!showProcess.value) {
            removeNode(graph, 'isProcess', removedNodes)
            if (!Object.keys(removedNodes.value).length) return
            removedNodes.value.isProcess.forEach((x) => {
                const relationsSet = new Set()
                const sources = new Set()
                const targets = new Set()
                x.edges.forEach((y) => {
                    const [source, target] = y.split('@')

                    if (source !== x.data.id) sources.add(source)
                    if (target !== x.data.id) targets.add(target)

                    Array.from(sources).forEach((z) => {
                        Array.from(targets).forEach((a) => {
                            relationsSet.add(`${z}@${a}`)
                        })
                    })

                    const relations = Array.from(relationsSet)

                    relations.forEach((z) => {
                        const [newSource, newTarget] = z.split('@')
                        const relation = {
                            fromEntityId: newSource,
                            toEntityId: newTarget,
                        }
                        addEdge(graph, relation, { isComputedEdge: true })
                    })
                })
            })
        }
    }

    return {
        highlightNodes,
        highlightEdges,
        updateProcessNodesPosition,
        toggleProcessNodes,
    }
}
