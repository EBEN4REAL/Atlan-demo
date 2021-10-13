<template>
    <div
        v-if="isLoading"
        class="flex items-center justify-center text-sm leading-none"
    >
        <a-spin size="small"></a-spin>
    </div>
    <div
        v-else
        class="w-full"
        @mouseover="showKebabMenu = true"
        @mouseleave="showKebabMenu = false"
    >
        <div v-if="editable" class="py-2 shadow">
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
                        announcementType === 'information'
                            ? 'information-bg'
                            : announcementType === 'issue'
                            ? 'issue-bg'
                            : announcementType === 'warning'
                            ? 'warning-bg'
                            : ''
                    "
                >
                    <component
                        :is="announcementObject?.icon"
                        class="w-auto h-4"
                    />

                    <span class="mb-0 ml-2">
                        {{ announcementObject?.label }}
                    </span>
                </div>
            </a-dropdown>
            <a-input
                ref="titleBar"
                v-model:value="announcementTitle"
                placeholder="Add Announcement Header..."
                class="mt-1 text-lg font-bold text-gray-700 border-0 shadow-none outline-none "
                @change="handleTitleUpdate"
            />
            <a-textarea
                v-model:value="announcementDescription"
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
                <a-button
                    type="primary"
                    :loading="isLoading"
                    @click="handleUpdate"
                    >Update</a-button
                >
            </div>
        </div>
        <div v-else>
            <div
                v-if="!bannerDescription || bannerDescription === ''"
                class="flex justify-between"
            >
                <div>
                    <div
                        class="flex items-center px-2 py-1 align-middle rounded cursor-pointer  max-w-min"
                        :class="
                            announcementType === 'information'
                                ? 'information-bg'
                                : announcementType === 'issue'
                                ? 'issue-bg'
                                : announcementType === 'warning'
                                ? 'warning-bg'
                                : ''
                        "
                    >
                        <component
                            :is="announcementObject?.icon"
                            class="w-auto h-4"
                        />

                        <span class="mb-0 ml-2">
                            {{ announcementObject?.label }}
                        </span>
                    </div>

                    <div
                        class="py-1 mt-1 text-lg font-bold text-gray-500 border-0 shadow-none outline-none "
                    >
                        Add Announcement Header...
                    </div>
                    <div
                        class="py-1 text-gray-500 border-0 shadow-none outline-none "
                    >
                        Add description...
                    </div>
                </div>
                <div>
                    <a-dropdown trigger="click" placement="bottomRight">
                        <a-button
                            v-show="showKebabMenu"
                            class="px-2 bg-transparent border-transparent shadow-none  hover:border-current"
                        >
                            <AtlanIcon icon="KebabMenu" class="h-4 m-0" />
                        </a-button>
                        <template #overlay>
                            <a-menu
                                mode="vertical"
                                @mouseover="showKebabMenu = true"
                                @mouseleave="showKebabMenu = false"
                            >
                                <a-menu-item key="edit" @click="startEdit">
                                    <div class="flex items-center">
                                        <AtlanIcon
                                            icon="Edit"
                                            class="h-4 mr-2"
                                        />
                                        Edit
                                    </div>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </div>
            <div
                v-else
                class="flex justify-between p-4 border rounded"
                :class="
                    bannerType === 'information'
                        ? 'information-bg information-border'
                        : bannerType === 'issue'
                        ? 'issue-bg issue-border'
                        : bannerType === 'warning'
                        ? 'warning-bg warning-border'
                        : ''
                "
            >
                <div class="flex">
                    <div>
                        <component
                            :is="bannerObject?.icon"
                            class="w-auto h-4 mt-1 mr-4"
                        />
                    </div>
                    <div>
                        <div class="mb-1 text-lg font-bold text-gray-700">
                            {{ bannerTitle }}
                        </div>
                        <div class="w-11/12 mb-2 text-gray-500">
                            {{ bannerDescription }}
                        </div>
                        <div class="flex items-center">
                            <a-popover>
                                <template #content>
                                    <OwnerInfoCard
                                        :user="
                                            asset?.attributes?.bannerUpdatedBy
                                        "
                                    />
                                </template>
                                <div
                                    class="
                                        flex
                                        items-center
                                        mr-2.5
                                        cursor-pointer
                                    "
                                >
                                    <avatar
                                        class="mr-2"
                                        :image-url="
                                            KeyMaps.auth.avatar.GET_AVATAR({
                                                username:
                                                    asset?.attributes
                                                        ?.bannerUpdatedBy,
                                            })
                                        "
                                        :allow-upload="false"
                                        :avatar-name="
                                            asset?.attributes?.bannerUpdatedBy
                                        "
                                        avatar-size="small"
                                        :avatar-shape="'circle'"
                                    />
                                    {{ asset?.attributes?.bannerUpdatedBy }}
                                </div></a-popover
                            >
                            <span class="text-xs text-gray-500">{{
                                timeAgo(asset?.attributes?.bannerUpdatedAt)
                            }}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <a-dropdown trigger="click" placement="bottomRight">
                        <a-button
                            v-show="showKebabMenu"
                            class="px-2 ml-2 bg-transparent border-transparent shadow-none  hover:border-current"
                        >
                            <AtlanIcon icon="KebabMenu" class="h-4 m-0" />
                        </a-button>
                        <template #overlay>
                            <a-menu
                                mode="vertical"
                                @mouseover="showKebabMenu = true"
                                @mouseleave="showKebabMenu = false"
                            >
                                <a-menu-item key="edit" @click="startEdit">
                                    <div class="flex items-center">
                                        <AtlanIcon
                                            icon="Edit"
                                            class="h-4 mr-2"
                                        />
                                        Edit
                                    </div>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { useTimeAgo } from '@vueuse/core'
    import { defineComponent, ref, PropType, Ref, computed, toRefs } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AnnouncementList from '~/constant/announcement'
    import addAnnouncement from '~/composables/asset/addAnnouncement'
    import Pill from '~/components/UI/pill/pill.vue'
    import { KeyMaps } from '~/api/keyMap'
    import Avatar from '~/components/common/avatar.vue'
    import OwnerInfoCard from '~/components/discovery/preview/hovercards/ownerInfo.vue'

    export default defineComponent({
        components: { Pill, Avatar, OwnerInfoCard },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const editable = ref(false)
            const titleBar: Ref<null | HTMLInputElement> = ref(null)
            const showKebabMenu = ref(false)

            const { asset } = toRefs(props)
            const {
                handleCancel,
                update,
                bannerType,
                bannerDescription,
                bannerTitle,
                isCompleted,
                isLoading,
            } = addAnnouncement(asset)

            const announcementDescription = ref(bannerDescription.value)
            const announcementType = ref(bannerType.value)
            const announcementTitle = ref(bannerTitle.value)

            const handleUpdate = () => {
                bannerDescription.value = announcementDescription.value
                bannerType.value = announcementType.value
                bannerTitle.value = announcementTitle.value
                editable.value = false
                update()
            }
            const onCancel = () => {
                editable.value = false
                handleCancel()
            }
            const handleTextAreaUpdate = (e: any) => {
                announcementDescription.value = e.target.value
            }
            const handleTitleUpdate = (e: any) => {
                announcementTitle.value = e.target.value
            }

            const announcementObject = computed(() => {
                const found = AnnouncementList.find(
                    (item) => item.id === announcementType.value
                )

                return found
            })
            const bannerObject = computed(() => {
                const found = AnnouncementList.find(
                    (item) => item.id === bannerType.value
                )

                return found
            })

            const startEdit = async () => {
                editable.value = true
                titleBar.value?.focus()
            }
            const handleMenuClick = (announcement) => {
                announcementType.value = announcement.id
            }

            const timeAgo = (time: string | number) => useTimeAgo(time).value

            return {
                editable,
                AnnouncementList,
                handleUpdate,
                bannerObject,
                onCancel,
                startEdit,
                announcementTitle,
                announcementDescription,
                handleMenuClick,
                announcementType,
                announcementObject,
                isLoading,
                handleTextAreaUpdate,
                bannerDescription,
                bannerType,
                bannerTitle,
                timeAgo,
                KeyMaps,
                isCompleted,
                showKebabMenu,
                handleTitleUpdate,
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
        @apply border-primary;
    }
    .issue-border {
        border-color: rgba(207, 89, 46, 1);
    }
    .warning-border {
        border-color: rgba(255, 177, 25, 1);
    }
    :global(.ant-input::-webkit-input-placeholder) {
        @apply text-gray-500 !important;
    }
</style>
