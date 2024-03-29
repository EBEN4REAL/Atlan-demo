<template>
    <div>
        <div v-if="isEdit" class="freeze-clicks-outside-popover"></div>

        <Shortcut
            shortcut-key="n"
            action="set name"
            placement="left"
            :edit-permission="editPermission && !isEdit"
        >
            <div
                class="flex flex-col px-1 rounded"
                :class="{
                    'bg-primary-light': isEdit,
                    'hover:bg-primary-light': editPermission,
                }"
            >
                <div
                    class="text-sm text-gray-700"
                    :class="$style.editable"
                    @click="handleEdit"
                >
                    <span
                        v-if="!isEdit && localValue"
                        class="break-words whitespace-pre-wrap"
                        >{{ localValue }}</span
                    >
                    <span
                        v-else-if="!isEdit && localValue === ''"
                        class="text-gray-700"
                        >No name available</span
                    >
                    <a-input
                        v-else
                        ref="nameRef"
                        v-model:value="localValue"
                        tabindex="0"
                        :rows="4"
                        @blur="handleBlur"
                        @keyup.esc="handleCancel"
                    ></a-input>
                </div></div
        ></Shortcut>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        Ref,
        ref,
        toRefs,
        watchEffect,
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
    import Shortcut from '@/common/popover/shortcut.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'NameWidget',
        components: { Shortcut },
        props: {
            modelValue: {
                type: String,
                required: true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
            selectedAsset: {
                type: Object,
                required: false,
                default: () => {},
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const { editPermission, selectedAsset } = toRefs(props)
            const localValue = ref(modelValue.value)
            const isEdit = ref(false)
            const nameRef: Ref<null | HTMLInputElement> = ref(null)
            const { title } = useAssetInfo()

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            const handleCancel = () => {
                if (isEdit.value) {
                    isEdit.value = false
                    localValue.value = modelValue.value
                }
            }

            const { n, enter } = useMagicKeys()

            const { start } = useTimeoutFn(() => {
                nameRef.value?.focus()
            }, 100)

            const handleBlur = () => {
                if (enter.value) {
                    return
                }
                isEdit.value = false
                handleChange()
            }
            const handleEdit = () => {
                if (editPermission?.value) {
                    isEdit.value = true
                    start()
                }
            }

            const activeElement = useActiveElement()
            const notUsingInput = computed(
                () =>
                    activeElement.value?.tagName !== 'INPUT' &&
                    activeElement.value?.tagName !== 'TEXTAREA' &&
                    activeElement.value?.attributes?.contenteditable?.value !==
                        'true'
            )

            watchEffect(() => {
                if (enter.value && isEdit.value) {
                    isEdit.value = false
                    handleChange()
                }
            })

            whenever(and(n, notUsingInput, editPermission.value), () => {
                handleEdit()
            })

            watch(selectedAsset, () => {
                localValue.value = title(selectedAsset.value)
            })
            return {
                localValue,
                handleEdit,
                handleChange,
                nameRef,
                isEdit,
                start,
                handleBlur,
                handleCancel,
                title,
            }
        },
    })
</script>

<style lang="less" module>
    .editable {
        :global(.ant-input) {
            @apply border-none bg-transparent shadow-none px-0 py-0 rounded-none  !important;
            z-index: 800 !important;
        }
        :global(.ant-input:focus) {
            @apply border-none bg-transparent shadow-none px-0 py-0 rounded-none !important;
        }
    }
</style>
