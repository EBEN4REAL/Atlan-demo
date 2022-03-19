import { useStorage } from '@vueuse/core'

export const state = {
    columnToSelect: useStorage('lin_column_qn_to_select', {}),
    mergedLineageData: useStorage('lin_merged_lineage_data', {}),
    nodesColumnList: useStorage('lin_nodes_column_list', {}),
    portLineage: useStorage('lin_port_lineage', {}),
}
