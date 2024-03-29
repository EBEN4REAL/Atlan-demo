<template>
    <div
        ref="container"
        @click="
            () => {
                if (!disabled) {
                    isAreaFocused = true
                }
            }
        "
        @mouseover="handleMouseOver"
        @mouseout="handleMouseOut"
        tabindex="0"
        class="relative flex items-center z-1"
        :class="[
            isAreaFocused
                ? '  border border-gray-300 px-3 py-1 box-shadow-focus'
                : 'border-gray-300 border  px-3 py-1 box-shadow',
            ,
            'flex flex-wrap items-center    rounded  selector-height chip-container ',
            disabled ? ' cursor-not-allowed disable-bg ' : '',
        ]"
    >
        <div class="flex items-center" v-if="selectedItem?.label">
            <component
                :is="getDataTypeImage(selectedItem?.type)"
                class="flex-none w-auto h-4 text-gray-500 -mt-0.5"
            ></component>
            <span class="mb-0 ml-1 text-sm text-gray-700">
                {{ selectedItem?.label }}
            </span>
        </div>
        <span v-else class="text-gray-500 truncate">
            {{ placeholder }}
        </span>

        <div class="absolute right-2">
            <AtlanIcon icon="ChevronDown" class="w-4 h-4" />
        </div>
        <teleport to="body">
            <div
                v-if="isAreaFocused"
                :style="`width: ${containerPosition.width}px;top:${
                    containerPosition.top + containerPosition.height
                }px;left:${containerPosition.left}px`"
                :class="[
                    'absolute z-10  pb-2 overflow-auto bg-white rounded custom-shadow position dropdown-container',
                ]"
            >
                <div :class="['w-full dropdown-container']">
                    <div
                        class="px-4 py-3 border-b border-gray-300 dropdown-container"
                    >
                        <div
                            class="flex items-center justify-between w-full dropdown-container"
                            style="min-width: 100%"
                        >
                            <CustomInput
                                v-model:queryText="queryText"
                                :placeholder="placeholder"
                            />
                        </div>
                    </div>
                    <div
                        class="w-full overflow-auto dropdown-container"
                        v-if="dropdownOption.length !== 0"
                        style="height: 205px"
                    >
                        <template
                            v-for="(item, index) in dropdownOption"
                            :key="item.value + index"
                        >
                            <div
                                class="inline-flex items-center justify-between w-full px-4 rounded h-9 hover:bg-primary-light dropdown-container"
                                @click="(e) => onSelectItem(item, e)"
                                :class="
                                    selectedItem?.label === item.label
                                        ? 'bg-primary-light'
                                        : 'bg-white'
                                "
                            >
                                <div class="flex items-center">
                                    <component
                                        :is="getDataTypeImage(item.type)"
                                        class="flex-none w-auto h-4 text-gray-500 -mt-0.5"
                                    ></component>
                                    <span
                                        class="mb-0 ml-1 text-sm text-gray-700"
                                    >
                                        {{ item.label }}
                                    </span>
                                </div>
                                <div
                                    class="flex items-center parent-ellipsis-container-extension"
                                >
                                    <AtlanIcon
                                        icon="Check"
                                        class="ml-2 text-primary parent-ellipsis-container-base"
                                        v-if="
                                            selectedItem?.label === item.label
                                        "
                                    />
                                    <div v-else class="w-4 ml-2"></div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <div
                        class="flex items-center justify-center w-full mt-4 text-sm text-center text-gray-400"
                        style="height: 205px"
                        v-if="dropdownOption.length == 0 && !isLoading"
                    >
                        <span>No Columns found!</span>
                    </div>

                    <!-- -------------------------- -->
                </div>
            </div>
        </teleport>
    </div>
</template>

<script lang="ts">
    import {
        Ref,
        onUpdated,
        computed,
        watch,
        defineComponent,
        ref,
        nextTick,
        onMounted,
        inject,
        PropType,
        ComputedRef,
        onUnmounted,
        toRefs,
    } from 'vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useVModels } from '@vueuse/core'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import ColumnKeys from '~/components/insights/playground/editor/vqb/panels/common/ColumnKeys/index.vue'
    import { useSchema } from '~/components/insights/explorers/schema/composables/useSchema'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { SubpanelAggregator } from '~/types/insights/VQBPanelAggregators.interface'
    import { SubpanelGroupColumn } from '~/types/insights/VQBPanelGroups.interface'
    import { SubpanelColumnData } from '~/types/insights/VQBPanelAggregators.interface'
    import { aggregatedAliasMap } from '~/components/insights/playground/editor/vqb/constants/aggregation'
    import CustomInput from '~/components/insights/playground/editor/vqb/panels/common/input/index.vue'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            Pill,
            ColumnKeys,
            CustomInput,
        },
        emits: ['change'],

        props: {
            selectedItem: {
                type: Object,
                required: true,
            },
            disabled: {
                type: Boolean,
                required: false,
                default: false,
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
        },

        setup(props, { emit }) {
            const { mixedSubpanels, disabled } = toRefs(props)
            const {
                isPrimary,
                dataTypeImageForColumn,
                dataTypeImage,
                dataType,
                assetType,
                certificateStatus,
            } = useAssetInfo()

            const observer = ref()
            const containerPosition = ref({
                width: undefined,
                height: undefined,
                top: undefined,
                left: undefined,
            })
            const isTableSelected = ref(false)
            const queryText = ref('')
            const { selectedItem } = useVModels(props)

            const { getDataTypeImage } = useColumn()
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const { isSameNodeOpenedInSidebar } = useSchema()
            const { openAssetSidebar, closeAssetSidebar } = useAssetSidebar(
                inlineTabs,
                activeInlineTab
            )

            const inputRef = ref()
            const initialRef = ref()
            const selectAll = ref(false)
            const mouseOver = ref(false)
            const topPosShift = ref(0)
            const inputValue1 = ref('')
            const inputValue2 = ref('')
            const isAreaFocused = ref(false)
            const container = ref()
            const clickPos = ref({ left: 0, top: 0 })
            const setFoucs = () => {
                if (disabled?.value) return
                isAreaFocused.value = true
                nextTick(() => {
                    if (disabled?.value) inputRef?.value?.focus()
                })
            }
            const setFocusedCusror = () => {
                nextTick(() => {
                    inputRef?.value?.focus()
                })
            }

            const inputChange = () => {
                nextTick(() => {
                    if (topPosShift.value !== container.value?.offsetHeight) {
                        topPosShift.value = container.value?.offsetHeight
                    }
                })
            }

            const dropdownOption = computed(() => {
                let _data: any = []
                let totalCount = mixedSubpanels.value.totalCount
                ;[
                    ...mixedSubpanels.value.mappedGroupSubpanels,
                    ...mixedSubpanels.value.mappedAggregateSubpanels,
                ].forEach((item) => {
                    if (item.addedBy === 'group') {
                        _data.push({
                            label: item?.label,
                            value: item?.columnsQualifiedName,
                            addedBy: item.addedBy,
                            type: item?.type,
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
                                aggregator: aggregator,
                                /* Reduntant property */
                                totalCount,
                            })
                        })
                    }
                })

                const filtered_data = _data.filter((item) =>
                    item?.label.includes(queryText.value)
                )
                return filtered_data
            })

            const totalCount = computed(() => dropdownOption.value.length || 0)

            const input1Change = () => {
                setFoucs()
                queryText.value = inputValue1.value
                // emit('queryTextChange')
            }
            const input2Change = () => {
                setFoucs()
                queryText.value = inputValue2.value
                // emit('queryTextChange')
            }

            // let selectedColumn = ref({})

            const onSelectItem = (item, event) => {
                // selectedColumn.value = item
                selectedItem.value = item
                emit('change', item)
                setFocusedCusror()
                event.stopPropagation()
                event.preventDefault()
                isAreaFocused.value = false
                return false
            }

            const handleMouseOver = () => {
                if (!mouseOver.value) mouseOver.value = true
            }
            const handleMouseOut = () => {
                if (mouseOver.value) mouseOver.value = false
            }

            const clearAllSelected = () => {
                // selectedItem.value = {}
                emit('change', {})
            }

            onMounted(() => {
                topPosShift.value = container.value?.offsetHeight
                selectedItem.value = {
                    ...selectedItem.value,
                    active: true,
                }
                observer.value = new ResizeObserver(onResize).observe(
                    container.value
                )
                const viewportOffset = container.value?.getBoundingClientRect()
                if (viewportOffset?.width)
                    containerPosition.value.width = viewportOffset?.width
                if (viewportOffset?.top)
                    containerPosition.value.top = viewportOffset?.top
                if (viewportOffset?.left)
                    containerPosition.value.left = viewportOffset?.left
                if (viewportOffset?.height)
                    containerPosition.value.height = viewportOffset?.height

                document?.addEventListener('click', function (event) {
                    let isClickInside = container.value?.contains(event.target)

                    if (!isClickInside) {
                        isClickInside =
                            event?.target?.classList?.contains('ant-input')
                    }
                    if (!isClickInside) {
                        isClickInside =
                            event?.target?.classList?.contains(
                                'dropdown-container'
                            )
                    }

                    if (!isClickInside) {
                        isAreaFocused.value = false
                    }
                })
                nextTick(() => {
                    initialRef.value?.focus()
                })
            })

            const onResize = () => {
                const viewportOffset = container.value?.getBoundingClientRect()
                if (viewportOffset?.width)
                    containerPosition.value.width = viewportOffset?.width
                if (viewportOffset?.top)
                    containerPosition.value.top = viewportOffset?.top
                if (viewportOffset?.left)
                    containerPosition.value.left = viewportOffset?.left
                if (viewportOffset?.height)
                    containerPosition.value.height = viewportOffset?.height
            }
            onUpdated(() => {
                nextTick(() => {
                    const viewportOffset =
                        container.value?.getBoundingClientRect()
                    if (viewportOffset?.width)
                        containerPosition.value.width = viewportOffset?.width
                    if (viewportOffset?.top)
                        containerPosition.value.top = viewportOffset?.top
                    if (viewportOffset?.left)
                        containerPosition.value.left = viewportOffset?.left
                    if (viewportOffset?.height)
                        containerPosition.value.height = viewportOffset?.height
                    if (topPosShift.value !== container.value?.offsetHeight) {
                        topPosShift.value = container.value?.offsetHeight
                    }
                })
            })
            onUnmounted(() => {
                observer?.value?.unobserve(container?.value)
                selectedItem.value = {
                    ...selectedItem.value,
                    active: false,
                }
            })

            const placeholder = computed(() => {
                if (dropdownOption.value?.length > 0) {
                    return `Search from ${dropdownOption.value?.length} columns`
                }
                return `Select a Column first`
            })

            const actionClick = (event, t) => {
                if (
                    activeInlineTab?.value &&
                    Object.keys(activeInlineTab?.value).length
                ) {
                    if (isSameNodeOpenedInSidebar(t, activeInlineTab)) {
                        /* Close it if it is already opened */
                        closeAssetSidebar(activeInlineTab.value)
                    } else {
                        let activeInlineTabCopy: activeInlineTabInterface =
                            Object.assign({}, activeInlineTab.value)
                        activeInlineTabCopy.assetSidebar.assetInfo = t
                        activeInlineTabCopy.assetSidebar.isVisible = true
                        openAssetSidebar(activeInlineTabCopy, 'not_editor')
                    }
                }
                event.stopPropagation()
                event.preventDefault()
                return false
            }

            return {
                disabled,
                isTableSelected,
                containerPosition,
                initialRef,
                queryText,
                clearAllSelected,
                handleMouseOver,
                handleMouseOut,
                mouseOver,
                onSelectItem,
                // selectedColumn,
                totalCount,
                selectAll,
                dropdownOption,
                selectedItem,
                placeholder,
                inputChange,
                topPosShift,
                inputRef,
                input1Change,
                input2Change,
                inputValue1,
                inputValue2,
                clickPos,
                container,
                setFoucs,
                isAreaFocused,
                getDataTypeImage,
                getEntityStatusIcon,
                assetType,
                certificateStatus,
                actionClick,
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
</style>
<style lang="less" module>
    .custom_input {
        background-color: #fbfbfb !important;
    }
</style>
