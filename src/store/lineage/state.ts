import { useStorage } from '@vueuse/core'

export const state = {
    nodesColumnList: useStorage('lin_nodes_column_list', {}), // => {assets: assets[], total: number}[]
    columnsLineage: useStorage('lin_columns_lineage', {}),
}
