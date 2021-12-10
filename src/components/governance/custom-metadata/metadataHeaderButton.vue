<template>
    <a-dropdown :trigger="['click']">
        <a-button class="rounded" size="small">
            <AtlanIcon icon="KebabMenu"></AtlanIcon>
        </a-button>
        <template #overlay>
            <a-menu>
                <a-menu-item
                    key="1"
                    v-auth="map.UPDATE_BUSINESS_METADATA"
                    @click="metadataModal.open()"
                    ><AtlanIcon
                        class="inline mr-2"
                        icon="Edit"
                    />Edit</a-menu-item
                >
                <a-menu-item
                    key="1"
                    @click.prevent.stop="
                        copyAPI(metadata.displayName, 'Name Copied!')
                    "
                >
                    <AtlanIcon class="inline mr-2" icon="CopyOutlined" />Copy
                    name</a-menu-item
                >
                <a-menu-item
                    key="1"
                    @click.prevent.stop="copyAPI(metadata.guid, 'GUID Copied!')"
                >
                    <AtlanIcon class="inline mr-2" icon="CopyOutlined" />Copy
                    ID</a-menu-item
                >
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
    <ArchiveMetadataModal
        :visible="openDeleteModal"
        :businessMetadata="metadata"
        @close="openDeleteModal = false"
    />
</template>

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue'
    import { message, Modal } from 'ant-design-vue'
    import addMetadataModal from '~/components/governance/custom-metadata/metadataModal.vue'
    import { copyToClipboard } from '~/utils/clipboard'
    import ArchiveMetadataModal from './archiveMetadataModal.vue'

    import map from '~/constant/accessControl/map'

    export default defineComponent({
        components: {
            addMetadataModal,
            ArchiveMetadataModal,
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

            const copyAPI = (text: string, theMessage: String) => {
                copyToClipboard(text)
                message.success({
                    content: theMessage,
                })
            }
            const showDeleteConfirm = () => {
                Modal.confirm({
                    title: 'Delete metadata',
                    content: `Are you sure you want delete ${props.metadata.name} ?`,
                    okText: 'Yes',
                    okType: 'danger',
                    onOk() {
                        // const { data, isReady, error, isLoading } =
                        // watch([data, isReady, error, isLoading], () => {
                        //     if (isReady && !error.value && !isLoading.value) {
                        //         message.success('deleted.')
                        //         reloadTable()
                        //     } else if (error && error.value) {
                        //         message.error(
                        //             'Unable to revoke invite, please try again'
                        //         )
                        //     }
                        // })
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
