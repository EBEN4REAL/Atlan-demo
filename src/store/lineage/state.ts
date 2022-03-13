import { useStorage } from '@vueuse/core'

export const state = {
    mergedLineageData: useStorage('lin_merged_lineage_data', {}),
    nodesColumnList: useStorage('lin_nodes_column_list', {}),
    portLineage: useStorage('lin_port_lineage', {}),
}
