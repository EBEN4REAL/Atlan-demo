export const actions = {
    setCyclicRelation(relStr) {
        if (this.cyclicRelations.includes(relStr)) return
        this.cyclicRelations.push(relStr)
    },
    setPortToSelect(port) {
        this.portToSelect = port
    },
    setMergedLineageData(lineage) {
        this.mergedLineageData = lineage
    },
    setNodesPortsList(nodeId, ports?, offset?, total?) {
        if (nodeId) {
            this.nodesPortsList[nodeId] = { ports, offset, total }
        } else {
            this.nodesPortsList = {}
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
