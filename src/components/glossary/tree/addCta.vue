<template>
    <div
        v-if="!noPermissions"
        class="group-hover:opacity-100 leading-5"
        :class="{
            'opacity-100': isVisible,
            'opacity-0 treeMode': treeMode,
            'opacity-100': visible,
        }"
    >
        <a-dropdown
            v-model:visible="isVisible"
            :trigger="treeMode ? ['click'] : ['click']"
            :class="{
                [$style.treeMode] : treeMode,
                [$style.threeDotMenu]: true
            }"
            @click.stop="() => {}"
        >
            <a-button
                class="px-2 three-dot-menu"
                :class="{
                    ' border-0 shadow-none outline-none':
                         treeMode,
                    'treeMode h-4 w-4 ml-0.5': treeMode,
                }"
                @click.prevent
            >
                <!-- <fa icon="fal ellipsis-v" class="h-4" /> -->
                <AtlanIcon icon="Add" class="h-4 m-0" />
            </a-button>
            <template #overlay>
                <a-menu :class="$style.threeDotMenu">

                    <a-menu-item
                        v-if="
                            entity?.typeName !== 'AtlasGlossaryTerm' &&
                            permissions.CREATE_TERM
                        "
                        key="add"
                        @click="closeMenu"
                    >
                        <AddGtcModal
                            entityType="term"
                            :glossaryId="glossaryId"
                            :glossaryQualifiedName="
                                entity?.typeName === 'AtlasGlossary'
                                    ? entity?.attributes?.qualifiedName
                                    : entity?.attributes?.anchor
                                          ?.uniqueAttributes?.qualifiedName
                            "
                            :categoryId="categoryId"
                        >
                            <template #header>
                                <ModalHeader
                                    :entity="entity"
                                    entity-to-add="term"
                                />
                            </template>
                            <template #trigger>
                                <div class="flex items-center">
                                    <AtlanIcon icon="Term" class="m-0 mr-2" />
                                    <p class="p-0 m-0">Create New Term</p>
                                </div>
                            </template>
                        </AddGtcModal>
                    </a-menu-item>

                    <a-menu-item
                        v-if="
                            entity?.typeName !== 'AtlasGlossaryTerm' &&
                            permissions.CREATE_CATEGORY
                        "
                        key="addCat"
                        @click="closeMenu"
                    >
                        <AddGtcModal
                            entityType="category"
                            :glossaryId="glossaryId"
                            :glossaryQualifiedName="
                                entity?.attributes?.anchor?.uniqueAttributes
                                    ?.qualifiedName
                            "
                            :categoryId="categoryId"
                        >
                            <template #header>
                                <ModalHeader
                                    :entity="entity"
                                    entity-to-add="category"
                                />
                            </template>
                            <template #trigger>
                                <div class="flex items-center">
                                    <AtlanIcon
                                        icon="Category"
                                        class="m-0 mr-2"
                                    />
                                    <p class="p-0 m-0">Create New Category</p>
                                </div>
                            </template>
                        </AddGtcModal>
                    </a-menu-item>

                    <!-- <a-menu-divider /> -->
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
        computed,
    } from 'vue'
    import { useRouter } from 'vue-router'

    // components
    import { message } from 'ant-design-vue'
    import AddGtcModal from '@/glossary/gtcCrud/addGtcModal.vue'
    import ModalHeader from '@/glossary/gtcCrud/modalHeader.vue'

    // utils
    import assetTypeLabel from '@/glossary/constants/assetTypeLabel'
    // composables
    import useDeleteGlossary from '~/components/glossary/composables/useDeleteGlossary'
    import useCreateGlossary from '~/components/glossary/composables/useCreateGlossary'
    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'
    import { useAccessStore } from '~/services/access/accessStore'
    import redirect from '@/glossary/utils/redirectToProfile'

    export default defineComponent({
        components: {
            AddGtcModal,
            ModalHeader,
        },
        props: {
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: true,
                default: () => {},
            },
            treeMode: {
                type: Boolean,
                required: false,
                default: () => true,
            },
            visible: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        setup(props, context) {
            // data
            const { entity } = toRefs(props)
            const isVisible = ref(false)
            const isModalVisible = ref<boolean>(false)
            const router = useRouter()

            const handleFetchListInj: Function | undefined = inject(
                'handleFetchList',
                () => null
            )
            const updateTreeNode: Function | undefined =
                inject<any>('updateTreeNode')
            const refreshEntity = inject<() => void>('refreshEntity', () => {})
            const showCategories = ref(false)
            const refetchGlossaryTree = inject<
                (
                    guid: string | 'root',
                    categoryQualifiedName: string,
                    refreshEntityType?: 'term' | 'category'
                ) => void
            >('refetchGlossaryTree')
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

            const { createTerm, createCategory } = useCreateGlossary()

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

            // create new term
            const createNewTerm = () => {
                if (props.entity?.typeName === 'AtlasGlossary')
                    createTerm(props.entity?.guid ?? '')
                else
                    createTerm(
                        props.entity?.attributes?.anchor?.guid ?? '',
                        props.entity.guid
                    )
            }
            // create new category
            const createNewCategory = () => {
                if (props.entity?.typeName === 'AtlasGlossary')
                    createCategory(props.entity?.guid ?? '')
                else
                    createCategory(
                        props.entity?.attributes?.anchor?.guid ?? '',
                        props.entity.guid
                    )
            }
            const redirectToProfile = redirect(router)

            // update tree on archive or create new entity
            const updateTree = (selectedAsset: Glossary | Category | Term) => {
                if (updateTreeNode) {
                    updateTreeNode({
                        guid: selectedAsset.guid,
                        entity: selectedAsset,
                    })
                }
            }

            const store = useAccessStore()
            const permissionMap = {
                AtlasGlossary: {
                    update: 'UPDATE_GLOSSARY',
                    delete: 'DELETE_GLOSSARY',
                },
                AtlasGlossaryCategory: {
                    update: 'UPDATE_CATEGORY',
                    delete: 'DELETE_CATEGORY',
                },
                AtlasGlossaryTerm: {
                    update: 'UPDATE_TERM',
                    delete: 'DELETE_TERM',
                },
            }
            const permissions = computed(() =>
                store.checkPermissions(['CREATE_TERM', 'CREATE_CATEGORY'])
            )
            const deletePermission = computed(() =>
                store.checkPermission(
                    permissionMap[props.entity?.typeName]?.delete
                )
            )
            const udpatePermission = computed(() =>
                store.checkPermission(
                    permissionMap[props.entity?.typeName]?.update
                )
            )
            const noPermissions = computed(
                () =>
                    !(
                        permissions.value.CREATE_TERM ||
                        permissions.value.CREATE_CATEGORY ||
                        deletePermission.value ||
                        udpatePermission.value
                    )
            )
            return {
                permissions,
                deletePermission,
                udpatePermission,
                noPermissions,
                assetTypeLabel,
                isVisible,
                isModalVisible,
                updateTree,
                handleCancel,
                showModal,
                createNewTerm,
                createNewCategory,
                closeMenu,
                redirectToProfile,
                glossaryId,
                categoryId,
                showCategories,
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
        :global( .ant-dropdown-menu-submenu-title) {
            padding: 9px 16px !important;
            margin: 0;
        }
    }
</style>
