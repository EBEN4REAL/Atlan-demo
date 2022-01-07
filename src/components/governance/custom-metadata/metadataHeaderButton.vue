<template>
    <a-dropdown :trigger="['click']">
        <a-button class="rounded" size="small">
            <AtlanIcon icon="KebabMenu"></AtlanIcon>
        </a-button>
        <template #overlay>
            <a-menu>
                <div
                    key="1"
                    v-auth="map.UPDATE_BUSINESS_METADATA"
                    class="rounded-t menu-item"
                    @click="metadataModal.open()"
                >
                    <AtlanIcon class="inline mb-1 mr-2" icon="Edit" />Edit
                </div>
                <div
                    key="3"
                    class="menu-item"
                    @click.prevent.stop="
                        copyAPI(metadata.displayName, 'Name Copied!')
                    "
                >
                    <AtlanIcon
                        class="inline mb-1 mr-2"
                        icon="CopyOutlined"
                    />Copy name
                </div>
                <div
                    key="3"
                    class="menu-item"
                    @click.prevent.stop="copyAPI(metadata.guid, 'GUID Copied!')"
                >
                    <AtlanIcon
                        class="inline mb-1 mr-2"
                        icon="CopyOutlined"
                    />Copy ID
                </div>
                <a-tooltip
                    :title="
                        !allowDelete
                            ? `${metadata.displayName} is linked with ${assetCount} assets. You'll have to remove them before archiving.`
                            : ''
                    "
                    :mouse-enter-delay="0"
                    placement="left"
                >
                    <div
                        key="4"
                        v-auth="map.DELETE_BUSINESS_METADATA"
                        class="rounded-b menu-item"
                        :class="
                            !allowDelete
                                ? 'text-gray-200 cursor-not-allowed'
                                : ''
                        "
                        @click.prevent.stop="deleteConfirm = true"
                    >
                        <AtlanIcon
                            class="inline mb-1 mr-2"
                            :class="
                                !allowDelete ? 'text-red-200' : 'text-error'
                            "
                            icon="Trash"
                        />
                        Delete
                    </div>
                    <a-modal
                        v-model:visible="deleteConfirm"
                        :width="340"
                        :closable="false"
                    >
                        <div class="p-4" style="height: 85px">
                            <p class="mb-1 font-bold text-md">
                                Delete {{ metadata.displayName }}
                            </p>
                            <p class="text-md">
                                Are you sure you want to delete the custom
                                metadata?
                            </p>
                        </div>

                        <template #footer>
                            <div class="flex justify-end p-2 space-x-2">
                                <AtlanButton
                                    color="minimal"
                                    padding="compact"
                                    size="sm"
                                    @click="deleteConfirm = false"
                                    >Cancel</AtlanButton
                                >
                                <AtlanButton
                                    color="danger"
                                    size="sm"
                                    padding="compact"
                                    :loading="isLoading"
                                    @click="deleteCM"
                                    >Delete</AtlanButton
                                >
                            </div>
                        </template>
                    </a-modal>
                </a-tooltip>
            </a-menu>
        </template>
    </a-dropdown>
    <addMetadataModal
        ref="metadataModal"
        :metadata="metadata"
        :is-edit="true"
    />
</template>

<script lang="ts">
    import { defineComponent, ref, watch, h } from 'vue'
    import { message, Modal } from 'ant-design-vue'
    import addMetadataModal from '~/components/governance/custom-metadata/metadataModal.vue'
    import { copyToClipboard } from '~/utils/clipboard'
    import useDeleteTypedefs from '~/composables/typedefs/useDeleteTypedefs'

    import map from '~/constant/accessControl/map'
    import { useTypedefStore } from '~/store/typedef'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import AtlanButton from '@/UI/button.vue'

    export default defineComponent({
        components: {
            addMetadataModal,
            AtlanButton,
        },
        props: {
            metadata: {
                type: Object,
                default: () => {},
            },
            allowDelete: {
                type: Boolean,
                required: true,
            },
            assetCount: {
                type: Number,
                required: true,
            },
        },
        setup(props) {
            const store = useTypedefStore()
            const metadataModal = ref(null)
            const openDeleteModal = ref(false)

            const copyAPI = (text: string, theMessage) => {
                copyToClipboard(text)
                message.success(theMessage)
            }

            const { data, isReady, error, isLoading, mutate } =
                useDeleteTypedefs(props.metadata.name)

            watch([data, isReady, error, isLoading], () => {
                if (isReady && !error.value && !isLoading.value) {
                    message.success({
                        key: 'delete_cm',
                        content: 'deleted.',
                        duration: 2,
                    } as any)
                    useAddEvent('governance', 'custom_metadata', 'deleted')
                    // reloadTable()
                    store.removeCustomMetadataByName(props.metadata.name)
                } else if (error && error.value) {
                    // ? error getting handled in the composable (useDeleteTypedefs)
                }
            })

            const deleteConfirm = ref(false)

            const deleteCM = () => {
                message.loading({
                    key: 'delete_cm',
                    content: 'deleting...',
                    duration: 2,
                } as any)
                mutate()
            }

            const showDeleteConfirm = () => {
                if (!props.allowDelete) return
                Modal.confirm({
                    title: 'Delete metadata',
                    content: () =>
                        h('div', { class: ['h-10'] }, [
                            'Are you sure you want to delete',
                            h('span', ['']),
                            h(
                                'span',
                                {
                                    class: ['font-bold'],
                                },
                                [`${props.metadata.displayName}`]
                            ),

                            h('span', '?'),
                        ]),
                    okText: 'Delete',
                    okType: 'danger',
                    onOk() {
                        message.loading({
                            key: 'delete_cm',
                            content: 'deleting...',
                            duration: 2,
                        } as any)
                        mutate()
                    },
                })
            }

            return {
                isLoading,
                deleteConfirm,
                deleteCM,
                metadataModal,
                openDeleteModal,
                copyAPI,
                showDeleteConfirm,
                map,
            }
        },
    })
</script>
<style lang="less" scoped>
    .menu-item {
        @apply p-2;
        @apply cursor-pointer;
        &:hover {
            @apply bg-gray-100;
        }
    }
</style>

<style lang="less"></style>
