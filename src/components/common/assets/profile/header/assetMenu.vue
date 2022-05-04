<template>
    <a-dropdown
        v-model:visible="isVisible"
        trigger="click"
        placement="bottomRight"
    >
        <slot></slot>
        <template #overlay>
            <a-menu class="" style="min-width: 200px" mode="vertical">
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
                    v-if="isGTC(asset)"
                    key="edit"
                    class="px-4 py-2"
                    @click="closeMenu"
                >
                    <template v-if="editPermission">
                        <div
                            class="flex items-center"
                            @click="$emit('edit', asset)"
                        >
                            <AtlanIcon icon="Pencil" class="mr-2" />
                            <p class="p-0 m-0">Rename</p>
                        </div>
                    </template>
                    <template v-else>
                        <RenameModal
                            :entityType="asset?.typeName"
                            :entityTitle="asset?.attributes?.name"
                            :selected-asset="asset"
                        >
                            <template #trigger>
                                <div class="flex items-center">
                                    <AtlanIcon icon="Pencil" class="m-0 mr-2" />
                                    <p class="p-0 m-0">Rename</p>
                                </div>
                            </template>
                        </RenameModal>
                    </template>
                </a-menu-item>

                <a-menu-item
                    key="announcement"
                    class="px-4 py-2"
                    @click="closeMenu"
                >
                    <template v-if="editPermission">
                        <AnnouncementModal
                            :updating="announcementTitle(asset) ? true : false"
                            :asset="asset"
                        >
                            <template #trigger>
                                <div class="flex items-center">
                                    <AtlanIcon icon="Megaphone" />
                                    <span class="pl-2 text-sm">
                                        {{
                                            announcementTitle(asset)
                                                ? 'Edit'
                                                : 'Add'
                                        }}
                                        Announcement
                                    </span>
                                </div>
                            </template>
                        </AnnouncementModal>
                    </template>
                    <template v-else>
                        <a-tooltip
                            placement="right"
                            title="You don't have permission to perform this action"
                        >
                            <div
                                class="flex items-center text-gray-500 cursor-not-allowed"
                            >
                                <AtlanIcon icon="Megaphone" />
                                <span class="pl-2 text-sm"
                                    >{{
                                        announcementTitle(asset)
                                            ? 'Edit'
                                            : 'Add'
                                    }}
                                    Announcement
                                </span>
                            </div>
                        </a-tooltip>
                    </template>
                </a-menu-item>
                <!-- Bulk upload hidden for GA  : only available for secret url i.e. ?sandbox=true-->
                <a-menu-item
                    v-if="asset?.typeName === 'AtlasGlossary'"
                    key="bulk upload"
                    class="px-4 py-2"
                    @click="closeMenu"
                >
                    <BulkUploadModal :entity="asset">
                        <template #trigger>
                            <div class="flex items-center">
                                <AtlanIcon
                                    icon="Download"
                                    class="m-0 mr-2 transform rotate-180 text-primary"
                                />
                                <p class="p-0 m-0 text-gray-700 capitalize">
                                    Bulk upload terms
                                </p>
                            </div>
                        </template>
                    </BulkUploadModal>
                </a-menu-item>

                <a-menu-item
                    v-if="isGTC(asset)"
                    key="archive"
                    class="px-4 py-2"
                    @click="closeMenu"
                >
                    <template v-if="deletePermission">
                        <RemoveGTCModal
                            :entity-type="asset.typeName"
                            :entity="asset"
                            :redirect="true"
                        >
                            <template #trigger>
                                <div>
                                    <div class="flex items-center">
                                        <AtlanIcon
                                            icon="Trash"
                                            class="m-0 mr-2 text-red-700"
                                        />
                                        <p class="p-0 m-0">Archive</p>
                                    </div>
                                </div>
                            </template>
                        </RemoveGTCModal>
                    </template>
                    <template v-else>
                        <a-tooltip
                            placement="right"
                            title="You don't have permission to perform this action"
                        >
                            <div>
                                <div
                                    class="flex items-center text-gray-500 cursor-not-allowed"
                                >
                                    <AtlanIcon
                                        icon="Trash"
                                        class="m-0 mr-2 text-red-300"
                                    />
                                    <p class="p-0 m-0">Archive</p>
                                </div>
                            </div>
                        </a-tooltip>
                    </template>
                </a-menu-item>

                <!-- <a-menu-item
                    key="archive"
                    class="flex items-center text-red-700"
                >
                    <div class="flex items-center">
                        <AtlanIcon icon="Trash" />
                        <span class="pl-2 text-sm">Archive</span>
                    </div>
                </a-menu-item> -->
            </a-menu>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
    import {
        defineComponent,
        ref,
        PropType,
        toRefs,
        inject,
        computed,
    } from 'vue'
    import { useRoute } from 'vue-router'

    // components
    import AnnouncementModal from '@common/widgets/announcement/addAnnouncementModal.vue'
    import BulkUploadModal from '@/glossary/modal/bulkUploadModal.vue'
    import RemoveGTCModal from '@/glossary/modal/removeGTCModal.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import RenameModal from '@/glossary/modal/renameModal.vue'

    // utils
    import { assetInterface } from '~/types/assets/asset.interface'
    import map from '~/constant/accessControl/map'
    import useAuth from '~/composables/auth/useAuth'

    export default defineComponent({
        components: { AnnouncementModal, RemoveGTCModal, BulkUploadModal , RenameModal },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
                default: () => {},
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
            deletePermission: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        emit: ['edit'],
        setup(props) {
            // data
            const isVisible = ref(false)
            const { isGTC, announcementTitle } = useAssetInfo()
            const route = useRoute()
            const sandbox = computed(() => route?.query?.sandbox || '')

            const closeMenu = () => {
                isVisible.value = false
            }
            const { checkAccess } = useAuth()
            return {
                isVisible,
                announcementTitle,
                closeMenu,
                isGTC,
                sandbox,
                map,
                checkAccess,
            }
        },
    })
</script>
