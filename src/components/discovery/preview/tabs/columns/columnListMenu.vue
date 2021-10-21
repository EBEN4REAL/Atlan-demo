<template>
    <a-dropdown
        v-model:visible="isVisible"
        trigger="click"
        placement="bottomRight"
    >
        <a-button
            class="px-2 text-gray-500 border-transparent shadow-none  hover:border-gray-300 hover:shadow-sm"
        >
            <AtlanIcon icon="KebabMenu" class="h-4 m-0" />
        </a-button>
        <template #overlay>
            <a-menu mode="vertical">
                <a-menu-item key="copyLink" @click="handleCopyProfileLink">
                    <div class="flex items-center">
                        <AtlanIcon icon="CopyOutlined" />
                        <span class="pl-2 text-sm">
                            Copy asset profile link
                        </span>
                    </div>
                </a-menu-item>
                <a-menu-divider />

                <a-sub-menu key="status" :disabled="!editPermission">
                    <template #title>
                        <div class="flex items-center justify-between">
                            <StatusBadge
                                :key="asset?.guid"
                                :status-id="
                                    asset?.attributes?.certificateStatus
                                "
                                :show-chip-style-status="false"
                                :show-no-status="true"
                                :show-label="true"
                                class="p-0"
                            ></StatusBadge>
                            <AtlanIcon
                                class="flex-none -mr-2"
                                icon="ChevronRight"
                            />
                        </div>
                    </template>
                    <template #expandIcon />

                    <a-menu-item class="m-0 bg-white">
                        <Status
                            v-if="asset?.guid"
                            :selectedAsset="asset"
                            @update:selectedAsset="updateAsset"
                        />
                    </a-menu-item>
                </a-sub-menu>

                <!-- <a-sub-menu key="classification">
                    <template #title>
                        <div class="flex items-center">
                            <AtlanIcon icon="AddUser" />
                            <span class="pl-2 text-sm">Add Classification</span>
                            <AtlanIcon
                                class="flex-none ml-auto -mr-2"
                                icon="ChevronRight"
                            />
                        </div>
                    </template>
                    <template #expandIcon />
                    <a-menu-item class="m-0 bg-white">
                        <Classification :selected-asset="asset" />
                    </a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="term">
                    <template #title>
                        <div class="flex items-center">
                            <AtlanIcon icon="AddUser" />
                            <span class="pl-2 text-sm">Add Term</span>
                            <AtlanIcon
                                class="flex-none ml-auto -mr-2"
                                icon="ChevronRight"
                            />
                        </div>
                    </template>
                    <template #expandIcon />
                    <a-menu-item class="m-0 bg-white">
                        <LinkTerms
                            :selected-asset="asset"
                            @update:selected-asset="updateAsset"
                        />
                    </a-menu-item>
                </a-sub-menu> -->
            </a-menu>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
    import { defineComponent, ref, PropType, toRefs } from 'vue'

    // components
    import StatusBadge from '@common/badge/status/index.vue'
    import Classification from '@common/sidebar/classifications.vue'
    import LinkTerms from '@common/sidebar/linkTerms.vue'
    import Status from '@/glossary/threeDotMenu/status.vue'

    // utils
    import { copyToClipboard } from '~/utils/clipboard'

    import useAssetInfo from '~/composables/asset/useAssetInfo'

    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: { Status, StatusBadge, Classification, LinkTerms },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
                default: () => {},
            },
            editPermission: {
                type: Boolean,
                required: true,
            },
        },
        setup(props, context) {
            // data
            const isVisible = ref(false)
            const { asset } = toRefs(props)

            const closeMenu = () => {
                isVisible.value = false
            }
            const { assetType } = useAssetInfo()

            const isColumnAsset = (paramAsset) =>
                assetType(paramAsset) === 'Column'

            const getColumnUrl = (paramAsset) => {
                const tableGuid = paramAsset.attributes?.table?.guid
                return `assets/${tableGuid}/overview?column=${paramAsset?.guid}`
            }

            const handleCopyProfileLink = () => {
                const baseUrl = window.location.origin
                if (isColumnAsset(asset.value)) {
                    const text = `${baseUrl}/${getColumnUrl(asset.value)}`
                    copyToClipboard(text)
                } else {
                    const text = `${baseUrl}/assets/${asset.value.guid}/overview`
                    copyToClipboard(text)
                }
            }

            function updateAsset() {}

            return {
                handleCopyProfileLink,
                isVisible,
                updateAsset,
                closeMenu,
            }
        },
    })
</script>
