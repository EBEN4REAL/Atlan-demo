<template>
    <div
        class="group-hover:opacity-100"
        :class="{
            'opacity-0 treeMode': treeMode,
        }"
    >
        <a-dropdown
            v-model:visible="isVisible"
            :trigger="treeMode ? ['click'] : ['click']"
            :class="{
                [$style.treeMode]: treeMode,
                [$style.threeDotMenu]: true,
            }"
            @click.stop="() => {}"
        >
            <div>
                <AtlanIcon
                    icon="KebabMenu"
                    class="h-4 m-0"
                    v-if="treeMode"
                    @click.prevent
                />
            </div>

            <template #overlay>
                <a-menu :class="$style.threeDotMenu">
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
                            :glossary-qualified-name="glossaryQualifiedName"
                            :categoryGuid="categoryGuid"
                        >
                            <template #trigger>
                                <div class="flex items-center">
                                    <AtlanIcon icon="Term" class="m-0 mr-2" />
                                    <p class="p-0 m-0">Create New Term</p>
                                </div>
                            </template>
                        </AddGtcModal>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
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
            AddGtcModal,
            // Categories,
            ModalHeader,
            // BulkModal,
        },
        props: {
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: true,
                default: () => {},
            },
            glossaryQualifiedName: {
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
        emits: ['unlinkAsset'],
        setup(props, context) {
            // data
            const { entity, glossaryQualifiedName, categoryGuid } =
                toRefs(props)
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
            padding: 9px 16px !important;
            margin: 0;
        }
        :global(.ant-dropdown-menu-submenu-title) {
            padding: 9px 16px !important;
            margin: 0;
        }
    }
</style>
