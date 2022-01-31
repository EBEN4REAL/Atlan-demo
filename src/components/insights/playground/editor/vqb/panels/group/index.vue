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
                            <AtlanIcon
                                icon="BuilderGroup"
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
                                    'text-sm   ',
                                ]"
                            >
                                <div class="flex items-center">
                                    <div class="relative font-bold">Group</div>
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
                                    getSummarisedInfoOfGroupPanel(
                                        activeInlineTab.playground.vqb.panels[
                                            index
                                        ].subpanels
                                    )
                                }}
                            </p>
                        </div>
                    </div>

                    <PanelOptions
                        @handleCheckboxChange="handleCheckboxChange"
                        @handleDelete="handleDelete"
                        v-model:containerHovered="containerHovered"
                        v-model:submenuHovered="submenuHovered"
                        :panel="panel"
                        :index="index"
                    />
                </div>
            </div>

            <!-- Show on expand -->
            <keep-alive>
                <transition name="collapse-smooth">
                    <GroupSubPanel
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
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { VQBPanelType } from '~/types/insights/VQB.interface'
    import Actions from '../action/index.vue'
    import FooterActions from '../action/footer.vue'
    import GroupSubPanel from './subpanel/index.vue'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
    import { useSort } from '~/components/insights/playground/editor/vqb/composables/useSort'
    import PanelOptions from '~/components/insights/playground/editor/vqb/panels/common/options/index.vue'

    export default defineComponent({
        name: 'Groups',
        components: {
            FooterActions,
            Actions,
            AtlanBtn,
            GroupSubPanel,
            PanelOptions,
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
                getSummarisedInfoOfGroupPanel,
                getInitialPanelExpandedState,
            } = useUtils()
            const { syncSortAggregateAndGroupPanel } = useSort()

            const { index, panel } = toRefs(props)
            const containerHovered = ref(false)
            const submenuHovered = ref(false)
            const isChecked = computed(
                () =>
                    activeInlineTab.value.playground.vqb.panels[index.value]
                        .hide
            )
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

            const handleDelete = (index) => {
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

            const handleCheckboxChange = () => {
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
                findTimeLineHeight,
                getSummarisedInfoOfGroupPanel,
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
        height: 56px;
    }
    .collapse-smooth-leave-from {
        height: 56px;
        opacity: 1;
    }

    .collapse-smooth-leave-to {
        // transform: translateX(20px);
        height: 0px;
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
