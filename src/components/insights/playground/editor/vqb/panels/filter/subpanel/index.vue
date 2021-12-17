<template>
    <div :class="[' mx-3 mt-1 mb-4 ']">
        <div class="">
            <template
                v-for="(subpanel, index) in subpanels"
                :key="subpanel?.id + index"
            >
                <div class="flex items-center w-full mb-3 group">
                    <div style="width: 90px">
                        <FilterType
                            v-if="index !== 0"
                            v-model:filterType="subpanel.filter.filterType"
                        />
                        <span v-else class="flex flex-row-reverse text-gray-500"
                            >Where</span
                        >
                    </div>

                    <ColumnSelector
                        class="flex-1 ml-6"
                        v-model:selectedItem="subpanel.column"
                        style="max-width: 30%"
                        :tableQualfiedName="
                            columnSubpanels[0]?.tableQualfiedName
                        "
                        @change="(val) => handleColumnChange(val, index)"
                    />

                    <FilterSelector
                        class="ml-6"
                        style="min-width: 240px; max-width: 300px"
                        :columnName="subpanel?.column?.label"
                        :columnType="subpanel?.column?.type"
                        v-model:selectedFilter="subpanel.filter"
                    />

                    <Input
                        v-if="
                            subpanel?.filter?.type === 'input' &&
                            !subpanel?.filter?.isVariable
                        "
                        :selectedFilter="subpanel.filter"
                        class="flex-1 ml-6"
                        :type="
                            getInputTypeFromColumnType(subpanel?.column?.type)
                        "
                        v-model:inputValue="subpanel.filter.value"
                    />

                    <MultiInput
                        v-if="
                            subpanel?.filter?.type === 'multi_input' &&
                            !subpanel?.filter?.isVariable
                        "
                        class="flex-1 ml-6"
                        v-model:inputValue="subpanel.filter.value"
                    />

                    <RangeInput
                        v-if="
                            subpanel?.filter?.type === 'range_input' &&
                            !subpanel?.filter?.isVariable
                        "
                        class="flex-1 ml-6"
                        :type="
                            getInputTypeFromColumnType(subpanel?.column?.type)
                        "
                        v-model:inputValue="subpanel.filter.value"
                    />

                    <!-- Custom variable placeholder -->
                    <div
                        v-if="subpanel?.filter?.isVariable"
                        class="flex items-center flex-1 ml-6 border border-gray-300 rounded box-shadow focus:border-primary-focus focus:border-2 focus:outline-none"
                        style="height: 32px !important"
                    >
                        <code class="px-3 truncate">
                            <a-tooltip placement="bottomLeft">
                                <template #title
                                    >{{
                                        getInputTypeFromColumnType(
                                            subpanel?.column?.type
                                        )?.toUpperCase()
                                    }}:&nbsp;
                                    {{ getCustomVariable(subpanel.id).value }}
                                </template>
                                <div
                                    class="truncate cursor-pointer moustacheDecoration"
                                >
                                    {{ getCustomVariableText(subpanel.id) }}
                                </div>
                            </a-tooltip>
                        </code>
                    </div>
                    <!--  -->
                    <div class="flex items-center ml-3 text-gray-500">
                        <AtlanIcon
                            @click.stop="() => handleDelete(index)"
                            icon="Close"
                            class="w-6 h-6 mr-3 text-gray-500 opacity-0 mt-0.5 cursor-pointer group-hover:opacity-100"
                        />

                        <a-tooltip placement="bottomLeft">
                            <template #title
                                >Toggle this to change it to
                                {{
                                    subpanel?.filter?.isVariable
                                        ? 'input field'
                                        : 'custom variable'
                                }}
                            </template>
                            <div>
                                <AtlanIcon
                                    v-if="!subpanel?.filter?.isVariable"
                                    @click.stop="
                                        () =>
                                            toggleVariableType(
                                                false,
                                                index,
                                                subpanel
                                            )
                                    "
                                    icon="Flash"
                                    class="w-6 h-6 opacity-0 cursor-pointer mt-9px hover:text-yellow-400 group-hover:opacity-100"
                                />
                                <AtlanIcon
                                    v-else
                                    @click.stop="
                                        () =>
                                            toggleVariableType(
                                                true,
                                                index,
                                                subpanel
                                            )
                                    "
                                    icon="FlashColor"
                                    class="w-6 h-6 opacity-0 cursor-pointer mt-9px hover:text-yellow-400 group-hover:opacity-100"
                                />
                            </div>
                        </a-tooltip>
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
        inject,
        ComputedRef,
        Ref,
    } from 'vue'
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
    import { useFilter } from '~/components/insights/playground/editor/vqb/composables/useFilter'

    import RangeInput from '../filterComponents/rangeInput.vue'
    import { useCustomVariable } from '~/components/insights/playground/editor/common/composables/useCustomVariable'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { editor } from 'monaco-editor'

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
            const { getInputTypeFromColumnType } = useFilter()

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const showcustomVariablesToolBar = inject(
                'showcustomToolBar'
            ) as Ref<Boolean>
            const editorInstanceRef = inject(
                'editorInstance'
            ) as Ref<editor.IStandaloneCodeEditor>
            const monacoInstanceRef = inject('monacoInstance') as Ref<any>
            const editorInstance = toRaw(editorInstanceRef.value)
            const monacoInstance = toRaw(monacoInstanceRef.value)
            const {
                addVariableFromVQB,
                getCustomVaribleByVQBFilterSubpanelId,
            } = useCustomVariable(editorInstance, monacoInstance)
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>

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
                copySubPanel.filter.value = undefined
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
                        isVariable: false,
                    },
                })
                subpanels.value = copySubPanels

                // console.log('subpanels: ', copySubPanels)
            }
            const handleDelete = (index) => {
                subpanels.value.splice(index, 1)
            }
            const toggleVariableType = (currVal, index, subpanel) => {
                const Varindex =
                    activeInlineTab.value.playground.editor.variables.findIndex(
                        (variable) => variable?.subpanelId === subpanel.id
                    )
                if (Varindex < 0) {
                    addVariableFromVQB(activeInlineTab, tabs, {
                        vqbPanelId: 'filter',
                        subpanelId: subpanel.id,
                    })
                }
                subpanels.value[index].filter.isVariable = !currVal
                showcustomVariablesToolBar.value = !currVal
            }

            const changeColumn = (column) => {
                console.log('columns: ', column)
            }
            const getCustomVariableText = (id) => {
                const variable = getCustomVaribleByVQBFilterSubpanelId(
                    id,
                    activeInlineTab
                )
                if (variable) {
                    return `{{${variable.name}}}`
                } else return false
            }
            const getCustomVariable = (id) => {
                return getCustomVaribleByVQBFilterSubpanelId(
                    id,
                    activeInlineTab
                )
            }

            let hoverItem = ref(null)

            return {
                getCustomVariable,
                getCustomVariableText,
                toggleVariableType,
                getInputTypeFromColumnType,
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
    .mt-9px {
        margin-top: 9px;
    }
</style>
