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
                            class="flex items-center justify-center mr-2 bg-gray-100 border border-gray-300 rounded-full p-1.5"
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
                            <div
                                class="relative flex items-center justify-center"
                            >
                                <AtlanIcon
                                    icon="Trigger"
                                    :class="[
                                        isChecked
                                            ? 'text-gray-500'
                                            : 'text-gray-400',
                                        isChecked && expand
                                            ? 'text-primary'
                                            : '',
                                        'absolute w-4 h-4 dead-center',
                                    ]"
                                />
                                <div class="w-4 h-4"></div>
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
                                        class="px-3 py-1 ml-2 text-gray-500 rounded-full bg-gray-light"
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
                                    'text-xs',
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
                            />
                            <!-- ------------------------------ -->
                        </div>
                        <div class="border-r border-gray-300">
                            <AtlanBtn
                                @click.stop="() => handleDelete(index)"
                                :disabled="Number(index) === 0"
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
            <FooterActions
                @add="(type, panel) => handleAddPanel(index, type, panel)"
                v-if="
                    expand &&
                    activeInlineTab.playground.vqb.panels.length - 1 ===
                        Number(index)
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
    import AggregatorSubPanel from './subpanel/index.vue'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'

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
            const { getSummarisedInfoOfAggregationPanel } = useUtils()
            const isChecked = computed(
                () =>
                    activeInlineTab.value.playground.vqb.panels[index.value]
                        .hide
            )
            const containerHovered = ref(false)
            const submenuHovered = ref(false)
            const expand = ref(true)
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

            watch(
                activeInlineTab,
                () => {
                    console.log('updated data: ', activeInlineTab.value)
                },
                { immediate: true }
            )

            return {
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
        top: 50%;
        left: 50%;
    }
</style>
