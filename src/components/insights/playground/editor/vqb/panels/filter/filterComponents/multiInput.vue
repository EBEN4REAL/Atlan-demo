<template>
    <a-select
        v-model:value="inputValue"
        mode="tags"
        class="w-full border-gray-300 rounded box-shadow focus:border-primary-focus focus:border-2 focus:outline-none"
        :class="$style.multi_input"
        style="height: 32px !important"
        placeholder="Enter multi values 1,2,3"
        :token-separators="[',']"
        @change="handleChange"
    >
    </a-select>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        watch,
        PropType,
        toRaw,
        inject,
        ComputedRef,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        name: 'Sub panel',
        components: {},
        props: {
            inputValue: {
                type: String,
                required: true,
            },
        },

        setup(props, { emit }) {
            const { inputValue } = useVModels(props)

            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<activeInlineTabInterface>

            const inlineTabs = inject(
                'inlineTabs'
            ) as ComputedRef<activeInlineTabInterface>

            const { updateVQB } = useVQB()

            const handleChange = () => {
                // updateVQB(activeInlineTabKey, inlineTabs)
            }
            return {
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
        :global(.ant-select-selection-placeholder) {
            @apply text-gray-500 !important;
        }
        :global(.ant-select-selection-item-remove) {
            margin-top: 1px !important;
        }
    }
</style>
