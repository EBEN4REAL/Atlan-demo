import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { SubpanelColumn } from '~/types/insights/VQBPanelColumns.interface'
import { VQBPanelType } from '~/types/insights/VQB.interface'
import { Ref, ComputedRef } from 'vue'
import squel from 'squel'
import { useUtils } from './useUtils'
import { aggregatedAliasMap } from '../constants/aggregation'

export function generateSQLQuery(activeInlineTab: activeInlineTabInterface) {
    const { getTableNameFromTableQualifiedName } = useUtils()
    const select = squel.select()
    const columnPanel = activeInlineTab.playground.vqb.panels.find(
        (panel) => panel.id.toLowerCase() === 'columns'
    )
    const aggregatePanel = activeInlineTab.playground.vqb.panels.find(
        (panel) => panel.id.toLowerCase() === 'aggregate'
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
    return select.toString()
}
