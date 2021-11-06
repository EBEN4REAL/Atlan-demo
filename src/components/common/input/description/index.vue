<template>
    <div
        class="flex flex-col px-1 rounded hover:bg-primary-light"
        :class="isEdit ? 'bg-primary-light' : ''"
    >
        <div
            class="text-sm text-gray-700"
            @click="handleEdit"
            :class="$style.editable"
        >
            <span v-if="!isEdit && localValue">{{ localValue }}</span>
            <span v-else-if="!isEdit && localValue === ''"
                >No description available</span
            >
            <a-textarea
                ref="descriptionRef"
                tabindex="0"
                v-model:value="localValue"
                v-else
                @blur="handleBlur"
                :rows="4"
            ></a-textarea>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        nextTick,
        onMounted,
        PropType,
        Ref,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import {
        useMagicKeys,
        useTimeoutFn,
        useVModels,
        whenever,
    } from '@vueuse/core'

    export default defineComponent({
        name: 'DescriptionWidget',
        props: {
            modelValue: {
                type: String,
                required: true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const isEdit = ref(false)
            const descriptionRef: Ref<null | HTMLInputElement> = ref(null)

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            const { start } = useTimeoutFn(() => {
                descriptionRef.value?.focus()
            }, 100)

            const handleBlur = () => {
                isEdit.value = false
                handleChange()
            }
            const handleEdit = () => {
                isEdit.value = true
                start()
            }

            const { d /* keys you want to monitor */ } = useMagicKeys()

            watch(d, (v) => {
                if (v) {
                    console.log('Description')
                    if (!isEdit.value) {
                        handleEdit()
                    }
                }
            })

            return {
                localValue,
                handleEdit,
                handleChange,
                descriptionRef,
                isEdit,
                start,
                handleBlur,
            }
        },
    })
</script>

<style lang="less" module>
    .editable {
        :global(.ant-input) {
            @apply border-none bg-transparent shadow-none px-0 py-0 rounded-none  !important;
        }
        :global(.ant-input:focus) {
            @apply border-none bg-transparent shadow-none px-0 py-0 rounded-none !important;
        }
    }
</style>
