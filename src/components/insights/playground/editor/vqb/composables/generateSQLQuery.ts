import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { SubpanelColumn } from '~/types/insights/VQBPanelColumns.interface'
import { VQBPanelType } from '~/types/insights/VQB.interface'
import { Ref } from 'vue'
import squel from 'squel'

export function generateSQLQuery(
    activeInlineTab: Ref<activeInlineTabInterface>
) {
    const select = squel.select()
    const columnsPanel = activeInlineTab.value.playground.vqb.panels.find(
        (panel) => panel.id.toLowerCase() === 'columns'
    )
}
