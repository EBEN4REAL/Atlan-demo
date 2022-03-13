export const actions = {
    setMergedLineageData(lineage) {
        this.mergedLineageData = lineage
    },
    setNodesColumnList(nodeId, columns?, offset?, total?) {
        if (nodeId) {
            this.nodesColumnList[nodeId] = { columns, offset, total }
        } else {
            this.nodesColumnList = {}
        }
    },
    setPortLineage(portId, lineage?) {
        if (portId) {
            this.portLineage[portId] = lineage
        } else {
            this.portLineage = {}
        }
    },
}
