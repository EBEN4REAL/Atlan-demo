<template>
    <div :class="[' mx-3 mt-1 mb-4']">
        <div class="">
            <template
                v-for="(subpanel, index) in subpanels"
                :key="subpanel?.id + index"
            >
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
                        :selectedTablesQualifiedNames="
                            activeInlineTab.playground.vqb.selectedTables
                        "
                        @change="(val) => handleColumnChange(val, index)"
                    />

                    <span class="px-3 text-sm text-gray-500">order by</span>
                    <!-- {{ subpanel }} -->
                    <RaisedTab
                        v-model:active="subpanel.order"
                        class="mr-auto"
                        :data="tabConfig"
                    />

                    <AtlanIcon
                        @click.stop="() => handleDelete(index)"
                        icon="Close"
                        class="w-6 h-6 ml-3 text-gray-500 mt-0.5 cursor-pointer"
                        :class="`opacity-${
                            hoverItem === subpanel.id ? 100 : 0
                        }`"
                    />
                </div>
            </template>
        </div>

        <span>
            <div
                class="items-center mt-3 cursor-pointer text-primary"
                @click.stop="handleAddPanel"
            >
                <AtlanIcon icon="Add" class="w-4 h-4 mr-1 -mt-0.5" />
                <span>Add another</span>
            </div>
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
    } from 'vue'
    // import Pill from '~/components/UI/pill/pill.vue'
    // import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import { SubpanelColumn } from '~/types/insights/VQBPanelColumns.interface'
    import { SubpanelSort } from '~/types/insights/VQBPanelSort.interface'
    import { generateUUID } from '~/utils/helper/generator'
    import { useVModels } from '@vueuse/core'
    import RaisedTab from '@/UI/raisedTab.vue'
    // import ColumnSelector from '../columnSelector/index.vue'
    import ColumnSelector from '../../common/columnSelector/index.vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            ColumnSelector,
            RaisedTab,
        },
        props: {
            expand: {
                type: Boolean,
                required: true,
                default: false,
            },
            subpanels: {
                type: Object as PropType<SubpanelSort[]>,
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
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const { subpanels, columnSubpanels } = useVModels(props)
            const columnName = ref('Hello World')
            const columnType = ref('char')

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

                const copySubPanel = JSON.parse(
                    JSON.stringify(toRaw(subpanels.value[index]))
                )
                copySubPanel.column = val
                // copySubPanel.aggregators = []

                subpanels.value[index] = copySubPanel
                console.log(subpanels.value)
            }

            const handleAddPanel = () => {
                const copySubPanels: SubpanelSort[] = JSON.parse(
                    JSON.stringify(toRaw(subpanels.value))
                )
                let uuid = generateUUID()
                copySubPanels.push({
                    id: generateUUID(),
                    column: {},
                    order: 'asc',
                })
                subpanels.value = copySubPanels

                // console.log('subpanels: ', copySubPanels)
            }
            const handleDelete = (index) => {
                subpanels.value.splice(index, 1)
            }

            const changeColumn = (column) => {
                console.log('columns: ', column)
            }

            let hoverItem = ref(null)
            const tabConfig = ref([
                { key: 'asc', label: 'ASC' },
                { key: 'desc', label: 'DESC' },
            ])

            // const selectedOrder = ref('asc')

            return {
                activeInlineTab,
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
                // selectedOrder,
                tabConfig,
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
