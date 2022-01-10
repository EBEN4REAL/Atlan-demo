<template>
    <div class="flex items-center text-xs text-gray-500">
        <a-popover
            v-if="editPermission"
            v-model:visible="isEdit"
            placement="leftTop"
            :overlay-class-name="$style.certificatePopover"
            :trigger="['click']"
            @visibleChange="handleVisibleChange"
        >
            <template #content>
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
                    !editPermission
                        ? `You don't have permission to add a certification to this asset`
                        : ''
                "
                :mouse-enter-delay="0.5"
            >
                <a-button
                    v-if="showAddBtn"
                    :disabled="!editPermission"
                    shape="circle"
                    size="small"
                    class="text-center shadow"
                    :class="{
                        editPermission:
                            'hover:bg-primary-light hover:border-primary',
                    }"
                    @click="() => (isEdit = true)"
                >
                    <span><AtlanIcon icon="Add" class="h-3"></AtlanIcon></span
                ></a-button>
            </a-tooltip>

            <span v-if="!showAddBtn" class="-ml-1 text-sm text-gray-500"
                >No certification</span
            >
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
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
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import CertificatePill from '@/common/pills/certificate.vue'
    import CertificateFacet from '@/common/facet/certificate/index.vue'
    import whoami from '~/composables/user/whoami'

    export default defineComponent({
        name: 'CertificateWidget',
        components: {
            CertificatePill,
            CertificateFacet,
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
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const isEdit = ref(false)
            const { selectedAsset, inProfile, editPermission } = toRefs(props)

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

            const { username } = whoami()

            const handleVisibleChange = (visible) => {
                if (!visible) {
                    localValue.value.certificateUpdatedBy = username.value
                    handleChange()
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
