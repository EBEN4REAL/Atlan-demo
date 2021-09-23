import { ref } from 'vue'
import {
    updateEdgesStroke,
    updateNodesToHighlight,
    isProcessNode,
} from './util.js'

const edgesToHighlightSet = new Set()
const nodesToHighlightSet = new Set()
const options = { distance: 1 }

const getPredecessors = (graph, guid, showProcess) => {
    const getCell = (guid) => graph.value.getCellById(guid)

    // 2D Matrix of predecessors from every iteration [[guid],[guid, guid, ...]]
    const result = [[guid]]
    let index = 0
    const currIterationSet = new Set() // a Set containing predecessors of the current iteration (guid)

    while (result[index].length > 0) {
        const currIteration = result[index]
        currIterationSet.clear()

        currIteration.forEach((guid) => {
            // Find predecessors for each guid in the current iteration
            graph.value
                .getPredecessors(getCell(guid), options)
                .map((x) => x.id)
                .forEach((pred) => {
                    if (!showProcess && isProcessNode(graph, pred)) {
                        // If hide process node
                        graph.value
                            .getPredecessors(getCell(pred), options)
                            .map((x) => x.id)
                            .forEach((pPred) => {
                                edgesToHighlightSet.add(`${pPred}@${guid}`)
                                nodesToHighlightSet.add(pPred)
                                nodesToHighlightSet.add(guid)
                                currIterationSet.add(pPred)
                            })
                    } else {
                        // If show process node
                        edgesToHighlightSet.add(`${pred}@${guid}`)
                        nodesToHighlightSet.add(pred)
                        nodesToHighlightSet.add(guid)
                        currIterationSet.add(pred)
                    }
                })
        })

        if (!currIterationSet.size) break
        result.push(Array.from(currIterationSet))
        index += 1
    }
}

const getSuccessors = (graph, guid, showProcess) => {
    const getCell = (guid) => graph.value.getCellById(guid)

    // 2D Matrix of predecessors from every iteration [[guid],[guid, guid, ...]]
    const result = [[guid]]
    let index = 0
    const currIterationSet = new Set() // a Set containing predecessors of the current iteration (guid)

    while (result[index].length > 0) {
        const currIteration = result[index]
        currIterationSet.clear()

        currIteration.forEach((guid) => {
            // Find predecessors for each guid in the current iteration
            graph.value
                .getSuccessors(getCell(guid), options)
                .map((x) => x.id)
                .forEach((succ) => {
                    if (!showProcess && isProcessNode(graph, succ)) {
                        // If hide process node
                        graph.value
                            .getSuccessors(getCell(succ), options)
                            .map((x) => x.id)
                            .forEach((pSucc) => {
                                edgesToHighlightSet.add(`${guid}@${pSucc}`)
                                nodesToHighlightSet.add(guid)
                                nodesToHighlightSet.add(pSucc)
                                currIterationSet.add(pSucc)
                            })
                    } else {
                        // If show process node
                        edgesToHighlightSet.add(`${guid}@${succ}`)
                        nodesToHighlightSet.add(guid)
                        nodesToHighlightSet.add(succ)
                        currIterationSet.add(succ)
                    }
                })
        })

        if (!currIterationSet.size) break
        result.push(Array.from(currIterationSet))
        index += 1
    }
}

export default function useHighlight(
    graph,
    model,
    edges,
    nodes,
    baseEntityGuid,
    showProcess,
    highlightLoadingCords
) {
    const highlightedNode = ref(null)

    graph.value.on('cell:mouseup', ({ node }) => {
        highlight(node.id)
    })
    graph.value.on('blank:click', () => {
        highlight(null)
    })

    const getEdgesToHighlight = async (guid) => {
        await getPredecessors(graph, guid, showProcess)
        await getSuccessors(graph, guid, showProcess)
    }

    const highlight = async (guid) => {
        if (!guid || guid === highlightedNode.value) {
            highlightedNode.value = null
            edgesToHighlightSet.clear()
            nodesToHighlightSet.clear()
            // const nodesToHighlight = Array.from(nodesToHighlightSet)
            // updateNodesToHighlight(
            //     graph,
            //     model,
            //     nodes,
            //     highlightedNode,
            //     nodesToHighlight,
            //     true
            // )
            const edgesToHighlight = edges.value
            updateEdgesStroke(
                graph,
                model,
                edges,
                edgesToHighlight,
                baseEntityGuid,
                true
            )
        } else {
            highlightedNode.value = guid
            edgesToHighlightSet.clear()
            nodesToHighlightSet.clear()
            await getEdgesToHighlight(guid)
            // const nodesToHighlight = Array.from(nodesToHighlightSet)
            // updateNodesToHighlight(
            //     graph,
            //     model,
            //     nodes,
            //     highlightedNode,
            //     nodesToHighlight,
            //     false
            // )
            const edgesToHighlight = Array.from(edgesToHighlightSet)
            updateEdgesStroke(
                graph,
                model,
                edges,
                edgesToHighlight,
                baseEntityGuid,
                false
            )
        }

        highlightLoadingCords.value = {}
    }
}
