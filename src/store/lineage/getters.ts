export const getters = {
    getNodesColumnList(state) {
        return (nodeId) => {
            if (nodeId) return state.nodesColumnList[nodeId]
            return state.nodesColumnList
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
    hasColumnLineage(state) {
        return (nodeId) => {
            if (!nodeId) return false
            const lineage = state.columnsLineage?.[nodeId]
            return !!lineage
        }
    },
}
