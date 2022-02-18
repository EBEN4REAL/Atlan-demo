<template>
    <a-select
        ref="inputRef"
        v-model:value="localValue"
        placeholder="Select announcement type"
        class="w-full center-arrow"
        :showArrow="true"
        :allow-clear="true"
        @change="handleChange"
    >
        <a-select-option
            v-for="(item, index) in AnnouncementList"
            :value="item.id"
            :key="index"
        >
            <div class="flex items-center w-full atlan-reverse">
                <component
                    :is="item.icon"
                    class="inline-flex self-center w-auto h-4 mb-0.5"
                />
                <span class="mb-0 ml-1 text-gray">
                    {{ item.label }}
                </span>
            </div></a-select-option
        >

        <template #suffixIcon>
            <AtlanIcon icon="CaretDown" />
        </template>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { useVModels } from '@vueuse/core'
    import AnnouncementList from '~/constant/announcement'

    export default defineComponent({
        name: 'AnnouncementTypeSelector',
        props: {
            modelValue: {
                type: Array,
                required: false,
                default: () => undefined,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
                console.log('hello', localValue.value)
            }

            return {
                AnnouncementList,

                localValue,
                handleChange,
            }
        },
    })
</script>

<style lang="less" scoped></style>
