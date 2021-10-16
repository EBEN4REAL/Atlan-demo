<template>
    <div v-if="mode !== 'threeDotMenu'" :class="$style.categories">
        <p v-if="mode === 'edit'" class="mb-1 text-sm text-gray-500">
            Categories
        </p>
        <div class="flex flex-wrap items-center">
            <div v-if="mode === 'edit' && existingCategories.length < 1">
                <div v-if="editPermission" @click.stop="toggleCategoriesTree">
                    <div
                        v-if="mode === 'edit'"
                        class="
                            flex
                            items-center
                            cursor-pointer
                            text-primary
                            hover:text-primary
                            hover:underline
                        "
                    >
                        <!-- <span class="flex items-center text-xs">
                                <fa icon="fal plus" />
                            </span> -->
                        <span class="text-xs">Add to categories</span>
                    </div>
                </div>
                <div v-else>
                    <span class="text-xs"
                        >Term does not belong to any categories</span
                    >
                </div>
            </div>
            <PillGroup
                v-else-if="mode === 'edit'"
                :data="existingCategories"
                label-key="guid"
                :readOnly="!editPermission"
                @add="toggleCategoriesTree"
            >
                <template #pillPrefix>
                    <AtlanIcon icon="Category" class="group-hover:text-white" />
                </template>
            </PillGroup>
            <a-button
                v-else-if="mode === 'create'"
                :class="{ 'text-primary': existingCategories.length }"
                @click.stop="toggleCategoriesTree"
            >
                <span class="flex">
                    <AtlanIcon icon="Category" class="mr-2 my-auto" />
                    {{
                        existingCategories.length > 0
                            ? existingCategories.length
                            : ''
                    }}
                    {{
                        existingCategories.length === 1
                            ? 'Category'
                            : 'Categories'
                    }}
                </span>
            </a-button>
        </div>
    </div>
    <a-popover
        v-model:visible="showAddCategoriesTree"
        :placement="mode === 'create' ? 'bottom' : 'left'"
        trigger="click"
    >
        <template #content :class="$style.popover">
            <div
                class="flex flex-col overflow-y-auto w-64"
                :class="$style.treeSelect"
            >
                <a-tree-select
                    v-model:value="selectedCategories"
                    tree-data-simple-mode
                    tree-checkable
                    placeholder="Search categories"
                    :tree-data="treeData"
                    :treeCheckStrictly="true"
                    :maxTagCount="2"
                    :dropdown-style="{
                        overflow: 'auto',
                        maxHeight: '256px',
                        maxWidth: '220px',
                        position: 'relative',
                        boxShadow: 'none',
                    }"
                    :getPopupContainer="getPopupContainer"
                    size="small"
                />
                <div class="">
                    <div id="renderDropdown" class="mt-4 max-h-64 z-10"></div>

                    <div
                        class="
                            z-30
                            space-x-4
                            mt-4
                            absolute
                            flex
                            justify-around
                            mx-auto
                        "
                    >
                        <a-button
                            class="popover-button"
                            :class="$style.popoverButton"
                            @click="cancelCategoriesUpdate"
                            >Cancel</a-button
                        >
                        <a-button
                            class="popover-button"
                            :class="$style.popoverButton"
                            @click="handleUpdate"
                            :loading="isUpdateButtonLoading"
                            type="primary"
                            >Update</a-button
                        >
                    </div>
                </div>
            </div>
        </template>
    </a-popover>

    <div v-if="mode === 'threeDotMenu'" :class="$style.popover">
        <div
            class="flex flex-col overflow-y-auto w-64"
            :class="$style.treeSelect"
        >
            <a-tree-select
                v-model:value="selectedCategories"
                tree-data-simple-mode
                tree-checkable
                placeholder="Search categories"
                :tree-data="treeData"
                :treeCheckStrictly="true"
                :maxTagCount="2"
                :dropdown-style="{
                    overflow: 'auto',
                    maxHeight: '256px',
                    maxWidth: '220px',
                    position: 'relative',
                    boxShadow: 'none',
                }"
                :getPopupContainer="getPopupContainer"
                size="small"
            />
            <div class="">
                <div id="renderDropdown" class="mt-4 max-h-64 z-10"></div>

                <div
                    class="
                        z-30
                        space-x-4
                        mt-4
                        absolute
                        flex
                        justify-around
                        mx-auto
                    "
                >
                    <a-button
                        class="popover-button"
                        :class="$style.popoverButton"
                        @click="cancelCategoriesUpdate"
                        >Cancel</a-button
                    >
                    <a-button
                        class="popover-button"
                        :class="$style.popoverButton"
                        @click="handleUpdate"
                        :loading="isUpdateButtonLoading"
                        type="primary"
                        >Update</a-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {
        defineComponent,
        computed,
        ref,
        watch,
        PropType,
        toRef,
        inject,
    } from 'vue'

    //components
    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import useGtcSearch from '~/components/glossary/composables/useGtcSearch'
    import useUpdateGtcEntity from '@/glossary/composables/useUpdateGtcEntity'
    import { Glossary as GlossaryApi } from '~/services/atlas/glossary/glossary_api'

    //types
    import {
        Category,
        RelatedEntity,
        Term,
    } from '~/types/glossary/glossary.interface'
    import { TreeSelect } from 'ant-design-vue'

    type TreeDataItem = Category & {
        children?: TreeDataItem[]
        id: string
        pId: string
        value: string
        title: string
        isLeaf?: boolean
    }

