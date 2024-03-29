<template>
    <div :class="[' mx-3 pb-3 ']">
        <div class="">
            <template
                v-for="(subpanel, index) in subpanels"
                :key="subpanel?.id + index"
            >
                <div class="flex items-center mb-1">
                    <div
                        class="flex items-center justify-end mr-3 item-1"
                        style="min-width: 91px"
                    >
                        <FilterType
                            class=""
                            v-if="index !== 0"
                            v-model:filterType="subpanel.filter.filterType"
                            :disabled="readOnly"
                        />
                        <span v-else class="flex flex-row-reverse text-gray-500"
                            >WHERE</span
                        >
                    </div>
                    <div class="w-full grid-container group">
                        <div class="item-1">
                            <ColumnSelector
                                class="flex-1"
                                v-model:selectedColumn="subpanel.column"
                                :disabled="readOnly"
                                :tableQualifiedName="
                                    columnSubpanels[0]?.tableQualfiedName
                                "
                                :selectedTablesQualifiedNames="
                                    activeInlineTab.playground.vqb
                                        .selectedTables
                                "
                            >
                                <template #head>
                                    <ColumnSelectorHead
                                        v-model:selectedColumn="subpanel.column"
                                        :selectedTables="
                                            activeInlineTab.playground.vqb
                                                .selectedTables
                                        "
                                    />
                                </template>

                                <template #body>
                                    <ColumnSelectorDropdown
                                        v-model:selectedColumn="subpanel.column"
                                        :disabled="readOnly"
                                        :tableQualifiedName="
                                            columnSubpanels[0]
                                                ?.tableQualfiedName
                                        "
                                        :selectedTablesQualifiedNames="
                                            activeInlineTab.playground.vqb
                                                .selectedTables
                                        "
                                        @change="
                                            (val) =>
                                                handleColumnChange(
                                                    val,
                                                    index,
                                                    subpanel
                                                )
                                        "
                                    />
                                </template>
                            </ColumnSelector>
                        </div>

                        <div class="item-2" style="min-width: 120px">
                            <!-- Will appear when there is only one column -->
                            <div class="flex items-center text-gray-500">
                                <AtlanIcon
                                    v-if="
                                        isSubpanelClosable(subpanels) &&
                                        !readOnly &&
                                        !subpanel?.filter?.type
                                    "
                                    @click.stop="
                                        () => handleDelete(index, subpanel)
                                    "
                                    icon="Close"
                                    class="w-6 h-6 text-gray-500 opacity-0 mt-0.5 cursor-pointer group-hover:opacity-100"
                                />
                                <div style="width: 32px" v-else></div>
                            </div>
                            <!-- ------------ -->
                            <FilterSelector
                                class="w-full"
                                v-if="subpanel?.filter?.type"
                                :columnName="subpanel?.column?.label"
                                :columnType="subpanel?.column?.type"
                                v-model:selectedFilter="subpanel.filter"
                                :disabled="
                                    readOnly && !subpanel?.filter?.isVariable
                                "
                                @change="
                                    () => handleFilterChange(subpanel, index)
                                "
                            />
                        </div>

                        <div class="flex item-3">
                            <Input
                                v-if="subpanel?.filter?.type === 'input'"
                                :selectedFilter="subpanel.filter"
                                :subpanel="subpanel"
                                v-model:subpanels="subpanels"
                                :index="index"
                                class="flex-1 w-full"
                                :type="
                                    getInputTypeFromColumnType(
                                        subpanel?.column?.type
                                    )
                                "
                                v-model:inputValue="subpanel.filter.value"
                            />

                            <MultiInput
                                v-if="subpanel?.filter?.type === 'multi_input'"
                                class="flex-1 w-full"
                                :selectedFilter="subpanel.filter"
                                :subpanel="subpanel"
                                v-model:subpanels="subpanels"
                                :index="index"
                                v-model:inputValue="subpanel.filter.value"
                            />

                            <RangeInput
                                v-if="subpanel?.filter?.type === 'range_input'"
                                class="flex-1 w-full"
                                :selectedFilter="subpanel.filter"
                                :subpanel="subpanel"
                                v-model:subpanels="subpanels"
                                :index="index"
                                :type="
                                    getInputTypeFromColumnType(
                                        subpanel?.column?.type
                                    )
                                "
                                v-model:inputValue="subpanel.filter.value"
                            />

                            <!-- Will appear when there are 3 columns visible on screen -->
                            <div class="flex items-center text-gray-500">
                                <AtlanIcon
                                    v-if="
                                        isSubpanelClosable(subpanels) &&
                                        !readOnly &&
                                        subpanel?.filter?.type
                                    "
                                    @click.stop="
                                        () => handleDelete(index, subpanel)
                                    "
                                    icon="Close"
                                    class="w-6 h-6 text-gray-500 opacity-0 ml-2 mt-0.5 cursor-pointer group-hover:opacity-100"
                                />
                                <div style="width: 32px" v-else></div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <span
            v-if="!readOnly"
            class="items-center mt-3 cursor-pointer text-primary"
            @click="handleAddPanel"
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
        computed,
        toRefs,
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
    import ColumnSelector from '~/components/insights/playground/editor/vqb/panels/common/multiSelect/index.vue'
    import ColumnSelectorDropdown from '~/components/insights/playground/editor/vqb/panels/common/multiSelect/dropdown.vue'
    import ColumnSelectorHead from '~/components/insights/playground/editor/vqb/panels/common/multiSelect/head.vue'
    import Input from '../filterComponents/input.vue'
    import MultiInput from '../filterComponents/multiInput.vue'
    import FilterType from '../filterComponents/filterType.vue'
    import { useFilter } from '~/components/insights/playground/editor/vqb/composables/useFilter'

    import RangeInput from '../filterComponents/rangeInput.vue'
    import { useCustomVariable } from '~/components/insights/playground/editor/common/composables/useCustomVariable'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { editor } from 'monaco-editor'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'

    export default defineComponent({
        name: 'Sub panel',
        components: {
            FilterSelector,
            ColumnSelector,
            MultiInput,
            FilterType,
            RangeInput,
            Input,
            ColumnSelectorDropdown,
            ColumnSelectorHead,
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
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
        },

        setup(props, { emit }) {
            const selectedAggregates = ref([])
            const selectedColumn = ref({})
            const { isSubpanelClosable } = useUtils()
            const { disabled } = toRefs(props)
            const { getInputTypeFromColumnType, totalFiledsMapWithInput } =
                useFilter()

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<activeInlineTabInterface>

            const inlineTabs = inject(
                'inlineTabs'
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
                deleteVariable,
                changeVariableTypeFromVQB,
                addVariableFromVQB,
                getCustomVaribleByVQBFilterSubpanelId,
            } = useCustomVariable(editorInstance, monacoInstance)
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>

            const { updateVQB } = useVQB()

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

            const handleColumnChange = (val, index, subpanel) => {
                console.log('col change: ', val)

                const copySubPanel = JSON.parse(
                    JSON.stringify(toRaw(subpanels.value[index]))
                )
                copySubPanel.column = val
                /* 
                {"filterType":"and","value":"__vue_devtool_undefined__","name":"equal","type":"input","title":"Equal to"} */
                copySubPanel.filter.value = undefined
                copySubPanel.filter.name = 'equal'
                copySubPanel.filter.title = 'Equal to'
                copySubPanel.filter.type = 'input'

                // copySubPanel.filter = {}

                subpanels.value[index] = copySubPanel
                // console.log(subpanels.value)

                /* If there are custom variables change there types */

                // get all custom variables related to this panel
                const subpanelIds = subpanels.value
                    .filter((subpanel) => subpanel.id === copySubPanel.id)
                    .map((_subpanel) => _subpanel.id)

                let variables: any = []
                activeInlineTab.value.playground.editor.variables.map(
                    (_variable) => {
                        subpanelIds.forEach((subpanelId) => {
                            if (_variable?.subpanelId?.includes(subpanelId)) {
                                variables.push(_variable)
                            }
                        })
                    }
                )
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
                updateVQB(activeInlineTab, inlineTabs)

                // console.log('subpanels: ', copySubPanels)
            }
            const handleDelete = (index, subpanel) => {
                subpanels.value.splice(index, 1)
                updateVQB(activeInlineTab, inlineTabs)
            }

            const changeColumn = (column) => {
                console.log('columns: ', column)
            }

            /* If any subpanel have more than one filed i,e = 2 then the second filed id 
            will be panelid+inputFiledNum eg: filter2 ( second filed Id).
            otherwise field will have id as same as panelid eg: filter
             */

            const getCustomVariableText = (
                subpanel,
                inputFieldNum?: number
            ) => {
                let subpanelId = subpanel.id
                if (inputFieldNum) {
                    subpanelId = `${subpanelId}${inputFieldNum}`
                }
                const variable = getCustomVaribleByVQBFilterSubpanelId(
                    subpanelId,
                    activeInlineTab
                )
                if (variable) {
                    return `{{${variable.name}}}`
                } else return false
            }

            /* If any subpanel have more than one filed i,e = 2 then the second filed id 
            will be panelid+inputFiledNum eg: filter2 ( second filed Id).
            otherwise field will have id as same as panelid eg: filter
             */
            const getCustomVariable = (subpanel, inputFieldNum?: number) => {
                let subpanelId = subpanel.id
                if (inputFieldNum) {
                    subpanelId = `${subpanelId}${inputFieldNum}`
                }
                return getCustomVaribleByVQBFilterSubpanelId(
                    subpanelId,
                    activeInlineTab
                )
            }

            const handleFilterChange = (subpanel, index) => {
                // A null check
                if (
                    subpanel.filter.type === 'multi_input' &&
                    typeof subpanel.filter.value !== 'object'
                ) {
                    subpanels.value[index].filter.value = [
                        subpanel.filter.value,
                    ]
                }
            }

            let hoverItem = ref(null)

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
                disabled,
                readOnly,
                isSubpanelClosable,
                activeInlineTab,
                handleFilterChange,
                totalFiledsMapWithInput,
                getCustomVariable,
                getCustomVariableText,
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
    .collapse-smooth-enter-active {
        transition: all 0.2s ease;
    }
    .collapse-smooth-leave-active {
        transition: all 0.2s ease;
    }
    // .collapse-smooth-enter-from {
    //     height: 0px;
    // }
    .collapse-smooth-leave-from {
        height: 80px !important;
        opacity: 1;
    }

    .collapse-smooth-leave-to {
        // transform: translateX(20px);
        height: 0px !important;
        opacity: 0;
    }
    .border-shift-plus {
        padding: 1px;
    }
    .border-shift-minus {
        padding: 0px;
    }
    .mt-9px {
        margin-top: 9px;
    }
    .grid-container {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
    }
    .item-1 {
        flex: 0.35;
        flex-shrink: 0;
        padding: 0px 2px 6px 2px;
        white-space: nowrap;
        overflow: hidden;
    }
    .item-2 {
        flex: 0.2;
        flex-shrink: 0;
        padding: 2px 2px 6px 2px;
        white-space: nowrap;
        overflow: hidden;
    }
    .item-3 {
        flex: 0.45;
        flex-shrink: 0;
        padding: 2px 2px 6px 2px;
        white-space: nowrap;
        overflow-y: auto;
        overflow-x: hidden;
    }
</style>
