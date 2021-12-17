<template>
    <div
        v-if="announcementTitle(selectedAsset)"
        class="flex justify-between px-3 py-2 border rounded"
        :class="bgClass"
    >
        <div class="flex flex-col">
            <div class="font-bold text-gray-700">
                {{ announcementTitle(selectedAsset) }}
            </div>
            <div class="text-gray-500">
                {{ announcementMessage(selectedAsset) }}
            </div>
            <div class="flex items-center mt-2 text-gray-500 gap-x-1">
                <div class="flex text-sm">
                    <AtlanIcon :icon="icon" class="mt-0.5"></AtlanIcon>
                    <div class="ml-1">
                        {{ announcementUpdatedBy(selectedAsset) }},
                    </div>
                </div>
                {{ announcementUpdatedAt(selectedAsset, true) }}
            </div>
        </div>
        <div v-if="editPermission(selectedAsset)">
            <a-dropdown trigger="click" placement="bottomRight">
                <a-button
                    class="px-2 bg-transparent border-none shadow-none hover:bg-white hover:shadow-sm"
                >
                    <AtlanIcon icon="KebabMenu" class="h-4 m-0" />
                </a-button>

                <template #overlay>
                    <a-menu mode="vertical">
                        <a-menu-item key="edit">
                            <AnnouncementModal :asset="selectedAsset"
                                ><template #trigger>
                                    <div class="flex items-center">
                                        <AtlanIcon
                                            icon="Edit"
                                            class="h-4 mr-2"
                                        />
                                        Edit
                                    </div></template
                                ></AnnouncementModal
                            >
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import AnnouncementModal from '@common/widgets/announcement/addAnnouncementModal.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'AnnouncementWidget',
        components: { AnnouncementModal },

        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const {
                announcementTitle,
                announcementMessage,
                announcementType,
                announcementUpdatedAt,
                announcementUpdatedBy,
                editPermission,
            } = useAssetInfo()

            const bgClass = computed(() => {
                switch (announcementType(selectedAsset.value).toLowerCase()) {
                    case 'information':
                        return 'information-bg information-border'
                    case 'issue':
                        return 'issue-bg issue-border'
                    case 'warning':
                        return 'warning-bg warning-border'
                    default:
                        return 'information-bg information-border'
                }
            })

            const icon = computed(() => {
                switch (announcementType(selectedAsset.value).toLowerCase()) {
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
                editPermission,
                bgClass,
                icon,
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
