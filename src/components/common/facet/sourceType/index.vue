<template>
    <a-checkbox-group
        v-if="!isRadio"
        class="w-full px-4"
        v-model:value="localValue"
        @change="handleChange"
    >
        <div class="flex flex-col w-full gap-y-1">
            <template v-for="item in sourceType" :key="item.id">
                <a-checkbox
                    :value="item.id"
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
            <template v-for="item in packageType" :key="item.id">
                <a-radio
                    :value="item.id"
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
    import { defineComponent, ref, toRefs } from 'vue'
    import { sourceType } from '~/constant/sourceType'

    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        props: {
            modelValue: {
                required: false,
            },
            isRadio: {
                required: false,
                default() {
                    return false
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const { isRadio } = toRefs(props)

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            return {
                sourceType,
                localValue,
                isRadio,
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
