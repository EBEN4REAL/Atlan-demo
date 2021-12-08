import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { SubpanelColumn } from '~/types/insights/VQBPanelColumns.interface'
import { VQBPanelType } from '~/types/insights/VQB.interface'
import { Ref, ComputedRef } from 'vue'
import squel from 'squel'

function getTableNameFromTableQualifiedName(tableQualifiedName: string) {
    const vals = tableQualifiedName.split('/')
    if (vals.length > 0) return vals[vals.length - 1]
}
export function generateSQLQuery(activeInlineTab: activeInlineTabInterface) {
    const select = squel.select()
    const columnPanel = activeInlineTab.playground.vqb.panels.find(
        (panel) => panel.id.toLowerCase() === 'columns'
    )
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
    return select.toString()
}
