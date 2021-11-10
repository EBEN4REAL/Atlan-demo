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
                    <div class="flex items-center cursor-pointer">
                        <AtlanIcon :icon="icon" class="w-auto h-4 mr-1" /><span
                            class="text-sm capitalize"
                            >{{ type }}</span
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
        watch,
    } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AnnouncementList from '~/constant/announcement'
    import updateAsset from '~/composables/discovery/updateAsset'
    import { message } from 'ant-design-vue'

    export default defineComponent({
        name: 'AnnouncementModal',
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { asset } = toRefs(props)
            const {
                announcementTitle,
                announcementMessage,
                announcementType,
                title,
            } = useAssetInfo()

            const description = ref(announcementMessage(asset.value) || '')
            const type = ref(announcementType(asset.value) || 'information')
            const annTitle = ref(announcementTitle(asset.value) || '')
            const visible = ref<boolean>(false)

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

            const entity = ref<assetInterface>({
                guid: asset.value.guid,
                typeName: asset.value.typeName,
                attributes: {
                    name: asset.value.attributes?.name,
                    qualifiedName: asset.value.attributes?.qualifiedName,
                    tenantId: 'default',
                },
            })

            const body = ref({
                entities: <assetInterface[]>[],
            })

            const { data, mutate, error, isLoading } = updateAsset(body)

            const handleUpdate = () => {
                entity.value.attributes.announcementTitle = annTitle.value
                entity.value.attributes.announcementMessage = description.value
                entity.value.attributes.announcementType = type.value
                body.value.entities = [entity.value]
                mutate().then(
                    watch([data, error, isLoading], () => {
                        if (!error.value && !isLoading.value) {
                            message.success('Announcement added')
                            visible.value = false
                        } else if (error && error.value) {
                            message.error(
                                'Not able to add announcement, try again later'
                            )
                            visible.value = false
                        }
                    })
                )
            }

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
                type.value = announcement.id
            }

            return {
                asset,
                type,
                description,
                annTitle,
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
        :global(.ant-modal-header) {
            @apply border-0 border-t-0 border-b-0 px-4  !important;
        }
        :global(.ant-modal-footer) {
            @apply border-0 border-t-0 px-4 border-b-0  !important;
        }
        :global(.ant-modal-body) {
            @apply px-4 pt-0 pb-4 !important;
        }
    }
    .titleInput {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold text-gray-500 !important;
        }
    }
</style>
