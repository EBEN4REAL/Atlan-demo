import { useStorage } from '@vueuse/core'

export const state = {
    nodesColumnList: useStorage('nodes_column_list', {}),
    nodesPortList: useStorage('nodes_port_list', {}),
    columnsLineage: useStorage('columns_lineage', {}),
}
