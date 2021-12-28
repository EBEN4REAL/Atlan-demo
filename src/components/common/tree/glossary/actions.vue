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
                <div v-auth="map.CREATE_CATEGORY">
                    <a-menu-item
                        v-if="
                            showGtcCrud &&
                            entity?.typeName !== 'AtlasGlossaryTerm'
                        "
                        key="add"
                        @click="closeMenu"
                    >
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
                    </a-menu-item>
                </div>
                <div v-auth="map.CREATE_TERM">
                    <a-menu-item
                        v-if="
                            showGtcCrud &&
                            entity?.typeName !== 'AtlasGlossaryTerm'
                        "
                        key="add"
                        @click="closeMenu"
                    >
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
                                    <AtlanIcon icon="Term" class="m-0 mr-2" />
                                    <p class="p-0 m-0">Add Term</p>
                                </div>
                            </template>
                        </AddGtcModal>
                    </a-menu-item>
                </div>
                <div
                    v-auth="
                        entity?.typeName === 'AtlasGlossaryTerm'
                            ? map.DELETE_TERM
                            : entity?.typeName === 'AtlasGlossaryCategory'
                            ? map.DELETE_CATEGORY
                            : map.DELETE_GLOSSARY
                    "
                >
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
        emits: ['unlinkAsset', 'add'],
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

            return {
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
