<template>
    <a-select
        placeholder="Select"
        v-model:value="localValue"
        class="w-full"
        @change="handleChange"
        :allowClear="allowClear"
    >
        <a-select-option
            v-for="item in list"
            :value="item.value"
            :key="item.value"
        >
            {{ item.label }}
        </a-select-option>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, watch, ref, computed, toRefs } from 'vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'Timezone Select',
        props: {
            queryText: {
                type: String,
                required: false,
                default: () => '',
            },
            modelValue: {
                type: [Array, String],
                required: false,
            },
            allowClear: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const list = computed(() => {
                const temp = []
                for (let i = 1; i < 32; i++) {
                    temp.push({
                        value: i.toString(),
                        label: i,
                    })
                }
                return temp
            })

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
