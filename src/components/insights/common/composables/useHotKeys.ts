import { ref, Ref, toRaw } from 'vue'
import { useSpiltPanes } from './useSpiltPanes'
import { currentNormalExplorerSize, outputPaneSize } from './useSpiltPanes'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useLocalStorageSync } from '~/components/insights/common/composables/useLocalStorageSync'

export function useHotKeys() {
    const { syncInlineTabsInLocalStorage } = useLocalStorageSync()
    const { _t, assetSidebarPaneSize } = useSpiltPanes()
    function explorerPaneToggle(explorerPaneSizeParam: Ref<any>) {
        if (explorerPaneSizeParam.value == 0) {
            // setting original width
            explorerPaneSizeParam.value = currentNormalExplorerSize.value
        } else explorerPaneSizeParam.value = 0
    }
    function assetSidebarToggle(assetSidebarPaneSizeParam: Ref<any>) {
        if (assetSidebarPaneSizeParam.value == 0) {
            assetSidebarPaneSizeParam.value = assetSidebarPaneSize.value
        } else assetSidebarPaneSizeParam.value = 0
    }
    function resultsPaneSizeToggle(
        activeInlineTab: Ref<activeInlineTabInterface>,
        tabsArray: Ref<activeInlineTabInterface[]>
    ) {
        if (activeInlineTab.value.playground.resultsPane.outputPaneSize <= 10) {
            debugger
            if (
                Math.abs(
                    activeInlineTab.value.playground.resultsPane.outputPaneSize
                ) < 1
            ) {
                // EXCEPTION when manually set to 0
                activeInlineTab.value.playground.resultsPane.outputPaneSize =
                    outputPaneSize.value
                return
            }
            activeInlineTab.value.playground.resultsPane.outputPaneSize =
                Math.abs(
                    activeInlineTab.value.playground.resultsPane.outputPaneSize
                )
        } else
            activeInlineTab.value.playground.resultsPane.outputPaneSize =
                -activeInlineTab.value.playground.resultsPane.outputPaneSize
        syncInlineTabsInLocalStorage(toRaw(tabsArray.value))
    }

    return {
        resultsPaneSizeToggle,
        explorerPaneToggle,
        assetSidebarToggle,
    }
}
