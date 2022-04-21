import { useStorage } from '@vueuse/core'

export const state = {
    cyclicRelations: useStorage('lin_cyclic_relations', []),
    portToSelect: useStorage('lin_port_qn_to_select', {}),
    mergedLineageData: useStorage('lin_merged_lineage_data', {}),
    nodesPortsList: useStorage('lin_nodes_ports_list', {}),
    portLineage: useStorage('lin_port_lineage', {}),
}
