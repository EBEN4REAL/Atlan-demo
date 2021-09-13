<template>
    <div ref="root" class="virtual-list-container">
        <div
            v-if="isVirtualised"
            ref="wrapper"
            class="flex flex-col virtual-list-scroll"
            :style="wrapperStyle"
        >
            <!-- This element is only rendered when the virtual list does not start from 0th element -->
            <div
                v-if="listIndices[0]"
                ref="loadTop"
                class="flex-shrink-0"
                :style="topStyle"
            >
                Load More
            </div>
            <div
                v-for="(item, idx) in pool"
                :key="item[dataKey]"
                class="flex-shrink-0 virtual-list-item"
            >
                <slot :item="item" :index="idx + listIndices[0]"></slot>
            </div>
            <!-- This element is only rendered when the virtual list does not end at last element -->
            <div
                v-if="listIndices[1] != data.length"
                ref="loadBottom"
                class="flex justify-center flex-grow"
            >
                <a-spin tip="Loading..." />
            </div>
        </div>
        <div v-else>
            <div
                v-for="(item, idx) in data"
                :key="idx + listIndices[0]"
                class="flex-shrink-0 virtual-list-item"
            >
                <slot :item="item" :index="idx + listIndices[0]"></slot>
            </div>
        </div>
        <div class="footer" v-if="$slots?.footer">
            <slot name="footer" />
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
    } from 'vue'
    import useDynamicHeightList from './dynamicList'
    import useFixedHeightList from './fixedList'

    interface Props {
        data: any[]
        dataKey: string
        variableHeight: boolean
    }

    /**
     * Usage:
     * ```
     *  <VirtualList :data="list" :data-key="keyField">
     *      <template #default="{ item, index }">
     *
     *      </template>
     *  </VirtualList>
     * ```
     */
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
            /**
             * Set it to `true` if the height of the rows may be
             * different for each row, but will never change.
             * Set it to `false` if the height of the rows will be same for every row,
             * but height of individual rows can change in runtime but never be different.
             */
            variableHeight: {
                type: Boolean,
                default: () => false,
            },
        },
        setup(props: Props): any {
            const { data, variableHeight } = toRefs(props)
            const root = ref<Element | null>(null)
            const wrapper = ref<Element | null>(null)

            /**
             * Top/Bottom most element of the virtual list that
             * is watched by the intersection observer. We hide
             * them with v-if when not needed and check for
             * intersection and recalculate/rerender the virtual list.
             */
            const loadBottom = ref<Element | null>(null)
            const loadTop = ref<Element | null>(null)

            const rowCount = computed(() => data.value.length)

            const {
                handleIntersection,
                topHeight,
                fullHeight,
                listIndices,
                reset,
            } = variableHeight.value
                ? useDynamicHeightList(rowCount, wrapper)
                : useFixedHeightList(rowCount, wrapper)

            // We dynamically change these css property to give the illusion of scroll
            const wrapperStyle = computed(() => ({
                height: fullHeight.value + 'px',
            }))

            const topStyle = computed(() => ({
                height: topHeight.value + 'px',
            }))

            // Virtualize the container if there are more than 20 elements
            // for varible-height, always virtualize.
            const isVirtualised = computed(() => data.value?.length > 20)

            /** Slice of the data that is actually rendered on the screen */
            const pool = computed(() =>
                data.value.slice(listIndices.value[0], listIndices.value[1])
            )

            let lastListLength = data.value.length

            let iObserver: IntersectionObserver

            function observeThreshold(observer: IntersectionObserver) {
                if (loadBottom.value) observer.observe(loadBottom.value)
                if (loadTop.value) observer.observe(loadTop.value)
            }

            function observationCallback(
                entries: IntersectionObserverEntry[],
                observer: IntersectionObserver
            ) {
                /**
                 * Checks if any of the visible observed elements are
                 * intersecting, if yes run the calculations. Something
                 * to note here is that either or any of `loadTop` and
                 * `loadBottom` might not be visible, so we do this check.
                 */
                const intersecting = entries.reduce(
                    (acc, elem) => acc || elem.isIntersecting,
                    false
                )
                if (intersecting) {
                    observer.disconnect()
                    handleIntersection(
                        root.value?.scrollTop,
                        root.value?.clientHeight
                    )
                    nextTick(() => observeThreshold(observer))
                }
            }

            /**
             * Initializes/resets the internal state of the component
             */
            async function init() {
                // listSize.splice(1)
                // listIndices.value = [0, Math.min(GROUP_SIZE, data.value.length)]
                // topStyle.height = 'auto'
                // wrapperStyle.height = 'auto'
                iObserver = new IntersectionObserver(observationCallback, {
                    root: root.value,
                    threshold: [0],
                })
                await nextTick()
                observeThreshold(iObserver)
            }

            onMounted(init)

            watch(data, init)
            watch([isVirtualised, data.value.length], (cVal) => {
                // Reset the list when the mode is set to virtualised
                // or when the length of list smaller than the last one
                if (cVal || lastListLength > data.value.length) {
                    reset()
                }

                lastListLength = data.value.length
            })

            return {
                pool,
                root,
                wrapper,
                wrapperStyle,
                topStyle,
                listIndices,
                loadBottom,
                loadTop,
                isVirtualised,
                rowCount,
            }
        },
    })
</script>

<style scoped>
    .virtual-list-container {
        flex: 1 1 auto;
        margin: 0px;
        overflow: auto;
    }
    .virtual-list-scroll {
        box-sizing: border-box;
    }
    .virtual-list-item {
        overflow: hidden;
    }
    .footer {
        @apply py-3;
    }
</style>
