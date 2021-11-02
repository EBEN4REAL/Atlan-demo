<template>
    <a-select
        placeholder="Select a connection"
        :v-model:value="localValue"
        :allowClear="false"
        :showSearch="false"
        @change="handleChange"
        :get-popup-container="(target) => target.parentNode"
    >
        <a-select-option
            :value="item.id"
            v-for="item in discoverySorting"
            :key="item.id"
        >
            {{ item.label }}
        </a-select-option>
    </a-select>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { defineComponent, ref } from 'vue'

    import { discoverySorting } from '~/constant/filters/discoverySorting'

    export default defineComponent({
        props: {
            modelValue: {
                type: String,
                required: false,
                default() {
                    return undefined
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)

            const localValue = ref(modelValue.value)

            const handleChange = (value) => {
                modelValue.value = value
                emit('change')
            }

            return {
                handleChange,
                discoverySorting,
                localValue,
            }
        },
    })
</script>

<style lang="less" scoped></style>
