<template>
    <div
        ref="container"
        @click="toggleFocus"
        class="relative flex items-center w-full border cursor-pointer group"
        :class="[
            isAreaFocused
                ? ' container-box-shadow-focus'
                : 'border-gray-300 container-box-shadow',
            ,
            'flex flex-wrap items-center  rounded selector-height',
            disabled ? ' cursor-not-allowed disable-bg ' : '',
        ]"
    >
        <div
            class="relative flex flex-wrap items-center w-full px-3 py-1"
            style="gap: 4px"
        >
            <template
                v-if="enrichedSelectedItems.length !== 0"
                v-for="(item, index) in enrichedSelectedItems"
                :key="item + index"
            >
                <!-- chips -->
                <div
                    class="inline-flex items-center justify-center px-3 mr-2 py-0.5 text-xs text-gray-700 rounded-full bg-gray-light"
                >
                    <span> {{ item.label }}</span>
                </div>
            </template>
            <span v-else class="text-gray-500">
                {{ placeholder }}
            </span>

            <div class="absolute right-3 carron-pos">
                <AtlanIcon
                    :icon="isAreaFocused ? 'ChevronUp' : 'ChevronDown'"
                    class="w-4 h-4"
                />
            </div>
        </div>

        <teleport to="body">
            <div
                v-if="isAreaFocused"
                @click.stop="() => {}"
                :style="`${
                    specifiedBodyWidth
                        ? `width:${specifiedBodyWidth}px;`
                        : `width:${containerPosition?.width}px;`
                }top:${
                    containerPosition?.top + containerPosition?.height
                }px;left:${containerPosition?.left}px;min-height:0`"
                :class="[
                    'absolute z-10 flex flex-col bg-white rounded custom-shadow position',
                ]"
            >
                <div
                    tabindex="-1"
                    :class="[
                        '  bg-white  custom-shadow flex flex-col  dropdown-container py-1 pb-2 rounded-b flex-1 ',
                    ]"
                    style="min-height: 0"
                >
                    <div
                        tabindex="-1"
                        :class="['dropdown-container flex w-full flex-col']"
                        style="min-height: 0"
                    >
                        <div
                            class="flex w-full dropdown-container"
                            style="min-height: 0"
                        >
                            <div
                                class="w-full overflow-y-auto"
                                :class="[
                                    dropdownOption.length === 0
                                        ? 'flex justify-center items-center'
                                        : '',
                                ]"
                                style="min-height: 0"
                            >
                                <template
                                    v-for="(item, index) in dropdownOption"
                                    :key="item.value + index"
                                >
                                    <a-checkbox
                                        :checked="map[item?.value]"
                                        @change="
                                            (checked) =>
                                                onCheckChange(checked, item)
                                        "
                                        class="inline-flex flex-row-reverse items-center w-full px-4 py-1 rounded atlanReverse hover:bg-primary-light dropdown-container"
                                    >
                                        <span class="text-gray-700">{{
                                            item.label
                                        }}</span>
                                    </a-checkbox>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script lang="ts">
    import {
        Ref,
        watch,
        inject,
        computed,
        defineComponent,
        PropType,
        ComputedRef,
        ref,
        onMounted,
        onUnmounted,
        toRefs,
    } from 'vue'

    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useAggregate } from '~/components/insights/playground/editor/vqb/composables/useAggregate'
    import { useVModels } from '@vueuse/core'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'

    export default defineComponent({
        name: 'Aggregate Selector',
        components: {},
        emits: ['onMounted', 'onUnmounted', 'checkChange'],
        props: {
            selectedItems: {
                type: Object as PropType<any[]>,
                required: true,
            },
            columnName: {
                type: String,
                required: true,
            },
            columnType: {
                type: String,
                required: true,
            },
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            specifiedBodyWidth: {
                type: Number,
                required: false,
            },
        },

        setup(props, { emit }) {
            const { columnName, columnType, disabled, specifiedBodyWidth } =
                toRefs(props)
            const { selectedItems } = useVModels(props)
            const { updateVQB } = useVQB()
            const map = ref({})

            const container = ref()
            // const lockVQBScroll = inject('lockVQBScroll') as Ref<Boolean>
            const observer = ref()
            const containerPosition = ref({
                width: undefined,
                height: undefined,
                top: undefined,
                left: undefined,
            })

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const inlineTabs = inject(
                'inlineTabs'
            ) as ComputedRef<activeInlineTabInterface>

            const isAreaFocused = ref(false)

            const setDropDownPosition = () => {
                const viewportOffset = container.value?.getBoundingClientRect()
                if (viewportOffset?.width)
                    containerPosition.value.width = viewportOffset?.width
                if (viewportOffset?.top)
                    containerPosition.value.top = viewportOffset?.top + 1
                if (viewportOffset?.left)
                    containerPosition.value.left = viewportOffset?.left
                if (viewportOffset?.height)
                    containerPosition.value.height = viewportOffset?.height
            }

            onMounted(() => {
                // const _container = document.getElementById('_container')
                emit('onMounted')
                if (container.value) {
                    observer.value = new ResizeObserver(onResize).observe(
                        container.value
                    )

                    setDropDownPosition()
                    document.addEventListener('click', (event) => {
                        console.log(event, 'evetmn')
                        const withinBoundaries = event
                            .composedPath()
                            .includes(container.value)

                        if (withinBoundaries) {
                            console.log('inside')
                        } else {
                            isAreaFocused.value = false
                        }
                    })
                }
            })

            const onResize = () => {
                const viewportOffset = container.value?.getBoundingClientRect()
                if (viewportOffset?.width)
                    containerPosition.value.width = viewportOffset?.width
                if (viewportOffset?.top)
                    containerPosition.value.top = viewportOffset?.top + 1
                if (viewportOffset?.left)
                    containerPosition.value.left = viewportOffset?.left
                if (viewportOffset?.height)
                    containerPosition.value.height = viewportOffset?.height
            }

            const toggleFocus = () => {
                setDropDownPosition()
                if (!disabled.value) {
                    if (isAreaFocused.value) {
                        isAreaFocused.value = false
                    } else {
                        isAreaFocused.value = true
                    }
                }
            }

            onUnmounted(() => {
                observer?.value?.unobserve(container?.value)
                emit('onUnmounted')
            })

            ///////////////////////////////

            const { aggregateList } = useAggregate()

            let aggregationList = ref([])
            watch(
                [columnType],
                () => {
                    aggregationList.value = aggregateList(columnType.value)
                },
                {
                    immediate: true,
                }
            )

            // const totalCount = computed(
            //     () => aggregationList.value?.length || 0
            // )

            const dropdownOption = computed(() => {
                let data = aggregationList.value.map((ls) => ({
                    label: ls.label,
                    value: ls.key,
                    key: ls.key,
                }))
                return data
            })

            const enrichedSelectedItems = computed(() => {
                const data: any[] = []
                selectedItems.value.forEach((key) => {
                    let item = aggregationList.value.find(
                        (el) => el.key?.toLowerCase() === key?.toLowerCase()
                    )
                    if (item) {
                        data.push({
                            label: item?.label,
                        })
                        // }
                        // console.log('selected: ', key)
                        map.value[key] = true
                    }
                })
                return data
            })

            const placeholder = computed(() => {
                if (columnName.value) {
                    return `Select functions`
                }
                return `Select a column first`
            })

            const onCheckChange = (checked, item) => {
                if (checked.target.checked) {
                    if (!(item.key in map.value)) {
                        map.value[item.key] = true
                    }
                } else {
                    delete map.value[item.key]
                }
                console.log('options: ', { checked, map: map.value })

                selectedItems.value = [...Object.keys(map.value)]
                emit('checkChange', selectedItems.value)
                updateVQB(activeInlineTab, inlineTabs)
            }
            watch(selectedItems, (newSelectedItems) => {
                if (newSelectedItems.length == 0) {
                    map.value = {}
                }
            })

            return {
                map,
                placeholder,
                dropdownOption,
                enrichedSelectedItems,
                toggleFocus,
                specifiedBodyWidth,
                disabled,
                container,
                isAreaFocused,
                containerPosition,
                onCheckChange,
            }
        },
    })
</script>
<style lang="less" scoped>
    .custom-shadow {
        box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    }

    .container-box-shadow {
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);
    }
    .container-box-shadow-focus {
        box-shadow: 0 0 0 2px rgb(82 119 215 / 20%);
    }
    .selector-height {
        min-height: 32px;
    }
    .position {
        @apply right-0;
    }
    .box-shadow {
        box-shadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12),
            0px 6px 16px rgba(0, 0, 0, 0.08),
            0px 9px 28px 8px rgba(0, 0, 0, 0.05);
    }
    .disable-bg {
        background-color: #fbfbfb;
    }
    .carron-pos {
        transform: translateY(-50%);
        top: 50%;
    }
</style>
