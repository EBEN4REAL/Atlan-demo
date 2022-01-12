export const getters = {
    getNodesColumnList(state) {
        return (nodeId) => {
            if (nodeId) return state.nodesColumnList[nodeId]
            return state.nodesColumnList
        }
    },
    getNodesPortList(state) {
        return (nodeId) => {
            if (nodeId) return state.nodesPortList[nodeId]
            return state.nodesPortList
        }
    },
    getColumnsLineage(state) {
        return (nodeId) => {
            if (nodeId) return state.columnsLineage[nodeId]
            return state.columnsLineage
        }
    },
    hasColumnList(state) {
        return (nodeId) => {
            if (!nodeId) return false
            const columns = state.nodesColumnList?.[nodeId]
            return !!columns
        }
    },
    hasPortList(state) {
        return (nodeId) => {
            if (!nodeId) return false
            const ports = state.nodesPortList?.[nodeId]
            return !!ports
        }
    },
    hasColumnLineage(state) {
        return (nodeId) => {
            if (!nodeId) return false
            const lineage = state.columnsLineage?.[nodeId]
            return !!lineage
        }
    },
}
