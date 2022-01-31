<template>
    <PanelLayout
        @handleMouseOver="handleMouseOver"
        @handleMouseOut="handleMouseOut"
        @toggleExpand="toggleExpand"
        :expand="expand"
        :isChecked="isChecked"
    >
        <template #panelIcon>
            <div class="relative flex items-center justify-center">
                <AtlanIcon
                    icon="Trigger"
                    :class="[
                        isChecked ? 'text-gray' : 'text-gray-400',
                        isChecked && expand ? 'text-primary' : '',
                        'w-4 h-4',
                    ]"
                />
            </div>
        </template>
        <template #panelName>
            <span> Aggregate </span>
        </template>
        <template #panelDescription>
            <span>
                {{
                    getSummarisedInfoOfAggregationPanel(
                        activeInlineTab.playground.vqb.panels[index].subpanels
                    )
                }}
            </span>
        </template>
        <template #options>
            <PanelOptions
                @handleCheckboxChange="handleCheckboxChange"
                @handleDelete="handleDelete"
                v-model:containerHovered="containerHovered"
                v-model:submenuHovered="submenuHovered"
                :panel="panel"
                :index="index"
            />
        </template>
        <template #expand>
            <div>
                <!-- Show on expand -->
                <keep-alive>
                    <transition name="collapse-smooth">
                        <AggregatorSubPanel
                            v-model:subpanels="
                                activeInlineTab.playground.vqb.panels[index]
                                    .subpanels
                            "
                            v-model:columnSubpanels="
                                activeInlineTab.playground.vqb.panels[0]
                                    .subpanels
                            "
                            :expand="expand"
                            v-if="expand"
                        />
                    </transition>
                </keep-alive>
            </div>
        </template>
    </PanelLayout>
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
    import AggregatorSubPanel from './subpanel/index.vue'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
    import { useSort } from '~/components/insights/playground/editor/vqb/composables/useSort'
    import PanelOptions from '~/components/insights/playground/editor/vqb/panels/common/options/index.vue'
    import PanelLayout from '~/components/insights/playground/editor/vqb/panels/layout/index.vue'

    export default defineComponent({
        name: 'Aggregate',
        components: {
            PanelLayout,
            FooterActions,
            Actions,
            AtlanBtn,
            AggregatorSubPanel,
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
                getSummarisedInfoOfAggregationPanel,
                handleCheckboxChange,
            }
        },
    })
</script>
<style lang="less" scoped>
    .min-h-panel-header {
        min-height: 36px;
    }
    .collapse-smooth-enter-active {
        transition: all 0.25s ease-out;
        overflow-y: hidden;
    }
    .collapse-smooth-leave-active {
        transition: all 0.25s ease;
        overflow-y: hidden;
    }
    .collapse-smooth-enter-from {
        height: 0px;
        // opacity: 0;
    }
    .collapse-smooth-enter-to {
        height: 80px;
    }
    .collapse-smooth-leave-from {
        height: 80px !important;
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
    .dead-center {
        transform: translate(-39%, -45%);
        top: 45%;
        left: 40%;
    }
</style>
