<template>
    <div :class="[' mx-3 mt-1 mb-4 ']">
        <div class="">
            <template
                v-for="(subpanel, index) in subpanels"
                :key="subpanel?.id + index"
            >
                <div class="flex items-center mb-3">
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
                            >Where</span
                        >
                    </div>
                    <div class="w-full grid-container group">
                        <div class="item-1">
                            <ColumnSelector
                                class="flex-1"
                                v-model:selectedItem="subpanel.column"
                                :tableQualfiedName="
                                    columnSubpanels[0]?.tableQualfiedName
                                "
                                :disabled="readOnly"
                                :selectedTablesQualifiedNames="
                                    activeInlineTab.playground.vqb
                                        .selectedTables
                                "
                                @change="
                                    (val) =>
                                        handleColumnChange(val, index, subpanel)
                                "
                            />
                        </div>

                        <div class="item-2">
                            <FilterSelector
                                class="w-full"
                                :columnName="subpanel?.column?.label"
                                :columnType="subpanel?.column?.type"
                                v-model:selectedFilter="subpanel.filter"
                                :disabled="readOnly"
                                @change="() => handleFilterChange(subpanel)"
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
                                v-model:inputValue="subpanel.filter.value"
                            />

                            <RangeInput
                                v-if="subpanel?.filter?.type === 'range_input'"
                                class="flex-1 w-full"
                                :type="
                                    getInputTypeFromColumnType(
                                        subpanel?.column?.type
                                    )
                                "
                                v-model:inputValue="subpanel.filter.value"
                            />

                            <!--  -->
                            <div class="flex items-center text-gray-500">
                                <AtlanIcon
                                    v-if="
                                        isSubpanelClosable(subpanels) &&
                                        !readOnly
                                    "
                                    @click.stop="
                                        () => handleDelete(index, subpanel)
                                    "
                                    icon="Close"
                                    class="w-6 h-6 text-gray-500 opacity-0 ml-2 mt-0.5 cursor-pointer group-hover:opacity-100"
                                />
                                <!-- <div style="width: 32px" v-else></div> -->
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>

        <span
            v-if="!readOnly"
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
    import ColumnSelector from '../../common/columnSelector/index.vue'
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
                if (variables?.length > 0) {
                    variables.forEach((variable) => {
                        changeVariableTypeFromVQB(
                            activeInlineTab,
                            tabs,
                            variable,
                            val?.type?.toLowerCase() ?? 'string'
                        )
                    })
                }
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
                updateVQB(activeInlineTabKey, inlineTabs)

                // console.log('subpanels: ', copySubPanels)
            }
            const handleDelete = (index, subpanel) => {
                subpanels.value.splice(index, 1)
                updateVQB(activeInlineTabKey, inlineTabs)
                /* FIXME: This needed an improvment when variable is used more than one place
                right now it assuems that it present in only one place */
                const subpanelIds = [subpanel.id]
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
                try {
                    const forceDelete = true
                    // delete all the custom variables
                    variables.forEach((variable) => {
                        if (variable !== undefined)
                            deleteVariable(
                                activeInlineTab,
                                tabs,
                                variable,
                                forceDelete
                            )
                    })
                } catch (e) {
                    console.error('Failed to delete custom variable')
                }
            }
            const toggleVariableType = (currVal, index, subpanel) => {
                /* Check if variable already exists */
                const Varindex =
                    activeInlineTab.value.playground.editor.variables.findIndex(
                        (variable) => variable?.subpanelId === subpanel.id
                    )

                const Varindex2 =
                    activeInlineTab.value.playground.editor.variables.findIndex(
                        (variable) =>
                            variable?.subpanelId === `${subpanel.id}${2}`
                    )
                if (Varindex < 0) {
                    addVariableFromVQB(activeInlineTab, tabs, {
                        vqbPanelId: subpanel.id,
                        subpanelId: subpanel.id,
                        type: subpanel?.column?.type?.toLowerCase(),
                    })

                    /* If fileds are more than one, then it will have inputFiledValue 2 */
                    if (Varindex2 < 0) {
                        if (
                            totalFiledsMapWithInput[subpanel?.filter?.type] > 1
                        ) {
                            addVariableFromVQB(activeInlineTab, tabs, {
                                vqbPanelId: `${subpanel.id}${2}`,
                                subpanelId: `${subpanel.id}${2}`,
                                type: subpanel?.column?.type.toLowerCase(),
                            })
                        }
                    }
                }
                subpanels.value[index].filter.isVariable = !currVal
                showcustomVariablesToolBar.value = !currVal
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

            const handleFilterChange = (subpanel) => {
                /* If user moves from 1 field to 2 */
                if (
                    totalFiledsMapWithInput[subpanel?.filter?.type] > 1 &&
                    subpanel?.filter?.isVariable
                ) {
                    /* Check if 2nd field is there, if there then don't create otherwise create it */
                    /* Check if variable already exists */
                    /* If fileds are more than one, then it will have inputFiledValue 2 */
                    const Varindex2 =
                        activeInlineTab.value.playground.editor.variables.findIndex(
                            (variable) =>
                                variable?.subpanelId === `${subpanel.id}${2}`
                        )
                    if (Varindex2 < 0) {
                        addVariableFromVQB(activeInlineTab, tabs, {
                            vqbPanelId: `${subpanel.id}${2}`,
                            subpanelId: `${subpanel.id}${2}`,
                            type: subpanel?.column?.type.toLowerCase(),
                        })
                    }
                }

                /* FIXME: Delete only if there are no instance used in other subpanels */
                /* If user moves from 2 field to 1 then kill the 2nd variable */
                if (
                    totalFiledsMapWithInput[subpanel?.filter?.type] < 2 &&
                    subpanel?.filter?.isVariable
                ) {
                    /* Check if 2nd field is there*/
                    const Varindex2 =
                        activeInlineTab.value.playground.editor.variables.findIndex(
                            (variable) =>
                                variable?.subpanelId === `${subpanel.id}${2}`
                        )
                    if (Varindex2 > -1) {
                        let forceDelete = true
                        const variable = {
                            ...activeInlineTab.value.playground.editor
                                .variables[Varindex2],
                        }
                        deleteVariable(
                            activeInlineTab,
                            tabs,
                            variable,
                            forceDelete
                        )
                    }
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
    .grid-container {
        display: grid;
        grid-gap: 12px;
        grid-template-columns: 1fr 0.65fr 1.5fr;
    }
    .item-1 {
        grid-column-start: 1;
        grid-column-end: 2;
    }
    .item-2 {
        grid-column-start: 2;
        grid-column-end: 3;
    }
    .item-3 {
        grid-column-start: 3;
        grid-column-end: 4;
    }
    .item-4 {
        grid-column-start: 4;
        grid-column-end: 5;
    }
</style>
