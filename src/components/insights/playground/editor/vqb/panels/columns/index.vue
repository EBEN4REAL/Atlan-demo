<template>
    <div>
        <div @mouseover="handleMouseOver" @mouseout="handleMouseOut">
            <div
                @click="toggleExpand"
                class="box-border relative flex items-center p-3 cursor-pointer"
            >
                <div class="flex items-center justify-between w-full">
                    <div class="flex items-center">
                        <div
                            class="flex items-center justify-center mr-2 rounded-md p-1.5"
                            :class="[
                                expand ? 'bg-primary-light' : 'bg-gray-100',
                            ]"
                            style="z-index: 2"
                        >
                            <AtlanIcon
                                icon="TableGray"
                                :class="[
                                    expand ? 'text-primary' : '',
                                    'w-4 h-4',
                                ]"
                            />
                        </div>
                        <div class="">
                            <p class="text-sm font-bold capitalize text-gray">
                                Select from
                            </p>
                            <p
                                class="text-xs text-gray-500 break-words line-clamp-2"
                                v-if="!expand"
                            >
                                {{
                                    getTableNamesStringFromQualfieidNames(
                                        panel?.subpanels?.map(
                                            (e) => e.tableQualfiedName
                                        )
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
                            class="border-gray-300"
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
                            />
                            <!-- ------------------------------ -->
                        </div>
                    </div>
                </div>
            </div>
            <!-- Show on expand -->
            <keep-alive>
                <transition name="collapse-smooth">
                    <ColumnSubPanel
                        v-model:subpanels="
                            activeInlineTab.playground.vqb.panels[index]
                                .subpanels
                        "
                        v-model:selectedTables="
                            activeInlineTab.playground.vqb.selectedTables
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
                    activeInlineTab.playground.vqb.selectedTables.length > 0 &&
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
    import ColumnSubPanel from './subpanel/index.vue'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'

    export default defineComponent({
        name: 'Columns',
        components: {
            FooterActions,
            Actions,
            AtlanBtn,
            ColumnSubPanel,
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
            const {
                getTableNamesStringFromQualfieidNames,
                getInitialPanelExpandedState,
            } = useUtils()
            const { index, panel } = toRefs(props)
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
            const getInitialExpandValue = () => {
                if (
                    Number(index.value) == 0 &&
                    activeInlineTab.value.playground.vqb?.panels?.length == 1
                )
                    return true
                // if (
                //     activeInlineTab.value.playground.vqb.panels[index.value]
                //         .expand
                // )
                //     return true

                return false
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
            const { deletePanelsInVQB, handleAdd } = useVQB()

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

            return {
                readOnly,
                getTableNamesStringFromQualfieidNames,
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
        height: 56px;
    }
    .collapse-smooth-leave-from {
        height: 56px !important;
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
