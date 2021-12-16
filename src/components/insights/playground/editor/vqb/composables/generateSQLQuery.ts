import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import squel from 'squel'
import { useUtils } from './useUtils'
import { aggregatedAliasMap } from '../constants/aggregation'
import { useFilter } from './useFilter'

const { nameMap, getInputTypeFromColumnType } = useFilter()
function getValueStringFromType(subpanel, value) {
    let res = ''
    const type = getInputTypeFromColumnType(subpanel?.column?.type)
    if (type === 'number') res += `${value}`
    else if (type === 'text') res += `'${value}'`
    else if (type === 'date') res += `DATE '${value}'`
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
                    select.field(columnName)
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
            res += `${nameMap[subpanel?.filter?.name]}`

            switch (subpanel?.filter?.type) {
                case 'range_input': {
                    if (subpanel?.filter?.name === 'between') {
                        if (subpanel?.filter?.value > 0) {
                            const firstVal = getValueStringFromType(
                                subpanel,
                                subpanel?.filter?.value[0]
                            )
                            const secondVal = getValueStringFromType(
                                subpanel,
                                subpanel?.filter?.value[1]
                            )
                            res += ` ${firstVal} AND ${secondVal}`
                        }
                    }
                    break
                }
                case 'input': {
                    res += ` ${getValueStringFromType(
                        subpanel,
                        subpanel?.filter?.value
                    )}`
                    break
                }
                case 'multi_input': {
                    res += ` '${subpanel?.filter?.value?.join(',')}'`
                    break
                }
                case 'none': {
                    break
                }
            }
        })
        select.where(res)
    }
    console.log(select.toString(), 'select.toString()')
    return select.toString()
}
