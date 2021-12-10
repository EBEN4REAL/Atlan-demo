<template>
    <a-input
        v-model:value="inputValue"
        placeholder="Enter Value"
        class="w-full border-gray-300 rounded box-shadow focus:border-primary-focus focus:border-2 focus:outline-none"
        style="height: 32px !important"
    />
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
