<template>
    <div class="relative flex w-full" style="min-height: 34px; z-index: 3">
        <a-select
            v-model:value="inputValue"
            :disabled="readOnly && !subpanel?.filter?.isVariable"
            mode="tags"
            :class="$style.multi_input"
            class="w-full border-gray-200 rounded focus:border-primary-focus focus:border-2 focus:outline-none"
            style="height: 32px !important; z-index: 2"
            placeholder="Enter Multiple Values"
            @change="handleChange"
            :open="false"
        >
            <template #dropdownRender="{ menuNode: menu }" />
        </a-select>
        <div class="absolute z-20 right-2 trigger-icon">
            <CustomVariableTrigger
                v-if="!(readOnly && !subpanel?.filter?.isVariable)"
                :subpanel="subpanel"
                :index="index"
                v-model:subpanels="subpanels"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        watch,
        toRefs,
        Ref,
        PropType,
        computed,
        inject,
        toRaw,
        ComputedRef,
        onUnmounted,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import CustomVariableTrigger from './customVariableTrigger.vue'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { SubpanelFilter } from '~/types/insights/VQBPanelFilter.interface'

    export default defineComponent({
        name: 'Sub panel',
        components: { CustomVariableTrigger },
        props: {
            inputValue: {
                type: String,
                required: true,
            },
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
            const { inputValue, subpanels } = useVModels(props)
            const { subpanel, index } = toRefs(props)

            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<activeInlineTabInterface>
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const inlineTabs = inject(
                'inlineTabs'
            ) as ComputedRef<activeInlineTabInterface>

            const { updateVQB } = useVQB()

            let timeout = null

            function createDebounce() {
                return function (fnc, delayMs) {
                    clearTimeout(timeout)
                    timeout = setTimeout(() => {
                        fnc()
                    }, delayMs || 500)
                }
            }

            const handleChange = () => {
                createDebounce()(() => {
                    updateVQB(activeInlineTab, inlineTabs)
                }, 2000)
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
            return {
                subpanels,
                index,
                subpanel,
                readOnly,
                inputValue,
                handleChange,
            }
        },
    })
</script>
<style lang="less" scoped>
    .box-shadow {
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);
    }
    .trigger-icon {
        transform: translateY(-60%);
        top: 50%;
    }
</style>
<style lang="less" module>
    .multi_input {
        :global(.ant-select-selection-item) {
            @apply text-xs !important;
            border-radius: 100px !important;
            margin: 4px !important;
            height: 20px !important;
            padding-top: 1.5px !important;
            // padding-bottom: 4px !important;
            padding-left: 8px !important;
            padding-right: 8px !important;
            background-color: rgb(243, 243, 243);

            @apply text-gray-500 !important;
        }
        :global(.ant-select-selector) {
            @apply border-gray-300 !important;
            @apply text-gray-700 !important;
        }
        :global(.ant-select-dropdown) {
            display: none !important;
        }
        :global(.ant-select-selection-placeholder) {
            @apply text-gray-500 !important;
        }
        :global(.ant-select-selection-item-remove) {
            margin-top: 1px !important;
        }
    }
</style>
