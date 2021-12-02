import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { VQBPanelType } from '~/types/insights/VQB.interface'
import { Ref, ComputedRef, toRaw } from 'vue'

export function findIndexOfActiveInlineTab(
    activeInlineTabKey: ComputedRef<string>,
    inlineTabs: Ref<activeInlineTabInterface[]>
) {
    return inlineTabs.value.findIndex(
        (tab) => tab.key === activeInlineTabKey.value
    )
}
export function useVQB() {
    function addPanelsInVQB(
        panelIndex: number,
        panel: VQBPanelType,
        activeInlineTabKey: ComputedRef<string>,
        inlineTabs: Ref<activeInlineTabInterface[]>
    ) {
        const index = findIndexOfActiveInlineTab(activeInlineTabKey, inlineTabs)
        const copyTabData = Object.assign(
            {},
            { ...toRaw(inlineTabs.value)[index] }
        )
        copyTabData.playground.vqb.panels.splice(
            Number(panelIndex) + 1,
            0,
            panel
        )
        inlineTabs.value[index] = copyTabData
    }
    function deletePanelsInVQB(
        panelIndex: number,
        activeInlineTabKey: ComputedRef<string>,
        inlineTabs: Ref<activeInlineTabInterface[]>
    ) {
        const index = findIndexOfActiveInlineTab(activeInlineTabKey, inlineTabs)
        const copyTabData = Object.assign({}, inlineTabs.value[index])
        copyTabData.playground.vqb.panels.splice(Number(panelIndex), 1)
        inlineTabs.value[index] = copyTabData
    }
    return {
        deletePanelsInVQB,
        addPanelsInVQB,
    }
}
