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
                @click.self="toggleExpand"
                class="box-border relative flex items-center p-3 cursor-pointer"
            >
                <div class="mr-3" @click.self="toggleExpand">
                    <AtlanIcon
                        @click.self="toggleExpand"
                        icon="ChevronRight"
                        :class="
                            expand
                                ? 'w-4 h-4 chevron rotate-90'
                                : 'w-4 h-4 chevron rotate-0'
                        "
                    />
                </div>
                <div
                    class="flex items-center justify-between w-full"
                    @click="toggleExpand"
                >
                    <div class="flex items-center">
                        <div
                            class="flex items-center justify-center mr-2 bg-gray-100 border rounded-full p-1.5"
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
                                icon="JoinHeader"
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
                            <p
                                :class="[
                                    isChecked ? 'text-gray' : 'text-gray-500',
                                    'text-sm font-bold  ',
                                ]"
                            >
                                Join data
                            </p>
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
                                    getSummarisedInfoOfJoinPanel(
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
                                Number(index)
                            "
                        >
                            <!-- Show dropdown except the last panel -->
                            <a-tooltip
                                placement="top"
                                title="Add step"
                                :destroyTooltipOnHide="true"
                            >
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
                <JoinSubPanel
                    v-model:subpanels="
                        activeInlineTab.playground.vqb.panels[index].subpanels
                    "
                    :panelIndex="index"
                    v-model:selectedTables="
                        activeInlineTab.playground.vqb.selectedTables
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
    import JoinSubPanel from './subpanel/index.vue'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'

    export default defineComponent({
        name: 'Joins',
        components: {
            FooterActions,
            Actions,
            AtlanBtn,
            JoinSubPanel,
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
                getSummarisedInfoOfJoinPanel,
                getInitialPanelExpandedState,
            } = useUtils()

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
                const copySelectedTables = JSON.parse(
                    JSON.stringify(
                        toRaw(
                            activeInlineTab.value.playground.vqb.selectedTables
                        )
                    )
                )
                /* Remove all the  selected table from joins*/

                activeInlineTab.value.playground.vqb.selectedTables = [
                    copySelectedTables[0],
                ]
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

            const handleCheckboxChange = () => {
                updateVQB(activeInlineTab, inlineTabs)
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
                getSummarisedInfoOfJoinPanel,
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
