export const actions = {
    setNodesColumnList(nodeId, columns, offset, total) {
        this.nodesColumnList[nodeId] = { columns, offset, total }
    },
    setPortLineage(portId, lineage) {
        this.portLineage[portId] = lineage
    },
}
