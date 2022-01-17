<template>
    <a-checkbox-group
        v-model:value="localValue"
        class="w-full px-4"
        @change="handleChange"
    >
        <div class="flex flex-col w-full">
            <template v-for="el in item.data" :key="el.id">
                <a-checkbox
                    :value="el.id"
                    class="inline-flex flex-row-reverse items-center w-full mb-1 atlan-reverse"
                >
                    <div class="flex items-center">
                        <div
                            v-if="el.colorDot"
                            :style="`background-color: ${el.colorDot}`"
                            class="dot"
                        />
                        <span class="mb-0 ml-3 text-gray">
                            {{ el.label }}
                        </span>
                    </div>
                </a-checkbox>
            </template>
        </div>
    </a-checkbox-group>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        props: {
            modelValue: {
                required: false,
            },
            item: {
                required: false,
                default: {},
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }
            return {
                localValue,
                handleChange,
            }
        },
    })
</script>

<style lang="less" scoped>
    .dot {
        height: 6px;
        width: 6px;
        border-radius: 50%;
    }
</style>
