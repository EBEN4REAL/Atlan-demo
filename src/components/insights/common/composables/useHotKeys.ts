import { ref, Ref } from 'vue'
import { useMagicKeys, whenever } from '@vueuse/core'

export function useHotKeys() {
    const { arrowleft, arrowright } = useMagicKeys()
    function explorerPaneToggle(explorerPaneSize: Ref<any>) {
        whenever(arrowleft, () => {
            if (explorerPaneSize.value == 0) explorerPaneSize.value = 20
            else explorerPaneSize.value = 0
        })
    }
    function assetSidebarToggle(assetSidebarPaneSize: Ref<any>) {
        whenever(arrowright, () => {
            if (assetSidebarPaneSize.value == 0) assetSidebarPaneSize.value = 20
            else assetSidebarPaneSize.value = 0
        })
    }
    return {
        explorerPaneToggle,
        assetSidebarToggle,
    }
}
