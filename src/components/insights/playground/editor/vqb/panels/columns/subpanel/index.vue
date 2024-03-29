<template>
    <div :class="[' mx-3 pb-3']">
        <div class="">
            <template
                v-for="(subpanel, index) in subpanels"
                :key="subpanel?.id + index"
            >
                <div class="flex items-start w-full mb-3 pr-9">
                    <TableSelector class="flex-1" :disabled="readOnly">
                        <template #head>
                            <TableSelectorHead
                                :modelValue="subpanel.tableQualfiedName"
                                :selectedTableData="subpanel.tableData"
                                :disabled="readOnly"
                            />
                        </template>
                        <template #body>
                            <TableSelectorDropdown
                                class="flex-1"
                                v-model:modelValue="subpanel.tableQualfiedName"
                                v-model:selectedTableData="subpanel.tableData"
                                :disabled="readOnly"
                                :selectedItem="{}"
                                @change="
                                    (val) =>
                                        hanldeTableQualifiedNameChange(
                                            val,
                                            index
                                        )
                                "
                            />
                        </template>
                    </TableSelector>
                </div>
            </template>
        </div>
        <!-- <span
            class="items-center mt-3 cursor-pointer text-primary"
            @click.stop="handleAddPanel"
        >
            <AtlanIcon icon="Add" class="w-4 h-4 mr-1 -mt-0.5" />
            <span>Add another</span>
        </span> -->
    </div>
</template>

<script lang="ts">
    import {
        ComputedRef,
        defineComponent,
        ref,
        toRefs,
        watch,
        inject,
        Ref,
        computed,
        onUpdated,
        PropType,
        toRaw,
    } from 'vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { SubpanelColumn } from '~/types/insights/VQBPanelColumns.interface'
    import { useVModels } from '@vueuse/core'
    import { generateUUID } from '~/utils/helper/generator'
    import { selectedTables } from '~/types/insights/VQB.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import TableSelector from '~/components/insights/playground/editor/vqb/panels/common/tableSelector/_index.vue'
    import TableSelectorDropdown from '~/components/insights/playground/editor/vqb/panels/common/tableSelector/dropdown.vue'
    import TableSelectorHead from '~/components/insights/playground/editor/vqb/panels/common/tableSelector/head.vue'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            Pill,
            TableSelector,
            TableSelectorDropdown,
            TableSelectorHead,
        },
        props: {
            expand: {
                type: Boolean,
                required: true,
                default: false,
            },
            subpanels: {
                type: Object as PropType<SubpanelColumn[]>,
                required: true,
                default: [],
            },
            selectedTables: {
                type: Object as PropType<selectedTables>,
                required: true,
                default: [],
            },
        },

        setup(props, { emit }) {
            const { subpanels, selectedTables } = useVModels(props)
            const { expand } = toRefs(props)
            const filteredTablesValues = computed(() =>
                subpanels.value.map((subpanel) => subpanel.tableQualfiedName)
            )
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const { getDataTypeImage } = useColumn()
            const { assetType, certificateStatus } = useAssetInfo()
            const tableQualfiedName = ref(undefined)

            const cols = ref([])
            watch(tableQualfiedName, () => {
                if (!tableQualfiedName.value) {
                    cols.value = []
                }
            })
            const hanldeTableQualifiedNameChange = (item, index) => {
                if (!item.value) {
                    const copySubPanel = JSON.parse(
                        JSON.stringify(toRaw(subpanels.value[0]))
                    )
                    copySubPanel.columns = []
                    copySubPanel.columnsData = []
                    copySubPanel.tableQualfiedName = undefined
                    copySubPanel.tableData = {
                        certificateStatus: undefined,
                        assetType: undefined,
                        item: {},
                    }

                    subpanels.value[index] = copySubPanel
                    console.log(subpanels.value)
                } else {
                    const copySelectedTables: selectedTables[] = JSON.parse(
                        JSON.stringify(toRaw(selectedTables.value))
                    )
                    // removed the very first tableQualfiedName
                    if (copySelectedTables.length > 0)
                        copySelectedTables.shift()

                    copySelectedTables.unshift({
                        tableQualifiedName:
                            subpanels.value[0].tableQualfiedName,
                        addedBy: 'column',
                    })

                    const copySubPanel = JSON.parse(
                        JSON.stringify(toRaw(subpanels.value[0]))
                    )
                    // pre populate all columns selection
                    copySubPanel.columns = ['all']

                    copySubPanel.columnsData = []
                    copySubPanel.tableData.certificateStatus =
                        certificateStatus(item)
                    copySubPanel.tableData.assetType = assetType(item)

                    subpanels.value[index] = copySubPanel
                    selectedTables.value = copySelectedTables
                    console.log(subpanels.value)
                }
            }

            const handleAddPanel = () => {
                const copySubPanels: SubpanelColumn[] = JSON.parse(
                    JSON.stringify(toRaw(subpanels.value))
                )
                copySubPanels.push({
                    id: generateUUID(),
                    tableQualfiedName: undefined,
                    columns: [],
                    columnsData: [],
                })
                subpanels.value = copySubPanels
            }

            const handleDelete = (index) => {
                if (index == 0) {
                    const copySubPanel = JSON.parse(
                        JSON.stringify(toRaw(subpanels.value[0]))
                    )
                    copySubPanel.columns = []
                    copySubPanel.tableQualfiedName = undefined
                    subpanels.value[index] = copySubPanel
                } else {
                    subpanels.value.splice(index, 1)
                }
            }
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
                filteredTablesValues,
                activeInlineTab,
                handleDelete,
                handleAddPanel,
                hanldeTableQualifiedNameChange,
                subpanels,
                getDataTypeImage,
                tableQualfiedName,
                cols,
            }
        },
    })
</script>
<style lang="less" scoped>
    .border-shift-plus {
        padding: 13px;
    }
    .border-shift-minus {
        padding: 12px;
    }
    .custom-shadow {
        box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
    }
    .width-50 {
        max-width: 50%;
    }
</style>
