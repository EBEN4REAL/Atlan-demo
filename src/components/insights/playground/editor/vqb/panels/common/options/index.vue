<template>
    <div
        v-if="!readOnly"
        :class="[
            true ? 'opacity-100' : 'opacity-0',
            'flex border border-gray-light rounded   items-strech',
            'h-8',
        ]"
    >
        <div
            class="inline-flex items-center justify-center px-2 py-2 border-r border-gray-light"
            @click.stop="() => {}"
        >
            <a-tooltip
                placement="top"
                :title="
                    activeInlineTab.playground.vqb.panels[index].hide
                        ? 'Disable step'
                        : 'Enable step'
                "
            >
                <a-checkbox
                    class="h-4"
                    style="margin-top: -5px"
                    v-model:checked="
                        activeInlineTab.playground.vqb.panels[index].hide
                    "
                    @change="handleCheckboxChange"
                ></a-checkbox>
            </a-tooltip>
        </div>
        <div
            class="border-r border-gray-light"
            v-if="
                activeInlineTab.playground.vqb.panels.length - 1 !==
                    Number(index) && !readOnly
            "
        >
            <!-- Show dropdown except the last panel -->
            <a-tooltip placement="top" title="Add step">
                <Actions
                    @add="(type, panel) => handleAddPanel(index, type, panel)"
                    :panelInfo="activeInlineTab.playground.vqb.panels[index]"
                    v-model:submenuHovered="submenuHovered"
                    v-model:containerHovered="containerHovered"
                />
            </a-tooltip>
            <!-- ------------------------------ -->
        </div>
        <div class="flex items-center">
            <a-tooltip placement="top" title="Delete step">
                <AtlanBtn
                    @click.stop="() => handleDelete(index)"
                    :disabled="Number(index) === 0"
                    class="px-3 border-none text-gray hover:text-red-500"
                    size="sm"
                    color="secondary"
                    padding="compact"
                >
                    <AtlanIcon icon="Delete" class="w-4 h-4 -mx-1"></AtlanIcon>
                </AtlanBtn>
            </a-tooltip>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        Ref,
        watch,
        inject,
        computed,
        defineComponent,
        ref,
        onMounted,
        onUnmounted,
        ComputedRef,
        PropType,
        toRefs,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'
    import { VQBPanelType } from '~/types/insights/VQB.interface'
    import Actions from '~/components/insights/playground/editor/vqb/panels/action/index.vue'

    export default defineComponent({
        name: 'Options',
        components: { Actions },
        props: {
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            containerHovered: {
                type: Boolean,
                required: true,
            },
            submenuHovered: {
                type: Boolean,
                required: true,
            },
            index: {
                type: String,
                required: true,
            },
            panel: {
                type: Object as PropType<VQBPanelType>,
                required: true,
            },
        },
        emit: ['handleDelete', 'handleCheckboxChange'],

        setup(props, { emit }) {
            const { handleAdd, deletePanelsInVQB, updateVQB } = useVQB()
            const { containerHovered, submenuHovered } = useVModels(props)
            const { index, panel } = toRefs(props)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<string>
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >

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
                emit('handleDelete', index)
            }

            const handleCheckboxChange = () => {
                updateVQB(activeInlineTab, inlineTabs)
                emit('handleCheckboxChange')
            }

            return {
                index,
                panel,
                activeInlineTab,
                handleCheckboxChange,
                containerHovered,
                submenuHovered,
                handleAddPanel,
                handleDelete,
                handleAdd,
                readOnly,
            }
        },
    })
</script>
<style lang="less" scoped></style>
