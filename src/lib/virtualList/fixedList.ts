import { Ref, ref, computed } from 'vue'

/** Arbitrary size of a single batch */
const GROUP_SIZE = 20

export default function useFixedHeightList(
    rowCount: Ref<number>,
    wrapper: Ref<Element | null>
) {
    const topHeight = ref(0)
    const fullHeight = ref(0)
    const listIndices = ref([0, Math.min(GROUP_SIZE, rowCount.value)])

    const rowHeight = computed(() => {
        if (rowCount.value && wrapper.value) {
            const firstElem = listIndices.value[0] ? 1 : 0
            const size = wrapper.value?.children[firstElem].clientHeight
            return size || 0
        }
        return 0
    })

    function handleIntersection(scrollTop: number, clientHeight: number) {
        if (rowHeight.value) {
            const topIndex = Math.floor(scrollTop / rowHeight.value)

            topHeight.value = rowHeight.value * topIndex
            fullHeight.value = rowCount.value * rowHeight.value
            const screenBuffer = Math.round(clientHeight / rowHeight.value)

            const invisibleBuffer = Math.round(screenBuffer / 2)

            listIndices.value = [
                Math.max(0, topIndex - invisibleBuffer),
                Math.min(
                    rowCount.value,
                    topIndex + screenBuffer + invisibleBuffer
                ),
            ]
        }
    }

    return { topHeight, fullHeight, listIndices, handleIntersection }
}
