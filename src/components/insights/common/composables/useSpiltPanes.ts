import { ref } from 'vue'
export function useSpiltPanes() {
    /* ---- Panes  ----- */
    /* TODO: Collapse panes if it reach  threshold */
    const EXPLORER_WIDTH = 333 // in px
    const ASSET_SIDEBAR_WIDTH = 420 // in px
    const explorerThreshold = 10
    const explorerPaneCollapsed = ref(false)
    const assetSidebarThreshold = 10
    const explorerPaneSize = ref(24.5)
    const assetSidebarPaneSize = ref(25)
    const outputPaneSize = ref(27.3)
    const paneResize = (event: any) => {
        if (event.length > 0) {
            // explorerPaneSize.value = event[0].size
        }
    }

    return {
        ASSET_SIDEBAR_WIDTH,
        EXPLORER_WIDTH,
        outputPaneSize,
        explorerPaneSize,
        assetSidebarPaneSize,
        paneResize,
    }
}
