<template>
    <a-dropdown v-model:visible="isVisible" @click.stop="() => {}">
        <a-button class="" @click.prevent size="small">
            <AtlanIcon icon="KebabMenu" class="" />
        </a-button>
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
                        <p class="p-0 m-0">
                            Copy
                            {{ assetTypeLabel[entity?.typeName] }}
                            profile link
                        </p>
                    </div>
                </a-menu-item>
                <a-menu-item
                    key="bulk"
                    class="flex items-center"
                    @click="closeMenu"
                >
                    <BulkUploadModal :entity="entity">
                        <template #trigger>
                            <div class="flex items-center">
                                <AtlanIcon
                                    icon="Download"
                                    class="m-0 mr-2 transform rotate-180  text-primary"
                                />
                                <p class="p-0 m-0 text-gray-700 capitalize">
                                    Bulk upload terms
                                </p>
                            </div>
                        </template>
                    </BulkUploadModal>
                </a-menu-item>
                <a-menu-divider></a-menu-divider>
                <!-- Archive -->
                <a-menu-item
                    v-if="showGtcCrud"
                    key="archive"
                    class="text-red-700"
                    @click="closeMenu"
                >
                    <RemoveGTCModal :entity="entity">
                        <template #trigger>
                            <div class="flex items-center">
                                <AtlanIcon
                                    icon="Trash"
                                    class="mr-2 text-red-700"
                                />
                                <p class="p-0 m-0 text-gray-700 capitalize">
                                    Archive
                                </p>
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
    // import Categories from '@/glossary/common/categories.vue'
    import ModalHeader from '@/glossary/modal/modalHeader.vue'
    // import BulkModal from '@/glossary/gtcCrud/bulkModal.vue'

    // utils
    import { copyToClipboard } from '~/utils/clipboard'
    import BulkUploadModal from '@/glossary/modal/bulkUploadModal.vue'
    import RemoveGTCModal from '@/glossary/modal/removeGTCModal.vue'
    import assetTypeLabel from '@/glossary/constants/assetTypeLabel'
    // composables
    // import useDeleteGlossary from '~/components/glossary/composables/useDeleteGlossary'
    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        components: {
            // Status,
            // Owners,
            StatusBadge,
            BulkUploadModal,
            AddGtcModal,
            // Categories,
            ModalHeader,
            RemoveGTCModal,
            // BulkModal,
        },
        props: {
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: true,
                default: () => {},
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
        emits: ['unlinkAsset'],
        setup(props, context) {
            // data
            const { entity } = toRefs(props)
            const isVisible = ref(false)
            const isModalVisible = ref<boolean>(false)
            const router = useRouter()
            const showCategories = ref(false)

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
                const baseUrl = window.location.origin
                const text = `${baseUrl}/glossary/${glossaryId.value}`
                copyToClipboard(text)
                message.success({
                    content: 'Copied!',
                })
                closeMenu()
            }

            // const redirectToProfile = redirect(router)

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
            }
        },
    })
</script>
<style lang="less" module></style>
