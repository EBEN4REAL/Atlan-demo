export const actions = {
    setNodesColumnList(nodeId, columns) {
        this.nodesColumnList[nodeId] = columns
    },
    setNodesPortList(nodeId, ports) {
        this.nodesPortList[nodeId] = ports
    },
    setColumnsLineage(nodeId, lineage) {
        this.columnsLineage[nodeId] = lineage
    },
}
