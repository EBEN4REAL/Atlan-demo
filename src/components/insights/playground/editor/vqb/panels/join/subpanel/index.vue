<template>
    <div :class="[' mx-3 mt-1 mb-4']">
        <div class="">
            <template
                v-for="(subpanel, index) in subpanels"
                :key="subpanel?.id + index"
            >
                <div
                    class="w-full p-2 rounded grid-container"
                    @mouseover="hoverItem = subpanel.id"
                    @mouseout="hoverItem = null"
                >
                    <div class="flex-none item-1">
                        <JoinSelector
                            class="w-full"
                            v-model:selectedJoinType="subpanel.joinType"
                        />
                    </div>
                    <div class="item-2">
                        <TreeColumnSelector
                            class="flex-1"
                            v-model:selectedColumn="subpanel.columnsDataLeft"
                            :panelIndex="Number(panelIndex)"
                            :rowIndex="index"
                            :subIndex="0"
                            @change="
                                (qualifiedName) =>
                                    handleColumnChange(
                                        qualifiedName,
                                        subpanel?.id + index + 1
                                    )
                            "
                        />
                    </div>
                    <div
                        class="flex items-center justify-center flex-none item-4"
                    >
                        <span
                            class="w-4 h-4 text-lg text-gray-500 -mt-2.5 outline-none"
                            >=</span
                        >
                    </div>
                    <div class="flex items-center item-3">
                        <!-- subpanel?.id + index + 2 works as a unique string -->
                        <TreeColumnSelector
                            class="flex-1"
                            v-model:selectedColumn="subpanel.columnsDataRight"
                            :panelIndex="Number(panelIndex)"
                            :rowIndex="index"
                            :subIndex="1"
                            @change="
                                (qualifiedName) =>
                                    handleColumnChange(
                                        qualifiedName,
                                        subpanel?.id + index + 2
                                    )
                            "
                        />
                        <AtlanIcon
                            v-if="index !== 0"
                            @click="() => handleDelete(index)"
                            icon="Close"
                            style="min-width: 26px"
                            class="w-6 h-6 text-gray-500 ml-2 mt-0.5 cursor-pointer"
                            :class="`opacity-${
                                hoverItem === subpanel.id ? 100 : 0
                            }`"
                        />
                        <div style="width: 34px" v-else></div>
                    </div>
                </div>
            </template>
        </div>

        <span
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
        toRefs,
        inject,
        ComputedRef,
    } from 'vue'
    import JoinSelector from '../joinSelector/index.vue'
    import { SubpanelJoin } from '~/types/insights/VQBPanelJoins.interface'
    import { generateUUID } from '~/utils/helper/generator'
    import { useVModels } from '@vueuse/core'
    import TreeColumnSelector from '~/components/insights/playground/editor/vqb/panels/common/treeColumnsSelector/index.vue'
    import { selectedTables } from '~/types/insights/VQB.interface'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
    import { useJoin } from '~/components/insights/playground/editor/vqb/composables/useJoin'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

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
            selectedTables: {
                type: Object as PropType<selectedTables>,
                required: true,
                default: [],
            },
            panelIndex: {
                type: String,
                required: true,
            },
        },

        setup(props, { emit }) {
            const {
                getTableQualifiedNameFromColumnQualifiedName,
                isSubpanelClosable,
            } = useUtils()
            const selectedAggregates = ref([])
            const selectedColumn = ref({})
            const { allowedTablesInJoinSelector } = useJoin()

            const { subpanels, selectedTables } = useVModels(props)
            const { panelIndex } = toRefs(props)
            const columnName = ref('Hello World')
            const columnType = ref('char')
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            watch(columnName, () => {
                if (!columnName.value) {
                    selectedAggregates.value = []
                }
            })

            const checkChange = (checkedArr: string[]) => {
                console.log('checked array: ', checkedArr)
            }

            const handleColumnChange = (
                columnQualifiedName: string,
                uniqueSubpanelString: string
            ) => {
                if (columnQualifiedName) {
                    const tableQualifiedName =
                        getTableQualifiedNameFromColumnQualifiedName(
                            columnQualifiedName
                        )
                    const addedBy = `joins-${uniqueSubpanelString}`
                    const copySelectedTables = JSON.parse(
                        JSON.stringify(toRaw(selectedTables.value))
                    )
                    const _index = copySelectedTables?.findIndex(
                        (table) =>
                            table.addedBy === `joins-${uniqueSubpanelString}`
                    )
                    const t = { ...copySelectedTables[_index] }
                    /* Already a tableName there for this subpanel field */
                    if (_index > -1) {
                        t.tableQualifiedName = tableQualifiedName
                        copySelectedTables.splice(_index, 1, t)
                    } else {
                        const _foundIndex = copySelectedTables.findIndex(
                            (table) =>
                                table.tableQualifiedName === tableQualifiedName
                        )
                        /* exception: Prevent inserting the 1st table again, if it is selected in join */
                        if (_foundIndex !== 0) {
                            copySelectedTables.push({
                                tableQualifiedName,
                                addedBy,
                            })
                        }
                    }

                    selectedTables.value = [...copySelectedTables]
                }

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
                const copySelectedTables = JSON.parse(
                    JSON.stringify(toRaw(selectedTables.value))
                )
                const subpanel = subpanels.value[index]

                const leftColumnQualifiedName =
                    subpanel?.columnsDataLeft?.columnQualifiedName
                const rightColumnQualifiedName =
                    subpanel?.columnsDataRight?.columnQualifiedName
                let addedBy: any = new Set()
                if (leftColumnQualifiedName)
                    addedBy.add(`joins-${subpanel.id}${index}1`)
                if (rightColumnQualifiedName)
                    addedBy.add(`joins-${subpanel.id}${index}2`)
                addedBy = Array.from(addedBy)
                let t: any = []
                t = copySelectedTables.filter(
                    (selectedTable) => !addedBy.includes(selectedTable.addedBy)
                )
                debugger
                selectedTables.value = t
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
                panelIndex,
                activeInlineTab,
                allowedTablesInJoinSelector,
                isSubpanelClosable,
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
    .grid-container {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
    }
    .item-1 {
        grid-column-start: 1;
        grid-column-end: 2;
        width: 126px;
    }
    .item-2 {
        flex: 0.5;
        flex-shrink: 0;
        white-space: nowrap;
        overflow: hidden;
    }
    .item-3 {
        flex: 0.5;
        flex-shrink: 0;
        white-space: nowrap;
        overflow: hidden;
    }
    .item-4 {
        width: 16px;
    }
</style>
