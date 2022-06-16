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
