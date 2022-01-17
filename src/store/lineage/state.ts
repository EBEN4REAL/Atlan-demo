import { useStorage } from '@vueuse/core'

export const state = {
    nodesColumnList: useStorage('lin_nodes_column_list', {}),
    columnsLineage: useStorage('lin_columns_lineage', {}),
}
