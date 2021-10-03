<template>
    <a-dropdown
        v-model:visible="isVisible"
        trigger="click"
        placement="bottomRight"
    >
        <a-button class="px-2">
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

                <a-sub-menu key="status">
                    <template #title>
                        <div class="flex items-center justify-between">
                            <StatusBadge
                                :key="asset?.guid"
                                :status-id="asset?.attributes?.assetStatus"
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

                <a-sub-menu key="owner">
                    <template #title>
                        <div class="flex items-center">
                            <AtlanIcon icon="AddUser" />
                            <span class="pl-2 text-sm">Add Owner</span>
                            <AtlanIcon
                                class="flex-none ml-auto -mr-2"
                                icon="ChevronRight"
                            />
                        </div>
                    </template>
                    <template #expandIcon />
                    <a-menu-item class="m-0 bg-white">
                        <Owners
                            :selectedAsset="asset"
                            @update:selectedAsset="updateAsset"
                        />
                    </a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="widgets">
                    <template #title>
                        <div class="flex items-center">
                            <AtlanIcon icon="Widgets" />
                            <span class="pl-2 text-sm">Widgets</span>
                            <AtlanIcon
                                class="flex-none ml-auto -mr-2"
                                icon="ChevronRight"
                            />
                        </div>
                    </template>
                    <template #expandIcon />
                    <a-menu-item key="copyLink">
                        <div class="flex items-center">
                            <AtlanIcon icon="Readme" />
                            <span class="pl-2 text-sm"> Readme </span>
                        </div>
                    </a-menu-item>
                    <a-menu-item key="copyLink">
                        <div class="flex items-center">
                            <AtlanIcon icon="Megaphone" />
                            <span class="pl-2 text-sm"> Announcements </span>
                        </div>
                    </a-menu-item>
                    <a-menu-item key="copyLink">
                        <div class="flex items-center">
                            <AtlanIcon icon="Link" />
                            <span class="pl-2 text-sm"> Resources </span>
                        </div>
                    </a-menu-item>
                </a-sub-menu>
                <a-menu-divider />
                <a-menu-item
                    key="archive"
                    class="flex items-center text-red-700"
                >
                    <div class="flex items-center justify-between">
                        <AtlanIcon icon="Trash" />
                        <span class="pl-2 text-sm">Archive</span>
                    </div>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
    import { defineComponent, ref, PropType, computed } from 'vue'
    import { useRouter } from 'vue-router'

    // components
    import StatusBadge from '@common/badge/status/index.vue'
    import Owners from '@/glossary/threeDotMenu/owners.vue'
    import Status from '@/glossary/threeDotMenu/status.vue'
    import AddGtcModal from '@/glossary/gtcCrud/addGtcModal.vue'
    import Categories from '@/glossary/common/categories.vue'

    // utils
    import { copyToClipboard } from '~/utils/clipboard'

    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: { Status, Owners, StatusBadge, AddGtcModal, Categories },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
                default: () => {},
            },
        },
        setup(props, context) {
            // data
            const isVisible = ref(false)
            const router = useRouter()

            const closeMenu = () => {
                isVisible.value = false
            }

            function handleCopyProfileLink() {
                // FIXME:
                // const baseUrl = window.location.origin
                // const text = `${baseUrl}/glossary/${
                //     assetTypeLabel[props.asset?.typeName]
                // }/${props?.asset?.guid}`
                // copyToClipboard(text)
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
