export const getters = {
    getSelectedNodeId(state) {
        return () => state.selectedNodeId
    },
    getPreferences(state) {
        return () => state.preferences
    },
    getCyclicRelations(state) {
        return () => state.cyclicRelations
    },
    getPortToSelect(state) {
        return () => state.portToSelect
    },
    getMergedLineageData(state) {
        return () => state.mergedLineageData
    },
    getNodesPortList(state) {
        return (nodeId) => {
            if (nodeId) return state.nodesPortsList[nodeId]
            return state.nodesPortsList
        }
    },
    getPortsLineage(state) {
        return (portId) => {
            if (portId) return state.portLineage[portId]
            return state.portLineage
        }
    },
    hasPortsList(state) {
        return (nodeId) => {
            if (!nodeId) return false
            const ports = state.nodesPortsList?.[nodeId]?.ports
            return !!ports
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
