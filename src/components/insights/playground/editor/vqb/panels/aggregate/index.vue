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
                            <div
                                class="relative flex items-center justify-center"
                            >
                                <AtlanIcon
                                    icon="Trigger"
                                    :class="[
                                        isChecked
                                            ? 'text-gray'
                                            : 'text-gray-400',
                                        isChecked && expand
                                            ? 'text-primary'
                                            : '',
                                        'w-4 h-4',
                                    ]"
                                />
                            </div>
                        </div>
                        <div class="">
                            <div
                                :class="[
                                    isChecked ? 'text-gray' : 'text-gray-500',
                                    'text-sm   ',
                                ]"
                            >
                                <div class="flex items-center">
                                    <div class="relative font-bold">
                                        Aggregate
                                    </div>
                                    <div
                                        v-if="!isChecked && expand"
                                        class="px-3 ml-2 text-gray-500 rounded-full bg-gray-light"
                                    >
                                        Disabled
                                    </div>
                                </div>
                            </div>
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
                                    getSummarisedInfoOfAggregationPanel(
                                        activeInlineTab.playground.vqb.panels[
                                            index
                                        ].subpanels
                                    )
                                }}
                            </p>
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
                            <a-tooltip placement="top" title="Add step">
                                <!-- Show dropdown except the last panel -->
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
                                    :disabled="Number(index) === 0"
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
                <AggregatorSubPanel
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
    import AggregatorSubPanel from './subpanel/index.vue'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
    import { useSort } from '~/components/insights/playground/editor/vqb/composables/useSort'

    export default defineComponent({
        name: 'Aggregate',
        components: {
            FooterActions,
            Actions,
            AtlanBtn,
            AggregatorSubPanel,
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
            const { index, panel } = toRefs(props)
            const {
                getSummarisedInfoOfAggregationPanel,
                getInitialPanelExpandedState,
            } = useUtils()
            const { syncSortAggregateAndGroupPanel } = useSort()

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
                    panel.value,
                    activeInlineTab.value.playground.vqb.panels[index.value]
                        ?.expand
                )

            const expand = computed(
                () =>
                    activeInlineTab.value.playground.vqb.panels[index.value]
                        .expand
            )

            const checkbox = ref(true)
            const { deletePanelsInVQB, handleAdd, updateVQB } = useVQB()

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
                syncSortAggregateAndGroupPanel(activeInlineTab)
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
                console.log(containerHovered.value && !submenuHovered.value)
                if (containerHovered.value && !submenuHovered.value) {
                    containerHovered.value = false
                }
            }
            const handleMouseOver = () => {
                if (!containerHovered.value) containerHovered.value = true
            }

            // watch(
            //     activeInlineTab.value.playground.vqb?.panels[index.value]
            //         ?.subpanels,
            //     (state, prev) => {
            //         activeInlineTab.value.isSaved = false
            //         console.log('vqb update: ')
            //     },
            //     { deep: true }
            // )

            const handleCheckboxChange = () => {
                updateVQB(activeInlineTab, inlineTabs)
                syncSortAggregateAndGroupPanel(activeInlineTab)
            }

            return {
                readOnly,
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
                getSummarisedInfoOfAggregationPanel,
                handleCheckboxChange,
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
    .dead-center {
        transform: translate(-39%, -45%);
        top: 45%;
        left: 40%;
    }
</style>
