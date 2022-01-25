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
        <slot name="head"> </slot>

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
                }px;left:${
                    containerPosition?.left
                }px;height:280px;min-height:0`"
                :class="[
                    'absolute z-10 flex flex-col bg-white rounded custom-shadow position',
                ]"
            >
                <slot name="body"> </slot>
            </div>
        </teleport>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        ref,
        onMounted,
        onUnmounted,
        PropType,
        toRefs,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { VQBPanelType } from '~/types/insights/VQB.interface'
    import { SubpanelColumnData } from '~/types/insights/VQBPanelAggregators.interface'
    import { SubpanelAggregator } from '~/types/insights/VQBPanelAggregators.interface'
    import { useUtilsScoped } from './useUtilsScoped'
    import { aggregatedAliasMap } from '~/components/insights/playground/editor/vqb/constants/aggregation'

    import {
        useProvide,
        provideDataInterface,
    } from '~/components/insights/common/composables/useProvide'

    export default defineComponent({
        name: 'Sub panel',
        components: {},
        props: {
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            selectedColumn: {
                type: Object,
                required: true,
                default: () => {},
            },
            mixedSubpanels: {
                type: Object as PropType<{
                    mappedGroupSubpanels: SubpanelColumnData &
                        { addedBy: string }[]
                    mappedAggregateSubpanels: SubpanelAggregator &
                        { addedBy: string }[]
                    totalCount: number
                }>,
                required: true,
            },

            panel: {
                type: Object as PropType<VQBPanelType>,
                required: true,
            },
        },

        setup(props, { emit }) {
            const { disabled, mixedSubpanels } = toRefs(props)
            const { selectedColumn, panel } = useVModels(props)
            const container = ref()

            const observer = ref()
            const containerPosition = ref({
                width: undefined,
                height: undefined,
                top: undefined,
                left: undefined,
            })

            const isAreaFocused = ref(false)
            const isTableSelected = ref(false)
            const isColumnLoading = ref(false)
            const columnQueryText = ref('')
            const tableQueryText = ref('')
            const totalColumnsCount = ref(0)
            const { suffixDuplicates } = useUtilsScoped()

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

            const columnDropdownOption = computed(() => {
                let _data: any = []
                let totalCount = mixedSubpanels.value.totalCount
                ;[
                    ...mixedSubpanels.value.mappedGroupSubpanels,
                    ...mixedSubpanels.value.mappedAggregateSubpanels,
                ].forEach((item) => {
                    if (item.addedBy === 'group') {
                        _data.push({
                            label: item?.label,
                            value:
                                item?.columnsQualifiedName ??
                                item?.qualifiedName,
                            addedBy: item.addedBy,
                            type: item?.type,
                            item: item.item,
                            /* Reduntant property */
                            totalCount,
                        })
                    } else if (item.addedBy === 'aggregate') {
                        item?.aggregators?.forEach((aggregator) => {
                            const aggregatorUpperCase = aggregator.toUpperCase()
                            _data.push({
                                label: aggregatedAliasMap[aggregatorUpperCase](
                                    item?.column?.label
                                ),
                                value:
                                    item?.column?.columnQualifiedName ??
                                    item?.column?.qualifiedName,
                                addedBy: item.addedBy,
                                type: item?.column?.type,
                                item: item.column.item,
                                aggregator: aggregator,
                                /* Reduntant property */
                                totalCount,
                            })
                        })
                    }
                })

                _data = suffixDuplicates(_data)
                // debugger

                const filtered_data = _data.filter((item) =>
                    item?.label.includes(columnQueryText.value)
                )
                totalColumnsCount.value = filtered_data?.length
                return filtered_data
            })

            onMounted(() => {
                // const _container = document.getElementById('_container')

                if (container.value) {
                    observer.value = new ResizeObserver(onResize).observe(
                        container.value
                    )
                    setDropDownPosition()

                    document.addEventListener('click', (event) => {
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
            })

            /* ---------- PROVIDERS FOR CHILDRENS -----------------
            ---Be careful to add a property/function otherwise it will pollute the whole flow for childrens--
            */

            const provideData: provideDataInterface = {
                columnQueryText: columnQueryText,
                tableQueryText: tableQueryText,
                isAreaFocused: isAreaFocused,
                isTableSelected: isTableSelected,
                totalColumnsCount: totalColumnsCount,
                isColumnLoading: isColumnLoading,
                columnDropdownOption: columnDropdownOption,
            }
            useProvide(provideData)
            /*-------------------------------------*/

            return {
                toggleFocus,
                disabled,
                container,
                isAreaFocused,
                containerPosition,
            }
        },
    })
</script>
<style lang="less" scoped>
    .border-plus {
        padding: 1px;
    }
    .border-minus {
        padding: 0px;
    }
    .custom-shadow {
        box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    }
    .selector-height {
        min-height: 32px;
    }
    .position {
        @apply right-0;
    }
    .box-shadow {
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);
    }
    .disable-bg {
        background-color: #fbfbfb;
    }
    .container-box-shadow {
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);
    }
    .container-box-shadow-focus {
        box-shadow: 0 0 0 2px rgb(82 119 215 / 20%);
    }
</style>
