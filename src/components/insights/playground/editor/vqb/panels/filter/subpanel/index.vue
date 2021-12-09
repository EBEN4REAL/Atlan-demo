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
                    <div style="width: 90px">
                        <FilterType
                            v-if="index !== 0"
                            v-model:filterType="subpanel.filter.filterType"
                        />
                    </div>

                    <ColumnSelector
                        style="width: 300px"
                        class="ml-6"
                        v-model:selectedItem="subpanel.column"
                        :tableQualfiedName="
                            columnSubpanels[0]?.tableQualfiedName
                        "
                        @change="(val) => handleColumnChange(val, index)"
                    />

                    <FilterSelector
                        class="ml-6"
                        style="width: 300px"
                        :columnName="subpanel?.column?.label"
                        :columnType="subpanel?.column?.type"
                        v-model:selectedFilter="subpanel.filter"
                    />

                    <Input
                        v-if="subpanel?.filter?.type === 'input'"
                        class="flex-1 ml-6"
                        v-model:inputValue="subpanel.filter.value"
                    />

                    <MultiInput
                        v-if="subpanel?.filter?.type === 'multi_input'"
                        class="flex-1 ml-6"
                        v-model:inputValue="subpanel.filter.value"
                    />

                    <RangeInput
                        v-if="subpanel?.filter?.type === 'range_input'"
                        class="flex-1 ml-6"
                        v-model:inputValue="subpanel.filter.value"
                    />
                    <AtlanIcon
                        @click.stop="() => handleDelete(index)"
                        icon="Close"
                        class="w-6 h-6 text-gray-500 mt-0.5 cursor-pointer"
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
    import { defineComponent, ref, watch, PropType, toRaw } from 'vue'
    // import Pill from '~/components/UI/pill/pill.vue'
    // import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import FilterSelector from '../filterSelector/index.vue'
    import { SubpanelColumn } from '~/types/insights/VQBPanelColumns.interface'
    import { SubpanelFilter } from '~/types/insights/VQBPanelFilter.interface'
    import { generateUUID } from '~/utils/helper/generator'
    import { useVModels } from '@vueuse/core'
    // import ColumnSelector from '../columnSelector/index.vue'
    import ColumnSelector from '../../common/columnSelector/index.vue'
    import Input from '../filterComponents/input.vue'
    import MultiInput from '../filterComponents/multiInput.vue'
    import FilterType from '../filterComponents/filterType.vue'
    import RangeInput from '../filterComponents/rangeInput.vue'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            FilterSelector,
            ColumnSelector,
            MultiInput,
            FilterType,
            RangeInput,
            Input,
        },
        props: {
            expand: {
                type: Boolean,
                required: true,
                default: false,
            },
            subpanels: {
                type: Object as PropType<SubpanelFilter[]>,
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
                // copySubPanel.filter = {}

                subpanels.value[index] = copySubPanel
                // console.log(subpanels.value)
            }

            const handleAddPanel = () => {
                const copySubPanels: SubpanelFilter[] = JSON.parse(
                    JSON.stringify(toRaw(subpanels.value))
                )
                let uuid = generateUUID()
                copySubPanels.push({
                    id: uuid,
                    column: {},
                    filter: {
                        filterType: 'and',
                    },
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

            return {
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
