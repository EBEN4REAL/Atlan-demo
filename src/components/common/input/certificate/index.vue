<template>
    <div class="flex items-center text-xs text-gray-500">
        <a-popover
            placement="leftBottom"
            :overlayClassName="$style.certificatePopover"
            @visibleChange="handleVisibleChange"
            v-model:visible="isEdit"
            :trigger="['click']"
        >
            <template #content>
                <CertificateFacet
                    :isRadio="true"
                    v-model="localValue.certificateStatus"
                ></CertificateFacet>
                <div class="px-3 mt-1">
                    <p class="text-sm text-gray-500">Message</p>
                    <a-textarea
                        :rows="4"
                        v-model:value="localValue.certificateStatusMessage"
                    >
                    </a-textarea>
                </div>
            </template>

            <CertificatePill
                v-if="
                    certificateStatus(selectedAsset) !== 'NONE' &&
                    certificateStatus(selectedAsset)
                "
                class="w-full"
                :status="certificateStatus(selectedAsset)"
                :message="certificateStatusMessage(selectedAsset)"
                :username="certificateUpdatedBy(selectedAsset)"
                :timestamp="certificateUpdatedAt(selectedAsset)"
            ></CertificatePill>
            <a-button
                v-else
                shape="circle"
                size="small"
                class="text-center shadow  hover:bg-primary-light hover:border-primary"
            >
                <span><AtlanIcon icon="Add" class="h-3"></AtlanIcon></span
            ></a-button>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        computed,
        ref,
        watch,
        nextTick,
        reactive,
    } from 'vue'
    import {
        and,
        useActiveElement,
        useMagicKeys,
        useVModels,
        whenever,
    } from '@vueuse/core'
    // import { message } from 'ant-design-vue'
    // import updateAsset from '~/composables/discovery/updateAsset'
    import { assetInterface } from '~/types/assets/asset.interface'
    // import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { certificateList } from '~/constant/certification'
    // import assetTypeLabel from '@/glossary/constants/assetTypeLabel'

    import CertificatePill from '@/common/pills/certificate.vue'
    import CertificateFacet from '@/common/facet/certificate/index.vue'
    import whoami from '~/composables/user/whoami'

    import confetti from '~/utils/confetti'

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
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const isEdit = ref(false)

            const {
                certificateStatus,
                certificateStatusMessage,
                certificateUpdatedBy,
                certificateUpdatedAt,
                selectedAsset,
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
                    activeElement.value?.tagName !== 'TEXTAREA'
            )
            const { c, Escape, v } = useMagicKeys()
            whenever(and(c, notUsingInput), () => {
                if (!isEdit.value) {
                    isEdit.value = true
                }
            })

            whenever(and(v, notUsingInput), () => {
                console.log('dd')
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
                selectedAsset,
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
