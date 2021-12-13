<template>
    <div
        v-if="data?.attributes?.announcementTitle"
        class="flex justify-between px-4 py-3 border rounded bg-blue-50 border-primary"
    >
        <AtlanIcon icon="InformationAnnouncement" class="h-5 mr-4"></AtlanIcon>
        <div class="flex flex-col w-full">
            <div class="flex justify-between w-full mb-2">
                <div class="text-base font-bold text-gray-700">
                    {{ data?.attributes?.announcementTitle }}
                </div>
            </div>
            <div class="mb-2 text-gray-500">
                {{ data?.attributes?.announcementMessage }}
            </div>
            <div class="flex items-center text-gray-500 gap-x-1">
                <div class="flex items-center text-sm">
                    <Avatar
                        :image-url="
                            imageUrl(data?.attributes?.announcementUpdatedBy)
                        "
                        :allow-upload="false"
                        :avatar-name="data?.attributes?.announcementUpdatedBy"
                        :avatar-size="16"
                        :avatar-shape="'circle'"
                        class="mr-1 mt-0.5"
                        avatar-bg-class="bg-blue-100"
                    />
                    <div class="ml-1">
                        {{ data?.attributes?.announcementUpdatedBy }},
                    </div>
                </div>
                {{ updatedDate }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import dayjs from 'dayjs'
    import useTenant from '~/composables/tenant/useTenant'
    import Avatar from '~/components/common/avatar/index.vue'

    export default defineComponent({
        name: 'Annoucements',
        components: {
            Avatar,
        },
        setup() {
            const { data } = useTenant()
            const updatedDate = computed(() =>
                dayjs(
                    Number(data.value?.attributes?.announcementUpdatedAt) ||
                        new Date()
                ).format('MMM DD, YYYY')
            )
            const imageUrl = (username: any) =>
                `${window.location.origin}/api/service/avatars/${username}`
            return {
                data,
                updatedDate,
                imageUrl,
            }
        },
    })
</script>

<style scoped></style>
