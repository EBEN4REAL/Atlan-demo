export const actions = {
    setNodesColumnList(nodeId, columns) {
        this.nodesColumnList[nodeId] = columns
    },
    setColumnsLineage(nodeId, lineage) {
        this.columnsLineage[nodeId] = lineage
    },
}
