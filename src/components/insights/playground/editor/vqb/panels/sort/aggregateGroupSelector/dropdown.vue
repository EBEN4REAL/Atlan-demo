<template>
    <div
        tabindex="-1"
        :class="[
            '  bg-white rounded custom-shadow flex flex-col  dropdown-container flex-1',
        ]"
        style="min-height: 0"
    >
        <div
            tabindex="-1"
            :class="['dropdown-container flex w-full']"
            style="min-height: 0"
        >
            <div class="flex flex-col flex-1 w-full" style="min-height: 0">
                <!-- For single table select -->
                <div class="flex flex-col" style="min-height: 0">
                    <div
                        class="px-4 py-3 border-b border-gray-300 dropdown-container"
                    >
                        <div
                            class="flex items-center justify-between w-full"
                            style="min-width: 100%"
                        >
                            <CustomInput
                                v-model:queryText="columnQueryText"
                                :placeholder="placeholder"
                                :autofocus="true"
                            />
                        </div>
                    </div>

                    <div
                        class="flex-1 w-full overflow-auto dropdown-container"
                        style="min-height: 0"
                        v-if="
                            columnDropdownOption.length !== 0 &&
                            !isColumnLoading
                        "
                    >
                        <template
                            v-for="(item, index) in columnDropdownOption"
                            :key="item.qualifiedName"
                        >
                            <div
                                class="inline-flex items-center justify-between w-full px-4 rounded h-9 hover:bg-primary-light"
                                @click="(e) => onSelectColumn(item, e)"
                                :class="
                                    selectedColumn?.qualifiedName +
                                        selectedColumn?.value ===
                                    item.value + item?.label
                                        ? 'bg-primary-light'
                                        : 'bg-white'
                                "
                            >
                                <div
                                    class="flex items-center parent-ellipsis-container"
                                >
                                    <component
                                        :is="getDataTypeImage(item.type)"
                                        class="flex-none w-auto h-4 text-gray-500 -mt-0.5 parent-ellipsis-container-extension"
                                    ></component>
                                    <span
                                        class="mb-0 ml-1 text-sm text-gray-700 truncate parent-ellipsis-container-base"
                                    >
                                        {{ item.label }}
                                    </span>
                                </div>
                                <div class="relative flex items-center h-full">
                                    <ColumnKeys
                                        :isPrimary="item.isPrimary"
                                        :isForeign="item.isForeign"
                                        :isPartition="item.isPartition"
                                    />

                                    <AtlanIcon
                                        icon="Check"
                                        class="ml-2 text-primary"
                                        v-if="
                                            selectedColumn?.qualifiedName +
                                                selectedColumn?.value ===
                                            item.value + item?.label
                                        "
                                    />
                                    <div v-else class="w-4 ml-2"></div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>

                <span
                    class="w-full mt-4 text-sm text-center text-gray-400"
                    v-if="columnDropdownOption.length == 0 && !isColumnLoading"
                >
                    No Columns found!
                </span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {
        watch,
        computed,
        ComputedRef,
        inject,
        defineComponent,
        PropType,
        Ref,
        toRefs,
        onMounted,
        onUnmounted,
        toRaw,
        ref,
    } from 'vue'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useVModels } from '@vueuse/core'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import getEntityStatusIcon from '~/utils/getEntityStatusIcon'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import Loader from '@common/loaders/page.vue'
    import CustomInput from '~/components/insights/playground/editor/vqb/panels/common/input/index.vue'
    import ColumnKeys from '~/components/common/column/columnKeys.vue'
    import { SubpanelColumnData } from '~/types/insights/VQBPanelAggregators.interface'
    import { SubpanelAggregator } from '~/types/insights/VQBPanelAggregators.interface'
    import { aggregatedAliasMap } from '~/components/insights/playground/editor/vqb/constants/aggregation'

    export default defineComponent({
        name: 'Sub panel',
        components: { Loader, CustomInput, ColumnKeys },
        props: {
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

            selectedColumn: {
                type: Object,
                required: true,
                default: () => {},
            },
        },

        setup(props, { emit }) {
            const { mixedSubpanels, disabled } = toRefs(props)
            const { selectedColumn, subpanel } = useVModels(props)
            const isAreaFocused = inject('isAreaFocused') as Ref<Boolean>
            const isColumnLoading = inject('isColumnLoading') as Ref<Boolean>
            const totalColumnsCount = inject('totalColumnsCount') as Ref<number>
            const columnQueryText = inject('columnQueryText') as Ref<String>

            const { openAssetInSidebar, getTableNameFromTableQualifiedName } =
                useUtils()
            const { updateVQB } = useVQB()
            const { getDataTypeImage } = useColumn()
            const {
                isPrimary,
                dataTypeImageForColumn,
                dataType,
                assetType,
                certificateStatus,
            } = useAssetInfo()

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<string>
            const inlineTabs = inject('inlineTabs') as ComputedRef<
                activeInlineTabInterface[]
            >

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
                    item?.label.includes(columnQueryText.value)
                )
                totalColumnsCount.value = filtered_data?.length
                return filtered_data
            })

            const placeholder = computed(() => {
                if (columnDropdownOption.value?.length > 0) {
                    return `Search from ${columnDropdownOption.value?.length} columns`
                }
                return `Select a Column first`
            })

            const onSelectColumn = (item, event) => {
                selectedColumn.value = {
                    label: item.label,
                    type: item.type,
                    value: item.label,
                    qualifiedName: item.value,
                    tableName: getTableNameFromTableQualifiedName(
                        item.qualifiedName
                    ),
                }

                emit('change', item.qualifiedName)
                activeInlineTab.value.playground.vqb.selectedTables =
                    JSON.parse(
                        JSON.stringify(
                            activeInlineTab.value.playground.vqb.selectedTables
                        )
                    )

                event.stopPropagation()
                event.preventDefault()
                updateVQB(activeInlineTab, inlineTabs)
                isAreaFocused.value = false
                return false
            }

            const actionClick = (event, t) => {
                openAssetInSidebar(event, t, activeInlineTab, inlineTabs)
            }

            return {
                getDataTypeImage,
                actionClick,
                onSelectColumn,
                isColumnLoading,
                placeholder,
                columnQueryText,
                isAreaFocused,
                disabled,
                columnDropdownOption,
                getEntityStatusIcon,
                isPrimary,
                dataTypeImageForColumn,
                dataType,
                assetType,
                certificateStatus,
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

    .selector-height {
        min-height: 32px;
    }

    .disable-bg {
        background-color: #fbfbfb;
    }
    .parent-ellipsis-container {
        display: flex;
        align-items: center;
        min-width: 0;
    }
    .parent-ellipsis-container-base {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .parent-ellipsis-container-extension {
        flex-shrink: 0;
    }

    .input_styles {
        width: 100% !important;
        // padding: 5px;
        // margin: 0;
        -webkit-box-sizing: border-box !important;
        -moz-box-sizing: border-box !important;
        -o-box-sizing: border-box !important;
        -ms-box-sizing: border-box !important;
        box-sizing: border-box !important;
    }
</style>
<style lang="less" module>
    .custom_input {
        background-color: #fbfbfb !important;
    }
</style>
