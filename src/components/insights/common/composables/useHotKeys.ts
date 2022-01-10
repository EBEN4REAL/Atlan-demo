import { ref, Ref } from 'vue'
import { useSpiltPanes } from './useSpiltPanes'
import { currentNormalExplorerSize } from './useSpiltPanes'

export function useHotKeys() {
    const { _t, assetSidebarPaneSize, outputPaneSize } = useSpiltPanes()
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
    function resultsPaneSizeToggle(outputPaneSizeParam: Ref<any>) {
        if (outputPaneSizeParam.value <= 10) {
            outputPaneSizeParam.value = outputPaneSize.value
        } else outputPaneSizeParam.value = 0
    }

    return {
        resultsPaneSizeToggle,
        explorerPaneToggle,
        assetSidebarToggle,
    }
}
