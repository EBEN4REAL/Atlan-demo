<template>
    <div class="virtual-list-container" ref="root">
        <div
            class="flex flex-col virtual-list-scroll"
            ref="wrapper"
            :style="wrapperStyle"
        >
            <div
                class="flex-shrink-0"
                ref="loadTop"
                :style="topStyle"
                v-if="listIndices[0]"
            >
                Load More
            </div>
            <div
                class="flex-shrink-0 virtual-list-item"
                v-for="(item, idx) in pool"
                :key="item[dataKey]"
            >
                <slot :item="item" :index="idx + listIndices[0]"></slot>
            </div>
            <div
                class="flex-grow"
                ref="loadBottom"
                v-if="listIndices[1] != data.length"
            >
                Load More
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {
    ref,
    toRefs,
    defineComponent,
    onMounted,
    watch,
    computed,
    nextTick,
    reactive,
} from 'vue'

interface Props {
    data: any[]
    dataKey: string
}

export default defineComponent({
    name: 'VirtualList',
    props: {
        data: {
            type: Array,
            default: () => [],
        },
        dataKey: {
            type: String,
            default: () => 'id',
        },
    },
    setup(props: Props): any {
        const { data } = toRefs(props)
        const root = ref<Element | null>(null)
        const wrapper = ref<Element | null>(null)
        const loadBottom = ref<Element | null>(null)
        const loadTop = ref<Element | null>(null)

        const GROUP_SIZE = 20

        const listSize = [0]
        const listIndices = ref([0, 0])
        const wrapperStyle = reactive({
            height: 'auto',
        })
        const topStyle = reactive({
            height: 'auto',
        })

        const pool = computed(() => {
            return data.value.slice(listIndices.value[0], listIndices.value[1])
        })

        watch(
            listIndices,
            () => {
                const index = listIndices.value

                // Keep recording the height of the elements
                // TODO: Account for the spacer elements
                while (
                    listSize.length < index[1] + 1 &&
                    wrapper.value?.childElementCount
                ) {
                    let nthChild =
                        listSize.length - index[0] + (index[0] ? 1 : 0)
                    let size =
                        listSize[listSize.length - 1] +
                        wrapper.value?.children[nthChild].clientHeight

                    listSize.push(size)
                }
            },
            { flush: 'post' }
        )

        function calculateIndexFromHeight(arr: number[], height: number) {
            // DO a binary search on the list
            let low = 0
            let high = Array.isArray(arr)
                ? arr.length - 1
                : Object.keys(arr).length - 1
            let mid
            while (low < high) {
                mid = Math.floor((high + low) / 2)
                // Check if height is present at middle position
                if (arr[mid] == height) {
                    break
                } else if (arr[mid] > height) {
                    high = mid - 1
                } else {
                    low = mid + 1
                }
            }

            mid = Math.floor((high + low) / 2)
            if (height <= arr[mid]) return mid - 1
            else return mid
        }

        function handleIntersection() {
            const range: number[] = []
            range[0] = calculateIndexFromHeight(listSize, root.value.scrollTop)
            range[1] = calculateIndexFromHeight(
                listSize,
                root.value.scrollTop + root.value?.clientHeight
            )
            const diff = Math.round((range[1] - range[0]) / 2)
            listIndices.value = [
                Math.max(0, range[0] - diff),
                Math.min(data.value.length, range[1] + diff),
            ]
            topStyle.height = listSize[listIndices.value[0]] + 'px'
            wrapperStyle.height = listSize[listSize.length - 1] + 30 + 'px'
        }

        function observeThreshold(observer: IntersectionObserver) {
            if (loadBottom.value) observer.observe(loadBottom.value)
            if (loadTop.value) observer.observe(loadTop.value)
        }

        function observationCallback(
            entries: IntersectionObserverEntry[],
            observer: IntersectionObserver
        ) {
            const intersecting = entries.reduce(
                (acc, elem) => acc || elem.isIntersecting,
                false
            )
            if (intersecting) {
                observer.disconnect()
                handleIntersection()
                nextTick(() => observeThreshold(observer))
            }
        }
        onMounted(async () => {
            listIndices.value = [0, Math.min(GROUP_SIZE, data.value.length)]
            const observer = new IntersectionObserver(observationCallback, {
                root: root.value,
                threshold: [0],
            })
            await nextTick()
            observeThreshold(observer)
        })

        return {
            pool,
            root,
            wrapper,
            listSize,
            wrapperStyle,
            topStyle,
            listIndices,
            loadBottom,
            loadTop,
        }
    },
})
</script>

<style scoped>
.virtual-list-container {
    flex: 1 1 auto;
    margin: 12px;
    overflow: auto;
}
.virtual-list-scroll {
    box-sizing: border-box;
}
.virtual-list-item {
    overflow: hidden;
}
</style>
