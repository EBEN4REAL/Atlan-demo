<template>
    <a-select
        placeholder="Select"
        v-model:value="localValue"
        class="w-full"
        @change="handleChange"
    >
        <a-select-option v-for="item in list" :value="item.id" :key="item.id">
            {{ item.label }}
        </a-select-option>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, watch, ref, computed, toRefs } from 'vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'Custom Select',
        props: {
            queryText: {
                type: String,
                required: false,
                default: () => '',
            },
            list: {
                type: Array,
                required: false,
                default: () => [],
            },
            modelValue: {
                type: [Array, String],
                required: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { list } = toRefs(props)
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            return {
                list,
                localValue,
                handleChange,
            }
        },
    })
</script>
