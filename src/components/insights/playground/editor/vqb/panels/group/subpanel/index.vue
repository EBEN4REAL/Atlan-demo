<template>
    <div :class="[' mx-3 mt-1 mb-4']">
        <div class="">
            <template
                v-for="(subpanel, index) in subpanels"
                :key="subpanel?.id + index"
            >
                <div class="flex items-center w-full mb-3 pr-9">
                    <ColumnSelector
                        v-if="selectedTables.length < 2"
                        class="flex-1 h-9"
                        v-model:selectedItems="subpanel.columns"
                        :showSelectAll="false"
                        v-model:selectedColumnsData="subpanel.columnsData"
                        :selectedTablesQualifiedNames="
                            activeInlineTab.playground.vqb.selectedTables
                        "
                        :disabled="readOnly"
                        :tableQualfiedName="
                            columnSubpanels[0]?.tableQualfiedName
                        "
                    >
                        <template #chip="{ item }">
                            <div
                                class="flex items-center px-3 py-0.5 truncate justify-center mr-2 text-xs text-gray-700 rounded-full bg-gray-light"
                            >
                                <component
                                    v-if="item.type !== 'Columns'"
                                    :is="getDataTypeImage(item.type)"
                                    class="flex-none -mt-0.5 h-4 w-4 text-xs text-gray-500 mr-1"
                                ></component>
                                <AtlanIcon
                                    v-else
                                    icon="Columns"
                                    class="w-4 h-4 mr-1 text-xs text-gray-500"
                                />
                                <div
                                    class="truncate ... overflow-ellipsis overflow-hidden"
                                >
                                    {{ item.label }}
                                </div>
                            </div>
                        </template>
                    </ColumnSelector>
                    <TreeColumnSelector
                        v-else
                        class="flex-1"
                        :showColumnWithTable="false"
                        style="max-width: 30%"
                        :disabled="readOnly"
                        v-model:selectedColumn="subpanel.columnsDataLeft"
                        v-model:selectedItems="subpanel.columns"
                        v-model:selectedColumnsData="subpanel.columnsData"
                        :selectedTablesQualifiedNames="
                            activeInlineTab.playground.vqb.selectedTables
                        "
                    >
                        <template #chip="{ item }">
                            <div
                                class="flex cursor-pointer items-center px-3 py-0.5 truncate justify-center mr-2 text-xs text-gray-700 rounded-full bg-gray-light"
                            >
                                <component
                                    v-if="item.type !== 'Columns'"
                                    :is="getDataTypeImage(item.type)"
                                    class="flex-none -mt-0.5 h-4 w-4 text-xs text-gray-500 mr-1"
                                ></component>
                                <AtlanIcon
                                    v-else
                                    icon="Columns"
                                    class="w-4 h-4 mr-1 text-xs text-gray-500"
                                />

                                <a-tooltip>
                                    <template #title>
                                        <div>
                                            {{
                                                `TABLE: ${getTableName(
                                                    item.columnsQualifiedName
                                                )}`
                                            }}
                                        </div>
                                    </template>

                                    <div
                                        class="truncate ... overflow-ellipsis overflow-hidden"
                                    >
                                        {{ item.label }}
                                    </div>
                                </a-tooltip>
                            </div>
                        </template>
                    </TreeColumnSelector>

                    <div
                        v-if="subpanel.tableQualfiedName && !readOnly"
                        class="text-gray-500 hover:text-primary"
                        @click.stop="() => handleDelete(index)"
                    >
                        <AtlanIcon
                            icon="Close"
                            class="w-6 h-6 ml-3 -mt-0.5 cursor-pointer"
                        />
                    </div>
                </div>
            </template>
        </div>
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
        PropType,
        toRaw,
    } from 'vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import TablesTree from '~/components/insights/playground/editor/vqb/dropdowns/tables/index.vue'
    import ColumnSelector from '../../columns/columnSelector/index.vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { SubpanelColumn } from '~/types/insights/VQBPanelColumns.interface'
    import { SubpanelGroupColumn } from '~/types/insights/VQBPanelGroups.interface'
    import { useVModels } from '@vueuse/core'
    import { generateUUID } from '~/utils/helper/generator'
    import { selectedTables } from '~/types/insights/VQB.interface'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'

    import TreeColumnSelector from '~/components/insights/playground/editor/vqb/panels/common/multipleColumnTreeSelector/index.vue'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            Pill,
            TablesTree,
            ColumnSelector,
            TreeColumnSelector,
        },
        props: {
            expand: {
                type: Boolean,
                required: true,
                default: false,
            },
            subpanels: {
                type: Object as PropType<SubpanelGroupColumn[]>,
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
            const { subpanels, columnSubpanels } = useVModels(props)
            const { getTableName } = useUtils()
            const { expand } = toRefs(props)
            const filteredTablesValues = computed(() =>
                subpanels.value.map((subpanel) => subpanel.tableQualfiedName)
            )
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const { getDataTypeImage } = useColumn()
            const tableQualfiedName = ref(undefined)
            const selectedTables = computed(() => {
                return activeInlineTab.value.playground.vqb.selectedTables
            })

            const cols = ref([])
            watch(tableQualfiedName, () => {
                if (!tableQualfiedName.value) {
                    cols.value = []
                }
            })
            const hanldeTableQualifiedNameChange = (val, index) => {
                if (!val) {
                    const copySubPanel = JSON.parse(
                        JSON.stringify(toRaw(subpanels.value[0]))
                    )
                    copySubPanel.columns = []
                    copySubPanel.tableQualfiedName = undefined
                    subpanels.value[index] = copySubPanel
                    console.log(subpanels.value)
                }
            }

            const handleAddPanel = () => {
                const copySubPanels: SubpanelGroupColumn[] = JSON.parse(
                    JSON.stringify(toRaw(subpanels.value))
                )
                const uuid = generateUUID()
                copySubPanels.push({
                    id: uuid,
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

            let hoverPill = ref(null)
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
                getTableName,
                selectedTables,
                filteredTablesValues,
                activeInlineTab,
                handleDelete,
                handleAddPanel,
                hanldeTableQualifiedNameChange,
                subpanels,
                getDataTypeImage,
                tableQualfiedName,
                cols,
                columnSubpanels,
                hoverPill,
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
</style>
