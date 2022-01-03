import { SubpanelSort } from '~/types/insights/VQBPanelSort.interface'
import { SubpanelAggregator } from '~/types/insights/VQBPanelAggregators.interface'
import { SubpanelJoin } from '~/types/insights/VQBPanelJoins.interface'
import { SubpanelGroupColumn } from '~/types/insights/VQBPanelGroups.interface'
import { SubpanelFilter } from '~/types/insights/VQBPanelFilter.interface'
import { getValueStringFromType } from './generateSQLQuery'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

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
                        if (subpanel.filter?.isVariable) {
                            let firstVal = ''
                            let secondVal = ''
                            const variable1 =
                                activeInlineTab.playground.editor.variables.find(
                                    (variable) =>
                                        variable?.subpanelId === subpanel.id
                                )
                            // inputNumField
                            const variable2 =
                                activeInlineTab.playground.editor.variables.find(
                                    (variable) =>
                                        variable?.subpanelId ===
                                        `${subpanel.id}2`
                                )

                            firstVal = getValueStringFromType(
                                subpanel,
                                variable1?.value ?? ''
                            )
                            secondVal = getValueStringFromType(
                                subpanel,
                                variable2?.value ?? ''
                            )

                            /* Check if the type is date */
                            if (
                                subpanel?.column?.type?.toLowerCase() === 'date'
                            ) {
                                firstVal = getValueStringFromType(
                                    subpanel,
                                    variable1?.value?.format(
                                        'YYYY-MM-DD HH:mm:ss'
                                    )
                                )
                                secondVal = getValueStringFromType(
                                    subpanel,
                                    variable2?.value?.format(
                                        'YYYY-MM-DD HH:mm:ss'
                                    )
                                )
                            }

                            res += ` ${firstVal} AND ${secondVal}`
                        } else {
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
                    }
                    break
                }
                case 'input': {
                    if (subpanel.filter?.isVariable) {
                        const variable =
                            activeInlineTab.playground.editor.variables.find(
                                (variable) =>
                                    variable?.subpanelId === subpanel.id
                            )

                        /* Check if the type is date */
                        if (subpanel?.column?.type?.toLowerCase() === 'date') {
                            res += `
                                ${getValueStringFromType(
                                    subpanel,
                                    variable?.value.format(
                                        'YYYY-MM-DD HH:mm:ss'
                                    )
                                )}`
                        } else {
                            res += `
                                  ${getValueStringFromType(
                                      subpanel,
                                      variable?.value ?? ''
                                  )}`
                        }
                    } else {
                        res += ` ${getValueStringFromType(
                            subpanel,
                            subpanel?.filter?.value ?? ''
                        )}`
                    }
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
    }
}
