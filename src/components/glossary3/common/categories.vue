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
                        class="flex items-center cursor-pointer  text-primary hover:text-primary hover:underline"
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
                :data="pillCategories"
                label-key="label"
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
                    <AtlanIcon icon="Category" class="my-auto mr-2" />
                    {{
                        selectedCategories.length > 0
                            ? selectedCategories.length
                            : ''
                    }}
                    {{
                        selectedCategories.length === 1
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
                class="flex flex-col w-64 overflow-y-auto"
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
                    <div id="renderDropdown" class="z-10 mt-4 max-h-64"></div>

                    <div
                        class="absolute z-30 flex justify-around mx-auto mt-4 space-x-4 "
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
            class="flex flex-col w-64 overflow-y-auto"
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
                <div id="renderDropdown" class="z-10 mt-4 max-h-64"></div>

                <div
                    class="absolute z-30 flex justify-around mx-auto mt-4 space-x-4 "
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
        toRef,
        watch,
        PropType,
        toRefs,
        inject,
    } from 'vue'

    //components
    import PillGroup from '~/components/UI/pill/pillGroup.vue'
    import useGtcSearch from '~/components/glossary/composables/useGtcSearch'
    import useUpdateGtcEntity from '@/glossary/composables/useUpdateGtcEntity'

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
            const { categories: existingCategories} = toRefs(props)
            const term = toRef(props, 'term')
            const selectedCategories = ref<{ value: string; label?: string }[]>(
                existingCategories.value.map((category) => ({
                    value: category.guid,
                    label: category?.attributes?.name,
                    ...category
                }))
            )
            const pillCategories = computed(() =>
                existingCategories.value.map((category) => ({
                    label: category?.attributes?.name ?? category.label,
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
                        ...category
                    })
                )
                showAddCategoriesTree.value = false
            }
            const handleUpdate = () => {
                const newCategories = selectedCategories.value.map(
                    (category) => ({
                        guid: category.value,
                        ...category
                    })
                )
                const addedCategories = newCategories.filter(
                    (category) =>
                        !existingCategories.value.find(
                            (existing) =>
                                existing.guid === category.guid
                        )
                )
                const removedCategories = existingCategories.value.filter(
                    (category) =>
                        !newCategories.find(
                            (newCat) => newCat.guid === category.guid
                        )
                )
                if (
                    (props.mode === 'edit' || props.mode === 'threeDotMenu') &&
                    props.term
                ) {
                    isUpdateButtonLoading.value = true
                    const { data: updateData, updateEntity } =
                        useUpdateGtcEntity();
                        updateEntity(
                            {
                                typeName: props.term.typeName,
                                qualifiedName: props.term.attributes.qualifiedName,
                                name: props.term.attributes.name,
                                anchor: props.term.attributes.anchor,
                                updates: {
                                    categories: newCategories
                                }
                            }
                        )
                    watch(updateData, (newData) => {
                        if (newData) {
                            showAddCategoriesTree.value = false
                            isUpdateButtonLoading.value = false
                            // if (refreshEntity) refreshEntity()
                            term.value.attributes.categories = newCategories
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
                            ...category
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
                        ...category
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
                pillCategories,
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
