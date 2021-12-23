import { SubpanelSort } from '~/types/insights/VQBPanelSort.interface'
import { SubpanelAggregator } from '~/types/insights/VQBPanelAggregators.interface'
import { SubpanelGroupColumn } from '~/types/insights/VQBPanelGroups.interface'
import { SubpanelFilter } from '~/types/insights/VQBPanelFilter.interface'
import { getValueStringFromType } from './generateSQLQuery'

export function useUtils() {
    function getTableNameFromTableQualifiedName(tableQualifiedName: string) {
        const vals = tableQualifiedName?.split('/')
        if (vals?.length > 0) return vals[vals?.length - 1]
        else return ''
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
    function getSummarisedInfoOfSortPanel(subpanels: SubpanelSort[]) {
        if (subpanels.length == 0) return 'No Columns Added for Sort'

        let res = 'by '
        subpanels.forEach((subpanel, i) => {
            if (i !== subpanels.length - 1 && subpanel.column.label)
                res += `${
                    subpanel.column.label
                } in ${subpanel.order?.toUpperCase()}, `
            else if (i <= subpanels.length - 1 && subpanel.column.label)
                res += `${
                    subpanel.column.label
                } in ${subpanel.order?.toUpperCase()}`
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
            res += subpanel.columnsData.map((e) => e.label).join(', ')
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
                    .map((e) => e?.toUpperCase())
                    .join(', ')} of ${subpanel.column.label} and `
            else if (i <= subpanels.length - 1 && subpanel.column.label)
                res += `${subpanel.aggregators
                    .map((e) => e?.toUpperCase())
                    .join(', ')} of ${subpanel.column.label}`
            if (res === 'by ') res = 'No Columns Added for Aggregation'
        })
        return res
    }
    function getSummarisedInfoOfFilterPanel(subpanels: SubpanelFilter[]) {
        if (subpanels.length == 0) return 'No Columns Added for filter'
        let res = ' '
        subpanels.forEach((subpanel, i) => {
            if (subpanel.column.label) res += `${subpanel.column.label} `
            if (subpanel.filter.title) res += `${subpanel.filter.title}`

            switch (subpanel?.filter?.type) {
                case 'range_input': {
                    if (subpanel?.filter?.name === 'between') {
                        if (subpanel?.filter?.value?.length > 0) {
                            const firstVal = getValueStringFromType(
                                subpanel,
                                subpanel?.filter?.value[0] ?? ''
                            )
                            const secondVal = getValueStringFromType(
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
                    res += ` (${subpanel?.filter?.value?.join(',') ?? ''})`
                    break
                }
                case 'none': {
                    break
                }
            }
            if (subpanels?.length > 1 && i !== subpanels.length - 1) res += ', '

            if (res === ' ') res = 'No Columns Added for filter'
        })
        return res
    }

    return {
        getSummarisedInfoOfFilterPanel,
        getSummarisedInfoOfGroupPanel,
        getSummarisedInfoOfAggregationPanel,
        getSummarisedInfoOfSortPanel,
        getTableNameFromTableQualifiedName,
        getTableNamesStringFromQualfieidNames,
    }
}
