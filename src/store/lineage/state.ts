import { useStorage } from '@vueuse/core'

export const state = {
    selectedNodeId: '',
    selectedPortId: '',
    preferences: useStorage('lin_preferences', {
        showArrow: true,
        showSchema: true,
        showDatabase: true,
        showAnnouncement: true,
        showLegend: false,
    }),
    cyclicRelations: [],
    portToSelect: {},
    mergedLineageData: {},
    nodesPortsList: {},
    portLineage: {},
}

// export const state = {
//     selectedNodeId: useStorage('lin_selected_node_id', ''), //
//     selectedPortId: useStorage('lin_selected_port_id', ''), //
//     preferences: useStorage('lin_preferences', {
//         showArrow: true,
//         showSchema: true,
//         showDatabase: true,
//         showAnnouncement: true,
//         showLegend: false,
//     }),
//     cyclicRelations: useStorage('lin_cyclic_relations', []), //
//     portToSelect: useStorage('lin_port_qn_to_select', {}), //
//     mergedLineageData: useStorage('lin_merged_lineage_data', {}), //
//     nodesPortsList: useStorage('lin_nodes_ports_list', {}), //
//     portLineage: useStorage('lin_port_lineage', {}), //
// }
