<template>
    <div class="p-4">
        <div class="flex items-center justify-between w-full">
            <a-dropdown
                placement="bottomLeft"
                :trigger="['click']"
                @click.stop="() => {}"
            >
                <template #overlay>
                    <a-menu>
                        <a-menu-item
                            v-for="item in AnnouncementList"
                            :key="item"
                            @click="handleMenuClick(item)"
                        >
                            <div class="flex items-center space-x-2">
                                <component
                                    :is="item.icon"
                                    class="w-auto h-4 ml-1 mr-2"
                                />

                                {{ item.label }}
                            </div>
                        </a-menu-item>
                    </a-menu>
                </template>
                <div class="flex items-center cursor-pointer">
                    <AtlanIcon :icon="icon" class="w-auto h-4 mr-1" /><span
                        class="text-sm capitalize"
                        >{{ type }}</span
                    >
                </div>
            </a-dropdown>
        </div>

        <a-input
            ref="titleBar"
            v-model:value="annTitle"
            placeholder="Add Announcement Header..."
            class="mt-1 text-lg font-bold text-gray-700 border-0 shadow-none outline-none "
        />
        <a-textarea
            v-model:value="description"
            placeholder="Add description..."
            class="text-gray-500 border-0 shadow-none outline-none"
            :maxlength="280"
        />
        <div class="flex items-center justify-end w-full mt-3 space-x-3">
            <a-button @click="handleCancel">Cancel</a-button>
            <a-button type="primary" :loading="isLoading" @click="handleUpdate"
                >Update</a-button
            >
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref } from 'vue'
import AnnouncementList from '~/constant/announcement'
import useTenantData from '~/composables/tenant/useTenantData'
import useUserData from '~/composables/user/useUserData'

export default defineComponent({
    name: 'AddCompanyAnnouncement',
    emits: ['updateAnnouncement', 'deleteAnnouncement', 'close'],
    setup(props, { emit }) {
        const {
            announcementTitle,
            announcementMessage,
            announcementType,
            tenantRaw,
        } = useTenantData()
        const { username } = useUserData()
        const description = ref(announcementMessage.value || '')
        const type = ref(announcementType.value || 'information')
        const annTitle = ref(announcementTitle.value || '')

        const titleBar: Ref<null | HTMLInputElement> = ref(null)

        const resetInput = () => {
            annTitle.value = ''
            description.value = ''
            type.value = 'information'
        }

        const icon = computed(() => {
            switch (type.value) {
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

        const handleUpdate = () => {
            const tenantLocal = { ...tenantRaw.value }
            tenantLocal.attributes.announcementTitle = annTitle.value
            tenantLocal.attributes.announcementMessage = description.value
            tenantLocal.attributes.announcementType = type.value
            tenantLocal.attributes.announcementUpdatedAt = Date.now().toString()
            tenantLocal.attributes.announcementUpdatedBy = username
            emit('updateAnnouncement', tenantLocal)
        }

        const handleCancel = () => {
            // resetInput()
            emit('close')
        }
        const handleMenuClick = (announcement) => {
            type.value = announcement.id
        }
        return {
            type,
            description,
            annTitle,
            icon,
            titleBar,
            AnnouncementList,
            handleUpdate,
            handleCancel,
            handleMenuClick,

            tenantRaw,
        }
    },
})
</script>

<style lang="less" module>
.input {
    :global(.ant-input:focus, .ant-input:hover, .ant-input::selection, .focus-visible) {
        @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
    }
    :global(.ant-input):focus,
    :global(.ant-input):hover {
        @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
    }
    :global(.ant-input) {
        @apply shadow-none outline-none px-0 border-0 !important;
    }
}
.titleInput {
    :global(.ant-input::-webkit-input-placeholder) {
        @apply font-bold text-gray-500 !important;
    }
}
</style>
