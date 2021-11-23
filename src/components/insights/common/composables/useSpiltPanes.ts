import { ref } from 'vue'
export function useSpiltPanes() {
    /* ---- Panes  ----- */
    /* TODO: Collapse panes if it reach  threshold */
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
        outputPaneSize,
        explorerPaneSize,
        assetSidebarPaneSize,
        paneResize,
    }
}
