export const getters = {
    getColumnToSelect(state) {
        return () => state.columnToSelect
    },
    getMergedLineageData(state) {
        return () => state.mergedLineageData
    },
    getNodesColumnList(state) {
        return (nodeId) => {
            if (nodeId) return state.nodesColumnList[nodeId]
            return state.nodesColumnList
        }
    },
    getPortsLineage(state) {
        return (portId) => {
            if (portId) return state.portLineage[portId]
            return state.portLineage
        }
    },
    hasColumnList(state) {
        return (nodeId) => {
            if (!nodeId) return false
            const columns = state.nodesColumnList?.[nodeId]?.columns
            return !!columns
        }
    },
    hasPortLineage(state) {
        return (portId) => {
            if (!portId) return false
            const lineage = state.portLineage?.[portId]
            return !!lineage
        }
    },
}
