<template>
    <div class="">
        <div class="flex items-center mb-3">
            <div
                class="flex items-center justify-end mr-3 item-1"
                style="min-width: 91px"
            >
                <span>{{ subpanel.column?.label }}</span>
                <span v-if="index !== 0">
                    {{ subpanel.filter.title }}
                </span>
                <span v-else class="flex flex-row-reverse text-gray-500"
                    >Where</span
                >
            </div>
            <div class="w-full grid-container group">
                <div class="flex item-3">
                    <Input
                        v-if="subpanel?.filter?.type === 'input'"
                        :selectedFilter="subpanel.filter"
                        :subpanel="subpanel"
                        v-model:subpanels="subpanels"
                        :index="index"
                        class="flex-1 w-full"
                        :type="
                            getInputTypeFromColumnType(subpanel?.column?.type)
                        "
                        v-model:inputValue="subpanel.filter.value"
                    />

                    <MultiInput
                        v-if="subpanel?.filter?.type === 'multi_input'"
                        class="flex-1 w-full"
                        v-model:inputValue="subpanel.filter.value"
                    />

                    <RangeInput
                        v-if="subpanel?.filter?.type === 'range_input'"
                        class="flex-1 w-full"
                        :type="
                            getInputTypeFromColumnType(subpanel?.column?.type)
                        "
                        v-model:inputValue="subpanel.filter.value"
                    />
                </div>
            </div>
        </div>
    </div>
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
    import Input from '../filterComponents/input.vue'
    import MultiInput from '../filterComponents/multiInput.vue'
    import RangeInput from '../filterComponents/rangeInput.vue'

    export default defineComponent({
        name: 'Variable render',
        components: {
            MultiInput,
            RangeInput,
            Input,
        },
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
            const { getInputTypeFromColumnType } = useFilter()

            const { subpanels } = useVModels(props)

            return {
                subpanels,
                getInputTypeFromColumnType,
                subpanel,
                index,
            }
        },
    })
</script>
<style lang="less" scoped></style>
