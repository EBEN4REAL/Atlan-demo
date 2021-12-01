<template>
    <div
        :class="
            expand
                ? ['border', ' border-gray-300', 'rounded', 'group']
                : [
                      'border border-white',
                      'hover:border-gray-300',
                      'rounded',
                      'group',
                  ]
        "
        @click="
            () => {
                expand = !expand
            }
        "
    >
        <div
            class="box-border relative flex items-center p-3 rounded cursor-pointer "
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
                        class="
                            flex
                            items-center
                            justify-center
                            mr-2
                            bg-gray-100
                            border border-gray-300
                            rounded-full
                            p-1.5
                        "
                        :class="
                            !expand
                                ? [
                                      'flex',
                                      'items-center',
                                      'justify-center',
                                      'mr-2',
                                      'bg-gray-100',
                                      'border',
                                      'border-gray-300',
                                      'rounded-full',
                                      'p-1.5',
                                      'text-gray-500',
                                  ]
                                : [
                                      'flex',
                                      'items-center',
                                      'justify-center',
                                      'mr-2',
                                      'bg-primary-light',
                                      'border',
                                      'border-primary',
                                      'rounded-full',
                                      'p-1.5',
                                      'text-primary',
                                  ]
                        "
                        style="z-index: 2"
                    >
                        <AtlanIcon icon="Columns" class="w-4 h-4" />
                    </div>
                    <div class="text-xs">
                        <p class="font-bold text-gray">
                            Columns {{ panel.order }}
                        </p>
                        <p class="text-gray-500">
                            from Instacart_beverages_master
                        </p>
                    </div>
                </div>

                <div
                    class="flex border border-gray-300 rounded opacity-0  group-hover:opacity-100 items-strech"
                >
                    <div
                        class="
                            px-3
                            py-1.5
                            border-r border-gray-300
                            flex
                            items-center
                            justify-center
                        "
                    >
                        <a-checkbox v-model:checked="checkbox"></a-checkbox>
                    </div>
                    <div class="border-r border-gray-300">
                        <AtlanBtn
                            class="
                                flex-none
                                px-3.5
                                py-1
                                border-none border-r border-gray-300
                            "
                            size="sm"
                            color="secondary"
                            @click="() => handleAdd(index)"
                            padding="compact"
                        >
                            <AtlanIcon
                                icon="Add"
                                class="-mx-1 text-gray"
                            ></AtlanIcon>
                        </AtlanBtn>
                    </div>
                    <div class="border-r border-gray-300">
                        <AtlanBtn
                            @click="() => handleDelete(index)"
                            :disabled="
                                activeInlineTab.playground.vqb.panels.length ==
                                1
                            "
                            class="
                                flex-none
                                border-none
                                px-3.5
                                py-1
                                text-gray
                                hover:text-red-500
                            "
                            size="sm"
                            color="secondary"
                            padding="compact"
                        >
                            <AtlanIcon icon="Delete" class="-mx-1"></AtlanIcon>
                        </AtlanBtn>
                    </div>
                </div>
            </div>

            <div
                class=""
                :class="
                    expand
                        ? 'absolute bg-gray-300 opacity-0'
                        : 'absolute bg-gray-300 group-hover:opacity-0'
                "
                :style="`width: 1px; left: 55px; z-index: 1; ${findTimeLineHeight(
                    Number(index)
                )}`"
            ></div>
        </div>
        <!-- Show on expand -->
        <div
            class="h-24 p-3 mx-3 my-4 border border-gray-300 rounded"
            v-if="expand"
        ></div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        toRefs,
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

    export default defineComponent({
        name: 'Columns',
        components: {
            AtlanBtn,
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
            const expand = ref(false)
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
            const { addPanelsInVQB, deletePanelsInVQB } = useVQB()

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
            const handleAdd = (index) => {
                const panelCopy = Object.assign({}, { ...toRaw(panel.value) })
                panelCopy.order =
                    Number(activeInlineTab.value.playground.vqb.panels.length) +
                    1
                addPanelsInVQB(
                    Number(index),
                    panelCopy,
                    activeInlineTabKey,
                    inlineTabs
                )
            }
            const handleDelete = (index) => {
                deletePanelsInVQB(Number(index), activeInlineTabKey, inlineTabs)
            }

            return {
                expand,
                activeInlineTab,
                index,
                checkbox,
                panel,
                handleDelete,
                handleAdd,
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
