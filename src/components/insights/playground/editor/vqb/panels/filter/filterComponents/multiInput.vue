<template>
    <a-select
        v-model:value="inputValue"
        mode="tags"
        class="w-full border-gray-300 rounded box-shadow focus:border-primary-focus"
        :class="$style.multi_input"
        style="height: 32px !important"
        placeholder="Enter value"
        :token-separators="[',']"
    >
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, PropType, toRaw } from 'vue'
    import { useVModels } from '@vueuse/core'

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

            return {
                inputValue,
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
            margin: 6px !important;
            height: 20px !important;
            padding-top: 1.5px !important;
            // padding-bottom: 4px !important;
            padding-left: 8px !important;
            padding-right: 8px !important;
            background-color: rgb(243, 243, 243);

            @apply text-gray-500 !important;
        }
    }
</style>
