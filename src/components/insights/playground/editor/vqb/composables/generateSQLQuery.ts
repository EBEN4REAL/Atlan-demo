import { columns } from './../../../../../../constant/groups'
import { format } from 'sql-formatter'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import squel from 'squel'
import { useUtils } from './useUtils'
import { aggregatedAliasMap } from '../constants/aggregation'
import { useFilter } from './useFilter'
import { Ref } from 'vue'

const { nameMap, getInputTypeFromColumnType } = useFilter()
export function getValueStringFromType(subpanel, value) {
    let res = ''
    const type = getInputTypeFromColumnType(subpanel?.column?.type)
    if (type === 'number') res += `${Number(value)}`
    else if (type === 'text') {
        if (subpanel?.filter?.name?.includes('like')) {
            console.log(subpanel?.filter?.name?.includes('like'), 'sd like')
            switch (subpanel?.filter?.name) {
                case 'start_like': {
                    res += `'${value}%'`
                    break
                }
                case 'end_like': {
                    res += `'%${value}'`
                    break
                }
            }
        } else if (subpanel?.filter?.name?.includes('contains')) {
            switch (subpanel?.filter?.name) {
                case 'not_contains': {
                    res += `'%${value}%'`
                    break
                }
                case 'contains': {
                    res += `'%${value}%'`
                    break
                }
            }
        } else res += `'${value}'`
    } else if (type === 'date') res += `DATE '${value}'`
    return res
}
// "TABLENAME"."COLUMNNAME"
// "default/snowflake/1640717306/ATLAN_SAMPLE_DATA/COVID_19/COVID_COUNTY_LEVEL_PIVOT/LAST_UPDATED_DATE"
function getJoinFormattedColumnName(columnQualifiedName: string) {
    const spiltArray = columnQualifiedName?.split('/')
    if (spiltArray.length > 6) {
        return `"${spiltArray[5]}"."${spiltArray[6]}"`
    }
}
export function getTableName(columnQualifiedName: string) {
    const spiltArray = columnQualifiedName?.split('/')
    if (spiltArray?.length > 5) {
        return `"${spiltArray[5]}"`
    }
    return ''
}

