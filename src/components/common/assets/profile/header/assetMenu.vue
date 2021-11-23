<template>
    <a-dropdown
        v-model:visible="isVisible"
        trigger="click"
        placement="bottomRight"
    >
        <slot></slot>
        <template #overlay>
            <a-menu mode="vertical">
                <!-- <a-sub-menu key="status" :disabled="!editPermission">
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
                <a-sub-menu key="owner" :disabled="!editPermission">
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
                </a-sub-menu>-->
                <a-menu-item
                    key="announcement"
                    :disabled="!editPermission"
                    @click="closeMenu"
                    ><AnnouncementModal :asset="asset"
                        ><template #trigger>
                            <div class="flex items-center">
                                <AtlanIcon icon="Megaphone" />
                                <span class="pl-2 text-sm"
                                    >Add Announcement</span
                                >
                            </div></template
                        ></AnnouncementModal
                    ></a-menu-item
                >
                <a-menu-item
                    key="archive"
                    class="flex items-center text-red-700"
                >
                    <div class="flex items-center">
                        <AtlanIcon icon="Trash" />
                        <span class="pl-2 text-sm">Archive</span>
                    </div>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
    import { defineComponent, ref, PropType, toRefs } from 'vue'

    // components
    import AnnouncementModal from '@common/widgets/announcement/addAnnouncementModal.vue'

    // utils
    import { copyToClipboard } from '~/utils/clipboard'
    import { assetInterface } from '~/types/assets/asset.interface'
    export default defineComponent({
        components: { AnnouncementModal },
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
            function handleCopyProfileLink() {
                const baseUrl = window.location.origin
                const text = `${baseUrl}/assets/${asset.value?.guid}/overview`
                copyToClipboard(text)
            }

            return {
                handleCopyProfileLink,
                isVisible,
                closeMenu,
            }
        },
    })
</script>
