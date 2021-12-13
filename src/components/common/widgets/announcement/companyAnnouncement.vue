<template>
    <div
        v-if="announcementTitle"
        class="flex justify-between px-4 py-3 border rounded"
        :class="bgClass"
    >
        <AtlanIcon :icon="icon" class="h-5 mr-4"></AtlanIcon>
        <div class="flex flex-col w-full">
            <div class="flex justify-between w-full mb-2">
                <div class="text-base font-bold text-gray-700">
                    {{ announcementTitle }}
                </div>
            </div>
            <div class="mb-2 text-gray-500">
                {{ announcementMessage }}
            </div>
            <div class="flex items-center text-gray-500 gap-x-1">
                <div class="flex items-center text-sm">
                    <Avatar
                        :image-url="imageUrl(announcementUpdatedBy)"
                        :allow-upload="false"
                        :avatar-name="announcementUpdatedBy"
                        :avatar-size="16"
                        :avatar-shape="'circle'"
                        class="mr-1 mt-0.5"
                        avatar-bg-class="bg-blue-100"
                    />
                    <div class="ml-1">{{ announcementUpdatedBy }},</div>
                </div>
                {{ announcementUpdatedAtFormatted }}
            </div>
        </div>
        <a-dropdown :trigger="['hover', 'click']">
            <AtlanBtn
                color="secondary"
                padding="compact"
                size="sm"
                class="px-2 bg-white border-gray-300 rounded-md shadow-sm cursor-pointer"
                @click="downloadMetadataFile"
            >
                <div class="flex items-center">
                    <AtlanIcon icon="KebabMenu"></AtlanIcon>
                </div>
            </AtlanBtn>
            <template #overlay>
                <a-menu>
                    <a-menu-item @click="$emit('editAnnouncement')">
                        <div class="flex items-center">
                            <AtlanIcon
                                icon="Pencil"
                                class="self-center mr-2"
                            ></AtlanIcon>
                            <span>Edit</span>
                        </div>
                    </a-menu-item>
                    <a-menu-item
                        class="text-error"
                        @click="$emit('deleteAnnouncement')"
                    >
                        <div class="flex items-center">
                            <AtlanIcon
                                icon="Delete"
                                class="self-center mr-2"
                            ></AtlanIcon>
                            <span>Delete</span>
                        </div>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent } from 'vue'
    import useTenantData from '~/composables/tenant/useTenantData'
    import { formatDateTime } from '~/utils/date'
    import AtlanBtn from '@/UI/button.vue'
    import Avatar from '~/components/common/avatar/index.vue'

    export default defineComponent({
        name: 'CompanyAnnouncement',
        components: { AtlanBtn, Avatar },
        emits: ['editAnnouncement', 'deleteAnnouncement'],
        setup() {
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`

            const {
                announcementTitle,
                announcementMessage,
                announcementType,
                announcementUpdatedAt,
                announcementUpdatedBy,
            } = useTenantData()

            const bgClass = computed(() => {
                switch (announcementType.value.toLowerCase()) {
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
                switch (announcementType.value.toLowerCase()) {
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
            const announcementUpdatedAtFormatted = computed(() =>
                formatDateTime(parseInt(announcementUpdatedAt.value), {
                    dateStyle: 'medium',
                })
            )

            return {
                announcementTitle,
                announcementMessage,
                announcementType,
                announcementUpdatedAtFormatted,
                announcementUpdatedBy,
                announcementUpdatedAt,
                bgClass,
                icon,
                imageUrl,
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
