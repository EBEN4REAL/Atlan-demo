import { useStorage } from '@vueuse/core'

export const state = {
    nodesColumnList: useStorage('lin_nodes_column_list', {}),
    portLineage: useStorage('lin_port_lineage', {}),
}
