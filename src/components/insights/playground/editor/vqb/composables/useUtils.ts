import { Ref, ComputedRef } from 'vue'
import { SubpanelSort } from '~/types/insights/VQBPanelSort.interface'
import { SubpanelAggregator } from '~/types/insights/VQBPanelAggregators.interface'
import { SubpanelJoin } from '~/types/insights/VQBPanelJoins.interface'
import { SubpanelGroupColumn } from '~/types/insights/VQBPanelGroups.interface'
import { SubpanelFilter } from '~/types/insights/VQBPanelFilter.interface'
import { getValueStringFromType } from './generateSQLQuery'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { aggregatedAliasMap } from '../constants/aggregation'
import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'
import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
import { VQBPanelType } from '~/types/insights/VQB.interface'

export function useUtils() {
    function getTableNameFromTableQualifiedName(tableQualifiedName: string) {
        const vals = tableQualifiedName?.split('/')
        if (vals?.length > 0) return vals[vals?.length - 1]
        else return ''
    }
    function getTableName(columnQualifiedName: string) {
        const spiltArray = columnQualifiedName.split('/')
        if (spiltArray.length > 5) {
            return `"${spiltArray[5]}"`
        }
    }
    function getTableNamesStringFromQualfieidNames(
        tableQualfieidNames: string[]
    ) {
        let res = ''
        if (tableQualfieidNames?.length > 1) res += 'Table(s): '
        if (tableQualfieidNames?.length === 1) res += 'Table: '
        else if (tableQualfieidNames?.length === 0) res += 'Table: '
        else res += 'No Table'
        res += tableQualfieidNames
            .map((e) => getTableNameFromTableQualifiedName(e))
            .join(',')
        return res
    }
    function getTableQualifiedNameFromColumnQualifiedName(
        qualifiedName: string | undefined
    ) {
        if (qualifiedName) {
            const t = qualifiedName.split('/')
            t.pop()
            return t.join('/')
        }
        return ''
    }
    function getSummarisedInfoOfSortPanel(
        subpanels: SubpanelSort[],
        panel: VQBPanelType
    ) {
        if (subpanels.length == 0) return 'No Columns Added for Sort'

        let res = 'by '
        subpanels.forEach((subpanel, i) => {
            if (panel?.active === false) {
                if (i !== subpanels.length - 1 && subpanel?.column?.label)
                    res += `${
                        subpanel?.column?.label
                    } in ${subpanel.order?.toUpperCase()}, `
                else if (i <= subpanels.length - 1 && subpanel?.column?.label)
                    res += `${
                        subpanel?.column?.label
                    } in ${subpanel.order?.toUpperCase()}`
            } else {
                if (
                    i !== subpanels.length - 1 &&
                    subpanel.aggregateORGroupColumn?.label
                )
                    res += `${
                        subpanel.aggregateORGroupColumn?.label
                    } in ${subpanel.order?.toUpperCase()}, `
                else if (
                    i <= subpanels.length - 1 &&
                    subpanel.aggregateORGroupColumn?.label
                )
                    res += `${
                        subpanel.aggregateORGroupColumn?.label
                    } in ${subpanel.order?.toUpperCase()}`
            }
        })
        if (res === 'by ') res = 'No Columns Added for Sort'
        return res
    }
    function getSummarisedInfoOfGroupPanel(subpanels: SubpanelGroupColumn[]) {
        if (subpanels.length == 0) return 'No Columns Added for Group'
        let res = 'by '
        if (subpanels.length > 0 && subpanels[0].columns?.length == 0)
            res = 'No Columns Added for Group'
        subpanels.forEach((subpanel, i) => {
            res += subpanel.columnsData?.map((e) => e.label).join(', ')
        })
        return res
    }
    function getSummarisedInfoOfAggregationPanel(
        subpanels: SubpanelAggregator[]
    ) {
        if (subpanels.length == 0) return 'No Columns Added for Aggregation'
        let res = 'by '
        subpanels.forEach((subpanel, i) => {
            if (i !== subpanels.length - 1 && subpanel.column.label)
                res += `${subpanel.aggregators
                    ?.map((e) => e?.toUpperCase())
                    ?.join(', ')} of ${subpanel.column.label} and `
            else if (i <= subpanels.length - 1 && subpanel.column.label)
                res += `${subpanel.aggregators
                    ?.map((e) => e?.toUpperCase())
                    ?.join(', ')} of ${subpanel.column.label}`
            if (res === 'by ') res = 'No Columns Added for Aggregation'
        })
        return res
    }
    function getSummarisedInfoOfFilterPanel(
        subpanels: SubpanelFilter[],
        activeInlineTab: activeInlineTabInterface
    ) {
        if (subpanels.length == 0) return 'No Columns Added for filter'
        let res = ' '
        subpanels.forEach((subpanel, i) => {
            if (subpanel.column.label) res += `${subpanel.column.label} `
            if (subpanel.filter.title) res += `${subpanel.filter.title}`

            switch (subpanel?.filter?.type) {
                case 'range_input': {
                    if (subpanel?.filter?.name === 'between') {
                        if (subpanel?.filter?.value?.length > 0) {
                            let firstVal = getValueStringFromType(
                                subpanel,
                                subpanel?.filter?.value[0] ?? ''
                            )
                            let secondVal = getValueStringFromType(
                                subpanel,
                                subpanel?.filter?.value[1] ?? ''
                            )
                            res += ` ${firstVal} AND ${secondVal}`
                        }
                    }
                    break
                }
                case 'input': {
                    res += ` ${getValueStringFromType(
                        subpanel,
                        subpanel?.filter?.value ?? ''
                    )}`

                    break
                }
                case 'multi_input': {
                    res += ` ( `
                    subpanel?.filter?.value?.forEach((el, i) => {
                        if (i !== subpanel?.filter?.value?.length - 1)
                            res += `'${el}',`
                        else res += `'${el}'`
                    })
                    res += ` )`
                    break
                }
                case 'none': {
                    break
                }
            }
            if (subpanels?.length > 1 && i !== subpanels.length - 1) res += ', '

            if (res === ' ' || res === ' , ')
                res = 'No Columns Added for filter'
        })
        return res
    }

    function getSummarisedInfoOfJoinPanel(subpanels: SubpanelJoin[]) {
        if (subpanels.length == 0) return 'No Table Added for Join'
        let res = 'by '
        subpanels.forEach((subpanel, i) => {
            if (i == 0) {
                if (subpanel.columnsDataLeft.columnQualifiedName) {
                    res += `${getTableName(
                        subpanel.columnsDataLeft.columnQualifiedName
                    )} and `
                }
            }
            if (i < subpanels.length - 1) {
                if (subpanel.columnsDataRight.columnQualifiedName) {
                    res += `${getTableName(
                        subpanel.columnsDataRight.columnQualifiedName
                    )} using ${subpanel.joinType.name}, and `
                }
            }
            if (i == subpanels.length - 1) {
                if (subpanel.columnsDataRight.columnQualifiedName) {
                    res += `${getTableName(
                        subpanel.columnsDataRight.columnQualifiedName
                    )} using ${subpanel.joinType.name}`
                }
            }

            if (res === 'by ') res = 'No Columns Added for Aggregation'
        })
        return res
    }

    function getDistinctTableQualifiedNamesFromJoinPanel(
        subpanels: SubpanelJoin[]
    ) {
        const distinctTableQualifiedNames = new Set()
        subpanels.forEach((subpanel) => {
            const q1 = getTableQualifiedNameFromColumnQualifiedName(
                subpanel.columnsDataLeft.columnQualifiedName
            )
            const q2 = getTableQualifiedNameFromColumnQualifiedName(
                subpanel.columnsDataRight.columnQualifiedName
            )
            distinctTableQualifiedNames.add(q1)
            distinctTableQualifiedNames.add(q2)
        })
        return Array.from(distinctTableQualifiedNames)
    }
    function isSubpanelClosable(subpanels: object[]) {
        if (subpanels.length === 1) return false
        if (subpanels.length > 1) return true
    }

    function collapseAllPanelsExceptCurrent(
        currentPanel: any,
        activeInlineTab: Ref<activeInlineTabInterface>
    ) {
        const copyPanels = JSON.parse(
            JSON.stringify(activeInlineTab.value.playground.vqb.panels)
        )
        copyPanels.forEach((panel) => {
            panel.expand = false
        })
        activeInlineTab.value.playground.vqb.panels = copyPanels
    }

    function isAggregationORGroupPanelColumnsAdded(
        activeInlineTab: activeInlineTabInterface
    ) {
        const groupPanel = activeInlineTab.playground.vqb.panels.find(
            (panel) => panel.id.toLowerCase() === 'group'
        )
        const aggregatePanel = activeInlineTab.playground.vqb.panels.find(
            (panel) => panel.id.toLowerCase() === 'aggregate'
        )
        if (!groupPanel?.hide && !aggregatePanel?.hide) {
            return false
        }

        if (groupPanel?.subpanels[0]?.columnsData?.length > 0) return true
        if (aggregatePanel?.subpanels[0]?.aggregators?.length > 0) return true
        return false
    }
    function getAggregationORGroupPanelColumns(
        activeInlineTab: activeInlineTabInterface
    ) {
        const groupPanel = activeInlineTab.playground.vqb.panels.find(
            (panel) => panel.id.toLowerCase() === 'group'
        )
        const aggregatePanel = activeInlineTab.playground.vqb.panels.find(
            (panel) => panel.id.toLowerCase() === 'aggregate'
        )
        let mappedGroupSubpanels: any[] = []
        let mappedAggregateSubpanels: any[] = []

        if (groupPanel?.hide) {
            mappedGroupSubpanels = groupPanel?.subpanels[0]?.columnsData?.map(
                (columnData) => {
                    return {
                        ...columnData,
                        addedBy: 'group',
                    }
                }
            )
        }
        if (aggregatePanel?.hide) {
            mappedAggregateSubpanels = aggregatePanel?.subpanels?.map(
                (subpanel) => {
                    return {
                        ...subpanel,
                        addedBy: 'aggregate',
                    }
                }
            )
        }

        return {
            mappedGroupSubpanels: mappedGroupSubpanels ?? [],
            mappedAggregateSubpanels: mappedAggregateSubpanels ?? [],
            totalCount:
                mappedGroupSubpanels?.length + mappedAggregateSubpanels?.length,
        }
    }

    function getInitialPanelExpandedState(
        readOnly: boolean,
        panel: Object,
        localExpandedState: boolean,
        isCustomVariable?: boolean
    ) {
        if (localExpandedState) return true
        if (readOnly) {
            if (
                panel?.id?.toLocaleLowerCase() === 'filter' &&
                isCustomVariable &&
                panel?.mounted
            )
                return true
        } else {
            if (
                panel?.id?.toLocaleLowerCase() === 'filter' &&
                isCustomVariable &&
                panel?.mounted
            )
                return true
        }

        return false
    }
    const openAssetInSidebar = (
        event,
        t,
        activeInlineTab: ComputedRef<activeInlineTabInterface>,
        inlineTabs: Ref<activeInlineTabInterface[]>
    ) => {
        const { isSameNodeOpenedInSidebar } = useSchema()
        const { openAssetSidebar, closeAssetSidebar } = useAssetSidebar(
            inlineTabs,
            activeInlineTab
        )
        if (
            activeInlineTab?.value &&
            Object.keys(activeInlineTab?.value).length
        ) {
            if (isSameNodeOpenedInSidebar(t, activeInlineTab)) {
                /* Close it if it is already opened */
                closeAssetSidebar(activeInlineTab.value)
            } else {
                let activeInlineTabCopy: activeInlineTabInterface =
                    Object.assign({}, activeInlineTab.value)
                activeInlineTabCopy.assetSidebar.assetInfo = t
                activeInlineTabCopy.assetSidebar.isVisible = true
                openAssetSidebar(activeInlineTabCopy, 'not_editor')
            }
        }
        event.stopPropagation()
        event.preventDefault()
        return false
    }

    return {
        getTableName,
        getTableQualifiedNameFromColumnQualifiedName,
        getDistinctTableQualifiedNamesFromJoinPanel,
        getSummarisedInfoOfJoinPanel,
        getSummarisedInfoOfFilterPanel,
        getSummarisedInfoOfGroupPanel,
        getSummarisedInfoOfAggregationPanel,
        getSummarisedInfoOfSortPanel,
        getTableNameFromTableQualifiedName,
        getTableNamesStringFromQualfieidNames,
        isSubpanelClosable,
        collapseAllPanelsExceptCurrent,
        isAggregationORGroupPanelColumnsAdded,
        getAggregationORGroupPanelColumns,
        getInitialPanelExpandedState,
        openAssetInSidebar,
    }
}
