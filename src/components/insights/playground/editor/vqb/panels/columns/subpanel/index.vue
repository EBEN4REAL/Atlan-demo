<template>
    <div :class="[' mx-3 mt-1 mb-4']">
        <div class="">
            <template
                v-for="(subpanel, index) in subpanels"
                :key="subpanel?.id + index"
            >
                <div class="flex items-center w-full mb-3">
                    <TableSelector
                        typeName="Table"
                        style="width: 30%"
                        v-model:modelValue="subpanel.tableQualfiedName"
                        @change="
                            () => hanldeTableQualifiedNameChange(val, index)
                        "
                    />
                    <ColumnSelector
                        style="width: 30%"
                        class="z-10"
                        v-model:selectedItems="subpanel.columns"
                        v-model:queryText="queryText"
                        :tableQualfiedName="subpanel.tableQualfiedName"
                    >
                        <template #chip="{ item }">
                            <div
                                class="flex items-center px-3 py-0.5 my-1 justify-center mr-2 text-xs text-gray-700 rounded-full bg-gray-light"
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
                                <span> {{ item.label }}</span>
                            </div>
                        </template>
                    </ColumnSelector>
                    <div
                        v-if="index !== 0"
                        class="text-gray-500 hover:text-primary"
                        @click.stop="() => handleDelete(index)"
                    >
                        <AtlanIcon
                            icon="Close"
                            class="w-6 h-6 ml-6 -mt-0.5 cursor-pointer"
                        />
                    </div>
                </div>
            </template>
        </div>
        <div
            class="flex items-center mt-3 cursor-pointer text-primary"
            @click.stop="handleAddPanel"
        >
            <AtlanIcon icon="Add" class="w-4 h-4 mr-1 -mt-0.5" />
            <span>Add another</span>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        watch,
        Ref,
        PropType,
        toRaw,
    } from 'vue'
    import Pill from '~/components/UI/pill/pill.vue'
    import { useColumn } from '~/components/insights/playground/editor/vqb/composables/useColumn'
    import TablesTree from '~/components/insights/playground/editor/vqb/dropdowns/tables/index.vue'
    import TableSelector from '../tableSelector/index.vue'
    import ColumnSelector from '../columnSelector/index.vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { SubpanelColumn } from '~/types/insights/VQBPanelColumns.interface'
    import { useVModels } from '@vueuse/core'
    import { generateUUID } from '~/utils/helper/generator'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            Pill,
            TablesTree,
            TableSelector,
            ColumnSelector,
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
        },

        setup(props, { emit }) {
            const { subpanels } = useVModels(props)
            const { expand } = toRefs(props)
            const { getDataTypeImage } = useColumn()
            const tableQualfiedName = ref(undefined)
            const queryText = ref('')
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
                    subpanels.value[index] = copySubPanel
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
                })
                subpanels.value = copySubPanels
            }

            const handleDelete = (index) => {
                subpanels.value.splice(index, 1)
            }

            return {
                handleDelete,
                handleAddPanel,
                hanldeTableQualifiedNameChange,
                subpanels,
                getDataTypeImage,
                queryText,
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
</style>
