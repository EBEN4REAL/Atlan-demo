<template>
    <div :class="[' mx-3 pb-3']">
        <div class="">
            <template
                v-for="(subpanel, index) in subpanels"
                :key="subpanel?.id + index"
            >
                <div class="flex items-center w-full mb-3 pr-9">
                    <SingleTableMutliColumnSelector
                        v-if="
                            isJoinPanelStateDisabledComputed(
                                isJoinPanelDisabled,
                                selectedTables
                            )
                        "
                        class="flex-1"
                        :selectedItems="subpanel.columns"
                        :selectedTablesQualifiedNames="
                            activeInlineTab.playground.vqb.selectedTables
                        "
                        :disabled="readOnly"
                        :tableQualfiedName="
                            columnSubpanels[0]?.tableQualfiedName
                        "
                    >
                        <template #head>
                            <SingleTableMutliColumnSelectorHead
                                v-model:selectedItems="subpanel.columns"
                                v-model:selectedColumnsData="
                                    subpanel.columnsData
                                "
                                :disabled="readOnly"
                                :tableQualfiedName="
                                    columnSubpanels[0]?.tableQualfiedName
                                "
                            />
                        </template>
                        <template #body>
                            <SingleTableMutliColumnSelectorDropdown
                                v-model:selectedItems="subpanel.columns"
                                v-model:selectedColumnsData="
                                    subpanel.columnsData
                                "
                                :selectedTablesQualifiedNames="
                                    activeInlineTab.playground.vqb
                                        .selectedTables
                                "
                                :disabled="readOnly"
                                :tableQualfiedName="
                                    columnSubpanels[0]?.tableQualfiedName
                                "
                            />
                        </template>
                    </SingleTableMutliColumnSelector>

                    <MultiTableMutliColumnSelector
                        v-else
                        class="flex-1"
                        :disabled="readOnly"
                        :selectedItems="subpanel.columns"
                        :selectedTablesQualifiedNames="
                            activeInlineTab.playground.vqb.selectedTables
                        "
                    >
                        <template #head>
                            <MultiTableMutliColumnSelectorHead
                                :disabled="readOnly"
                                v-model:selectedItems="subpanel.columns"
                                v-model:selectedColumnsData="
                                    subpanel.columnsData
                                "
                                :selectedTables="
                                    activeInlineTab.playground.vqb
                                        .selectedTables
                                "
                            />
                        </template>
                        <template #body>
                            <MultiTableMutliColumnSelectorDropdown
                                :disabled="readOnly"
                                v-model:selectedItems="subpanel.columns"
                                v-model:selectedColumnsData="
                                    subpanel.columnsData
                                "
                                :selectedTablesQualifiedNames="
                                    activeInlineTab.playground.vqb
                                        .selectedTables
                                "
                            />
                        </template>
                    </MultiTableMutliColumnSelector>

                    <div
                        v-if="subpanel.tableQualfiedName && !readOnly"
                        class="text-gray-500 hover:text-primary"
                        @click="() => handleDelete(index)"
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
    import ColumnSelector from '../../columns/columnSelector/index.vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { SubpanelColumn } from '~/types/insights/VQBPanelColumns.interface'
    import { SubpanelGroupColumn } from '~/types/insights/VQBPanelGroups.interface'
    import { useVModels } from '@vueuse/core'
    import { generateUUID } from '~/utils/helper/generator'

    import MultiTableMutliColumnSelector from '~/components/insights/playground/editor/vqb/panels/common/multiColumns/multiTable/_index.vue'
    import MultiTableMutliColumnSelectorDropdown from '~/components/insights/playground/editor/vqb/panels/common/multiColumns/multiTable/dropdown.vue'
    import MultiTableMutliColumnSelectorHead from '~/components/insights/playground/editor/vqb/panels/common/multiColumns/multiTable/head.vue'

    import SingleTableMutliColumnSelector from '~/components/insights/playground/editor/vqb/panels/common/multiColumns/singleTable/_index.vue'
    import SingleTableMutliColumnSelectorDropdown from '~/components/insights/playground/editor/vqb/panels/common/multiColumns/singleTable/dropdown.vue'
    import SingleTableMutliColumnSelectorHead from '~/components/insights/playground/editor/vqb/panels/common/multiColumns/singleTable/head.vue'
    import { useJoin } from '~/components/insights/playground/editor/vqb/composables/useJoin'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            Pill,
            ColumnSelector,
            MultiTableMutliColumnSelector,
            MultiTableMutliColumnSelectorDropdown,
            MultiTableMutliColumnSelectorHead,
            SingleTableMutliColumnSelector,
            SingleTableMutliColumnSelectorDropdown,
            SingleTableMutliColumnSelectorHead,
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
            const { expand } = toRefs(props)
            const isJoinPanelDisabled = computed(() => {
                const joinPanel =
                    activeInlineTab.value.playground.vqb.panels.find(
                        (panel) => panel.id.toLowerCase() === 'join'
                    )
                return !joinPanel?.hide ? true : false
            })

            const filteredTablesValues = computed(() =>
                subpanels.value.map((subpanel) => subpanel.tableQualfiedName)
            )
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const { getDataTypeImage } = useColumn()
            const { isJoinPanelStateDisabledComputed } = useJoin()
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
                isJoinPanelDisabled,
                isJoinPanelStateDisabledComputed,
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
