<template>
    <div
        v-if="announcementTitle(selectedAsset)"
        class="flex flex-col px-3 py-3"
        :class="bgClass"
    >
        <AssetTitleCtx
            v-if="showAssetName"
            :item="selectedAsset"
            class="mb-1"
        ></AssetTitleCtx>
        <div class="flex justify-between">
            <div class="flex flex-col w-full">
                <div class="flex items-center font-bold text-gray-700">
                    <AtlanIcon
                        :icon="icon"
                        class="mr-2 h-4 mb-0.5"
                        style="min-width: 1rem"
                    ></AtlanIcon>
                    {{ announcementTitle(selectedAsset) }}
                </div>
                <div
                    v-linkified="{
                        className: 'text-primary',
                        target: '_blank',
                    }"
                    class="text-gray-500 break-words whitespace-pre-wrap"
                >
                    {{ announcementMessage(selectedAsset) }}
                </div>
            </div>
            <div
                v-if="selectedAssetUpdatePermission(selectedAsset) && allowEdit"
            >
                <a-dropdown trigger="click" placement="bottomRight">
                    <div>
                        <AtlanIcon
                            icon="KebabMenu"
                            class="h-4 m-0 cursor-pointer hover:text-primary"
                        />
                    </div>
                    <!-- <a-button
                        class="px-2 bg-transparent border-none shadow-none hover:bg-white hover:shadow-sm"
                    >
                    </a-button> -->

                    <template #overlay>
                        <a-menu mode="vertical">
                            <a-menu-item key="edit">
                                <AddAnnouncementModal
                                    :asset="selectedAsset"
                                    :updating="true"
                                    ><template #trigger>
                                        <div class="flex items-center">
                                            <AtlanIcon
                                                icon="Edit"
                                                class="h-4 mr-2"
                                            />
                                            Edit
                                        </div></template
                                    ></AddAnnouncementModal
                                >
                            </a-menu-item>
                            <a-menu-item key="delete">
                                <DeleteAnnouncementModal
                                    :asset="selectedAsset"
                                    :edit-permission="
                                        selectedAssetUpdatePermission(
                                            selectedAsset
                                        )
                                    "
                                    ><template #trigger>
                                        <div
                                            class="flex items-center text-red-500"
                                        >
                                            <AtlanIcon
                                                icon="Delete"
                                                class="h-4 mr-2"
                                            />
                                            Delete
                                        </div></template
                                    ></DeleteAnnouncementModal
                                ></a-menu-item
                            >
                        </a-menu>
                    </template>
                </a-dropdown>
            </div>
        </div>

        <div
            class="flex items-center justify-between mt-2 text-gray-500 gap-x-1"
            v-if="announcementUpdatedBy(selectedAsset)"
        >
            <div class="flex text-sm">
                <UserAvatar
                    :username="announcementUpdatedBy(selectedAsset)"
                    :show-username="true"
                ></UserAvatar>
            </div>
            <span class="text-xs">{{
                announcementUpdatedAt(selectedAsset, true)
            }}</span>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import AddAnnouncementModal from '@common/widgets/announcement/addAnnouncementModal.vue'
    import DeleteAnnouncementModal from '@common/widgets/announcement/deleteAnnouncementModal.vue'
    import UserAvatar from '@common/avatar/user.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AssetTitleCtx from './assetTitleContext.vue'

    export default defineComponent({
        name: 'AnnouncementWidget',
        components: {
            AddAnnouncementModal,
            DeleteAnnouncementModal,
            UserAvatar,
            AssetTitleCtx,
        },

        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            allowEdit: {
                type: Boolean,
                required: false,
                default: true,
            },
            noBorder: {
                type: Boolean,
                required: false,
                default: false,
            },
            showAssetName: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props) {
            const { selectedAsset, allowEdit, noBorder, showAssetName } =
                toRefs(props)
            const {
                announcementTitle,
                announcementMessage,
                announcementType,
                announcementUpdatedAt,
                announcementUpdatedBy,
                selectedAssetUpdatePermission,
            } = useAssetInfo()

            const bgClass = computed(() => {
                if (!announcementType(selectedAsset.value)) {
                    return ''
                }
                switch (announcementType(selectedAsset.value)?.toLowerCase()) {
                    case 'information':
                        return noBorder.value
                            ? 'information-bg'
                            : 'information-bg information-border border rounded'
                    case 'issue':
                        return noBorder.value
                            ? 'issue-bg'
                            : 'issue-bg issue-border border rounded'
                    case 'warning':
                        return noBorder.value
                            ? 'warning-bg'
                            : 'warning-bg warning-border border rounded'

                    default:
                        return 'information-bg information-border'
                }
            })

            const icon = computed(() => {
                if (!announcementType(selectedAsset.value)) {
                    return ''
                }
                switch (announcementType(selectedAsset.value)?.toLowerCase()) {
                    case 'information':
                        return 'InformationAnnouncement'
                    case 'issue':
                        return 'IssuesAnnouncement'
                    case 'warning':
                        return 'WarningAnnouncement'
                    default:
                        return 'InformationAnnouncement'
                }
            })

            return {
                announcementTitle,
                announcementMessage,
                announcementType,
                announcementUpdatedAt,
                announcementUpdatedBy,
                selectedAssetUpdatePermission,
                bgClass,
                icon,
                showAssetName,
                allowEdit,
                noBorder,
            }
        },
    })
</script>

<style lang="less" scoped>
    .information-bg {
        @apply bg-primary-light;
    }
    .issue-bg {
        background-color: rgba(249, 220, 210, 1);
    }
    .warning-bg {
        background-color: rgba(255, 239, 208, 1);
    }
    .information-border {
        background-color: #f5faff;
        border-color: #5277d7;
        // @apply border-primary;
    }
    .issue-border {
        border-color: rgba(207, 89, 46, 1);
    }
    .warning-border {
        border-color: rgba(255, 177, 25, 1);
    }
</style>