export default defineComponent({
    components: { PillGroup },
    props: {
        glossaryQualifiedName: {
            type: String,
            required: true,
            default: '',
        },
        termGuid: {
            type: String,
            required: false,
            default: '',
        },
        term: {
            type: Object as PropType<Term>,
            required: false,
            default: () => {},
        },
        categories: {
            type: Object as PropType<RelatedEntity[]>,
            required: true,
            default: () => [],
        },
        mode: {
            type: String as PropType<'edit' | 'create' | 'threeDotMenu'>,
            required: true,
            default: 'create',
        },
        editPermission: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    emits: ['updateCategories'],
    setup(props, { emit }) {
        const existingCategories = ref(props.categories)
        const term = toRef(props, 'term')
        const selectedCategories = ref<{ value: string; label?: string }[]>(
            existingCategories.value.map((category) => ({
                value: category.guid,
                label: category.guid,
            }))
        )

        const showAddCategoriesTree = ref(false)
        const parentGlossaryQualifiedName = computed(
            () => props.glossaryQualifiedName
        )
        const treeData = ref<TreeDataItem[]>([])
        const isUpdateButtonLoading = ref(false)

        const refreshEntity = inject<() => void>('refreshEntity')
        const reorderTreeNodes =
            inject<
                (
                    guid: string,
                    fromGuid?: string,
                    toGuid?: string,
                    categories?: { categoryGuid: string }[]
                ) => void
            >('reorderTreeNodes')

        const toggleCategoriesTree = () => {
            showAddCategoriesTree.value = !showAddCategoriesTree.value
        }
        const {
            categories,
            isLoading: searchLoading,
            fetchAssets: fetchCategories,
        } = useGtcSearch(
            parentGlossaryQualifiedName,
            ref(true),
            'AtlasGlossaryCategory'
        )

        const cancelCategoriesUpdate = () => {
            selectedCategories.value = existingCategories.value.map(
                (category) => ({
                    value: category.guid,
                    label: category.guid,
                })
            )
            showAddCategoriesTree.value = false
        }
        const handleUpdate = () => {
            const newCategories = selectedCategories.value.map((category) => ({
                categoryGuid: category.value,
            }))
            const addedCategories = newCategories.filter(
                (category) =>
                    !existingCategories.value.find(
                        (existing) => existing.guid === category.categoryGuid
                    )
            )
            const removedCategories = existingCategories.value.filter(
                (category) =>
                    !newCategories.find(
                        (newCat) => newCat.categoryGuid === category.guid
                    )
            )

            if (
                (props.mode === 'edit' || props.mode === 'threeDotMenu') &&
                props.term
            ) {
                const { data: updateData, updateEntity } = useUpdateGtcEntity()
                isUpdateButtonLoading.value = true

                const { data, error, isLoading } =
                    GlossaryApi.UpdateGlossaryTerm(props.termGuid, {
                        // ...props.term.attributes,
                        // ...props.term,
                        // qualifiedName: props.term.attributes.qualifiedName,
                        name: props.term.attributes.name,
                        shortDescription:
                            props.term.attributes.shortDescription,
                        assetStatus: props.term.attributes.assetStatus,
                        assetStatusMessage:
                            props.term.attributes.assetStatusMessage,
                        assetStatusUpdatedBy:
                            props.term.attributes.assetStatusUpdatedBy,
                        assetStatusUpdatedAt:
                            props.term.attributes.assetStatusUpdatedAt,
                        ownerUsers: props.term.attributes.ownerUsers,
                        ownerGroups: props.term.attributes.ownerGroups,
                        anchor: {
                            glossaryGuid: props.term.attributes.anchor.guid,
                        },
                        typeName: props.term.typeName,
                        categories: newCategories,
                    })
                watch(data, (newData) => {
                    if (newData?.guid) {
                        showAddCategoriesTree.value = false
                        isUpdateButtonLoading.value = false
                        if (refreshEntity) refreshEntity()
                        console.log('whaaa', reorderTreeNodes)
                        if (reorderTreeNodes) {
                            addedCategories.forEach((category) => {
                                reorderTreeNodes(
                                    props.termGuid,
                                    undefined,
                                    category.categoryGuid,
                                    newCategories
                                )
                            })
                            removedCategories.forEach((category) => {
                                reorderTreeNodes(
                                    props.termGuid,
                                    category.guid,
                                    undefined,
                                    newCategories
                                )
                            })
                        }
                    }
                })
            } else if (props.mode === 'create') {
                emit(
                    'updateCategories',
                    newCategories,
                    addedCategories,
                    removedCategories
                )
                showAddCategoriesTree.value = false
                existingCategories.value = selectedCategories.value.map(
                    (category) => ({
                        guid: category.value,
                        typeName: 'AtlasGlossaryCategory',
                        uniqueAttributes: {
                            qualifiedName: category.value,
                        },
                    })
                )
            }
        }
        const convertCategoriesToTree = (categories: Category[]) => {
            categories.forEach((category) => {
                treeData.value.push({
                    ...category,
                    id: category.guid ?? '',
                    pId: category.attributes?.parentCategory?.guid ?? 0,
                    value: category.guid ?? '',
                    title: category.displayText ?? '',
                    isLeaf: !category.attributes?.childrenCategories?.length
                        ? true
                        : false,
                })
            })
        }
        const onLoadData = (treeNode: any) => {
            return new Promise((resolve: (value?: unknown) => void) => {
                const { id } = treeNode.dataRef
                setTimeout(() => {
                    console.log(
                        treeNode,
                        treeNode.dataRef.children,
                        !treeNode.dataRef.children
                    )
                    categories.value.forEach((category: Category) => {
                        if (category.attributes.parentCategory === id) {
                            console.log(id)
                            if (!treeNode.dataRef.children)
                                treeNode.dataRef.children = []
                            treeData.value.push({
                                ...category,
                                id: category.guid ?? '',
                                pId: id,
                                value: category.guid ?? '',
                                title: category.displayText ?? '',
                                isLeaf: false,
                            })
                        }
                    })
                    resolve()
                }, 300)
            })
        }

        watch(categories, (newCategories) => {
            convertCategoriesToTree(newCategories as Category[])
        })
        watch(term, (newTerm) => {
            existingCategories.value = newTerm?.attributes?.categories ?? []
            selectedCategories.value = existingCategories.value.map(
                (category) => ({
                    value: category.guid,
                    label: category.guid,
                })
            )
        })

        const getPopupContainer = (trigger) => {
            return trigger.parentNode.querySelector('#renderDropdown')
        }

        return {
            getPopupContainer,
            existingCategories,
            showAddCategoriesTree,
            categories,
            treeData,
            toggleCategoriesTree,
            onLoadData,
            selectedCategories,
            cancelCategoriesUpdate,
            handleUpdate,
            isUpdateButtonLoading,
            TreeSelect,
        }
    },
})
</script>
<style lang="less" module>
.categories {
}
.popover {
    max-height: 600px;
    padding: 1rem;
}
.treeSelect {
    div {
        position: relative !important;
    }
    .popover {
        max-height: 600px;
        padding: 1rem;
    }
    .treeSelect {
        div {
            position: relative !important;
        }
        :global(.ant-select-tree-dropdown) {
            top: 0 !important;
        }
    }
    .popoverButton {
        min-width: 104px !important;
    }
}
.popoverButton {
    min-width: 104px !important;
}
</style>
