<template>
    <a-dropdown
        v-model:visible="isVisible"
        :trigger="treeMode ? ['click'] : ['click']"
        @click.stop="() => {}"
    >
        <div>
            <AtlanIcon icon="KebabMenu" class="m-0" @click.prevent />
        </div>

        <template #overlay>
            <a-menu>
                <a-menu-item
                    v-if="showLinks"
                    key="copyLink"
                    class="flex items-center"
                    @click="handleCopyProfileLink"
                >
                    <div class="flex items-center">
                        <AtlanIcon icon="CopyOutlined" class="m-0 mr-2" />
                        <p class="p-0 m-0">Copy link</p>
                    </div>
                </a-menu-item>
                <a-menu-item
                    v-if="showLinks"
                    key="copyName"
                    class="flex items-center"
                    @click="handleCopyName"
                >
                    <div class="flex items-center">
                        <AtlanIcon icon="CopyOutlined" class="m-0 mr-2" />
                        <p class="p-0 m-0">Copy name</p>
                    </div>
                </a-menu-item>
                <!-- entity update -->
                <a-menu-item v-if="showGtcCrud" key="edit" @click="closeMenu">
                    <template v-if="entityUpdatePermission">
                        <div
                            class="flex items-center"
                            @click="$emit('edit', entity)"
                        >
                            <AtlanIcon icon="Pencil" class="m-0 mr-2" />
                            <p class="p-0 m-0">Rename</p>
                        </div>
                    </template>
                    <template v-else>
                        <RenameModal :entityType="entity?.typeName" :entityTitle="entity?.attributes?.name" :selected-asset="entity">
                            <template #trigger>
                                <div class="flex items-center">
                                    <AtlanIcon icon="Pencil" class="m-0 mr-2" />
                                    <p class="p-0 m-0">Rename</p>
                                </div>
                            </template>
                        </RenameModal>
                    </template>
                </a-menu-item>
                <!-- entity create -->
                <div>
                    <a-menu-item
                        v-if="
                            showGtcCrud &&
                            entity?.typeName !== 'AtlasGlossaryTerm'
                        "
                        key="add"
                        @click="closeMenu"
                    >
                        <template v-if="createPermission">
                            <AddGtcModal
                                entityType="AtlasGlossaryCategory"
                                :glossaryName="glossaryName"
                                :categoryName="categoryName"
                                @add="handleAdd"
                                :glossary-qualified-name="glossaryQualifiedName"
                                :categoryGuid="categoryId"
                            >
                                <template #trigger>
                                    <div class="flex items-center">
                                        <AtlanIcon
                                            icon="Category"
                                            class="m-0 mr-2"
                                        />
                                        <p class="p-0 m-0">Add Category</p>
                                    </div>
                                </template>
                            </AddGtcModal>
                        </template>
                        <template v-else>
                            <a-tooltip
                                placement="right"
                                title="You don't have permission to perform this action"
                            >
                                <div
                                    :class="'cursor-not-allowed text-gray-500'"
                                    class="flex items-center"
                                >
                                    <AtlanIcon
                                        icon="Category"
                                        class="m-0 mr-2"
                                    />
                                    <p class="p-0 m-0">Add Category</p>
                                </div>
                            </a-tooltip>
                        </template>
                    </a-menu-item>
                </div>
                <!-- entity create -->
                <div>
                    <a-menu-item
                        v-if="
                            showGtcCrud &&
                            entity?.typeName !== 'AtlasGlossaryTerm'
                        "
                        key="add"
                        @click="closeMenu"
                    >
                        <template v-if="createPermission">
                            <AddGtcModal
                                entityType="AtlasGlossaryTerm"
                                :glossaryName="glossaryName"
                                :categoryName="categoryName"
                                @add="handleAdd"
                                :glossary-qualified-name="glossaryQualifiedName"
                                :categoryGuid="categoryId"
                            >
                                <template #trigger>
                                    <div class="flex items-center">
                                        <AtlanIcon
                                            icon="Term"
                                            class="m-0 mr-2"
                                        />
                                        <p class="p-0 m-0">Add Term</p>
                                    </div>
                                </template>
                            </AddGtcModal>
                        </template>
                        <template v-else>
                            <a-tooltip
                                placement="right"
                                title="You don't have permission to perform this action"
                            >
                                <div
                                    :class="'cursor-not-allowed text-gray-500'"
                                    class="flex items-center"
                                >
                                    <AtlanIcon icon="Term" class="m-0 mr-2" />
                                    <p class="p-0 m-0">Add Term</p>
                                </div>
                            </a-tooltip>
                        </template>
                    </a-menu-item>
                </div>
                <!-- entity delete -->
                <div>
                    <a-menu-divider
                        v-if="
                            showGtcCrud &&
                            entity?.typeName !== 'AtlasGlossaryTerm'
                        "
                        class="p-0 m-0"
                    ></a-menu-divider>
                    <a-menu-item
                        v-if="showGtcCrud"
                        key="archive"
                        @click="closeMenu"
                    >
                        <template v-if="entityDeletePermission">
                            <RemoveGTCModal
                                :entityType="entity.typeName"
                                :entity="entity"
                                @delete="handleDelete"
                                :redirect="shouldRedirect"
                            >
                                <template #trigger>
                                    <div class="flex items-center">
                                        <AtlanIcon
                                            icon="Trash"
                                            class="m-0 mr-2 text-red-700"
                                        />
                                        <p class="p-0 m-0">Archive</p>
                                    </div>
                                </template>
                            </RemoveGTCModal>
                        </template>
                        <template v-else>
                            <a-tooltip
                                placement="right"
                                title="You don't have permission to perform this action"
                            >
                                <div
                                    :class="'cursor-not-allowed text-gray-500'"
                                    class="flex items-center"
                                >
                                    <AtlanIcon
                                        icon="Trash"
                                        class="m-0 mr-2 text-red-200"
                                    />
                                    <p class="p-0 m-0">Archive</p>
                                </div>
                            </a-tooltip>
                        </template>
                    </a-menu-item>
                </div>
            </a-menu>
        </template>
    </a-dropdown>
