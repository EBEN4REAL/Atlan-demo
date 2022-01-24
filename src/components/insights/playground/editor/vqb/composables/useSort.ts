import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
import { Ref } from 'vue'

export function useSort() {
    function syncSortAggregateAndGroupPanel(
        activeInlineTab: Ref<activeInlineTabInterface>
    ) {
        let sortPanelIndex: number = 0
        const sortPanel = activeInlineTab.value.playground.vqb.panels.find(
            (panel, index) => {
                if (panel?.id?.toLowerCase() === 'sort') {
                    sortPanelIndex = index
                    return panel
                }
            }
        )
        if (!sortPanel) return
        const { isAggregationORGroupPanelColumnsAdded } = useUtils()
        const res = isAggregationORGroupPanelColumnsAdded(activeInlineTab.value)

        if (res) {
            if (
                !activeInlineTab.value.playground.vqb.panels[sortPanelIndex]
                    ?.active
            ) {
                if (
                    activeInlineTab.value.playground.vqb.panels[sortPanelIndex]
                        ?.subpanels
                ) {
                    let copySubPanels = JSON.parse(
                        JSON.stringify(
                            activeInlineTab.value.playground.vqb.panels[
                                sortPanelIndex
                            ]?.subpanels
                        )
                    )
                    copySubPanels = copySubPanels.map((subpanel) => {
                        return {
                            ...subpanel,
                            attributes: {},
                            column: {},
                            isForeign: undefined,
                            isPartition: undefined,
                            isPrimary: undefined,
                            item: undefined,
                            label: undefined,
                            order: 'asc',
                            qualifiedName: undefined,
                            type: undefined,
                        }
                    })
                    activeInlineTab.value.playground.vqb.panels[
                        sortPanelIndex
                    ] = {
                        ...sortPanel,
                        subpanels: copySubPanels,
                        active: true,
                    }
                }
            }
        } else {
            if (
                activeInlineTab.value.playground.vqb.panels[sortPanelIndex]
                    ?.active
            ) {
                let copySubPanels = JSON.parse(
                    JSON.stringify(
                        activeInlineTab.value.playground.vqb.panels[
                            sortPanelIndex
                        ]?.subpanels
                    )
                )
                copySubPanels = copySubPanels.map((subpanel) => {
                    return {
                        ...subpanel,
                        aggregateORGroupColumn: {
                            qualifiedName: undefined,
                            tableName: undefined,
                            type: undefined,
                            value: undefined,
                            label: undefined,
                        },
                    }
                })

                activeInlineTab.value.playground.vqb.panels[sortPanelIndex] = {
                    ...sortPanel,
                    subpanels: copySubPanels,
                    active: false,
                }
            }
        }
    }
    return {
        syncSortAggregateAndGroupPanel,
    }
}
