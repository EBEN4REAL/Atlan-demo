import { ref, Ref } from 'vue'
import { useSpiltPanes } from './useSpiltPanes'
export function useHotKeys() {
    const { explorerPaneSize, assetSidebarPaneSize, outputPaneSize } =
        useSpiltPanes()
    function explorerPaneToggle(explorerPaneSizeParam: Ref<any>) {
        if (explorerPaneSizeParam.value == 0) {
            // setting original width
            explorerPaneSizeParam.value = explorerPaneSize.value
        } else explorerPaneSizeParam.value = 0
    }
    function assetSidebarToggle(assetSidebarPaneSizeParam: Ref<any>) {
        if (assetSidebarPaneSizeParam.value == 0) {
            assetSidebarPaneSizeParam.value = assetSidebarPaneSize.value
        } else assetSidebarPaneSizeParam.value = 0
    }
    function resultsPaneSizeToggle(panesizeParam: Ref<any>) {
        if (panesizeParam.value == 0) {
            panesizeParam.value = outputPaneSize.value
        } else panesizeParam.value = 0
    }

    return {
        resultsPaneSizeToggle,
        explorerPaneToggle,
        assetSidebarToggle,
    }
}
