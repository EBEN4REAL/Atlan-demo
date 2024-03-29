<template>
    <a-checkbox-group
        v-if="!isRadio"
        class="w-full px-4"
        v-model:value="localValue"
        @change="handleChange"
    >
        <div class="flex flex-col w-full">
            <template v-for="item in certificateList" :key="item.id">
                <a-checkbox
                    :value="item.value"
                    class="inline-flex flex-row-reverse items-center w-full mb-1 atlan-reverse"
                >
                    <component
                        :is="item.icon"
                        class="inline-flex self-center w-auto h-4 mb-0.5"
                    />
                    <span class="mb-0 ml-1 text-gray">
                        {{ item.label }}
                    </span>
                </a-checkbox>
            </template>
        </div>
    </a-checkbox-group>

    <a-radio-group
        v-else
        class="w-full px-4"
        v-model:value="localValue"
        @change="handleChange"
    >
        <div class="flex flex-col w-full">
            <template v-for="item in certificateList" :key="item.id">
                <a-radio
                    :value="item.value"
                    class="inline-flex flex-row-reverse items-center w-full mb-1 atlan-reverse"
                >
                    <component
                        :is="item.icon"
                        class="inline-flex self-center w-auto h-4 mb-0.5"
                    />
                    <span class="mb-0 ml-1 text-gray">
                        {{ item.label }}
                    </span>
                </a-radio>
            </template>
        </div>
    </a-radio-group>
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { certificateList } from '~/constant/certification'

    export default defineComponent({
        props: {
            modelValue: {
                required: false,
            },
            isRadio: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            watch(modelValue, (newModelValue) => {
                localValue.value = newModelValue
            })

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            return {
                certificateList,
                localValue,
                handleChange,
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(.atlan-reverse > span:nth-child(2)) {
        @apply w-full pl-0;
    }
</style>
