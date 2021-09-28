const isProcessNode = (graph, guid) => {
    const nodes = graph.getNodes()
    const entity = nodes.find((x) => x.id === guid)
    return entity.typeName === 'AtlanProcess'
}

export default function useGetNodes() {
    const edgesToHighlightSet = new Set()
    const nodesToHighlightSet = new Set()
    const options = { distance: 1 }

    const getPredecessors = (graph, guid, showProcess, merge = true) => {
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

        result.shift()

        let returnedResult
        if (merge) returnedResult = [...result.flat()]

        return returnedResult
    }

    const getSuccessors = (graph, guid, showProcess, merge = true) => {
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

        result.shift()

        let returnedResult
        if (merge) returnedResult = [...result.flat()]

        return returnedResult
    }

    return {
        getPredecessors,
        getSuccessors,
        edgesToHighlightSet,
        nodesToHighlightSet,
    }
}
