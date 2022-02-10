export const actions = {
    setNodesColumnList(nodeId, columns, total) {
        this.nodesColumnList[nodeId] = { assets: columns, total }
    },
    setColumnsLineage(nodeId, lineage) {
        this.columnsLineage[nodeId] = lineage
    },
}
