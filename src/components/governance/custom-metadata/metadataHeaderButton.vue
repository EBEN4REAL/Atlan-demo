<template>
    <a-dropdown :trigger="['click']">
        <a-button class="rounded" size="small">
            <AtlanIcon icon="KebabMenu"></AtlanIcon>
        </a-button>
        <template #overlay>
            <a-menu>
                <div
                    class="menu-item"
                    key="1"
                    v-auth="map.UPDATE_BUSINESS_METADATA"
                    @click="metadataModal.open()"
                >
                    <AtlanIcon class="inline mr-2" icon="Edit" />Edit
                </div>
                <div
                    class="menu-item"
                    key="3"
                    @click.prevent.stop="
                        copyAPI(metadata.displayName, 'Name Copied!')
                    "
                >
                    <AtlanIcon class="inline mr-2" icon="CopyOutlined" />Copy
                    name
                </div>
                <div
                    class="menu-item"
                    key="3"
                    @click.prevent.stop="copyAPI(metadata.guid, 'GUID Copied!')"
                >
                    <AtlanIcon class="inline mr-2" icon="CopyOutlined" />Copy ID
                </div>
                <div
                    class="menu-item"
                    key="4"
                    @click.prevent.stop="showDeleteConfirm"
                >
                    <AtlanIcon
                        class="inline mr-2 text-error"
                        icon="Trash"
                    />Delete
                </div>
                <!-- <a-menu-item
                    key="2"
                    v-auth="map.DELETE_BUSINESS_METADATA"
                    class="text-red-500"
                    @click="openDeleteModal = true"
                >
                    <AtlanIcon class="inline mr-2" icon="Trash" />
                    Delete</a-menu-item
                > -->
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

    export default defineComponent({
        components: {
            addMetadataModal,
        },
        props: {
            metadata: {
                type: Object,
                default: () => {},
            },
        },
        setup(props) {
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
                } else if (error && error.value) {
                    // ? error getting handled in the composable (useDeleteTypedefs)
                }
            })
            const showDeleteConfirm = () => {
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
                    okText: 'Yes',
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
