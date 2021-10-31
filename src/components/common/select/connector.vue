<template>
    <a-select
        placeholder="Select a connector"
        v-model:value="selected"
        :allowClear="true"
        :showSearch="true"
        notFoundContent="No connector found"
    >
        <template v-for="item in sourceList" :key="item.id">
            <a-select-option :value="item.id">
                <div class="flex items-center">
                    <img :src="item.image" class="w-auto h-4 mr-1" />
                    {{ item.label }}
                </div></a-select-option
            >
        </template>
    </a-select>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { defineComponent, watch, ref, toRef, toRefs } from 'vue'

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
            const { modelValue } = useVModels(props, emit)
            const selected = ref(modelValue.value)

            watch(selected, () => {
                modelValue.value = selected.value
                emit('change')
            })

            return {
                sourceList,
                selected,
            }
        },
    })
</script>

<style lang="less" scoped></style>
