import { Ref, ref } from 'vue'

const FIRST_TOOLTIP_DELAY = 1.5
const ADJACENT_TOOLTIP_DELAY = 0.2

interface UseMouseEnterDelayReturn {
    mouseEnterDelay: Ref<number>
    enteredPill: () => void
}

/**
 * A utility function for calculating the mouse enter delay for classification
 * pills.
 */
export function useMouseEnterDelay(): UseMouseEnterDelayReturn {
    const mouseEnterDelay = ref(FIRST_TOOLTIP_DELAY)
    const timer = ref()

    const enteredPill = () => {
        if (timer.value !== undefined) {
            clearTimeout(timer.value)
        }
        mouseEnterDelay.value = ADJACENT_TOOLTIP_DELAY
        timer.value = setTimeout(() => {
            mouseEnterDelay.value = FIRST_TOOLTIP_DELAY
        }, ADJACENT_TOOLTIP_DELAY * 1000)
    }

    return {
        mouseEnterDelay,
        enteredPill,
    }
}