export function generateSQLQuery(
    activeInlineTab: activeInlineTabInterface,
    limitRows: {
        checked: boolean
        rowsCount: number
    }
) {
    const { getTableNameFromTableQualifiedName } = useUtils()

    const select = squel.select()
    const columnPanel = activeInlineTab.playground.vqb.panels.find(
        (panel) => panel.id.toLowerCase() === 'columns'
    )
    const aggregatePanel = activeInlineTab.playground.vqb.panels.find(
        (panel) => panel.id.toLowerCase() === 'aggregate'
    )
    const groupPanel = activeInlineTab.playground.vqb.panels.find(
        (panel) => panel.id.toLowerCase() === 'group'
    )
    const sortPanel = activeInlineTab.playground.vqb.panels.find(
        (panel) => panel.id.toLowerCase() === 'sort'
    )
    const filter = activeInlineTab.playground.vqb.panels.find(
        (panel) => panel.id.toLowerCase() === 'filter'
    )

    const join = activeInlineTab.playground.vqb.panels.find(
        (panel) => panel.id.toLowerCase() === 'join'
    )

    /* NOTE: Don't confuse hide=true means panel hide, it's opposite here, hide=true means it's included. The reaon why 
    it is this way because of two way binidng */

    if (columnPanel?.hide) {
        columnPanel?.subpanels.forEach((subpanel, i) => {
            if (i == 0) {
                if (subpanel.tableQualfiedName) {
                    const tableName = getTableNameFromTableQualifiedName(
                        subpanel.tableQualfiedName
                    )
                    if (tableName) {
                        select.from(`"${tableName}"`)
                    }
                }
                if (!subpanel.columns.includes('all')) {
                    subpanel.columnsData.forEach((column) => {
                        const tableName = getTableNameFromTableQualifiedName(
                            subpanel.tableQualfiedName
                        )
                        select.field(`"${tableName}"."${column.label}"`)
                    })
                } else {
                    if (
                        aggregatePanel?.subpanels?.length > 0 &&
                        aggregatePanel?.subpanels[0]?.column?.label &&
                        aggregatePanel?.subpanels[0]?.aggregators?.length > 0 &&
                        aggregatePanel?.subpanels[0]?.aggregators[0]
                    ) {
                    } else {
                        select.field('*')
                    }
                }
            }
        })
    }
    /* NOTE: Don't confuse hide=true means panel hide, it's opposite here, hide=true means it's included. The reaon why 
    it is this way because of two way binidng */

    if (aggregatePanel?.hide) {
        aggregatePanel?.subpanels.forEach((subpanel, i) => {
            subpanel.aggregators.forEach((aggregator: string) => {
                const aggregatorUpperCase = aggregator.toUpperCase()
                const tableName = getTableName(
                    subpanel.column.qualifiedName ??
                        subpanel.column.qualifiedName
                )
                const columnName = subpanel.column.label
                // console.log(aggregatorUpperCase, 'fxn')
                if (aggregatorUpperCase === 'UNIQUE') {
                    select.field(
                        `COUNT (DISTINCT ${tableName}."${columnName}")`,
                        aggregatedAliasMap[aggregatorUpperCase](columnName)
                    )
                } else {
                    select.field(
                        `${aggregatorUpperCase} (${tableName}."${columnName}")`,
                        aggregatedAliasMap[aggregatorUpperCase](columnName)
                    )
                }
            })
        })
        // console.log(select.toString(), 'select.toString()')
    }

    /* NOTE: Don't confuse hide=true means panel hide, it's opposite here, hide=true means it's included. The reaon why 
    it is this way because of two way binidng */

    if (groupPanel?.hide) {
        groupPanel?.subpanels.forEach((subpanel, i) => {
            subpanel.columnsData.forEach((columnData) => {
                const tableName = getTableName(
                    columnData.columnsQualifiedName ??
                        subpanel.column.qualifiedName
                )
                select.group(`${tableName}."${columnData.label}"`)
            })
        })
        // console.log(select.toString(), 'select.toString()')
    }

    /* NOTE: Don't confuse hide=true means panel hide, it's opposite here, hide=true means it's included. The reaon why 
    it is this way because of two way binidng */
    if (sortPanel?.hide) {
        sortPanel?.subpanels.forEach((subpanel) => {
            const order = subpanel.order === 'asc'
            if (subpanel.column.label) {
                const tableName = getTableName(
                    subpanel.column.qualifiedName ??
                        subpanel.column.qualifiedName
                )

                select.order(`${tableName}."${subpanel.column.label}"`, order)
            }
        })
        // console.log(select.toString(), 'select.toString()')
    }
    /* NOTE: Don't confuse hide=true means panel hide, it's opposite here, hide=true means it's included. The reaon why 
    it is this way because of two way binidng */
    if (filter?.hide) {
        let res = ''
        filter?.subpanels.forEach((subpanel, index) => {
            res += ` ${subpanel?.filter?.filterType?.toUpperCase()} `
            const tableName = getTableName(
                subpanel.column.columnQualifiedName ??
                    subpanel.column.qualifiedName
            )
            if (index == 0) res = ''
            if (
                tableName &&
                subpanel?.column?.label &&
                nameMap[subpanel?.filter?.name]
            ) {
                res += `${tableName}."${subpanel?.column?.label}"`
                res += `${nameMap[subpanel?.filter?.name]} `
            }

            switch (subpanel?.filter?.type) {
                case 'range_input': {
                    if (subpanel?.filter?.name === 'between') {
                        if (subpanel.filter?.isVariable) {
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

                            let firstVal = getValueStringFromType(
                                subpanel,
                                variable1?.value ?? ''
                            )
                            let secondVal = getValueStringFromType(
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
                            res += `${firstVal} AND ${secondVal}`
                        } else {
                            if (subpanel?.filter?.value?.length > 0) {
                                const firstVal = getValueStringFromType(
                                    subpanel,
                                    subpanel?.filter?.value[0] ?? ''
                                )
                                const secondVal = getValueStringFromType(
                                    subpanel,
                                    subpanel?.filter?.value[1] ?? ''
                                )
                                res += `${firstVal} AND ${secondVal}`
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
                        res += `${getValueStringFromType(
                            subpanel,
                            subpanel?.filter?.value ?? ''
                        )}`
                    }
                    break
                }
                case 'multi_input': {
                    res += ` ('${subpanel?.filter?.value?.join(',') ?? ''}')`
                    break
                }
                case 'none': {
                    break
                }
            }
        })
        select.where(res)
    }

    if (join?.hide) {
        console.log('join: ', join)

        join?.subpanels.forEach((subpanel, i) => {
            // leftColumnName = "TABLENAME"."COLUMNNAME"
            const leftColumnName = getJoinFormattedColumnName(
                subpanel.columnsDataLeft?.columnQualifiedName ?? ''
            )
            const rightColumnName = getJoinFormattedColumnName(
                subpanel.columnsDataRight?.columnQualifiedName ?? ''
            )
            // leftTableName = "TABLENAME"
            const rightTableName = getTableName(
                subpanel.columnsDataRight?.columnQualifiedName ??
                    subpanel.column.qualifiedName
            )
            if (leftColumnName && rightTableName && rightColumnName) {
                switch (subpanel.joinType.type) {
                    case 'inner_join': {
                        select.join(
                            rightTableName,
                            null,
                            `${leftColumnName} = ${rightColumnName}`
                        )
                        break
                    }
                    case 'outer_join': {
                        select.outer_join(
                            rightTableName,
                            null,
                            `${leftColumnName} = ${rightColumnName}`
                        )
                        break
                    }
                    case 'left_join': {
                        select.left_join(
                            rightTableName,
                            null,
                            `${leftColumnName} = ${rightColumnName}`
                        )
                        break
                    }
                    case 'right_join': {
                        select.right_join(
                            rightTableName,
                            null,
                            `${leftColumnName} = ${rightColumnName}`
                        )
                        break
                    }
                    default: {
                        select.join(
                            rightTableName,
                            null,
                            `${leftColumnName} = ${rightColumnName}`
                        )
                    }
                }
            }
        })
    }

    console.log(select.toString(), 'select.toString()')
    if (limitRows.checked) {
        return `${select.toString()} LIMIT ${limitRows.rowsCount}`
    }
    return select.toString()
}
