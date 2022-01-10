<template>
    <a-drawer
        placement="right"
        :destroy-on-close="true"
        :visible="isVisible"
        :get-container="false"
        :closable="false"
        :keyboard="true"
        :maskClosable="true"
        :mask="true"
        :class="$style.drawerStyle"
        :width="460"
        :close="closeDrawer"
    >
        <div class="relative overflow-x-hidden overflow-y-hidden drawer_height">
            <div class="absolute w-full h-full pt-4 bg-white">
                <div class="flex items-center mx-4 mt-2">
                    <Tooltip
                        :tooltip-text="`Select and link assets to ${selectedAsset?.displayText}`"
                        classes="text-base font-bold text-gray-500"
                    />
                    <CertificateBadge
                        v-if="certificateStatus(selectedAsset)"
                        :status="certificateStatus(selectedAsset)"
                        :username="certificateUpdatedBy(selectedAsset)"
                        :timestamp="certificateUpdatedAt(selectedAsset)"
                        class="mb-1 ml-1"
                    ></CertificateBadge>
                </div>
                <Assets
                    :show-filters="false"
                    :static-use="true"
                    :show-aggrs="true"
                    :showCheckBox="true"
                    :preference="preference"
                    :allCheckboxAreaClick="true"
                    :disableHandlePreview="true"
                    class="pb-6 mt-2 asset-list-height"
                    key="all-assets"
                    page="glossary"
                />
            </div>
        </div>
        <a-divider />
        <div class="flex items-center justify-end mx-4 gap-x-2">
            <span class="text-base font-bold text-gray-500"
                >{{ selectedAssetCount || 'No' }} items selected</span
            >
            <AtlanBtn
                size="sm"
                padding="compact"
                color="secondary"
                @click="closeDrawer"
                data-test-id="cancel"
                >Cancel</AtlanBtn
            >
            <AtlanBtn
                size="sm"
                padding="compact"
                data-test-id="save"
                @click="saveAssets"
                >Link asset(s)</AtlanBtn
            >
        </div>
    </a-drawer>
    <a-modal
        v-model:visible="isModalVisible"
        width="25%"
        :closable="false"
        okText="Save"
        cancelText=""
        :footer="null"
    >
        <div class="p-3">
            <p class="mb-1 font-bold text-md">Cancel linking assets</p>
            <p class="text-md">This action will clear your selection.</p>
        </div>

        <div class="flex justify-end p-3 space-x-2 border-t border-gray-200">
            <a-button @click="handleCancel">Cancel</a-button>
            <a-button class="text-white bg-error" @click="handleConfirmCancel"
                >Confirm</a-button
            >
        </div>
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import Assets from '@/assets/index.vue'
    import Tooltip from '@/common/ellipsis/index.vue'
    import CertificateBadge from '@/common/badge/certificate/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'LinkedAssetsDrawer',
        components: {
            Assets,
            AtlanBtn,
            Tooltip,
            CertificateBadge,
        },
        props: {
            isVisible: {
                type: Object as PropType<Boolean>,
                required: true,
                default: false,
            },
            preference: {
                type: Object,
                required: false,
            },
            selectedAssetCount: {
                type: Number,
                required: true,
            },
            selectedAsset: {
                type: Object,
                required: true,
            },
        },
        emits: ['closeDrawer', 'saveAssets'],
        setup(props, { emit }) {
            const isModalVisible = ref(false)
            const closeDrawer = () => {
                isModalVisible.value = true
                // emit('closeDrawer')
            }
            const saveAssets = () => {
                emit('saveAssets')
            }
            const {
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
            } = useAssetInfo()
            const handleCancel = () => {
                isModalVisible.value = false
            }
            const handleConfirmCancel = () => {
                isModalVisible.value = false
                emit('closeDrawer')
            }
            return {
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                certificateStatusMessage,
                closeDrawer,
                saveAssets,
                isModalVisible,
                handleCancel,
                handleConfirmCancel,
            }
        },
    })
</script>

<style lang="less" module>
    .drawerStyle {
        :global(.ant-drawer-body) {
            overflow-y: hidden;
            height: 100%;
        }
    }
</style>
<style lang="less" scoped>
    .drawer_height {
        height: calc(100vh - 6rem);
    }
</style>
