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
            <span v-if="!isEdit && description(selectedAsset)">{{
                description(selectedAsset)
            }}</span>
            <span v-else-if="!isEdit && description(selectedAsset) === ''"
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
        computed,
        defineComponent,
        nextTick,
        inject,
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
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

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

            const { description } = useAssetInfo()
            const selectedAsset = inject('selectedAsset')

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

            const activeElement = useActiveElement()
            const notUsingInput = computed(
                () =>
                    activeElement.value?.tagName !== 'INPUT' &&
                    activeElement.value?.tagName !== 'TEXTAREA' &&
                    activeElement.value?.attributes?.contenteditable?.value !==
                        'true'
            )

            const { d } = useMagicKeys()

            whenever(and(d, notUsingInput), () => {
                handleEdit()
            })

            return {
                localValue,
                handleEdit,
                handleChange,
                descriptionRef,
                isEdit,
                start,
                handleBlur,
                selectedAsset,
                description,
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
