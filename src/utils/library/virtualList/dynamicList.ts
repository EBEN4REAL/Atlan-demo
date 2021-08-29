import { ref, Ref, watch } from 'vue'

/** Arbitrary size of a single batch */
const GROUP_SIZE = 20

/**
 * Does a binary search on `arr` and return the highest value less than `height`.
 */
function calculateIndexFromHeight(arr: number[], height: number) {
    // Do a binary search on the list
    let low = 0
    let high = Array.isArray(arr) ? arr.length - 1 : Object.keys(arr).length - 1
    let mid
    while (low < high) {
        mid = Math.floor((high + low) / 2)
        // Check if height is present at middle position
        if (arr[mid] === height) {
            break
        } else if (arr[mid] > height) {
            high = mid - 1
        } else {
            low = mid + 1
        }
    }

    mid = Math.floor((high + low) / 2)
    if (height <= arr[mid]) return mid - 1
    return mid
}

export default function useDynamicHeightList(
    rowCount: Ref<number>,
    wrapper: Ref<Element | null>
) {
    /**
     * Array containing the height from which the
     * i-th elemnent start inside the scroll container
     */
    const listSize = [0]

    /**
     * It containes the highest [1] and lowest [0] index of the current visible buffer
     */
    const listIndices = ref([0, Math.min(GROUP_SIZE, rowCount.value)])

    const topHeight = ref(0)
    const fullHeight = ref(0)

    function handleIntersection(scrollTop: number, clientHeight: number) {
        // console.log(scrollTop, clientHeight)
        const range: number[] = []
        range[0] = calculateIndexFromHeight(listSize, scrollTop)
        range[1] = calculateIndexFromHeight(listSize, scrollTop + clientHeight)
        const diff = Math.round((range[1] - range[0]) / 2)
        listIndices.value = [
            Math.max(0, range[0] - diff),
            Math.min(rowCount.value, range[1] + diff),
        ]

        topHeight.value = listSize[listIndices.value[0]]
        fullHeight.value = listSize[listSize.length - 1]
    }

    watch(
        [listIndices, wrapper],
        () => {
            const index = listIndices.value
            // Set it to 1 if ref="loadTop" element is visible
            const offset = index[0] ? 1 : 0

            // Keep recording the height of the elements
            // TODO: Account for the spacer elements
            while (listSize.length <= index[1] + offset && wrapper.value) {
                const nthChild = listSize.length - (index[0] + offset)
                const size =
                    listSize[listSize.length - 1] +
                    wrapper.value?.children[nthChild].clientHeight
                listSize.push(size)
            }
        },
        { flush: 'post', immediate: true }
    )

    function reset() {
        topHeight.value = 0
        listIndices.value = [0, Math.min(GROUP_SIZE, rowCount.value)]
        listSize.splice(1)
    }

    return { handleIntersection, topHeight, fullHeight, listIndices, reset }
}
