<template>
    <div>
        <div @mouseover="handleMouseOver" @mouseout="handleMouseOut">
            <div
                @click.self="toggleExpand"
                class="box-border relative flex items-center p-3 cursor-pointer"
            >
                <div
                    class="flex items-center justify-between w-full"
                    @click="toggleExpand"
                >
                    <div class="flex items-center">
                        <div
                            class="flex items-center justify-center mr-2 rounded-md p-1.5"
                            :class="[
                                expand ? 'bg-primary-light' : 'bg-gray-100',
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
                                    isChecked ? 'text-gray' : 'text-gray-400',
                                    isChecked && expand ? 'text-primary' : '',
                                    'w-4 h-4',
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
                                        class="px-3 ml-2 text-gray-500 rounded-full bg-gray-light"
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
                                    'text-xs',
                                ]"
                                v-if="!expand"
                            >
                                <p
                                    :class="[
                                        isChecked
                                            ? 'text-gray-500'
                                            : 'text-gray-400 line-through',
                                        'text-xs break-words line-clamp-2',
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
                            class="flex items-center justify-center px-3 border-r border-gray-300"
                            @click.stop="() => {}"
                        >
                            <a-tooltip
                                placement="top"
                                :title="
                                    activeInlineTab.playground.vqb.panels[index]
                                        .hide
                                        ? 'Disable step'
                                        : 'Enable step'
                                "
                            >
                                <a-checkbox
                                    v-model:checked="
                                        activeInlineTab.playground.vqb.panels[
                                            index
                                        ].hide
                                    "
                                    @change="handleCheckboxChange"
                                ></a-checkbox>
                            </a-tooltip>
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
                            <a-tooltip placement="top" title="Add step">
                                <Actions
                                    @add="
                                        (type, panel) =>
                                            handleAddPanel(index, type, panel)
                                    "
                                    v-model:submenuHovered="submenuHovered"
                                    v-model:containerHovered="containerHovered"
                                    :panelInfo="
                                        activeInlineTab.playground.vqb.panels[
                                            index
                                        ]
                                    "
                                />
                            </a-tooltip>
                            <!-- ------------------------------ -->
                        </div>
                        <div class="border-r border-gray-300">
                            <a-tooltip placement="top" title="Delete step">
                                <AtlanBtn
                                    @click.stop="() => handleDelete(index)"
                                    class="flex-none border-none px-3.5 text-gray hover:text-red-500"
                                    size="sm"
                                    color="secondary"
                                    padding="compact"
                                >
                                    <AtlanIcon
                                        icon="Delete"
                                        class="-mx-1"
                                    ></AtlanIcon>
                                </AtlanBtn>
                            </a-tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Show on expand -->
            <keep-alive>
                <transition name="collapse-smooth">
                    <FilterSubPanel
                        v-model:subpanels="
                            activeInlineTab.playground.vqb.panels[index]
                                .subpanels
                        "
                        v-model:columnSubpanels="
                            activeInlineTab.playground.vqb.panels[0].subpanels
                        "
                        :expand="expand"
                        v-if="expand"
                    />
                </transition>
            </keep-alive>
            <!-- <FooterActions
                v-model:submenuHovered="submenuHovered"
                v-model:containerHovered="containerHovered"
                @add="(type, panel) => handleAddPanel(index, type, panel)"
                :panelInfo="activeInlineTab.playground.vqb.panels[index]"
                v-if="
                    expand &&
                    activeInlineTab.playground.vqb.panels.length - 1 ===
                        Number(index) &&
                    !readOnly
                "
            /> -->
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
            const {
                getSummarisedInfoOfFilterPanel,
                getInitialPanelExpandedState,
            } = useUtils()

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

            activeInlineTab.value.playground.vqb.panels[index.value].expand =
                getInitialPanelExpandedState(
                    readOnly.value,
                    {
                        ...panel.value,
                        mounted: true,
                    },
                    activeInlineTab.value.playground.vqb.panels[index.value]
                        ?.expand,

                    isFilterIsInteractive(
                        activeInlineTab.value?.playground?.vqb?.panels[
                            index.value
                        ]?.subpanels
                    )
                )

            const expand = computed(
                () =>
                    activeInlineTab.value.playground.vqb.panels[index.value]
                        .expand
            )

            const checkbox = ref(true)
            const { handleAdd, deletePanelsInVQB, updateVQB } = useVQB()

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
                containerHovered.value = false
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

            watch(
                activeInlineTab,
                () => {
                    console.log('updated data: ', activeInlineTab.value)
                },
                { immediate: true }
            )

            const handleCheckboxChange = () => {
                updateVQB(activeInlineTab, inlineTabs)
            }

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
                handleCheckboxChange,
            }
        },
    })
</script>
<style lang="less" scoped>
    .collapse-smooth-enter-active {
        transition: all 0.25s ease-out;
    }
    .collapse-smooth-leave-active {
        transition: all 0.25s ease;
    }
    .collapse-smooth-enter-from {
        height: 0px;
        // opacity: 0;
    }
    .collapse-smooth-enter-to {
        height: 75px;
    }
    .collapse-smooth-leave-from {
        height: 75px !important;
        opacity: 1;
    }

    .collapse-smooth-leave-to {
        // transform: translateX(20px);
        height: 0px !important;
        opacity: 0;
    }
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
