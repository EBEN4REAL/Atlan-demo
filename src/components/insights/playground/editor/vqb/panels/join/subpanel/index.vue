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
                    <JoinSelector
                        style="width: 30%; max-width: 300px"
                        v-model:selectedJoinType="subpanel.joinType"
                    />

                    <TreeColumnSelector
                        class="flex-1"
                        style="max-width: 30%"
                        v-model:selectedColumn="subpanel.columnsDataLeft"
                    />
                    <div>
                        <a-tooltip placement="top" color="#363636">
                            <template #title>
                                <span>Swap Tables</span>
                            </template>
                            <AtlanIcon
                                @click.stop="() => swapTables(index)"
                                icon="TableSwap"
                                class="w-4 h-4 text-gray-300 mt-0.5 cursor-pointer outline-none"
                            />
                        </a-tooltip>
                    </div>
                    <TreeColumnSelector
                        class="flex-1"
                        style="max-width: 30%"
                        v-model:selectedColumn="subpanel.columnsDataRight"
                    />

                    <AtlanIcon
                        @click.stop="() => handleDelete(index)"
                        icon="Close"
                        class="w-6 h-6 text-gray-500 mt-0.5 cursor-pointer ml-auto"
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
                <span>Add condition</span>
            </div>
        </span>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, PropType, toRaw } from 'vue'
    // import Pill from '~/components/UI/pill/pill.vue'
    // import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import JoinSelector from '../joinSelector/index.vue'
    import { SubpanelJoin } from '~/types/insights/VQBPanelJoins.interface'
    import { generateUUID } from '~/utils/helper/generator'
    import { useVModels } from '@vueuse/core'
    import TreeColumnSelector from '~/components/insights/playground/editor/vqb/panels/common/treeColumnsSelector/index.vue'
    // import ColumnSelector from '../columnSelector/index.vue'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            JoinSelector,
            TreeColumnSelector,
        },
        props: {
            expand: {
                type: Boolean,
                required: true,
                default: false,
            },
            subpanels: {
                type: Object as PropType<SubpanelJoin[]>,
                required: true,
                default: [],
            },
        },

        setup(props, { emit }) {
            const selectedAggregates = ref([])
            const selectedColumn = ref({})

            const { subpanels } = useVModels(props)
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
                const copySubPanels: SubpanelJoin[] = JSON.parse(
                    JSON.stringify(toRaw(subpanels.value))
                )
                let uuid = generateUUID()
                copySubPanels.push({
                    id: uuid,
                    columnsDataLeft: {},
                    columnsDataRight: {},
                    joinType: {
                        type: 'inner_join',
                        name: 'Inner Join',
                    },
                })
                subpanels.value = copySubPanels

                // console.log('subpanels: ', copySubPanels)
            }
            const handleDelete = (index) => {
                subpanels.value.splice(index, 1)
            }

            const swapTables = (index) => {
                console.log('subpanel: ', subpanels.value[index])
                let columnsDataLeft = subpanels.value[index].columnsDataLeft
                let columnsDataRight = subpanels.value[index].columnsDataRight

                subpanels.value[index].columnsDataLeft = columnsDataRight
                subpanels.value[index].columnsDataRight = columnsDataLeft
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
                swapTables,
                handleColumnChange,
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
