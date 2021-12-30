import { computed } from 'vue'

import { useActiveElement } from '@vueuse/core'

// if added to a-input, it will trigger shortcut even when the input is in focus
const ALLOW_TAB_SHORTCUT_CLASS = 'allow-tab-shortcut'

export default function useShortcuts() {
    const activeElement = useActiveElement()
    const usingInput = computed(() => {
        const isInput =
            activeElement.value?.tagName === 'INPUT' ||
            activeElement.value?.tagName === 'TEXTAREA'
        // const parent = activeElement.value?.parentElement
        // const isInputFocusAllowed = parent?.classList.contains(
        //     ALLOW_SHORTCUT_ON_FOCUS_PARENT_CLASS
        // )
        // if (isInputFocusAllowed) {
        //     return false
        // }
        return isInput
    })
    const allowedTabShortcut = computed(() => {
        const parent = activeElement.value?.parentElement
        return parent?.classList.contains(ALLOW_TAB_SHORTCUT_CLASS)
    })
    return {
        usingInput,
        allowedTabShortcut,
    }
}

export const allowTabShortcut = ALLOW_TAB_SHORTCUT_CLASS
