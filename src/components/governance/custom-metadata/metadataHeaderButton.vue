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
                    class="menu-item"
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
                        class="menu-item"
                        :class="
                            !allowDelete
                                ? 'text-gray-200 cursor-not-allowed'
                                : ''
                        "
                        @click.prevent.stop="showDeleteConfirm"
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

    export default defineComponent({
        components: {
            addMetadataModal,
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
                    // reloadTable()
                    store.removeCustomMetadataByName(props.metadata.name)
                } else if (error && error.value) {
                    // ? error getting handled in the composable (useDeleteTypedefs)
                }
            })
            const showDeleteConfirm = () => {
                if (!props.allowDelete) return
                Modal.confirm({
                    title: 'Delete metadata',
                    content: () =>
                        h('div', { class: [''] }, [
                            'Are you sure you want to delete',
                            h('span', [' ']),
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
