<template>
    <a-button-group class="border-gray-300">
        <a-dropdown
            v-model:visible="copyDropdown"
            :trigger="['click']"
            :overlay-style="{
                'box-shadow': '0px 9px 32px rgba(0, 0, 0, 0.12)',
                'border-radius': '4px',
            }"
            :overlay-class-name="$style.copyDropdown"
            placement="bottomLeft"
        >
            <AtlanButton
                class="flex items-center justify-center h-8 px-5 border rounded cursor-pointer customShadow"
                color="secondary"
                :class="!viewOnly ? 'border-r-0 rounded-r-none' : ''"
                @click="copyDropdown = true"
            >
                <AtlanIcon
                    icon="CopyOutlined"
                    class="text-gray-500"
                ></AtlanIcon>
            </AtlanButton>
            <template #overlay>
                <a-menu click="shadow-xl border border-red-500">
                    <div
                        key="1"
                        class="menu-item"
                        @click.prevent.stop="
                            copyAPI(metadata.displayName, 'Name Copied!')
                        "
                    >
                        Copy name
                    </div>
                    <div
                        key="2"
                        class="menu-item"
                        @click.prevent.stop="
                            copyAPI(metadata.guid, 'GUID Copied!')
                        "
                    >
                        Copy ID
                    </div>
                </a-menu>
            </template>
        </a-dropdown>

        <AtlanButton
            v-if="!viewOnly"
            v-auth="map.UPDATE_BUSINESS_METADATA"
            class="flex items-center justify-center h-8 px-5 border rounded-none cursor-pointer border-x-0 customShadow"
            color="secondary"
            @click="() => metadataModal?.open()"
        >
            <AtlanIcon class="" icon="Edit" />
        </AtlanButton>

        <a-tooltip
            :title="
                !allowDelete
                    ? `${metadata.displayName} is linked with ${assetCount} assets. You'll have to remove them before archiving.`
                    : ''
            "
            :mouse-enter-delay="0"
            placement="left"
        >
            <AtlanButton
                v-if="!viewOnly"
                v-auth="map.DELETE_BUSINESS_METADATA"
                class="flex items-center justify-center h-8 px-5 border border-l-0 rounded rounded-l-none cursor-pointer customShadow"
                color="secondary"
                :class="!allowDelete ? 'text-gray-400 cursor-not-allowed' : ''"
                @click.prevent.stop="
                    () =>
                        !viewOnly && allowDelete ? (deleteConfirm = true) : ''
                "
            >
                <AtlanIcon
                    class=""
                    :class="!allowDelete ? 'text-red-200' : 'text-error'"
                    icon="TrashAlt"
                />
            </AtlanButton>
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
                        Are you sure you want to delete the custom metadata?
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
    </a-button-group>

    <addMetadataModal
        ref="metadataModal"
        :metadata="metadata"
        :is-edit="true"
    />
</template>

<script lang="ts">
    import { defineComponent, ref, watch, h, inject, computed } from 'vue'
    import { message, Modal } from 'ant-design-vue'
    import addMetadataModal from '~/components/governance/custom-metadata/metadataModal.vue'
    import { copyToClipboard } from '~/utils/clipboard'
    import useDeleteTypedefs from '~/composables/typedefs/useDeleteTypedefs'

    import map from '~/constant/accessControl/map'
    import { useTypedefStore } from '~/store/typedef'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

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
            const copyDropdown = ref(false)
            const viewOnly = computed(
                () => props.metadata.options?.isLocked === 'true'
            )

            const copyAPI = (text: string, theMessage) => {
                copyToClipboard(text)
                message.success(theMessage)
                copyDropdown.value = false
            }

            const { data, isReady, error, isLoading, mutate } =
                useDeleteTypedefs(props.metadata.name)

            const resetSelection: Function = inject('resetSelection')

            watch([data, isReady, error, isLoading], () => {
                if (isReady && !error.value && !isLoading.value) {
                    message.success({
                        key: 'delete_cm',
                        content: 'deleted.',
                        duration: 2,
                    } as any)

                    useAddEvent('governance', 'custom_metadata', 'deleted', {
                        title: props.metadata.displayName,
                    })
                    // reloadTable()
                    store.removeCustomMetadataByName(props.metadata.name)
                    resetSelection()
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
                copyDropdown,
                viewOnly,
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
        @apply p-2 cursor-pointer;
        &:hover {
            @apply bg-gray-100;
        }
    }
</style>

<style lang="less" module>
    .copyDropdown {
        :global(.ant-dropdown-menu) {
            @apply shadow-none !important;
        }
    }
</style>
