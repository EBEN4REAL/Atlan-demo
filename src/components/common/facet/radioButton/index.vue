<template>
    <a-radio-group
        v-model:value="localValue"
        class="w-full px-3"
        @change="handleChange"
    >
        <div class="flex flex-col w-full">
            <template v-for="el in item.data" :key="el.id">
                <a-radio
                    :value="el.id"
                    class="inline-flex flex-row-reverse items-center w-full px-1 py-0.5 rounded atlan-reverse hover:bg-primary-menu"
                >
                    <div class="flex items-center gap-x-2">
                        <div
                            v-if="el.colorDot"
                            :style="`background-color: ${el.colorDot}`"
                            class="dot"
                        />
                        <AtlanIcon
                            v-if="el.icon"
                            class="mt-1"
                            :class="el.iconClass"
                            :icon="el.icon"
                        />
                        <span class="pt-1 mb-0 text-sm text-gray">
                            {{ el.label }}
                        </span>
                    </div>
                </a-radio>
            </template>
        </div>
    </a-radio-group>
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
