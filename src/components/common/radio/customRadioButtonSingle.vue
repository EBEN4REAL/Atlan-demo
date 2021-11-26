<template>
    <div class="flex items-center">
        <div class="flex border divide-x rounded">
            <template v-for="item in list" :key="item.id">
                <div
                    class="flex items-center justify-center px-5 py-1 text-sm cursor-pointer  hover:text-primary"
                    :class="
                        isSelected(item.id)
                            ? ' text-primary bg-primary-light'
                            : 'text-gray-500'
                    "
                    @click="() => handleClick(item.id)"
                >
                    {{ item.label }}
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { ref } from 'vue'
    import { defineComponent, PropType, toRefs } from 'vue'
    import { CheckboxArray, Checkbox } from '~/types'

    export default defineComponent({
        props: {
            modelValue: {
                required: false,
            },
            list: {
                type: Array as PropType<CheckboxArray>,
                required: false,
            },
            isMultiple: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { list, isMultiple } = toRefs(props)

            const { modelValue } = useVModels(props, emit)

            const localValue = ref(modelValue.value)

            const handleClick = (id) => {
                if (isMultiple.value) {
                    if (!localValue.value || localValue.value?.length == 0) {
                        localValue.value = [id]
                    } else {
                        const index = localValue.value?.indexOf(id)

                        if (index > -1) {
                            localValue.value?.splice(index, 1)
                        } else {
                            localValue.value?.push(id)
                        }
                    }
                } else {
                    localValue.value = id
                }
                modelValue.value = localValue.value
                emit('change', id)
            }

            const isSelected = (id) => {
                if (isMultiple.value) {
                    return !!localValue.value?.includes(id)
                } else {
                    return id === localValue.value
                }
            }

            return {
                handleClick,
                isMultiple,
                localValue,
                list,
                isSelected,
            }
        },
    })
</script>

<style lang="less" scoped>
    .active-btn {
        @apply text-primary bg-primary-light;
    }
    .button:first-child {
        @apply ml-0 !important;
    }
</style>
