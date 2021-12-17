<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>
    <a-modal
        :class="$style.input"
        width="800px"
        :closable="false"
        :visible="visible"
    >
        <template #title>
            <div class="flex items-center justify-between w-full">
                <div class="flex items-center text-gray-500 flex-nowrap">
                    <span class="overflow-hidden text-sm overflow-ellipsis">{{
                        title(asset)
                    }}</span>
                    <AtlanIcon icon="ChevronRight" class="flex-none" />
                    <span class="flex-none text-sm font-bold text-gray"
                        >New Announcement</span
                    >
                </div>
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
                    <div class="flex items-center mr-2 cursor-pointer">
                        <AtlanIcon :icon="icon" class="w-auto h-4 mr-1" /><span
                            class="text-sm capitalize"
                            >{{ localAnnouncement.announcementType }}</span
                        >
                    </div>
                </a-dropdown>
            </div>
        </template>
        <template #footer>
            <div class="flex items-center justify-end w-full space-x-3">
                <a-button @click="handleCancel">Cancel</a-button>
                <a-button
                    type="primary"
                    :loading="isLoading"
                    @click="handleUpdate"
                    >Update</a-button
                >
            </div>
        </template>
        <div class="px-4 pt-0 pb-4">
            <a-input
                ref="titleBar"
                v-model:value="localAnnouncement.announcementTitle"
                placeholder="Add Announcement Header..."
                class="mt-1 text-lg font-bold text-gray-700 border-0 shadow-none outline-none"
            />
            <a-textarea
                v-model:value="localAnnouncement.announcementMessage"
                placeholder="Add description..."
                class="text-gray-500 border-0 shadow-none outline-none"
                :maxlength="280"
            />
        </div>
    </a-modal>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        toRefs,
        nextTick,
        ref,
        Ref,
    } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AnnouncementList from '~/constant/announcement'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'

    export default defineComponent({
        name: 'AnnouncementModal',
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props) {
            const { asset, editPermission } = toRefs(props)
            const { title } = useAssetInfo()

            const visible = ref<boolean>(false)

            const titleBar: Ref<null | HTMLInputElement> = ref(null)

            const { isLoading, localAnnouncement, handleAnnouncementUpdate } =
                updateAssetAttributes(asset)

            const handleUpdate = async () => {
                handleAnnouncementUpdate()
                await nextTick()
                visible.value = false
            }

            const resetInput = () => {
                localAnnouncement.value.announcementTitle = ''
                localAnnouncement.value.announcementMessage = ''
                localAnnouncement.value.announcementType = 'information'
            }

            const icon = computed(() => {
                switch (localAnnouncement.value.announcementType) {
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

            const handleCancel = () => {
                resetInput()
                visible.value = false
            }

            const showModal = async () => {
                if (editPermission?.value) {
                    visible.value = true
                    await nextTick()
                    titleBar.value?.focus()
                }
            }

            const handleMenuClick = (announcement) => {
                localAnnouncement.value.announcementType = announcement.id
            }

            return {
                localAnnouncement,
                showModal,
                icon,
                title,
                titleBar,
                AnnouncementList,
                isLoading,
                handleUpdate,
                handleCancel,
                handleMenuClick,
                visible,
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
