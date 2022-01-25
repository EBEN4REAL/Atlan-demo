import { Boolean } from '~/assets/images/dataType/boolean.svg'
import { SubpanelJoin } from '~/types/insights/VQBPanelJoins.interface'
import { selectedTables } from '~/types/insights/VQB.interface'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

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
export function useJoin() {
    let list = [
        {
            type: 'inner_join',
            name: 'Inner Join',
            url: 'https://dataschool.com/how-to-teach-people-sql/inner-join-animated/',
        },
        {
            type: 'left_join',
            name: 'Left Join',
            url: 'https://dataschool.com/how-to-teach-people-sql/left-right-join-animated/',
        },
        {
            type: 'right_join',
            name: 'Right Join',
            url: 'https://dataschool.com/how-to-teach-people-sql/left-right-join-animated/',
        },
        {
            type: 'outer_join',
            name: 'Outer Join',
            url: 'https://dataschool.com/how-to-teach-people-sql/full-outer-join-animated/',
        },
    ]

    function isJoinPanelStateDisabledComputed(
        isJoinPanelDisabled: Boolean,
        selectedTables: any[]
    ) {
        if (isJoinPanelDisabled) return true
        if (!isJoinPanelDisabled) {
            if (selectedTables.length < 2) return true
            return false
        }
    }

    function allowedTablesInJoinSelector(
        panelIndex: number,
        rowIndex: number,
        subIndex: number,
        activeInlineTab: activeInlineTabInterface
    ) {
        if (rowIndex === 0 && subIndex === 0) {
            const columnsFirstTableQualifiedName =
                activeInlineTab.playground.vqb?.selectedTables[0]
                    ?.tableQualifiedName

            return { allowed: [columnsFirstTableQualifiedName], notAllowed: [] }
        }
        if (rowIndex === 0 && subIndex === 1) {
            const tableQualifiedName =
                activeInlineTab.playground.vqb?.panels[0]?.subpanels[0]
                    ?.tableQualfiedName

            if (tableQualifiedName) {
                return {
                    allowed: [],
                    notAllowed: [tableQualifiedName],
                }
            } else {
                return {
                    allowed: [],
                    notAllowed: [],
                }
            }
        }
        if (subIndex === 0) {
            const columnsFirstTableQualifiedName =
                activeInlineTab.playground.vqb?.selectedTables[0]
                    ?.tableQualifiedName
            const uniqueTableQualifiedNamesSelectedInJoinsPanelTillNow =
                activeInlineTab.playground.vqb.selectedTables
                    .filter((table) => table.addedBy.includes('joins'))
                    .map((table) => table.tableQualifiedName)
            uniqueTableQualifiedNamesSelectedInJoinsPanelTillNow.push(
                columnsFirstTableQualifiedName
            )
            return {
                allowed: uniqueTableQualifiedNamesSelectedInJoinsPanelTillNow,
                notAllowed: [],
            }
        }
        if (subIndex === 1) {
            const columnsFirstTableQualifiedName =
                activeInlineTab.playground.vqb?.selectedTables[0]
                    ?.tableQualifiedName
            const uniqueTableQualifiedNamesSelectedInJoinsPanelTillNow =
                activeInlineTab.playground.vqb.selectedTables
                    .filter((table) => table.addedBy.includes('joins'))
                    .map((table) => table.tableQualifiedName)
            uniqueTableQualifiedNamesSelectedInJoinsPanelTillNow.push(
                columnsFirstTableQualifiedName
            )
            return {
                allowed: [],
                notAllowed:
                    uniqueTableQualifiedNamesSelectedInJoinsPanelTillNow,
            }
        }
        return {
            allowed: [],
            notAllowed: [],
        }
    }

    return {
        list,
        allowedTablesInJoinSelector,
        isJoinPanelStateDisabledComputed,
    }
}
