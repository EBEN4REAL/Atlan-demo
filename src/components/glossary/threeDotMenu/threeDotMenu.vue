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
                        !showLinks || treeMode,
                    'treeMode h-4 w-4 ml-0.5': treeMode,
                }"
                @click.prevent
            >
                <!-- <fa icon="fal ellipsis-v" class="h-4" /> -->
                <AtlanIcon icon="KebabMenu" class="h-4 m-0" />
            </a-button>
            <template #overlay>
                <a-menu :class="$style.threeDotMenu">
                    <a-menu-item
                        v-if="showLinks"
                        key="profileLink"
                        @click="redirectToProfile(entity.typeName, entity.guid)"
                    >
                        <div class="flex items-center">
                            <atlan-icon
                                v-if="entity?.typeName === 'AtlasGlossaryTerm'"
                                icon="OpenTermProfile"
                                class="w-auto mr-2"
                            />
                            <atlan-icon
                                v-if="
                                    entity?.typeName === 'AtlasGlossaryCategory'
                                "
                                icon="OpenCategoryProfile"
                                class="w-auto mr-2"
                            />

                            <p class="p-0 m-0">
                                Go to
                                {{ assetTypeLabel[entity?.typeName] }}
                                profile
                            </p>
                        </div>
                    </a-menu-item>
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

                    <a-menu-divider v-if="showLinks" />
                    <a-menu-item
                        v-if="showGtcCrud && udpatePermission"
                        key="edit"
                        @click="closeMenu"
                    >
                        <AddGtcModal
                            :entityType="assetTypeLabel[entity?.typeName]"
                            :glossaryId="glossaryId"
                            :glossaryQualifiedName="
                                entity?.typeName === 'AtlasGlossary'
                                    ? entity?.attributes?.qualifiedName
                                    : entity?.attributes?.anchor
                                          ?.uniqueAttributes?.qualifiedName
                            "
                            :categoryId="categoryId"
                            mode="edit"
                            :entity="entity"
                        >
                            <template #header>
                                <ModalHeader :entity="entity" />
                            </template>
                            <template #trigger>
                                <div class="flex items-center">
                                    <AtlanIcon icon="Pencil" class="m-0 mr-2" />
                                    <p class="p-0 m-0 capitalize">
                                        Edit
                                        {{ assetTypeLabel[entity?.typeName] }}
                                    </p>
                                </div>
                            </template>
                        </AddGtcModal>
                    </a-menu-item>

                    <a-menu-item
                        v-if="
                            showGtcCrud &&
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
                            showGtcCrud &&
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

                    <a-menu-item v-if="showUnlinkAsset" key="unkink">
                        <a-button
                            class="w-full p-0 m-0 bg-transparent border-0 shadow-none outline-none "
                            @click="$emit('unlinkAsset', entity)"
                        >
                            <div class="flex items-center text-red-700">
                                <AtlanIcon icon="Link" class="mr-2" />
                                <p class="p-0 m-0">Unlink Asset</p>
                            </div>
                        </a-button>
                    </a-menu-item>

                    <a-menu-divider
                        v-if="
                            showGtcCrud &&
                            entity?.typeName !== 'AtlasGlossaryTerm'
                        "
                    />
                    <a-sub-menu v-if="udpatePermission" key="status">
                        <template #title>
                            <div class="flex items-center justify-between">
                                <StatusBadge
                                    :key="entity?.guid"
                                    :status-id="
                                        entity?.attributes?.certificateStatus
                                    "
                                    :show-chip-style-status="false"
                                    :show-no-status="true"
                                    :show-label="true"
                                    class="p-0"
                                ></StatusBadge>
                                <AtlanIcon
                                    class="pt-1 ml-4 transform -rotate-90"
                                    icon="ChevronDown"
                                />
                            </div>
                        </template>
                        <template #expandIcon><div></div> </template>

                        <a-menu-item class="m-0 bg-white">
                            <Status
                                v-if="entity?.guid"
                                :selectedAsset="entity"
                                :editPermission="udpatePermission"
                                @update:selectedAsset="updateTree"
                            />
                        </a-menu-item>
                    </a-sub-menu>

                    <a-sub-menu v-if="udpatePermission" key="owner">
                        <template #title>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center justify-between">
                                    <AtlanIcon
                                        icon="AddUser"
                                        class="m-0 mr-2"
                                    />
                                    <p class="p-0 m-0">Add Owner</p>
                                </div>
                                <AtlanIcon
                                    class="pt-1 ml-4 transform -rotate-90"
                                    icon="ChevronDown"
                                />
                            </div>
                        </template>
                        <template #expandIcon><div></div> </template>
                        <a-menu-item class="m-0 bg-white">
                            <Owners
                                :selectedAsset="entity"
                                :editPermission="udpatePermission"
                                @update:selectedAsset="updateTree"
                            />
                        </a-menu-item>
                    </a-sub-menu>
                    <a-menu-item
                        v-if="
                            showGtcCrud &&
                            entity?.typeName === 'AtlasGlossaryTerm' &&
                            udpatePermission
                        "
                        key="categories"
                        class="pr-0"
                    >
                        <a-popover :trigger="['hover']" placement="right">
                            <div
                                class="flex items-center justify-between pr-4 mr-2 "
                            >
                                <div class="flex items-center justify-between">
                                    <AtlanIcon
                                        icon="Category"
                                        class="m-0 mr-2"
                                    />
                                    <p class="p-0 m-0">Categories</p>
                                </div>
                                <AtlanIcon
                                    class="pt-1 transform -rotate-90"
                                    icon="ChevronDown"
                                />
                            </div>
                            <template
                                #content
                                class="absolute p-0 pb-8 hover:bg-white left-8"
                                style="max-height: 416px"
                            >
                                <Categories
                                    :glossaryQualifiedName="
                                        entity.attributes?.anchor
                                            ?.uniqueAttributes?.qualifiedName
                                    "
                                    :categories="entity.attributes.categories"
                                    :termGuid="entity.guid"
                                    :term="entity"
                                    mode="threeDotMenu"
                                    :editPermission="udpatePermission"
                                />
                            </template>
                        </a-popover>
                        <!-- <template #title>
                        
                        </template>
                        <template #expandIcon><div></div> </template> -->
                    </a-menu-item>

                    <a-menu-divider v-if="showGtcCrud" />

                    <a-menu-item
                        v-if="showGtcCrud && deletePermission"
                        key="archive"
                        class="text-red-700"
                    >
                        <a-button
                            class="w-full p-0 m-0 bg-transparent border-0 shadow-none outline-none "
                            @click="showModal"
                        >
                            <div class="flex items-center text-red-700">
                                <AtlanIcon icon="Trash" class="mr-2" />
                                <p class="p-0 m-0">Archive</p>
                            </div>
                        </a-button>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
        <a-modal
            v-model:visible="isModalVisible"
            :closable="false"
            @ok="handleOk"
        >
            <template #footer>
                <a-button key="back" @click="handleCancel">Cancel</a-button>
                <a-button key="submit" danger @click="handleOk"
                    >Delete</a-button
                >
            </template>
            <template #title>
                Delete {{ assetTypeLabel[entity?.typeName] }}</template
            >
            <div v-if="entity?.typeName === 'AtlasGlossary'">
                <p>
                    Warning: Deletion of {{ entity?.displayText }} will also
                    result in permanent deletion of all its child categories and
                    terms.
                </p>
            </div>
            <div v-if="entity?.typeName === 'AtlasGlossaryCategory'">
                <p>
                    Warning: Deletion of {{ entity?.displayText }} will not lead
                    to deletion of child terms. The terms will get unlinked from
                    this category.
                </p>
            </div>
            <div v-if="entity?.typeName === 'AtlasGlossaryTerm'">
                <p>
                    Warning: Deletion of {{ entity?.displayText }} will lead to
                    permanent deletion of the term across categories. You may
                    want to unlink the term instead.
                </p>
            </div>
        </a-modal>
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
    import StatusBadge from '@common/badge/status/index.vue'
    import Owners from './owners.vue'
    import Status from './status.vue'
    import AddGtcModal from '@/glossary/gtcCrud/addGtcModal.vue'
    import Categories from '@/glossary/common/categories.vue'
    import ModalHeader from '@/glossary/gtcCrud/modalHeader.vue'

    // utils
    import { copyToClipboard } from '~/utils/clipboard'
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
            Status,
            Owners,
            StatusBadge,
            AddGtcModal,
            Categories,
            ModalHeader,
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

            const handleFetchListInj: Function | undefined = inject(
                'handleFetchList',
                () => null
            )
            const updateTreeNode: Function | undefined =
                inject<any>('updateTreeNode')
            const refetchGlossaryList = inject<() => void>('refetchGlossaryList', () => {})
            const refreshEntity = inject<() => void>('refreshEntity', () => {})
            const showCategories = ref(false)
            const refetchGlossaryTree = inject<
                (
                    guid: string | 'root',
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

            const {
                deleteGlossary,
                deleteCategory,
                deleteTerm,
                error,
                isLoading,
            } = useDeleteGlossary()

            const { createTerm, createCategory } = useCreateGlossary()
            const serviceMap = {
                AtlasGlossaryTerm: deleteTerm,
                AtlasGlossaryCategory: deleteCategory,
                AtlasGlossary: deleteGlossary,
            }
            const closeMenu = () => {
                isVisible.value = false
            }
            const showModal = () => {
                isModalVisible.value = true
                isVisible.value = false
            }
            const handleOk = () => {
                const { data } = serviceMap[props.entity?.typeName](
                    props.entity?.guid,
                    !props.showLinks,
                    props.entity?.attributes?.anchor?.guid
                )
                if (handleFetchListInj) handleFetchListInj(props.entity)
                watch(data, () => {
                    if (refreshEntity) refreshEntity()
                    if (refetchGlossaryTree) {
                        if (
                            props.entity?.typeName === 'AtlasGlossaryCategory'
                        ) {
                            refetchGlossaryTree(
                                props.entity?.attributes?.parentCategory
                                    ?.guid ?? 'root',
                                'category'
                            )
                        } else if (
                            props.entity?.typeName === 'AtlasGlossaryTerm'
                        ) {
                            if (props.entity?.attributes?.categories?.length) {
                                props.entity?.attributes?.categories?.forEach(
                                    (category) => {
                                        refetchGlossaryTree(
                                            category.guid,
                                            'term'
                                        )
                                    }
                                )
                            } else {
                                refetchGlossaryTree('root', 'term')
                            }
                        }
                    }
                    if(refetchGlossaryList) refetchGlossaryList()
                })

                isModalVisible.value = false
            }

            const handleCancel = () => {
                isModalVisible.value = false
            }

            // copy profile link
            const handleCopyProfileLink = () => {
                const baseUrl = window.location.origin
                const text = `${baseUrl}/glossary/${
                    assetTypeLabel[props.entity?.typeName]
                }/${props?.entity?.guid}`
                copyToClipboard(text)
                message.success({
                    content: 'Copied!',
                })
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
                handleCopyProfileLink,
                assetTypeLabel,
                isVisible,
                isModalVisible,
                updateTree,
                handleOk,
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
