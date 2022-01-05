<template>
    <div>
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
                    v-if="!isEdit && description(selectedAsset)"
                    class="whitespace-pre-wrap"
                >{{ description(selectedAsset) }}</span>
                <span
                    v-else-if="!isEdit && description(selectedAsset) === ''"
                    class="text-gray-500"
                    >No description available</span
                >
                <a-textarea
                    v-else
                    ref="descriptionRef"
                    v-model:value="localValue"
                    tabindex="0"
                    :rows="4"
                    @blur="handleBlur($event)"
                    @press-enter="handleBlur($event)"
                    @keydown.esc="handleBlur($event)"
                ></a-textarea>
            </div>
        </div>
        <p v-if="descriptionRef !== null" class="text-xs text-right mt-1 text-gray-500">
            <span class="font-bold">{{ isMac ? "Return" : "Enter" }}</span> to save
            <span class="ml-2">
                <span class="font-bold">Shift + {{ isMac ? "Return" : "Enter" }}</span> to add a new line
            </span>
        </p>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        watch,
        PropType,
        Ref,
        ref,
        toRefs,
        watchEffect,
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
    import { assetInterface } from '~/types/assets/asset.interface'
    import { Modal } from 'ant-design-vue'

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
                default: false,
            },
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
            },
            inProfile: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const { editPermission, selectedAsset, inProfile } = toRefs(props)
            const localValue = ref(modelValue.value)
            const isEdit = ref(false)
            const descriptionRef: Ref<null | HTMLInputElement> = ref(null)

            const { description } = useAssetInfo()

            /**
             * A utility function to update the model value, and emit a `change`
             * event.
             */
            const updateValue = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            // Do we need to show the confirmation modal
            const needToConfirm = ref(true)

            /**
             * A utility function to handle a change in the value, and show a
             * confirmation modal if necessary.
             */
            const handleChange = () => {
                // if (needToConfirm.value && localValue.value !== modelValue.value) {
                if (false) {
                    // Show a modal, if required.
                    Modal.confirm({
                        title: "Do you want to save your changes?",
                        content: "You made changes to the description, but didn't save them. Click on 'Yes' if you want to.",
                        keyboard: false,
                        okText: "Yes",
                        cancelText: "No",
                        onOk() {
                            updateValue()
                        },
                        onCancel() {
                            localValue.value = modelValue.value
                            isEdit.value = false
                        }
                    })
                }
                else {
                    updateValue()
                }
            }

            const { d, enter, shift } = useMagicKeys()

            /**
             * Here, the enter key, acts as a reset switch. If it is pressed,
             * we reset the modal show indicator to true.
             */
            watchEffect(() => {
                if (enter.value && !shift.value) {
                    needToConfirm.value = true
                }
            })

            const { start } = useTimeoutFn(() => {
                descriptionRef.value?.focus()
            }, 100)

            /**
             * A utility function to handle both blur and keyboard events
             * @param event
             */
            const handleBlur = (event: FocusEvent | KeyboardEvent) => {
                if (
                    event instanceof KeyboardEvent
                    && event.key === 'Enter'
                ) {
                    if (event.getModifierState('Shift')) {
                        return
                    }
                    needToConfirm.value = false
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

            // The shortcut keys will change in accordance with this property.
            const isMac = (window.navigator.userAgent.indexOf("Mac") !== -1)

            const activeElement = useActiveElement()
            const notUsingInput = computed(
                () =>
                    activeElement.value?.tagName !== 'INPUT' &&
                    activeElement.value?.tagName !== 'TEXTAREA' &&
                    activeElement.value?.attributes?.contenteditable?.value !==
                        'true'
            )

            whenever(
                and(d, notUsingInput, !inProfile.value, editPermission.value),
                () => {
                    handleEdit()
                }
            )

            watch(
                selectedAsset,
                () => {
                    localValue.value = description(selectedAsset.value)
                }
            )

            return {
                localValue,
                handleEdit,
                handleChange,
                descriptionRef,
                isEdit,
                start,
                handleBlur,
                description,
                updateValue,
                isMac
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
