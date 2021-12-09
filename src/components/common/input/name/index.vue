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
                >No name available</span
            >
            <a-input
                ref="nameRef"
                tabindex="0"
                v-model:value="localValue"
                v-else
                @blur="handleBlur"
                :rows="4"
            ></a-input>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
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
        and,
        useActiveElement,
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
            readOnly: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const { readOnly } = toRefs(props)
            const localValue = ref(modelValue.value)
            const isEdit = ref(false)
            const nameRef: Ref<null | HTMLInputElement> = ref(null)

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            const handleReset = (val) => {
                localValue.value = val
            }

            const { start } = useTimeoutFn(() => {
                nameRef.value?.focus()
            }, 100)

            const handleBlur = () => {
                isEdit.value = false
                handleChange()
            }
            const handleEdit = () => {
                if (!readOnly?.value) {
                    isEdit.value = true
                    start()
                }
            }

            const activeElement = useActiveElement()
            const notUsingInput = computed(
                () =>
                    activeElement.value?.tagName !== 'INPUT' &&
                    activeElement.value?.tagName !== 'TEXTAREA'
            )

            const { n } = useMagicKeys()

            whenever(and(n, notUsingInput), () => {
                handleEdit()
            })

            return {
                localValue,
                handleEdit,
                handleChange,
                nameRef,
                isEdit,
                start,
                handleBlur,
                handleReset,
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
