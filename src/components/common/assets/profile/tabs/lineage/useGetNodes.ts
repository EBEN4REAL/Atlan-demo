export default function useGetNodes(graph, guid) {
    const predecessors = []
    const successors = []
    const getCell = (id) => graph.value.getCellById(id)
    const baseCell = getCell(guid)

    graph.value.getNodes().forEach((x) => {
        const cell = getCell(x.id)
        if (cell && baseCell) {
            const isPredecessor = graph.value.isPredecessor(baseCell, cell)
            const isSuccessor = graph.value.isSuccessor(baseCell, cell)
            if (isPredecessor) predecessors.push(x.id)
            if (isSuccessor) successors.push(x.id)
        }
    })

    return {
        predecessors,
        successors,
    }
}
