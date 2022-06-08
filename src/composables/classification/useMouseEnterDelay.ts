import { Ref, ref } from 'vue'

const FIRST_TOOLTIP_DELAY = 1.5
const ADJACENT_TOOLTIP_DELAY = 1

interface UseMouseEnterDelayReturn {
    mouseEnterDelay: Ref<number>
    enteredPill: () => void
    leftPill: () => void
}

/**
 * A utility function for calculating the mouse enter delay for classification
 * pills.
 */
export function useMouseEnterDelay(): UseMouseEnterDelayReturn {
    const mouseEnterDelay = ref(FIRST_TOOLTIP_DELAY)
    const timerRunOut = ref(false)
    const timer = ref(null)

    const enteredPill = () => {
        mouseEnterDelay.value = ADJACENT_TOOLTIP_DELAY
        if (timer.value !== null) {
            clearTimeout(timer.value)
            timer.value = null
        }
    }

    const leftPill = () => {
        timer.value = setTimeout(() => {
            mouseEnterDelay.value = FIRST_TOOLTIP_DELAY
            timerRunOut.value = true
        }, ADJACENT_TOOLTIP_DELAY * 1000)
    }

    return {
        mouseEnterDelay,
        enteredPill,
        leftPill,
    }
}
