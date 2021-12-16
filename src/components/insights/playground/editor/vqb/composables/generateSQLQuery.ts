import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import squel from 'squel'
import { useUtils } from './useUtils'
import { aggregatedAliasMap } from '../constants/aggregation'
import { useFilter } from './useFilter'

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
export function generateSQLQuery(activeInlineTab: activeInlineTabInterface) {
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
    // console.log('joins: ', joins)

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
                        select.from(tableName)
                    }
                }
                subpanel.columns.forEach((columnName) => {
                    if (columnName === 'all') select.field('*')
                    else select.field(columnName)
                })
            }
        })
    }
    /* NOTE: Don't confuse hide=true means panel hide, it's opposite here, hide=true means it's included. The reaon why 
    it is this way because of two way binidng */

    if (aggregatePanel?.hide) {
        aggregatePanel?.subpanels.forEach((subpanel, i) => {
            subpanel.aggregators.forEach((aggregator: string) => {
                const aggregatorUpperCase = aggregator.toUpperCase()
                const columnName = subpanel.column.label
                // console.log(aggregatorUpperCase, 'fxn')
                select.field(
                    `${aggregatorUpperCase} (${columnName})`,
                    aggregatedAliasMap[aggregatorUpperCase](columnName)
                )
            })
        })
        // console.log(select.toString(), 'select.toString()')
    }

    /* NOTE: Don't confuse hide=true means panel hide, it's opposite here, hide=true means it's included. The reaon why 
    it is this way because of two way binidng */

    if (groupPanel?.hide) {
        groupPanel?.subpanels.forEach((subpanel, i) => {
            subpanel.columnsData.forEach((columnData) => {
                select.group(columnData.label)
            })
        })
        // console.log(select.toString(), 'select.toString()')
    }

    /* NOTE: Don't confuse hide=true means panel hide, it's opposite here, hide=true means it's included. The reaon why 
    it is this way because of two way binidng */
    if (sortPanel?.hide) {
        sortPanel?.subpanels.forEach((subpanel) => {
            const order = subpanel.order === 'asc'
            if (subpanel.column.label)
                select.order(subpanel.column.label, order)
        })
        // console.log(select.toString(), 'select.toString()')
    }
    /* NOTE: Don't confuse hide=true means panel hide, it's opposite here, hide=true means it's included. The reaon why 
    it is this way because of two way binidng */
    if (filter?.hide) {
        console.log(filter)
        let res = ''
        filter?.subpanels.forEach((subpanel, index) => {
            res += ` ${subpanel?.filter?.filterType?.toUpperCase()} `
            if (index == 0) res = ''

            res += `"${subpanel?.column?.label}"`
            res += `${nameMap[subpanel?.filter?.name]} `

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
                            res += `${firstVal} AND ${secondVal}`
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

                        res += `
                        ${getValueStringFromType(
                            subpanel,
                            variable?.value ?? ''
                        )}`
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
        // .join("table2", "t2", "t1.id = t2.id")

        // let columnDataLeft = join?.subpanels[0]?.columnDataLeft
        // let columnDataRight = join?.subpanels[0]?.columnDataRight

        // let leftContext = columnDataLeft?.columnQualifiedName?.split('/')
        // let columnLeft = leftContext[leftContext.length-1]
        // let TableLeft = leftContext[leftContext.length-2]

        // let schemaName = leftContext[leftContext.length-2]

        //backup
        // select.join("COVID_COUNTY_LEVEL_STATS_INFRA_DETAILS", undefined, `"COVID_COUNTY_LEVEL_PIVOT"."COUNTRY_REGION" = "COVID_COUNTY_LEVEL_STATS_INFRA_DETAILS"."COUNTRY_REGION"` )

        const query = `SELECT
        "COVID_COUNTY_LEVEL_PIVOT"."ACTIVE",
        "COVID_COUNTY_LEVEL_PIVOT"."CONFIRMED",
        "COVID_COUNTY_LEVEL_PIVOT"."COUNTRY_REGION",
        SUM (ACTIVE) AS "sum_ACTIVE"
        FROM
            COVID_COUNTY_LEVEL_PIVOT
        INNER JOIN COVID_19."COVID_COUNTY_LEVEL_STATS_INFRA_DETAILS"
        ON COVID_19."COVID_COUNTY_LEVEL_PIVOT"."COUNTRY_REGION"= COVID_19."COVID_COUNTY_LEVEL_STATS_INFRA_DETAILS"."COUNTRY_REGION"
        WHERE
            ("ACTIVE" = 32)
        GROUP BY
            "COVID_COUNTY_LEVEL_PIVOT"."ACTIVE",
            "COVID_COUNTY_LEVEL_PIVOT"."CONFIRMED",
            "COVID_COUNTY_LEVEL_PIVOT"."COUNTRY_REGION"
        ORDER BY
             "COVID_COUNTY_LEVEL_PIVOT"."ACTIVE" ASC,
             "COVID_COUNTY_LEVEL_PIVOT"."CONFIRMED" DESC`

        return query
    }

    console.log(select.toString(), 'select.toString()')
    return select.toString()
}
