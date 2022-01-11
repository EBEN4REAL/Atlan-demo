<template>
    <div :class="[' mx-3 mt-1 mb-4']">
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
                        class="flex-1"
                        v-model:selectedItem="subpanel.column"
                        :tableQualfiedName="
                            columnSubpanels[0]?.tableQualfiedName
                        "
                        :disabled="readOnly"
                        :selectedTablesQualifiedNames="
                            activeInlineTab.playground.vqb.selectedTables
                        "
                        @change="(val) => handleColumnChange(val, index)"
                    />

                    <span class="px-3 text-sm text-gray-500"
                        >Calculate the</span
                    >

                    <AggregateSelector
                        class="flex-1"
                        v-model:selectedItems="subpanel.aggregators"
                        :columnName="subpanel?.column?.label"
                        :columnType="subpanel?.column?.type"
                        @checkChange="checkChange"
                        :disabled="readOnly"
                    />

                    <AtlanIcon
                        v-if="isSubpanelClosable(subpanels) && !readOnly"
                        @click.stop="() => handleDelete(index)"
                        icon="Close"
                        class="w-6 h-6 ml-3 text-gray-500 mt-0.5 cursor-pointer"
                        :class="`opacity-${
                            hoverItem === subpanel.id ? 100 : 0
                        }`"
                    />
                    <div style="width: 32px" v-else></div>
                </div>
            </template>
        </div>

        <span
            v-if="readonly"
            class="items-center mt-3 cursor-pointer text-primary"
            @click.stop="handleAddPanel"
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
    import AggregateSelector from '../aggregateSelector/index.vue'
    import { SubpanelColumn } from '~/types/insights/VQBPanelColumns.interface'
    import { SubpanelAggregator } from '~/types/insights/VQBPanelAggregators.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { generateUUID } from '~/utils/helper/generator'
    import { useVModels } from '@vueuse/core'
    // import ColumnSelector from '../columnSelector/index.vue'
    import ColumnSelector from '../../common/columnSelector/index.vue'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
    import { dataTypeCategoryList } from '~/constant/dataType'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            AggregateSelector,
            ColumnSelector,
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

                updateVQB(activeInlineTabKey, inlineTabs)

                // console.log('subpanels: ', copySubPanels)
            }
            const handleDelete = (index) => {
                subpanels.value.splice(index, 1)
                updateVQB(activeInlineTabKey, inlineTabs)
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
</style>
