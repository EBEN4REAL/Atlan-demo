<template>
    <div
        class="group-hover:opacity-100"
        :class="{'opacity-100': isVisible, 'opacity-0 treeMode': treeMode, 'opacity-100': visible }"
    >
        <a-dropdown
            v-model:visible="isVisible"
            :trigger="treeMode ? ['hover'] : ['click']"
            :class="treeMode ? $style.treeMode: ''"
            @click.stop="() => {}"
        >
            <a-button
                class="px-2 three-dot-menu"
                :class="{ ' border-0 shadow-none outline-none': !showLinks || treeMode, 'treeMode h-4 w-4 mr-2': treeMode }"
                @click.prevent
            >
                <!-- <fa icon="fal ellipsis-v" class="h-4" /> -->
                <AtlanIcon icon="KebabMenu" class="h-4 m-0" />
            </a-button>
            <template #overlay>
                <a-menu>
                    <a-menu-item
                        v-if="showLinks"
                        key="profileLink"
                        @click="redirectToProfile"
                    >
                        <div class="flex items-center">
                            <AtlanIcon icon="Link" class="m-0 mr-2" />
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
                    <a-menu-item key="edit" @click="closeMenu">
                        <AddGtcModal
                            :entityType="assetTypeLabel[entity?.typeName]"
                            :glossaryId="glossaryId"
                            :categoryId="categoryId"
                            mode="edit"
                            :entity="entity"
                        >
                            <template #header>
                                <div class="flex items-center mr-5">
                                    <AtlanIcon
                                        v-if="
                                            entity.typeName === 'AtlasGlossary'
                                        "
                                        icon="Glossary"
                                        class="h-4 m-0 mr-2"
                                    />
                                    <AtlanIcon
                                        v-if="
                                            entity.typeName ===
                                            'AtlasGlossaryTerm'
                                        "
                                        icon="Term"
                                        class="h-4 m-0 mr-2"
                                    />
                                    <AtlanIcon
                                        v-if="
                                            entity.typeName ===
                                            'AtlasGlossaryCategory'
                                        "
                                        icon="Category"
                                        class="h-4 m-0 mb-1 mr-2"
                                    />

                                    <span class="text-xs">{{
                                        entity?.displayText
                                    }}</span>
                                </div>
                            </template>
                            <template #trigger>
                                <div class="flex items-center">
                                    <AtlanIcon icon="Link" class="m-0 mr-2" />
                                    <p class="p-0 m-0">
                                        Edit
                                        {{ assetTypeLabel[entity?.typeName] }}
                                    </p>
                                </div>
                            </template>
                        </AddGtcModal>
                    </a-menu-item>

                    <a-menu-item
                        key="add"
                        @click="closeMenu"
                        v-if="entity?.typeName !== 'AtlasGlossaryTerm'"
                    >
                        <AddGtcModal
                            entityType="term"
                            :glossaryId="glossaryId"
                            :categoryId="categoryId"
                        >
                            <template #header>
                                <div class="flex items-center mr-5">
                                    <AtlanIcon
                                        v-if="
                                            entity.typeName === 'AtlasGlossary'
                                        "
                                        icon="Glossary"
                                        class="h-4 m-0 mr-2"
                                    />
                                    <AtlanIcon
                                        v-if="
                                            entity.typeName ===
                                            'AtlasGlossaryTerm'
                                        "
                                        icon="Term"
                                        class="h-4 m-0 mr-2"
                                    />
                                    <AtlanIcon
                                        v-if="
                                            entity.typeName ===
                                            'AtlasGlossaryCategory'
                                        "
                                        icon="Category"
                                        class="h-4 m-0 mb-1 mr-2"
                                    />

                                    <span class="text-xs">{{
                                        entity?.displayText
                                    }}</span>

                                    <AtlanIcon
                                        icon="ChevronDown"
                                        class="h-4 mx-1 transition-transform transform -rotate-90 "
                                    />
                                    <span
                                        class="text-xs font-bold text-gray-700"
                                        >New term</span
                                    >
                                </div>
                            </template>
                            <template #trigger>
                                <div class="flex items-center">
                                    <AtlanIcon icon="Term" class="m-0 mr-2" />
                                    <p class="p-0 m-0">Add New Term</p>
                                </div>
                            </template>
                        </AddGtcModal>
                    </a-menu-item>

                    <!-- <a-menu-item
                        v-if="entity?.typeName !== 'AtlasGlossaryTerm'"
                        key="add"
                        @click="createNewTerm"
                        class="flex items-center"
                    >
                        <div class="flex items-center">
                            <AtlanIcon icon="Link" class="m-0 mr-2" />
                            <p class="p-0 m-0">Add term</p>
                        </div>
                    </a-menu-item> -->
                    <!-- <a-menu-item
                        v-if="entity?.typeName !== 'AtlasGlossaryTerm'"
                        key="addCat"
                        class="flex items-center"
                        @click="createNewCategory"
                    >
                        <div class="flex items-center">
                            <AtlanIcon icon="Link" class="m-0 mr-2" />
                            <p class="p-0 m-0">Add category</p>
                        </div>
                    </a-menu-item> -->
                    <a-menu-item
                        key="addCat"
                        @click="closeMenu"
                        v-if="entity?.typeName !== 'AtlasGlossaryTerm'"
                    >
                        <AddGtcModal
                            entityType="category"
                            :glossaryId="glossaryId"
                            :categoryId="categoryId"
                        >
                            <template #header>
                                <div class="flex items-center mr-5">
                                    <AtlanIcon
                                        v-if="
                                            entity.typeName === 'AtlasGlossary'
                                        "
                                        icon="Glossary"
                                        class="h-4 m-0 mr-2"
                                    />
                                    <AtlanIcon
                                        v-if="
                                            entity.typeName ===
                                            'AtlasGlossaryTerm'
                                        "
                                        icon="Term"
                                        class="h-4 m-0 mr-2"
                                    />
                                    <AtlanIcon
                                        v-if="
                                            entity.typeName ===
                                            'AtlasGlossaryCategory'
                                        "
                                        icon="Category"
                                        class="h-4 m-0 mb-1 mr-2"
                                    />

                                    <span class="text-xs">{{
                                        entity?.displayText
                                    }}</span>

                                    <AtlanIcon
                                        icon="ChevronDown"
                                        class="h-4 mx-1 transition-transform transform -rotate-90 "
                                    />
                                    <span
                                        class="text-xs font-bold text-gray-700"
                                        >New category</span
                                    >
                                </div>
                            </template>
                            <template #trigger>
                                <div class="flex items-center">
                                    <AtlanIcon icon="Category" class="m-0 mr-2" />
                                    <p class="p-0 m-0">Add New Category</p>
                                </div>
                            </template>
                        </AddGtcModal>
                    </a-menu-item>

                    <a-menu-divider
                        v-if="entity?.typeName !== 'AtlasGlossaryTerm'"
                    />
                    <a-sub-menu key="status">
                        <template #title>
                            <div class="flex items-center justify-between">
                                <StatusBadge
                                    :key="entity?.guid"
                                    :status-id="entity?.attributes?.assetStatus"
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
                                @update:selectedAsset="updateTree"
                            />
                        </a-menu-item>
                    </a-sub-menu>

                    <a-sub-menu key="expert">
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
                                @update:selectedAsset="updateTree"
                            />
                        </a-menu-item>
                    </a-sub-menu>
                    <a-menu-divider />
                    <a-menu-item key="archive" class="text-red-700">
                        <a-button
                            class="w-full p-0 m-0 bg-transparent border-0 shadow-none outline-none "
                            @click="showModal"
                        >
                            <div class="flex items-center text-red-700">
                                <fa icon="fal trash-alt" class="mr-2"></fa>
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
        onMounted,
        computed,
    } from 'vue'
    import { useRouter } from 'vue-router'

    // components
    import StatusBadge from '@common/badge/status/index.vue'
    import Owners from '@/glossary/common/owners.vue'
    import Status from '@/glossary/common/status.vue'
    import AddGtcModal from '@/glossary/common/addGtcModal.vue'
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

    export default defineComponent({
        components: { Status, Owners, StatusBadge, AddGtcModal },
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
            treeMode: {
                type: Boolean,
                required: false,
                default: () => false
            },
            visible: {
                type: Boolean,
                required: false,
                default: true
            }
        },
        setup(props, context) {
            // data
            const isVisible = ref(false)
            const isModalVisible = ref<boolean>(false)
            const router = useRouter()

            const handleFetchListInj: Function | undefined =
                inject('handleFetchList')
            const updateTreeNode: Function | undefined =
                inject<any>('updateTreeNode')
            const refetchGlossaryTree = inject<(guid: string | 'root') => void>(
                'refetchGlossaryTree'
            )
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
                serviceMap[props.entity?.typeName](
                    props.entity?.guid,
                    !props.showLinks,
                    props.entity?.attributes?.anchor?.guid
                )
                if (handleFetchListInj) handleFetchListInj(props.entity)

                if (refetchGlossaryTree) {
                    if (props.entity?.typeName === 'AtlasGlossaryCategory') {
                        refetchGlossaryTree(
                            props.entity?.attributes?.parentCategory?.guid ??
                                'root'
                        )
                    } else if (props.entity?.typeName === 'AtlasGlossaryTerm') {
                        if (props.entity?.attributes?.categories?.length) {
                            props.entity?.attributes?.categories?.forEach(
                                (category) => {
                                    refetchGlossaryTree(category.guid)
                                }
                            )
                        } else {
                            refetchGlossaryTree('root')
                        }
                    }
                }
                isModalVisible.value = false
            }

            const handleCancel = () => {
                isModalVisible.value = false
            }
            const handleCopyProfileLink = () => {
                const baseUrl = window.location.origin
                const text = `${baseUrl}/glossary/${
                    assetTypeLabel[props.entity?.typeName]
                }/${props?.entity?.guid}`
                copyToClipboard(text)
            }
            const createNewTerm = () => {
                if (props.entity?.typeName === 'AtlasGlossary')
                    createTerm(props.entity?.guid ?? '')
                else
                    createTerm(
                        props.entity?.attributes?.anchor?.guid ?? '',
                        props.entity.guid
                    )
            }
            const createNewCategory = () => {
                if (props.entity?.typeName === 'AtlasGlossary')
                    createCategory(props.entity?.guid ?? '')
                else
                    createCategory(
                        props.entity?.attributes?.anchor?.guid ?? '',
                        props.entity.guid
                    )
            }
            const redirectToProfile = () => {
                if (props.entity.typeName === 'AtlasGlossary')
                    router.push(`/glossary/${props.entity.guid}`)
                else if (props.entity.typeName === 'AtlasGlossaryCategory')
                    router.push(`/glossary/category/${props.entity.guid}`)
                else if (props.entity.typeName === 'AtlasGlossaryTerm')
                    router.push(`/glossary/term/${props.entity.guid}`)
            }

            // update tree on archive or create new entity
            const updateTree = (selectedAsset: Glossary | Category | Term) => {
                if (updateTreeNode) {
                    updateTreeNode({
                        guid: selectedAsset.guid,
                        entity: selectedAsset,
                    })
                }
            }
            return {
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
            }
        },
    })
</script>
<style lang="less" module>
  .treeMode {
    @apply bg-black bg-opacity-0 !important;
  }
</style>
