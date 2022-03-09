<template>
    <div class="flex items-center text-xs text-gray-500">
        <a-popover
            v-if="showPopover && role !== 'Guest'"
            v-model:visible="isEdit"
            placement="leftTop"
            :overlay-class-name="$style.certificatePopover"
            :trigger="['click']"
            @visibleChange="handleVisibleChange"
        >
            <template #content>
                <div
                    v-if="!editPermission && role !== 'Guest'"
                    class="px-3 py-2 mx-4 mb-3 bg-gray-100"
                >
                    You don't have edit access, suggest a new Certificate.<br />
                    <span class="text-primary cursor-pointer">
                        <a-popover placement="rightBottom">
                            <template #content>
                                <AdminList></AdminList>
                            </template>
                            <span>Admins</span>
                        </a-popover>
                    </span>
                    can review the requests.
                </div>

                <CertificateFacet
                    v-model="localValue.certificateStatus"
                    :is-radio="true"
                ></CertificateFacet>
                <div class="px-3">
                    <p class="text-sm text-gray-500">Message</p>
                    <a-textarea
                        v-model:value="localValue.certificateStatusMessage"
                        :rows="4"
                    >
                    </a-textarea>
                </div>
                <div
                    v-if="!editPermission && role !== 'Guest'"
                    class="flex items-center justify-end mx-2 space-x-2 mt-5"
                >
                    <a-button @click="handleCancelRequest">Cancel</a-button>
                    <a-button
                        type="primary"
                        :loading="requestLoading"
                        @click="handleRequest"
                        class="bg-primary"
                        >Submit Request</a-button
                    >
                </div>
            </template>
        </a-popover>
        <CertificatePill
            v-if="certificateStatus(selectedAsset)"
            class="w-full"
            :class="{ 'cursor-pointer': editPermission }"
            :status="certificateStatus(selectedAsset)"
            :message="certificateStatusMessage(selectedAsset)"
            :username="certificateUpdatedBy(selectedAsset)"
            :timestamp="certificateUpdatedAt(selectedAsset)"
            @click="() => (isEdit = true)"
        ></CertificatePill>

        <span v-else-if="showMessage" class="text-sm text-gray-500">{{
            certificateStatusMessage(selectedAsset)
        }}</span>
        <div v-else class="flex items-center gap-1">
            <a-tooltip
                placement="left"
                :title="
                    !editPermission && role === 'Guest'
                        ? `You don't have permission to add owners to this asset`
                        : ''
                "
                :mouse-enter-delay="0.5"
            >
                <Shortcut
                    shortcut-key="c"
                    action="set certificate"
                    placement="left"
                    :edit-permission="editPermission"
                >
                    <a-button
                        v-if="showAddBtn"
                        :disabled="role === 'Guest' && !editPermission"
                        shape="circle"
                        size="small"
                        class="text-center shadow"
                        :class="{
                            editPermission:
                                'hover:bg-primary-light hover:border-primary',
                        }"
                        @click="handleOpenPopover"
                    >
                        <span
                            ><AtlanIcon
                                icon="Add"
                                class="h-3"
                            ></AtlanIcon></span></a-button
                ></Shortcut>
            </a-tooltip>
            <span v-if="!showAddBtn" class="-ml-1 text-sm text-gray-600"
                >No certification</span
            >
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        defineAsyncComponent,
        PropType,
        watch,
        computed,
        ref,
        toRefs,
        watchEffect,
    } from 'vue'
    import {
        and,
        useActiveElement,
        useMagicKeys,
        useVModels,
        whenever,
    } from '@vueuse/core'
    import { message } from 'ant-design-vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import { useCreateRequests } from '~/composables/requests/useCreateRequests'
    import CertificatePill from '@/common/pills/certificate.vue'
    import CertificateFacet from '@/common/facet/certificate/index.vue'
    import whoami from '~/composables/user/whoami'
    import Shortcut from '@/common/popover/shortcut.vue'
    import CertificateBadge from '@common/badge/certificate/index.vue'

    export default defineComponent({
        name: 'CertificateWidget',
        components: {
            CertificatePill,
            CertificateFacet,
            Shortcut,
            CertificateBadge,
            AdminList: defineAsyncComponent(
                () => import('@/common/info/adminList.vue')
            ),
        },
        props: {
            modelValue: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
            inProfile: {
                type: Boolean,
                required: false,
                default: false,
            },
            showMessage: {
                type: Boolean,
                required: false,
                default: () => {
                    return false
                },
            },
            showAddBtn: {
                type: Boolean,
                required: false,
                default: true,
            },
            showPopover: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const isEdit = ref(false)
            const { selectedAsset, inProfile, editPermission } = toRefs(props)

            const requestLoading = ref()
            const {
                certificateStatus,
                certificateStatusMessage,
                certificateUpdatedBy,
                certificateUpdatedAt,
            } = useAssetInfo()

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            const { username, role } = whoami()

            const handleVisibleChange = (visible) => {
                if (!visible) {
                    localValue.value.certificateUpdatedBy = username.value
                    handleChange()
                }
            }

            const handleOpenPopover = () => {
                isEdit.value = true
                requestLoading.value = false
            }

            const activeElement = useActiveElement()
            const notUsingInput = computed(
                () =>
                    activeElement.value?.tagName !== 'INPUT' &&
                    activeElement.value?.tagName !== 'TEXTAREA' &&
                    activeElement.value?.attributes?.contenteditable?.value !==
                        'true'
            )
            const handleRequest = () => {
                const {
                    error: requestError,
                    isLoading: isRequestLoading,
                    isReady: requestReady,
                } = useCreateRequests({
                    assetGuid: selectedAsset.value?.guid,
                    assetQf: selectedAsset.value?.attributes?.qualifiedName,
                    assetType: selectedAsset.value?.typeName,
                    certificate: localValue.value?.certificateStatus,
                })
                whenever(requestError, () => {
                    if (requestError.value) {
                        message.error(`Request failed`)
                        isEdit.value = false
                        requestLoading.value = false
                    }
                })
                whenever(requestReady, () => {
                    if (requestReady.value) {
                        message.success(`Request raised`)
                        isEdit.value = false
                        requestLoading.value = false
                    }
                })
                requestLoading.value = isRequestLoading.value
            }

            const handleCancelRequest = () => {
                isEdit.value = false
            }

            // keyboard shortcuts
            const { c, Escape, v, enter, shift } = useMagicKeys()
            whenever(
                and(c, notUsingInput, !inProfile.value, editPermission.value),
                () => {
                    if (!isEdit.value) {
                        isEdit.value = true
                    }
                }
            )

            whenever(and(v, notUsingInput), () => {
                if (isEdit.value) {
                    localValue.value.certificateStatus = 'VERIFIED'
                    handleChange()
                }
            })

            whenever(and(Escape), () => {
                if (isEdit.value) {
                    handleChange()
                    isEdit.value = false
                }
            })

            watchEffect(() => {
                if (enter.value && !shift.value && isEdit.value) {
                    localValue.value.certificateUpdatedBy = username.value
                    handleChange()
                    isEdit.value = false
                }
            })

            watch(selectedAsset, () => {
                localValue.value.certificateStatus = certificateStatus(
                    selectedAsset.value
                )
                localValue.value.certificateStatusMessage =
                    certificateStatusMessage(selectedAsset.value)
            })

            return {
                localValue,
                handleChange,
                handleVisibleChange,
                username,
                isEdit,
                certificateStatus,
                certificateStatusMessage,
                certificateUpdatedBy,
                certificateUpdatedAt,
                handleOpenPopover,
                role,
                handleRequest,
                handleCancelRequest,
                requestLoading,
            }
        },
    })
</script>

<style lang="less" module>
    .certificatePopover {
        :global(.ant-popover-inner-content) {
            @apply px-0 py-3 !important;
            width: 250px !important;
        }
    }
</style>
