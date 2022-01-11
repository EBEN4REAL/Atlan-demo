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
                            class="flex items-center justify-center mr-2 border border-gray-300 rounded-full p-1.5"
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
                            <AtlanIcon
                                icon="Sort"
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
                                    'text-sm   ',
                                ]"
                            >
                                <div class="flex items-center">
                                    <div class="relative font-bold">Sort</div>
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
                                    getSummarisedInfoOfSortPanel(
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
                            class="px-3 py-1.5 border-gray-300 flex items-center justify-center border-r"
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
                                    Number(index) && !readOnly
                            "
                        >
                            <!-- Show dropdown except the last panel -->
                            <a-tooltip placement="top" title="Add step">
                                <Actions
                                    @add="
                                        (type, panel) =>
                                            handleAddPanel(index, type, panel)
                                    "
                                    :panelInfo="
                                        activeInlineTab.playground.vqb.panels[
                                            index
                                        ]
                                    "
                                    v-model:submenuHovered="submenuHovered"
                                    v-model:containerHovered="containerHovered"
                                />
                            </a-tooltip>
                            <!-- ------------------------------ -->
                        </div>
                        <div class="border-r border-gray-300">
                            <a-tooltip placement="top" title="Delete step">
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
                            </a-tooltip>
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
                <SortSubPanel
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
    import SortSubPanel from './subpanel/index.vue'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'

    export default defineComponent({
        name: 'Aggregate',
        components: {
            FooterActions,
            Actions,
            AtlanBtn,
            SortSubPanel,
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
            const { getSummarisedInfoOfSortPanel } = useUtils()
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
                console.log(containerHovered.value && !submenuHovered.value)
                if (containerHovered.value && !submenuHovered.value) {
                    containerHovered.value = false
                }
            }
            const handleMouseOver = () => {
                if (!containerHovered.value) containerHovered.value = true
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
            const handleCheckboxChange = () => {
                updateVQB(activeInlineTabKey, inlineTabs)
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
                getSummarisedInfoOfSortPanel,
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
</style>
