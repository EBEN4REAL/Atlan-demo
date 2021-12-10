import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { VQBPanelType } from '~/types/insights/VQB.interface'
import { Ref, ComputedRef, toRaw } from 'vue'
import { generateUUID } from '~/utils/helper/generator'

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
    function handleAdd(
        index,
        type,
        panel,
        activeInlineTab: Ref<activeInlineTabInterface>,
        activeInlineTabKey: ComputedRef<string>,
        inlineTabs: Ref<activeInlineTabInterface[]>
    ) {
        const panelCopy = Object.assign({}, { ...toRaw(panel.value) })
        panelCopy.id = type
        panelCopy.hide = true
        panelCopy.order =
            Number(activeInlineTab.value.playground.vqb.panels.length) + 1
        switch (type) {
            case 'aggregate': {
                const subpanel = {
                    column: {
                        label: undefined,
                        type: undefined,
                        value: undefined,
                        columnQualfiedName: undefined,
                    },
                    aggregators: [],
                }
                panelCopy.subpanels = [subpanel]

                break
            }
            case 'group': {
                const subpanel = {
                    tableQualfiedName: undefined,
                    columns: [],
                    columnsData: {
                        label: undefined,
                        type: undefined,
                        value: undefined,
                        columnQualfiedName: undefined,
                    },
                }
                panelCopy.subpanels = [subpanel]
                break
            }
            case 'sort': {
                const subpanel = {
                    tableQualfiedName: undefined,
                    column: {
                        label: undefined,
                        type: undefined,
                        value: undefined,
                        columnQualfiedName: undefined,
                    },
                }
                panelCopy.subpanels = [subpanel]
                break
            }
            case 'filter': {
                break
            }
            case 'join': {
                break
            }
        }

        panelCopy.subpanels = [
            {
                ...panel,
            },
        ]
        // }
        panelCopy.order =
            Number(activeInlineTab.value.playground.vqb.panels.length) + 1
        addPanelsInVQB(Number(index), panelCopy, activeInlineTabKey, inlineTabs)
    }
    return {
        handleAdd,
        deletePanelsInVQB,
        addPanelsInVQB,
    }
}
