<template>
    <div>
        <div
            @mouseover="handleMouseOver"
            @mouseout="handleMouseOut"
            :class="[
                expand
                    ? 'border-gray-300 rounded  border '
                    : 'border-white  rounded border ',
                containerHovered ? 'border-gray-300' : '',
            ]"
        >
            <div
                @click="toggleExpand"
                class="box-border relative flex items-center p-3 cursor-pointer"
            >
                <div class="mr-3">
                    <AtlanIcon
                        icon="ChevronRight"
                        :class="
                            expand
                                ? 'w-4 h-4 chevron rotate-90'
                                : 'w-4 h-4 chevron rotate-0'
                        "
                    />
                </div>
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center">
                        <div
                            class="flex items-center relative justify-center mr-2 bg-gray-100 border rounded-full p-1.5"
                            :class="[
                                isChecked
                                    ? 'text-gray-500 bg-gray-100 border border-gray-300'
                                    : 'text-gray-400 bg-gray-100 border border-gray-300',
                                isChecked && expand
                                    ? 'border-primary-focus bg-primary-light text-primary '
                                    : '',
                                'flex items-center justify-center mr-2  rounded-full p-1.5 ',
                            ]"
                            style="z-index: 2"
                        >
                            <span class="absolute text-sm -right-1 -top-2">
                                <AtlanIcon
                                    v-if="
                                        isFilterIsInteractive(
                                            activeInlineTab.playground.vqb
                                                .panels[index].subpanels
                                        )
                                    "
                                    icon="GlowFlash"
                                    class="w-4 h-4"
                            /></span>

                            <AtlanIcon
                                icon="FilterFunnel"
                                :class="[
                                    isChecked
                                        ? 'text-gray-500'
                                        : 'text-gray-400',
                                    isChecked && expand ? 'text-primary' : '',
                                    ' w-4 h-4 ',
                                ]"
                            />
                        </div>
                        <div class="">
                            <div
                                :class="[
                                    isChecked ? 'text-gray' : 'text-gray-500',
                                    'text-sm  ',
                                ]"
                            >
                                <div class="flex items-center">
                                    <div class="relative font-bold">Filter</div>
                                    <div
                                        v-if="!isChecked && expand"
                                        class="px-3 py-1 ml-2 text-gray-500 rounded-full bg-gray-light"
                                    >
                                        Disabled
                                    </div>
                                </div>
                            </div>

                            <div
                                :class="[
                                    isChecked
                                        ? 'text-gray-500'
                                        : 'text-gray-400 line-through',
                                    'text-xs truncate',
                                ]"
                                v-if="!expand"
                            >
                                <p
                                    :class="[
                                        isChecked
                                            ? 'text-gray-500'
                                            : 'text-gray-400 line-through',
                                        'text-xs truncate',
                                    ]"
                                    v-if="!expand"
                                >
                                    {{
                                        getSummarisedInfoOfFilterPanel(
                                            activeInlineTab.playground.vqb
                                                .panels[index].subpanels,
                                            activeInlineTab
                                        )
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="!readOnly"
                        :class="[
                            containerHovered ? 'opacity-100' : 'opacity-0',
                            'flex border border-gray-300 rounded   items-strech',
                        ]"
                    >
                        <div
                            class="px-3 py-1.5 border-gray-300 flex items-center justify-center border-r"
                            @click.stop="() => {}"
                        >
                            <a-checkbox
                                v-model:checked="
                                    activeInlineTab.playground.vqb.panels[index]
                                        .hide
                                "
                            ></a-checkbox>
                        </div>
                        <div
                            class="border-r border-gray-300"
                            v-if="
                                activeInlineTab.playground.vqb.panels.length -
                                    1 !==
                                Number(index)
                            "
                        >
                            <!-- Show dropdown except the last panel -->
                            <Actions
                                @add="
                                    (type, panel) =>
                                        handleAddPanel(index, type, panel)
                                "
                                v-model:submenuHovered="submenuHovered"
                                v-model:containerHovered="containerHovered"
                                :panelInfo="
                                    activeInlineTab.playground.vqb.panels[index]
                                "
                            />
                            <!-- ------------------------------ -->
                        </div>
                        <div class="border-r border-gray-300">
                            <AtlanBtn
                                @click.stop="() => handleDelete(index)"
                                class="flex-none border-none px-3.5 py-1 text-gray hover:text-red-500"
                                size="sm"
                                color="secondary"
                                padding="compact"
                            >
                                <AtlanIcon
                                    icon="Delete"
                                    class="-mx-1"
                                ></AtlanIcon>
                            </AtlanBtn>
                        </div>
                    </div>
                </div>

                <div
                    :class="[
                        expand
                            ? 'absolute bg-gray-300 opacity-0'
                            : 'absolute bg-gray-300 ',
                        containerHovered ? 'opacity-0' : '',
                    ]"
                    :style="`width: 1px; left: 55px; z-index: 1; ${findTimeLineHeight(
                        Number(index)
                    )}`"
                ></div>
            </div>
            <!-- Show on expand -->
            <keep-alive>
                <FilterSubPanel
                    v-model:subpanels="
                        activeInlineTab.playground.vqb.panels[index].subpanels
                    "
                    v-model:columnSubpanels="
                        activeInlineTab.playground.vqb.panels[0].subpanels
                    "
                    :expand="expand"
                    v-if="expand"
                />
            </keep-alive>
            <FooterActions
                @add="(type, panel) => handleAddPanel(index, type, panel)"
                :panelInfo="activeInlineTab.playground.vqb.panels[index]"
                v-if="
                    expand &&
                    activeInlineTab.playground.vqb.panels.length - 1 ===
                        Number(index) &&
                    !readOnly
                "
            />
        </div>
        <div
            @click.stop="() => {}"
            class="relative w-full h-4"
            v-if="
                Number(index) < activeInlineTab.playground.vqb.panels.length - 1
            "
        >
            <div
                class="absolute h-4 bg-gray-300 left-14"
                style="width: 1px; top: -1px"
            ></div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        toRefs,
        watch,
        ref,
        ComputedRef,
        Ref,
        inject,
        PropType,
        toRaw,
    } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { VQBPanelType } from '~/types/insights/VQB.interface'
    import Actions from '../action/index.vue'
    import FooterActions from '../action/footer.vue'
    import FilterSubPanel from './subpanel/index.vue'
    import { editor } from 'monaco-editor'

    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
    import { useCustomVariable } from '~/components/insights/playground/editor/common/composables/useCustomVariable'
    import { useFilter } from '~/components/insights/playground/editor/vqb/composables/useFilter'
    import VariableRender from './variableRender/index.vue'

    export default defineComponent({
        name: 'Aggregate',
        components: {
            FooterActions,
            Actions,
            AtlanBtn,
            FilterSubPanel,
            VariableRender,
        },
        props: {
            index: {
                type: String,
                required: true,
            },
            panel: {
                type: Object as PropType<VQBPanelType>,
                required: true,
            },
        },
        setup(props, { emit }) {
            const STRING_CHECK = 'ksdghkjsdhfksdfhkjsdhfkjshfkjshfkjhsfkjh'
            const { index, panel } = toRefs(props)
            const { totalFiledsMapWithInput, isFilterIsInteractive } =
                useFilter()
            const editorInstanceRef = inject(
                'editorInstance'
            ) as Ref<editor.IStandaloneCodeEditor>
            const monacoInstanceRef = inject('monacoInstance') as Ref<any>
            const editorInstance = toRaw(editorInstanceRef.value)
            const monacoInstance = toRaw(monacoInstanceRef.value)
            const { getSummarisedInfoOfFilterPanel } = useUtils()
            const { deleteVariable } = useCustomVariable(
                editorInstance,
                monacoInstance
            )
            const confirmDeletePopover = ref(false)
            const isChecked = computed(
                () =>
                    activeInlineTab.value.playground.vqb.panels[index.value]
                        .hide
            )
            const containerHovered = ref(false)
            const submenuHovered = ref(false)
            const actionPanel = ref(false)
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<string>
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const expand = ref(
                activeInlineTab.value.playground.vqb.panels[index.value]?.expand
            )
            watch(
                () => activeInlineTab.value.playground.vqb.panels,
                () => {
                    expand.value =
                        activeInlineTab.value.playground.vqb.panels[
                            index.value
                        ]?.expand
                }
            )
            const checkbox = ref(true)
            const { handleAdd, deletePanelsInVQB } = useVQB()

            const findTimeLineHeight = (index) => {
                if (
                    index ==
                        activeInlineTab.value.playground.vqb.panels.length -
                            1 &&
                    activeInlineTab.value.playground.vqb.panels.length === 1
                )
                    return 'height:0%;bottom:0'
                else if (index === 0) return 'height:55%;bottom:0'
                else if (
                    index ===
                    activeInlineTab.value.playground.vqb.panels.length - 1
                )
                    return 'height:55%;bottom:50%'
                else return 'height:104%;;bottom:0'
            }
            const handleAddPanel = (index, type, panel) => {
                handleAdd(
                    index,
                    type,
                    panel,
                    activeInlineTab,
                    activeInlineTabKey,
                    inlineTabs
                )
            }
            const handleDelete = (index) => {
                deletePanelsInVQB(Number(index), activeInlineTabKey, inlineTabs)
                /* Delete all the custom variables related to it */

                // get all custom variables related to this panel
                const subpanelIds = panel.value.subpanels.map(
                    (subpanel) => subpanel.id
                )
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
                                inlineTabs,
                                variable,
                                forceDelete
                            )
                    })
                } catch (e) {
                    console.error('Failed to delete custom variable')
                }
            }
            const toggleExpand = () => {
                expand.value = !expand.value
                activeInlineTab.value.playground.vqb.panels[
                    index.value
                ].expand =
                    !activeInlineTab.value.playground.vqb.panels[index.value]
                        .expand
            }
            const toggleActionPanel = () => {
                actionPanel.value = !actionPanel.value
            }
            const handleMouseOut = () => {
                if (containerHovered.value && !submenuHovered.value) {
                    containerHovered.value = false
                }
            }
            const handleMouseOver = () => {
                if (!containerHovered.value) containerHovered.value = true
            }

            const getPopoverContent = () => {
                let _customVariableCount = 0
                panel.value.subpanels.forEach((subpanel) => {
                    if (subpanel.filter.isVariable === true) {
                        _customVariableCount +=
                            totalFiledsMapWithInput[subpanel?.filter?.type]
                    }
                })

                return `Are you sure you want to delete?
                There are total of <b>${_customVariableCount} variable${
                    _customVariableCount > 1 ? '(s)' : ''
                } </b> associated with this panel
                 `
            }

            const toggleConfirmPopover = (_index) => {
                /* Check if there is alteast one custom variable which is associated with this filter panel
                    otherwise don't show the confirm popover */

                const index = panel.value.subpanels.findIndex(
                    (subpanel) => subpanel.filter.isVariable === true
                )
                if (index > -1) {
                    confirmDeletePopover.value = true
                } else {
                    handleDelete(_index)
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

            watch(
                activeInlineTab,
                () => {
                    console.log('updated data: ', activeInlineTab.value)
                },
                { immediate: true }
            )

            return {
                readOnly,
                isFilterIsInteractive,
                STRING_CHECK,
                toggleConfirmPopover,
                getPopoverContent,
                confirmDeletePopover,
                getSummarisedInfoOfFilterPanel,
                isChecked,
                submenuHovered,
                handleMouseOver,
                handleMouseOut,
                containerHovered,
                toggleActionPanel,
                actionPanel,
                toggleExpand,
                expand,
                activeInlineTab,
                index,
                checkbox,
                panel,
                handleDelete,
                handleAddPanel,
                findTimeLineHeight,
            }
        },
    })
</script>
<style lang="less" scoped>
    .chevron {
        transition: all ease 0.1s;
    }
    .rotate-90 {
        transform: rotate(-90deg);
    }
    .rotate-0 {
        transform: rotate(0deg);
    }
</style>
