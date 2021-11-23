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
                    v-if="
                        showGtcCrud && entity?.typeName !== 'AtlasGlossaryTerm'
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
                        :categoryGuid="categoryGuid"
                    >
                        <template #trigger>
                            <div class="flex items-center">
                                <AtlanIcon icon="Category" class="m-0 mr-2" />
                                <p class="p-0 m-0">Add Category</p>
                            </div>
                        </template>
                    </AddGtcModal>
                </a-menu-item>

                <a-menu-item
                    v-if="
                        showGtcCrud && entity?.typeName !== 'AtlasGlossaryTerm'
                    "
                    key="add"
                    @click="closeMenu"
                >
                    <AddGtcModal
                        entityType="AtlasGlossaryTerm"
                        :glossaryName="glossaryName"
                        :categoryName="categoryName"
                        :glossary-qualified-name="glossaryQualifiedName"
                        :categoryGuid="categoryGuid"
                    >
                        <template #trigger>
                            <div class="flex items-center">
                                <AtlanIcon icon="Term" class="m-0 mr-2" />
                                <p class="p-0 m-0">Add Term</p>
                            </div>
                        </template>
                    </AddGtcModal>
                </a-menu-item>
                <a-menu-divider></a-menu-divider>
                <a-menu-item
                    v-if="showGtcCrud"
                    key="archive"
                    @click="closeMenu"
                >
                    <RemoveGTCModal
                        :entityType="entity.typeName"
                        :entity="entity"
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
    import { useRouter } from 'vue-router'

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
            const router = useRouter()
            const showCategories = ref(false)
            const { getAnchorQualifiedName } = useAssetInfo()

            const glossaryQualifiedName = computed(() => {
                if (entity.value.typeName === 'AtlasGlossary') {
                    return entity.value.qualifiedName
                }
                return getAnchorQualifiedName(entity.value)
            })

            // injects
            // const currentProfile = inject<Ref<Glossary | Term | Category>>('currentEntity')
            // const handleFetchListInj: Function | undefined = inject(
            //     'handleFetchList',
            //     () => null
            // )
            // const updateTreeNode: Function | undefined =
            //     inject<any>('updateTreeNode')
            // const refetchGlossaryList = inject<() => void>(
            //     'refetchGlossaryList',
            //     () => {}
            // )
            // const refreshEntity = inject<() => void>('refreshEntity', () => {})
            // const refetchGlossaryTree = inject<
            //     (
            //         guid: string | 'root',
            //         categoryQualifiedName?: string,
            //         refreshEntityType?: 'term' | 'category'
            //     ) => void
            // >('refetchGlossaryTree', () => {})

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
            const handleAdd = (asset) => {
                console.log('add')
                console.log(entity.value)
                console.log(asset)
                entity.value.children = []
                entity.value.children.push({
                    ...asset,
                    id: `${getAnchorQualifiedName(asset)}_${
                        asset.attributes?.qualifiedName
                    }`,
                    key: `${getAnchorQualifiedName(asset)}_${
                        asset.attributes?.qualifiedName
                    }`,
                    isLeaf: false,
                })
                console.log(entity.value)
                console.log(addGTCNode)
                // }
                // console.log('asdsd', entity)
                // addGTCNode(asset)
            }
            // const {
            //     deleteGlossary,
            //     deleteCategory,
            //     deleteTerm,
            //     error,
            //     isLoading,
            // } = useDeleteGlossary()

            // const serviceMap = {
            //     AtlasGlossaryTerm: deleteTerm,
            //     AtlasGlossaryCategory: deleteCategory,
            //     AtlasGlossary: deleteGlossary,
            // }
            const closeMenu = () => {
                isVisible.value = false
            }
            const showModal = () => {
                isModalVisible.value = true
                isVisible.value = false
            }
            // const handleDelete = () => {
            //     const { data } = serviceMap[props.entity?.typeName](
            //         props.entity?.guid,
            //         !props.showLinks || currentProfile?.value?.guid === props.entity?.guid,
            //         props.entity?.attributes?.anchor?.guid
            //     )
            //     if (handleFetchListInj) handleFetchListInj(props.entity)
            //     watch(data, () => {
            //         if (refreshEntity && currentProfile?.value?.guid === props.entity?.guid) refreshEntity()
            //         setTimeout(() => {
            //             if (refetchGlossaryTree) {
            //                 if (
            //                     props.entity?.typeName === 'AtlasGlossaryCategory'
            //                 ) {
            //                     refetchGlossaryTree(
            //                         props.entity?.attributes?.parentCategory
            //                             ?.guid ?? 'root',
            //                         props.entity?.attributes?.qualifiedName,
            //                         'category'
            //                     )
            //                 } else if (
            //                     props.entity?.typeName === 'AtlasGlossaryTerm'
            //                 ) {
            //                     if (props.entity?.attributes?.categories?.length) {
            //                         props.entity?.attributes?.categories?.forEach(
            //                             (category) => {
            //                                 refetchGlossaryTree(
            //                                     category.guid,
            //                                     category?.uniqueAttributes?.qualifiedName,
            //                                     'term'
            //                                 )
            //                             }
            //                         )
            //                     } else {
            //                         refetchGlossaryTree('root', '','term')
            //                     }
            //                 }
            //             }
            //         }, 500)
            //         if(refetchGlossaryList && props.entity.typeName === 'AtlasGlossary') refetchGlossaryList()
            //     })

            //     isModalVisible.value = false
            // }

            const handleCancel = () => {
                isModalVisible.value = false
            }

            // copy profile link
            const handleCopyProfileLink = () => {
                // const baseUrl = window.location.origin
                // const text = `${baseUrl}/glossary/${
                //     assetTypeLabel[props.entity?.typeName]
                // }/${props?.entity?.guid}`
                // copyToClipboard(text)
                message.success({
                    content: 'Copied!',
                })
            }

            // update tree on archive or create new entity
            // const updateTree = (selectedAsset: Glossary | Category | Term) => {
            //     if (updateTreeNode && !props.treeMode) {
            //         updateTreeNode({
            //             guid: selectedAsset.guid,
            //             entity: selectedAsset,
            //         })
            //     }
            // }

            return {
                handleCopyProfileLink,
                assetTypeLabel,
                isVisible,
                isModalVisible,
                // updateTree,
                // handleDelete,
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
