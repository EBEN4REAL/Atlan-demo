<template>
    <div :class="[' mx-3 pb-3']">
        <div class="">
            <!-- {{ columnSubpanels }} -->

            <template
                v-for="(subpanel, index) in subpanels"
                :key="subpanel?.id + index"
            >
                <!-- {{ subpanel }} -->
                <div
                    class="flex items-center w-full mb-3"
                    @mouseover="hoverItem = subpanel.id"
                    @mouseout="hoverItem = null"
                >
                    <ColumnSelector
                        class="item-1"
                        v-model:selectedColumn="subpanel.column"
                        :disabled="readOnly"
                        :tableQualifiedName="
                            columnSubpanels[0]?.tableQualfiedName
                        "
                        :selectedTablesQualifiedNames="
                            activeInlineTab.playground.vqb.selectedTables
                        "
                    >
                        <template #head>
                            <ColumnSelectorHead
                                v-model:selectedColumn="subpanel.column"
                                :selectedTables="
                                    activeInlineTab.playground.vqb
                                        .selectedTables
                                "
                            />
                        </template>

                        <template #body>
                            <ColumnSelectorDropdown
                                v-model:selectedColumn="subpanel.column"
                                :disabled="readOnly"
                                :tableQualifiedName="
                                    columnSubpanels[0]?.tableQualfiedName
                                "
                                :selectedTablesQualifiedNames="
                                    activeInlineTab.playground.vqb
                                        .selectedTables
                                "
                                @change="
                                    (val) =>
                                        handleColumnChange(val, index, subpanel)
                                "
                            />
                        </template>
                    </ColumnSelector>

                    <div class="flex items-center item-3">
                        <div
                            class="flex items-center justify-center px-4"
                            v-if="subpanel?.column?.item?.guid"
                        >
                            <span class="px-3 text-sm text-gray-500"
                                >calculate the</span
                            >
                        </div>
                        <AggregateSelector
                            :class="{
                                invisible: !subpanel?.column?.item?.guid,
                            }"
                            class=""
                            v-if="subpanel?.column?.item?.guid"
                            v-model:selectedItems="subpanel.aggregators"
                            :columnName="subpanel?.column?.label"
                            :columnType="subpanel?.column?.type"
                            @checkChange="checkChange"
                            :disabled="!subpanel?.column?.label || readOnly"
                        />

                        <AtlanIcon
                            v-if="isSubpanelClosable(subpanels) && !readOnly"
                            @click.stop="() => handleDelete(index)"
                            icon="Close"
                            class="w-6 h-6 ml-3 text-gray-500 mt-0.5 cursor-pointer"
                            style="min-width: 24px"
                            :class="`opacity-${
                                hoverItem === subpanel.id ? 100 : 0
                            }`"
                        />
                        <div style="width: 32px" v-else></div>
                    </div>
                </div>
            </template>
        </div>

        <span
            v-if="!readOnly"
            class="items-center mt-3 cursor-pointer text-primary"
            @click="handleAddPanel"
        >
            <AtlanIcon icon="Add" class="w-4 h-4 mr-1 -mt-0.5" />
            <span>Add another</span>
        </span>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        watch,
        PropType,
        toRaw,
        inject,
        ComputedRef,
        computed,
    } from 'vue'
    // import Pill from '~/components/UI/pill/pill.vue'
    // import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import AggregateSelector from '../aggregateSelector/_index.vue'
    import { SubpanelColumn } from '~/types/insights/VQBPanelColumns.interface'
    import { SubpanelAggregator } from '~/types/insights/VQBPanelAggregators.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { generateUUID } from '~/utils/helper/generator'
    import { useVModels } from '@vueuse/core'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
    import { dataTypeCategoryList } from '~/constant/dataType'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'

    import ColumnSelector from '~/components/insights/playground/editor/vqb/panels/common/multiSelect/index.vue'
    import ColumnSelectorDropdown from '~/components/insights/playground/editor/vqb/panels/common/multiSelect/dropdown.vue'
    import ColumnSelectorHead from '~/components/insights/playground/editor/vqb/panels/common/multiSelect/head.vue'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            AggregateSelector,
            ColumnSelector,
            ColumnSelectorDropdown,
            ColumnSelectorHead,
        },
        props: {
            expand: {
                type: Boolean,
                required: true,
                default: false,
            },
            subpanels: {
                type: Object as PropType<SubpanelAggregator[]>,
                required: true,
                default: [],
            },
            columnSubpanels: {
                type: Object as PropType<SubpanelColumn[]>,
                required: true,
                default: [],
            },
        },

        setup(props, { emit }) {
            const selectedAggregates = ref([])
            const selectedColumn = ref({})
            const { isSubpanelClosable } = useUtils()

            const { subpanels, columnSubpanels } = useVModels(props)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<activeInlineTabInterface>

            const inlineTabs = inject(
                'inlineTabs'
            ) as ComputedRef<activeInlineTabInterface>

            const columnName = ref('Hello World')
            const columnType = ref('char')
            const selectedTables = computed(() => {
                return activeInlineTab.value.playground.vqb.selectedTables
            })

            const { updateVQB } = useVQB()

            watch(columnName, () => {
                if (!columnName.value) {
                    selectedAggregates.value = []
                }
            })

            const checkChange = (checkedArr: string[]) => {
                console.log('checked array: ', checkedArr)
            }

            const handleColumnChange = (val, index) => {
                console.log('col change: ', val)
                console.log('column Subapanel', subpanels.value[0])

                const copySubPanel = JSON.parse(
                    JSON.stringify(toRaw(subpanels.value[index]))
                )
                /* Change only if types are different */

                const _getDataType1 = () => {
                    const found = dataTypeCategoryList.find((d) =>
                        d.type.find(
                            (type) =>
                                type.toLowerCase() ===
                                copySubPanel.column?.type?.toLowerCase()
                        )
                    )
                    return found?.label
                }
                const _getDataType2 = () => {
                    const found = dataTypeCategoryList.find((d) =>
                        d.type.find(
                            (type) =>
                                type.toLowerCase() === val?.type?.toLowerCase()
                        )
                    )
                    return found?.label
                }
                if (_getDataType1() !== _getDataType2()) {
                    copySubPanel.aggregators = []
                }

                copySubPanel.column = val

                subpanels.value[index] = copySubPanel
                console.log(subpanels.value)
            }

            const handleAddPanel = () => {
                const copySubPanels: SubpanelAggregator[] = JSON.parse(
                    JSON.stringify(toRaw(subpanels.value))
                )
                let uuid = generateUUID()
                copySubPanels.push({
                    id: uuid,
                    column: {},
                    aggregators: [],
                })
                subpanels.value = copySubPanels

                updateVQB(activeInlineTab, inlineTabs)

                // console.log('subpanels: ', copySubPanels)
            }
            const handleDelete = (index) => {
                subpanels.value.splice(index, 1)
                updateVQB(activeInlineTab, inlineTabs)
            }

            const changeColumn = (column) => {
                console.log('columns: ', column)
            }

            let hoverItem = ref(null)
            /* Accesss */
            const isQueryCreatedByCurrentUser = inject(
                'isQueryCreatedByCurrentUser'
            ) as ComputedRef

            const hasQueryWritePermission = inject(
                'hasQueryWritePermission'
            ) as ComputedRef

            const readOnly = computed(() =>
                activeInlineTab?.value?.qualifiedName?.length === 0
                    ? false
                    : isQueryCreatedByCurrentUser.value
                    ? false
                    : hasQueryWritePermission.value
                    ? false
                    : true
            )

            return {
                readOnly,
                isSubpanelClosable,
                activeInlineTab,
                selectedTables,
                selectedAggregates,
                columnName,
                columnType,
                checkChange,
                handleAddPanel,
                handleDelete,
                handleColumnChange,
                columnSubpanels,
                selectedColumn,
                changeColumn,
                hoverItem,
            }
        },
    })
</script>
<style lang="less" scoped>
    .border-shift-plus {
        padding: 1px;
    }
    .border-shift-minus {
        padding: 0px;
    }
    .item-1 {
        flex: 0.4575;
        flex-shrink: 0;
        white-space: nowrap;
        overflow: hidden;
    }

    .item-3 {
        flex: 0.5425;
        flex-shrink: 0;
        white-space: nowrap;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
