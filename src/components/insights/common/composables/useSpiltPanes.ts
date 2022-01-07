import { ref } from 'vue'

export const explorerPaneSize = ref(24.5)
export const minExplorerSize = ref(0)
export const maxExplorerSize = ref(24.5)
export const currentNormalExplorerSize = ref(24.5)

export function useSpiltPanes() {
    /* ---- Panes  ----- */
    /* TODO: Collapse panes if it reach  threshold */
    const EXPLORER_WIDTH = 333 // in px
    const ASSET_SIDEBAR_WIDTH = 420 // in px
    const MIN_EXPLORER_WIDTH = 300 // in px
    const MAX_EXPLORER_WIDTH = 390 // in px
    const explorerThreshold = 10
    const explorerPaneCollapsed = ref(false)
    const assetSidebarThreshold = 10

    const assetSidebarPaneSize = ref(25)

    const outputPaneSize = ref(27.3)
    const paneResize = (event: any) => {
        if (event.length > 0) {
            // explorerPaneSize.value = event[0].size
        }
    }

    return {
        MIN_EXPLORER_WIDTH,
        MAX_EXPLORER_WIDTH,
        ASSET_SIDEBAR_WIDTH,
        EXPLORER_WIDTH,
        outputPaneSize,
        assetSidebarPaneSize,
        paneResize,
    }
}
