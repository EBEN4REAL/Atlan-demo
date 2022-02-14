import { ref, Ref, toRaw } from 'vue'
import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
import { useLocalStorageSync } from '~/components/insights/common/composables/useLocalStorageSync'

export const explorerPaneSize = ref(24.5)
export const minExplorerSize = ref(0)
export const maxExplorerSize = ref(24.5)
export const currentNormalExplorerSize = ref(24.5)
export const outputPaneSize = ref(27.3)
const { syncInlineTabsInLocalStorage } = useLocalStorageSync()

export function useSpiltPanes(activeInlineTab?: activeInlineTabInterface) {
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

    const paneResize = (event: any) => {
        if (event.length > 0) {
            // explorerPaneSize.value = event[0].size
        }
    }
    const horizontalPaneResize = (
        event,
        activeInlineTab: Ref<activeInlineTabInterface>,
        tabsArray: Ref<activeInlineTabInterface[]>
    ) => {
        if (event.length > 0) {
            activeInlineTab.value.playground.resultsPane.outputPaneSize =
                event[1]?.size
            syncInlineTabsInLocalStorage(toRaw(tabsArray.value))
        }
    }

    return {
        MIN_EXPLORER_WIDTH,
        MAX_EXPLORER_WIDTH,
        ASSET_SIDEBAR_WIDTH,
        EXPLORER_WIDTH,
        assetSidebarPaneSize,
        paneResize,
        horizontalPaneResize,
        outputPaneSize,
    }
}
