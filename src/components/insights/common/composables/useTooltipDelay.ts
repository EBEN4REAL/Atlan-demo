import { ref } from 'vue'
export function useTooltipDelay() {
    // delay in seconds
    const MOUSE_ENTER_DELAY = 1
    const MOUSE_TRACK_MAXIMUM_DELAY = 0.2
    const ADJACENT_TOOLTIP_DELAY = 0.1
    const lastTooltipPresence = ref()

    const recordTooltipPresence = () => {
        lastTooltipPresence.value = setTimeout(() => {
            if (lastTooltipPresence.value !== undefined) {
                clearTimeout(lastTooltipPresence.value)
                lastTooltipPresence.value = undefined
            }
        }, MOUSE_TRACK_MAXIMUM_DELAY * 1000)
    }
    return {
        recordTooltipPresence,
        MOUSE_ENTER_DELAY,
        MOUSE_TRACK_MAXIMUM_DELAY,
        ADJACENT_TOOLTIP_DELAY,
        lastTooltipPresence,
    }
}
