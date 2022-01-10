<template>
    <a-popover placement="bottom">
        <template #content>
            <div class="p-3" style="width: 186px">
                <p class="mb-1 text-xs font-bold text-gray-700">
                    {{
                        !subpanel?.filter?.isVariable
                            ? 'Make this interactive'
                            : 'Interactive parameter'
                    }}
                </p>
                <p class="text-xs text-gray-500">
                    {{
                        !subpanel?.filter?.isVariable
                            ? 'Configure this input to show as an interactive variable'
                            : 'This input is configured as an interactive parameter'
                    }}
                </p>
            </div>
        </template>
        <div
            class="px-0.5 rounded cursor-pointer"
            :class="
                !subpanel?.filter?.isVariable
                    ? 'hover:bg-gray-light'
                    : 'bg-pink-light'
            "
        >
            <AtlanIcon
                v-if="!subpanel?.filter?.isVariable"
                @click.stop="() => toggleVariableType(false, index, subpanel)"
                icon="Flash"
                class="w-4 h-4"
            />
            <AtlanIcon
                v-else
                @click.stop="() => toggleVariableType(true, index, subpanel)"
                icon="GlowFlash"
                class="w-4 h-4"
            />
        </div>
    </a-popover>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        watch,
        PropType,
        toRaw,
        Ref,
        toRefs,
        inject,
        ComputedRef,
    } from 'vue'
    import { SubpanelFilter } from '~/types/insights/VQBPanelFilter.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { editor } from 'monaco-editor'
    import { useCustomVariable } from '~/components/insights/playground/editor/common/composables/useCustomVariable'
    import { useFilter } from '~/components/insights/playground/editor/vqb/composables/useFilter'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'Custom Icon trigger',
        components: {},
        props: {
            subpanel: {
                type: Object as PropType<SubpanelFilter>,
                required: true,
                default: () => {},
            },
            index: {
                type: Number,
                required: true,
            },
            subpanels: {
                type: Object as PropType<SubpanelFilter[]>,
                required: true,
                default: [],
            },
        },
        setup(props, { emit }) {
            const { subpanel, index } = toRefs(props)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const editorInstanceRef = inject(
                'editorInstance'
            ) as Ref<editor.IStandaloneCodeEditor>
            const showcustomVariablesToolBar = inject(
                'showcustomToolBar'
            ) as Ref<Boolean>
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const monacoInstanceRef = inject('monacoInstance') as Ref<any>
            const { totalFiledsMapWithInput } = useFilter()
            const editorInstance = toRaw(editorInstanceRef.value)
            const monacoInstance = toRaw(monacoInstanceRef.value)

            const { addVariableFromVQB } = useCustomVariable(
                editorInstance,
                monacoInstance
            )
            const { subpanels } = useVModels(props)

            const toggleVariableType = (currVal, index, subpanel) => {
                // /* Check if variable already exists */
                // const Varindex =
                //     activeInlineTab.value.playground.editor.variables.findIndex(
                //         (variable) => variable?.subpanelId === subpanel.id
                //     )
                // const Varindex2 =
                //     activeInlineTab.value.playground.editor.variables.findIndex(
                //         (variable) =>
                //             variable?.subpanelId === `${subpanel.id}${2}`
                //     )
                // if (Varindex < 0) {
                //     addVariableFromVQB(activeInlineTab, tabs, {
                //         vqbPanelId: subpanel.id,
                //         subpanelId: subpanel.id,
                //         type: subpanel?.column?.type?.toLowerCase(),
                //     })
                //     /* If fileds are more than one, then it will have inputFiledValue 2 */
                //     if (Varindex2 < 0) {
                //         if (
                //             totalFiledsMapWithInput[subpanel?.filter?.type] > 1
                //         ) {
                //             addVariableFromVQB(activeInlineTab, tabs, {
                //                 vqbPanelId: `${subpanel.id}${2}`,
                //                 subpanelId: `${subpanel.id}${2}`,
                //                 type: subpanel?.column?.type.toLowerCase(),
                //             })
                //         }
                //     }
                // }
                subpanels.value[index].filter.isVariable = !currVal
                // showcustomVariablesToolBar.value = !currVal
            }
            return {
                toggleVariableType,
                subpanel,
                index,
            }
        },
    })
</script>
<style lang="less" scoped></style>
