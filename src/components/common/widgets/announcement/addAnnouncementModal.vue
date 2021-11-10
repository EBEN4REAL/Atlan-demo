<template>
    <div class="py-2">
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
                                class="w-auto h-4 ml-1 mr-2 pushtop"
                            />

                            {{ item.label }}
                        </div>
                    </a-menu-item>
                </a-menu>
            </template>

            <div
                class="flex items-center px-2 py-1 ml-2 align-middle rounded cursor-pointer  max-w-min"
                :class="
                    type === 'information'
                        ? 'information-bg'
                        : type === 'issue'
                        ? 'issue-bg'
                        : type === 'warning'
                        ? 'warning-bg'
                        : ''
                "
            >
                <component
                    :is="localAnnouncementObject?.icon"
                    class="w-auto h-4"
                />
                <span class="mb-0 ml-2">
                    {{ localAnnouncementObject?.label }}
                </span>
            </div>
        </a-dropdown>
        <a-input
            ref="titleBar"
            v-model:value="title"
            placeholder="Add Announcement Header..."
            class="mt-1 text-lg font-bold text-gray-700 border-0 shadow-none outline-none "
            @change="handleTitleUpdate"
        />
        <a-textarea
            v-model:value="description"
            placeholder="Add description..."
            class="text-gray-500 border-0 shadow-none outline-none"
            :maxlength="280"
            @change="handleTextAreaUpdate"
        />
        <div class="flex items-center justify-end mt-2 mr-2">
            <a-button
                class="mr-2"
                :loading="false"
                :loading-text="'Cancelling...'"
                @click="onCancel"
                >Cancel</a-button
            >
            <a-button type="primary" :loading="isLoading" @click="handleUpdate"
                >Update</a-button
            >
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'Announcement',
        components: {},

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
                        return 'IssueAnnouncement'
                    case 'warning':
                        return 'WarningAnnouncement'
                    default:
                        return 'InformationAnnouncement'
                }
            })

            return {
                selectedAsset,
                announcementTitle,
                announcementMessage,
                announcementType,
                announcementUpdatedAt,
                announcementUpdatedBy,
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
