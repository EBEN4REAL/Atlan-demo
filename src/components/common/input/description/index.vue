<template>
    <div>
        <Shortcut
            shortcut-key="d"
            action="set description"
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
                        v-if="!isEdit && description(selectedAsset)"
                        class="break-words whitespace-pre-wrap"
                        >{{ description(selectedAsset) }}</span
                    >
                    <span
                        v-else-if="!isEdit && description(selectedAsset) === ''"
                        class="text-gray-600"
                        >No description available</span
                    >
                    <a-textarea
                        v-else
                        ref="descriptionRef"
                        v-model:value="localValue"
                        tabindex="0"
                        :autosize="{ minRows: 4 }"
                        @blur="handleBlur"
                        @keyup.esc="handleCancel"
                    ></a-textarea>
                    <div v-katex="'\\frac{a_i}{1+x}e^\\frac{2}{2+y}'"></div>
                    
                </div>
            </div>
            <div
                v-if="!editPermission && role !== 'Guest' && isEdit"
                class="px-3 py-2 mt-3 bg-gray-100"
            >
                You don't have edit access. Suggest a new Description and
                <span class="cursor-pointer text-primary">
                    <a-popover placement="rightBottom">
                        <template #content>
                            <AdminList></AdminList>
                        </template>
                        <span>Admins</span>
                    </a-popover>
                </span>
                can review your request.
            </div>
        </Shortcut>
        <p
            v-if="descriptionRef !== null"
            class="mt-1 text-xs text-right text-gray-500"
        >
            <span class="font-bold">{{ isMac ? 'Return' : 'Enter' }}</span> to
            save
            <span class="ml-2">
                <span class="font-bold"
                    >Shift + {{ isMac ? 'Return' : 'Enter' }}</span
                >
                to add a new line
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
        defineAsyncComponent,
    } from 'vue'
    import {
        and,
        useActiveElement,
        useMagicKeys,
        useTimeoutFn,
        useVModels,
        whenever,
    } from '@vueuse/core'
    import { message } from 'ant-design-vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Shortcut from '@/common/popover/shortcut.vue'
    import whoami from '~/composables/user/whoami'
    import { useCreateRequests } from '~/composables/requests/useCreateRequests'

    export default defineComponent({
        name: 'DescriptionWidget',
        components: {
            Shortcut,
            AdminList: defineAsyncComponent(
                () => import('@/common/info/adminList.vue')
            ),
        },
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
            readOnly: {
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
            const { role } = whoami()
            const descriptionRef: Ref<null | HTMLInputElement> = ref(null)

            const { description } = useAssetInfo()
            const descriptionSnapshot = ref(modelValue.value)

            /**
             * A utility function to update the model value, and emit a `change`
             * event.
             */
            const handleChange = () => {
                modelValue.value = localValue.value
                if (editPermission.value) emit('change')
                else handleRequest()
            }

            const { d, enter, shift } = useMagicKeys()

            const { start } = useTimeoutFn(() => {
                descriptionRef.value?.focus()
            }, 100)

            /**
             * A utility function to handle both blur and keyboard events
             */
            const handleBlur = () => {
                if (enter.value) {
                    return
                }
                isEdit.value = false
                handleChange()
            }

            const handleEdit = () => {
                if (
                    !props.readOnly &&
                    (role.value !== 'Guest' || editPermission.value)
                ) {
                    isEdit.value = true
                    start()
                }
            }

            const handleRequest = () => {
                if (descriptionSnapshot.value === localValue.value) {
                    return
                }
                const {
                    error: requestError,
                    isLoading: isRequestLoading,
                    isReady: requestReady,
                } = useCreateRequests({
                    assetGuid: selectedAsset.value?.guid,
                    assetQf: selectedAsset.value?.attributes?.qualifiedName,
                    assetType: selectedAsset.value?.typeName,
                    userDescription: localValue.value,
                    requestType: 'userDescription',
                })
                whenever(requestError, () => {
                    if (requestError.value) {
                        message.error(`Request failed`)
                        isEdit.value = false
                    }
                })
                whenever(requestReady, () => {
                    if (requestReady.value) {
                        message.success(`Request raised`)
                        isEdit.value = false
                        descriptionSnapshot.value = localValue.value
                    }
                })
            }

            const handleCancel = () => {
                if (isEdit.value) {
                    isEdit.value = false
                    localValue.value = modelValue.value
                }
            }

            // The shortcut keys will change in accordance with this property.
            const isMac = window.navigator.userAgent.indexOf('Mac') !== -1

            const activeElement = useActiveElement()
            const notUsingInput = computed(
                () =>
                    activeElement.value?.tagName !== 'INPUT' &&
                    activeElement.value?.tagName !== 'TEXTAREA' &&
                    activeElement.value?.attributes?.contenteditable?.value !==
                        'true'
            )
            const handleCancelRequest = () => {
                isEdit.value = false
            }

            whenever(
                and(d, notUsingInput, !inProfile.value, editPermission.value),
                () => {
                    handleEdit()
                }
            )
            watchEffect(() => {
                if (enter.value && !shift.value && isEdit.value) {
                    isEdit.value = false
                    handleChange()
                }
            })

            watch(selectedAsset, () => {
                localValue.value = description(selectedAsset.value)
            })

            return {
                localValue,
                handleEdit,
                handleChange,
                descriptionRef,
                isEdit,
                start,
                handleBlur,
                description,
                isMac,
                handleCancel,
                role,
                handleCancelRequest,
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