</template>
<script lang="ts">
    import {
        defineComponent,
        ref,
        PropType,
        inject,
        toRefs,
        watch,
        Ref,
        computed,
    } from 'vue'
    import { useRoute } from 'vue-router'

    // components
    import { message } from 'ant-design-vue'
    import StatusBadge from '@common/badge/status/index.vue'
    // import Owners from './owners.vue'
    // import Status from './status.vue'
    import AddGtcModal from '@/glossary/modal/addGtcModal.vue'
    import RemoveGTCModal from '@/glossary/modal/removeGTCModal.vue'
    // import Categories from '@/glossary/common/categories.vue'
    import ModalHeader from '@/glossary/modal/modalHeader.vue'
    import BulkUploadModal from '@/glossary/modal/bulkUploadModal.vue'
    import RenameModal from '@/glossary/modal/renameModal.vue'

    // utils
    import { copyToClipboard } from '~/utils/clipboard'
    import assetTypeLabel from '@/glossary/constants/assetTypeLabel'
    // composables
    // import useDeleteGlossary from '~/components/glossary/composables/useDeleteGlossary'
    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import map from '~/constant/accessControl/map'
    import { fetchGlossaryPermission } from '~/composables/glossary/useGTCPermissions'

    export default defineComponent({
        components: {
            // Status,
            // Owners,
            StatusBadge,
            AddGtcModal,
            // Categories,
            RemoveGTCModal,
            ModalHeader,
            BulkUploadModal,
            RenameModal,
        },
        props: {
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: true,
                default: () => {},
            },

            glossaryName: {
                type: String,
                required: false,
                default: () => '',
            },
            categoryName: {
                type: String,
                required: false,
                default: () => '',
            },
            categoryGuid: {
                type: String,
                required: false,
                default: () => '',
            },
            showLinks: {
                type: Boolean,
                required: false,
                default: () => true,
            },
            showGtcCrud: {
                type: Boolean,
                required: false,
                default: () => true,
            },
            showUnlinkAsset: {
                type: Boolean,
                required: false,
                default: () => false,
            },

            treeMode: {
                type: Boolean,
                required: false,
                default: () => false,
            },
            visible: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['unlinkAsset', 'add', 'edit'],
        setup(props, { emit }) {
            // data
            const {
                entity,

                categoryGuid,
                glossaryName,
                categoryName,
            } = toRefs(props)
            const isVisible = ref(false)
            const isModalVisible = ref<boolean>(false)
            const isRenameModalOpen = ref<boolean>(false)
            const route = useRoute()
            const shouldRedirect = computed(
                () => route?.params?.id === props?.entity?.guid
            ) // Should the page be redirect on deletion of the entity
            const showCategories = ref(false)
            const { getAnchorQualifiedName } = useAssetInfo()
            const glossaryQualifiedName = computed(() => {
                if (entity.value.typeName === 'AtlasGlossary') {
                    return entity.value?.attributes?.qualifiedName
                }
                return getAnchorQualifiedName(entity.value)
            })
            const glossaryId = computed(() => {
                if (props.entity?.typeName === 'AtlasGlossary')
                    return props.entity?.guid ?? ''
                return props.entity?.attributes?.anchor?.guid ?? ''
            })
            const categoryId = computed(() => {
                if (props.entity?.typeName === 'AtlasGlossaryCategory')
                    return props.entity?.guid
                return ''
            })
            const categoryQf = computed(() => {
                if (props.entity?.typeName === 'AtlasGlossaryCategory')
                    return props.entity?.attributes?.qualifiedName
                return ''
            })

            const addGTCNode = inject('addGTCNode')
            const deleteGTCNode = inject('deleteGTCNode')
            const handleDelete = (guid) => {
                deleteGTCNode(entity.value, guid)
            }
            const handleAdd = (asset) => {
                addGTCNode(asset, entity.value)
            }
            const closeMenu = () => {
                isVisible.value = false
            }
            const showModal = () => {
                isModalVisible.value = true
                isVisible.value = false
            }
            const handleCancel = () => {
                isModalVisible.value = false
            }
            // copy profile link
            const handleCopyProfileLink = () => {
                const baseUrl = window.location.origin
                const text = `${baseUrl}/glossary/${props.entity?.guid}`
                copyToClipboard(text)
                message.success({
                    content: 'Copied!',
                })
                closeMenu()
            }
            const handleCopyName = () => {
                copyToClipboard(
                    props?.entity?.attributes?.name ??
                        props?.entity?.displayText
                )
                message.success({
                    content: 'Copied!',
                })
                closeMenu()
            }

            // permissions
            // ? evaluate permission for glossary are checked against their glossary of any child, hence parse the glossary from category or  term
            const glossary = computed(() => {
                if (entity.value.typeName === 'AtlasGlossary')
                    return entity.value
                if (
                    ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'].includes(
                        entity.value.typeName
                    )
                )
                    return entity.value.attributes.anchor
                return null
            })

            const {
                termAddPermission,
                categoryAddPermission,
                entityUpdatePermission,
                entityDeletePermission,
                createPermission,
                fetch,
            } = fetchGlossaryPermission(glossary)

            // ? when action dropdown opens, fetch all permissions, if not fetched already
            watch(isVisible, (v) => {
                if (v && glossary.value) {
                    fetch()
                }
            })

            return {
                termAddPermission,
                categoryAddPermission,
                entityUpdatePermission,
                entityDeletePermission,
                createPermission,
                assetTypeLabel,
                isVisible,
                isModalVisible,
                handleCancel,
                showModal,
                closeMenu,
                glossaryId,
                categoryId,
                categoryQf,
                showCategories,
                entity,
                glossaryQualifiedName,
                categoryGuid,
                glossaryName,
                categoryName,
                handleAdd,
                addGTCNode,
                handleDelete,
                shouldRedirect,
                map,
                handleCopyProfileLink,
                handleCopyName,
            }
        },
    })
</script>
<style lang="less" module>
    .treeMode {
        @apply bg-black bg-opacity-0 !important;
    }
    .threeDotMenu {
        :global(.ant-dropdown-menu-item) {
            margin: 0;
        }
        :global(.ant-dropdown-menu-submenu-title) {
            padding: 9px 16px !important;
            margin: 0;
        }
    }
</style>
