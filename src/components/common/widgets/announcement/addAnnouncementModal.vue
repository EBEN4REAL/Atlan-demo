<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>
    <AtlanModal
        :modal-visible="visible"
        v-model:title="localAnnouncement.announcementTitle"
        v-model:description="localAnnouncement.announcementMessage"
        title-placeholder="Add Announcement Header..."
        description-placeholder="Add description..."
        :descriptionWordLimit="280"
        :show-description-limit="true"
    >
        <template #leftHeader>
            <span class="text-sm font-bold text-gray"
                >{{ updating ? 'Edit' : 'New' }} Announcement</span
            >
        </template>

        <template #rightHeader>
            <div>
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
                    <div
                        class="flex flex-row-reverse items-center cursor-pointer"
                        style="width: 120px"
                    >
                        <AtlanIcon
                            icon="CaretDown"
                            class="w-4 h-4 ml-1"
                        ></AtlanIcon>
                        <span class="text-sm capitalize">{{
                            localAnnouncement.announcementType
                        }}</span
                        ><AtlanIcon :icon="icon" class="w-auto h-4 mr-1" />
                    </div>
                </a-dropdown>
            </div>
        </template>

        <template #actionButtons>
            <a-button @click="handleCancel">Cancel</a-button>
            <a-button
                type="primary"
                :loading="isLoading"
                @click="handleUpdate"
                >{{ updating ? 'Update' : 'Add' }}</a-button
            >
        </template>
    </AtlanModal>
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
    import AtlanModal from '~/components/common/modal/modal.vue'

    export default defineComponent({
        name: 'AnnouncementModal',
        components: { AtlanModal },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            updating: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props) {
            const { asset } = toRefs(props)
            const {
                title,
                announcementMessage,
                announcementType,
                announcementTitle,
            } = useAssetInfo()

            const visible = ref<boolean>(false)

            const titleBar: Ref<null | HTMLInputElement> = ref(null)

            const { updating } = toRefs(props)

            const { isLoading, localAnnouncement, handleAnnouncementUpdate } =
                updateAssetAttributes(asset)

            const handleUpdate = async () => {
                handleAnnouncementUpdate(updating.value)
                await nextTick()
                visible.value = false
            }

            const resetInput = () => {
                localAnnouncement.value.announcementTitle =
                    announcementTitle(asset.value) || ''
                localAnnouncement.value.announcementMessage =
                    announcementMessage(asset.value) || ''
                localAnnouncement.value.announcementType =
                    announcementType(asset.value) || 'information'
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
                visible.value = true
                await nextTick()
                titleBar.value?.focus()
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
