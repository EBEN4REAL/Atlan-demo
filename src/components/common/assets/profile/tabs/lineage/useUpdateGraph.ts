import useGraph from './useGraph'

const { addNode, removeNode, addEdge, removeEdge, removedNodes } = useGraph()

/* eslint-disable no-nested-ternary */
export default function useUpdateGraph() {
    const highlightNodes = async (graph, highlightedNode, nodesToHighlight) => {
        await graph.value.model.nodes
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

    const highlightEdges = async (graph, edgesToHighlight) => {
        await graph.value.model.edges
        const graphEdges = graph.value.getEdges()
        const gray = edgesToHighlight.length ? '#d9d9d9' : '#c7c7c7'
        graphEdges.forEach((x) => {
            const itExists = edgesToHighlight.includes(x.id)
            x.attr('line/stroke', itExists ? '#5277d7' : gray)
            x.attr('line/targetMarker/stroke', itExists ? '#5277d7' : gray)
            x.setZIndex(itExists ? 30 : 1)
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

    const toggleProcessNodes = async (graph, showProcess) => {
        if (showProcess.value) {
            await Promise.all(
                removedNodes.value.isProcess.map(async (x) => {
                    const { entity } = x.data
                    await addNode(graph, entity)

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
            const { removedNodes: rn } = removeNode(graph, 'isProcess')

            rn.value.isProcess.forEach((x) => {
                const relationsSet = new Set()
                const sources = new Set()
                const targets = new Set()
                x.edges.forEach((y) => {
                    const [source, target] = y.split('@')

                    if (source !== x.data.id) sources.add(source)
                    if (target !== x.data.id) targets.add(target)

                    Array.from(sources).forEach((y) => {
                        Array.from(targets).forEach((z) => {
                            relationsSet.add(`${y}@${z}`)
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
