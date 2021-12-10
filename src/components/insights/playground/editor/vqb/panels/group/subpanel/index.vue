<template>
    <div :class="[' mx-3 mt-1 mb-4']">
        <div class="">
            <template
                v-for="(subpanel, index) in subpanels"
                :key="subpanel?.id + index"
            >
                <!-- {{ subpanel }} -->
                <div class="flex items-center w-full mb-3">
                    <!-- <div class="flex-1 border rounded h-14"> -->
                    <!-- <div class="flex flex-wrap items-center w-full"> -->
                    <!-- <template v-for="item in subpanel.columnsData">
                                <div
                                    class="flex items-center justify-center px-3 py-1.5 ml-2 text-xs text-gray-700 truncate border rounded-full"
                                    @mouseover="hoverPill = item?.label"
                                    @mouseout="hoverPill = null"
                                    :class="
                                        hoverPill === item?.label
                                            ? 'bg-primary text-white'
                                            : ''
                                    "
                                >
                                    <component
                                        :is="getDataTypeImage(item?.type)"
                                        class="flex-none w-4 h-4 mr-1 text-xs"
                                        :class="
                                            hoverPill === item?.label
                                                ? 'text-white'
                                                : 'text-gray-500'
                                        "
                                    ></component>
                                    <div
                                        class="truncate ... overflow-ellipsis overflow-hidden -mb-0.5"
                                        :class="
                                            hoverPill === item?.label
                                                ? 'bg-primary text-white'
                                                : ''
                                        "
                                    >
                                        {{ item.label }}
                                    </div>
                                </div>
                            </template> -->
                    <!-- <a-popover trigger="click" placement="bottomLeft">
                                <div
                                    v-if="subpanel?.columnsData?.length === 0"
                                    class="flex items-center justify-center w-full text-gray-500 h-14"
                                >
                                    click here to add columns to group column
                                    results
                                </div>
                                <div
                                    v-else
                                    class="flex-1 w-full ant-dropdown-link h-14"
                                ></div>
                                <template #content>
                                    <ColumnSelector
                                        style="width: 300px; margin-top: -20px"
                                        v-model:selectedItems="subpanel.columns"
                                        v-model:selectedColumnsData="
                                            subpanel.columnsData
                                        "
                                        :tableQualfiedName="
                                            columnSubpanels[0]
                                                ?.tableQualfiedName
                                        "
                                    />
                                </template>
                            </a-popover> -->
                    <!-- </div> -->
                    <ColumnSelector
                        class="h-9"
                        style="min-width: 30%"
                        v-model:selectedItems="subpanel.columns"
                        v-model:selectedColumnsData="subpanel.columnsData"
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
                    <!-- </div> -->
                    <!-- </div> -->

                    <div
                        v-if="subpanel.tableQualfiedName"
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

    export default defineComponent({
        name: 'Sub panel',
        components: {
            Pill,
            TablesTree,
            ColumnSelector,
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
            const filteredTablesValues = computed(() =>
                subpanels.value.map((subpanel) => subpanel.tableQualfiedName)
            )
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const { getDataTypeImage } = useColumn()
            const tableQualfiedName = ref(undefined)

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

            return {
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
