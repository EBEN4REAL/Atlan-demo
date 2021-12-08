<template>
    <a-select
        placeholder="Select a connector"
        v-model:value="localValue"
        :allowClear="true"
        :showSearch="true"
        notFoundContent="No connector found"
        :get-popup-container="(target) => target.parentNode"
        class="selector"
    >
        <template #suffixIcon>
            <AtlanIcon icon="CaretDown" class="mb-1" />
        </template>
        <template v-for="item in sourceList" :key="item.id">
            <a-select-option :value="item.id">
                <div class="flex items-center">
                    <img :src="item.image" class="w-auto h-4 mr-1" />
                    {{ item.label }}
                </div>
            </a-select-option>
        </template>
    </a-select>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { defineComponent, watch, ref } from 'vue'
    import useConnectionData from '~/composables/connection/useConnectionData'

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
            const { sourceList } = useConnectionData()

            console.log('list', sourceList)
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            watch(localValue, () => {
                modelValue.value = localValue.value
                emit('change')
            })
            return {
                sourceList,
                localValue,
            }
        },
    })
</script>

<style lang="less" scoped>
    .selector:deep(.ant-select-arrow) {
        @apply flex items-center;
    }
</style>
