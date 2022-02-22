<template>
    <div class="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <a-popover
            placement="leftBottom"
            class="ant-select-open"
            :overlay-class-name="$style.treeStyles"
            :trigger="['click']"
            @visibleChange="onPopoverClose"
        >
            <template #content>
                <SearchAdvanced
                    v-model="queryText"
                    :connectorName="facets?.hierarchy?.connectorName"
                    :autofocus="true"
                    ref="searchBar"
                    :allowClear="true"
                    @change="handleSearchChange"
                    placeholder="Search terms & categories..."
                    class="px-4 pb-2 mb-2"
                ></SearchAdvanced>

                <a-tree
                    v-if="!queryText"
                    :key="popoverVisible"
                    class="glossary-tree"
                    :tree-data="treeData"
                    :block-node="true"
                    :load-data="onLoadData"
                    :treeDataSimpleMode="true"
                    :auto-expand-parent="false"
                    v-model:expanded-keys="expandedKeys"
                    :checked-keys="checkedNodeKeys"
                    @check="onCheck"
                    :checkable="true"
                    :checkStrictly="true"
                    :blockNode="true"
                >
                    <template #switcherIcon>
                        <AtlanIcon icon="CaretRight" class="my-auto" />
                    </template>

                    <template #title="item">
                        <div
                            class="flex items-center space-x-1"
                            style="max-width: 200px"
                        >
                            <div class="w-4">
                                <AtlanIcon :icon="icon(item)" />
                            </div>
                            <Tooltip
                                :tooltip-text="item.title"
                                classes="cursor-pointer   "
                                @click="(e) => e.stopPropagation()"
                            />
                        </div>
                    </template>
                </a-tree>
                <!-- list starts -->
                <div
                    v-if="isLoading && queryText"
                    class="flex items-center justify-center flex-grow"
                >
                    <AtlanLoader class="h-10" />
                </div>
                <div
                    v-else-if="list.length == 0 && !isLoading && queryText"
                    class="flex-grow"
                >
                    <div
                        class="flex flex-col items-center justify-center h-full my-2"
                    >
                        <div class="flex flex-col items-center">
                            <span class="text-gray-500">No categories found</span>
                        </div>
                    </div>
                </div>
                <div v-else-if="queryText" >
                    <AssetList
                        :list="list"
                        :isLoadMore="isLoadMore"
                        :isLoading="isValidating"
                        @loadMore="handleLoadMore"
                        class="mt-3"
                    >
                        <template v-slot:default="{ item }">
                            <GlossaryItem
                                :item="item"
                                :checkable="true"
                                :checked="checkedNodeKeys?.includes(item.guid)"
                                checkableItemType="AtlasGlossaryCategory"
                                @check="onSearchItemCheck"
                            ></GlossaryItem>
                        </template>
                    </AssetList>
                </div>

                <div  :class="$style.categoryWidget" id="categoryWidget"></div>
            </template>
            <a-button
                v-if="editPermission"
                shape="circle"
                :disabled="disabled"
                size="small"
                class="text-center shadow hover:bg-primary-light hover:border-primary"
            >
                <span><AtlanIcon icon="Add" class="h-3"></AtlanIcon></span
            ></a-button>
        </a-popover>
        <div
            class="flex flex-wrap gap-1 text-sm"
            :class="{ '-ml-1': !editPermission }"
        >
            <template v-for="category in checkedKeys" :key="category.value">
                <div
                    class="flex items-center py-0.5 pl-1 pr-2 text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer hover:bg-purple hover:border-purple group hover:shadow hover:text-white"
                    style="max-width: 200px"
                >
                    <div class="w-4">
                        <AtlanIcon
                            :icon="icon(category)"
                            class="group-hover:text-white text-primary mb-0.5"
                        ></AtlanIcon>
                    </div>
                    <Tooltip
                        :tooltip-text="category.label"
                        classes="cursor-pointer text-gray-700 hover:text-white ml-0.5 group-hover:text-white"
                        @click="(e) => e.stopPropagation()"
                    />

                    <div
                        v-if="allowDelete"
                        class="flex"
                        @click="() => handleDelete(category)"
                    >
                        <AtlanIcon
                            icon="Cross"
                            class="h-3 ml-2 text-gray-500 group-hover:text-white"
                        ></AtlanIcon>
                    </div>
                </div>
            </template>
            <span
                v-if="!editPermission && checkedKeys?.length < 1"
                class="text-gray-600"
                >This term does not belong to any category</span
            >
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        ref,
        toRefs,
        watch,
        onMounted,
    } from 'vue'
    import { useDebounceFn, useVModels } from '@vueuse/core'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { TreeSelect } from 'ant-design-vue'
    import AssetList from '@/common/assets/list/index.vue'
    import GlossaryItem from '~/components/common/assets/list/glossaryAssetItem.vue'

    import GlossaryTree from '~/components/glossary/index.vue'
    import useCategoriesWidget from './useCategoriesWidget'
    import { useDiscoverList } from '~/composables/discovery/useDiscoverList'
    import {
        AssetAttributes,
        AssetRelationAttributes,
        GlossaryAttributes,
    } from '~/constant/projection'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import Tooltip from '@common/ellipsis/index.vue'

    import SearchAdvanced from '@/common/input/searchAdvanced.vue'

    export default defineComponent({
        name: 'CategoriesWidget',
        components: {
            GlossaryTree,
            Tooltip,
            SearchAdvanced,
            AssetList,
            GlossaryItem,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
            allowDelete: {
                type: Boolean,
                required: false,
                default: true,
            },
            disabled: {
                type: Boolean,
                default: false,
                required: false,
            },
            modelValue: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { selectedAsset } = toRefs(props)
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)
            const expandedKeys = ref([])
            const checkedNodeKeys = ref(
                modelValue.value.map((category) => category.guid)
            )
            const checkedKeys = ref(
                modelValue.value.map((category) => ({
                    label: category.attributes?.name,
                    value: category.guid,
                    attributes: category.attributes,
                }))
            )
            const checkedKeysSnapshot = ref(
                modelValue.value.map((category) => ({
                    label: category.attributes?.name,
                    value: category.guid,
                    attributes: category.attributes,
                }))
            )
            const SHOW_ALL = TreeSelect.SHOW_ALL
            const popoverVisible = ref(false)
            const hasBeenEdited = ref(false)
            const treeSelectRef = ref(null)
            const { categories } = useAssetInfo()
            const getContainer = () => {
                return document.getElementById('categoryWidget')
            }

            const { initCategories, treeData, onLoadData } =
                useCategoriesWidget({
                    parentGlossaryQf:
                        selectedAsset.value.attributes.anchor?.uniqueAttributes
                            .qualifiedName ?? '',
                })

            const handleCheckedNodesChange = (node) => {
                if (checkedKeys.value?.find(i=>i?.value===node?.guid)) {
                    checkedNodeKeys.value = checkedNodeKeys.value.filter(
                        (i) => i !== node?.guid
                    )
                    checkedKeys.value = checkedKeys.value?.filter(
                        (i) => i?.value !== node?.guid
                    )
                } else {
                    checkedNodeKeys.value.push(node.key)
                    checkedKeys.value.push({
                        label:
                            node?.title ??
                            node?.attributes?.name ??
                            node?.displayText,
                        value: node?.guid,
                        attributes: node?.attributes,
                    })
                }
                updateLocalValue(checkedKeys.value)
            }
            const onCheck = (e, { checkedNodes, checked, node }) => {
                handleCheckedNodesChange(node)
            }
            const onPopoverClose = async (visible) => {
                popoverVisible.value = visible
                if (visible) {
                    await initCategories()
                }
                if (!visible && hasBeenEdited.value) {
                    console.log('closing with ', localValue.value)
                    modelValue.value = checkedKeys.value.map((cat) => ({
                        guid: cat.value,
                        typeName: 'AtlasGlossaryCategory',
                        attributes: {
                            name: cat.label,
                            ...cat.attributes,
                        },
                    }))
                    emit('change', localValue.value)
                    checkedKeysSnapshot.value = checkedKeys.value
                }
                hasBeenEdited.value = false
            }
            const expandNode = (expanded: string[], event: any) => {
                console.log(expanded, event)
                const node = event?.node
                const isExpanded = expandedKeys.value?.includes(node?.guid)
                if (!isExpanded) {
                    expandedKeys.value?.push(node?.guid)
                } else if (isExpanded) {
                    const index = expandedKeys.value?.indexOf(node?.guid)
                    expandedKeys.value?.splice(index, 1)
                }
                expandedKeys.value = [...expandedKeys.value]
            }

            const handleDelete = (category: {
                label: string
                value: string
            }) => {
                checkedKeys.value = checkedKeys.value.filter(
                    (cat) => cat.value !== category.value
                )
                modelValue.value = checkedKeys.value.map((cat) => ({
                    guid: cat.value,
                    typeName: 'AtlasGlossaryCategory',
                    attributes: {
                        name: cat.label,
                        ...cat.attributes,
                    },
                }))
                emit('change', localValue.value)
                checkedKeysSnapshot.value = checkedKeys.value
                hasBeenEdited.value = false
            }

            const icon = (category) => {
                if (
                    category?.attributes?.certificateStatus?.toLowerCase() ===
                    'verified'
                ) {
                    return 'CategoryVerified'
                }
                if (
                    category?.attributes?.certificateStatus?.toLowerCase() ===
                    'draft'
                ) {
                    return 'CategoryDraft'
                }
                if (
                    category?.attributes?.certificateStatus?.toLowerCase() ===
                    'deprecated'
                ) {
                    return 'CategoryDeprecated'
                }
                return 'Category'
            }

            /* Adding this when parent data change, sync it with local */
            watch(modelValue, () => {
                localValue.value = modelValue.value
                checkedKeys.value = modelValue.value.map((category) => ({
                    label: category.attributes.name,
                    value: category.guid,
                    attributes: category.attributes,
                }))
                checkedNodeKeys.value = modelValue.value.map(
                    (category) => category?.guid
                )
            })
            const updateLocalValue = (newCheckedKeys) => {
                console.log(checkedKeysSnapshot.value, newCheckedKeys)
                if (
                    checkedKeysSnapshot.value.length !== newCheckedKeys.length
                ) {
                    hasBeenEdited.value = true
                } else {
                    if (
                        newCheckedKeys.every((node) =>
                            checkedKeysSnapshot.value.some(
                                (oldNode) => oldNode.value === node.value
                            )
                        )
                    ) {
                        hasBeenEdited.value = false
                    } else {
                        hasBeenEdited.value = true
                    }
                }
                console.log(hasBeenEdited.value)
            }
            watch(checkedKeys, (newCheckedKeys) => {
                updateLocalValue(newCheckedKeys)
            })
            watch(selectedAsset, () => {
                localValue.value = categories(selectedAsset.value)
                checkedKeys.value = localValue.value.map((category) => ({
                    label: category.attributes.name,
                    value: category.guid,
                    attributes: category.attributes,
                }))
                checkedNodeKeys.value = localValue.value.map(
                    (category) => category?.guid
                )
            })
            const onSearchItemCheck = (val) => {
                console.log(val)
                
                handleCheckedNodesChange(val)
            }
            // search related stuff
            // TODO: extract this logic to a seperate component

            const limit = ref(10)
            const offset = ref(0)
            const queryText = ref('')
            const facets = ref({})
            const postFacets = ref({
                glossary: '__all',
            })
            const dependentKey = ref('GLOSSARY_CATEGORY_LIST')

            const defaultAttributes = ref([
                ...AssetAttributes,
                ...GlossaryAttributes,
            ])
            const relationAttributes = ref([...AssetRelationAttributes])

            facets.value = {
                ...facets.value,
                typeNames: ['AtlasGlossaryCategory'],
                glossary:
                    selectedAsset.value.attributes.anchor?.uniqueAttributes
                        .qualifiedName ?? '',
            }

            const handleSearchChange = useDebounceFn(() => {
                list.value = []
                offset.value = 0
                quickChange()
            }, 250)
            const {
                list,
                isLoading,
                isLoadMore,
                isValidating,
                fetch,
                quickChange,
                cancelRequest,
            } = useDiscoverList({
                isCache: true,
                dependentKey,
                queryText,
                facets,
                postFacets,
                limit,
                offset,
                attributes: defaultAttributes,
                relationAttributes,
                suppressLogs: true,
            })
            const handleLoadMore = () => {
                if (isLoadMore.value) {
                    offset.value += limit.value
                }
                quickChange()
            }

            return {
                icon,
                onPopoverClose,
                localValue,
                checkedKeys,
                initCategories,
                treeData,
                onLoadData,
                SHOW_ALL,
                getContainer,
                treeSelectRef,
                handleDelete,
                popoverVisible,
                expandedKeys,
                checkedNodeKeys,
                onCheck,
                expandNode,
                handleSearchChange,
                list,
                facets,
                isLoadMore,
                isLoading,
                queryText,
                handleLoadMore,
                fetch,
                isValidating,
                onSearchItemCheck,
            }
        },
    })
</script>
<style lang="less" module>
    .categoryWidget {
        max-height: 200px;
        min-height: 80px;
        @apply overflow-y-auto overflow-x-hidden;

        div {
            position: static !important;
        }
        :global(.ant-select-dropdown) {
            box-shadow: none;
            width: 100% !important;
        }
    }
    .treeStyles {
        :global(.ant-popover-inner-content) {
            @apply px-0 py-3 !important;
            width: 350px !important;
            max-height: 300px;
            min-height: 300px;
            overflow: auto;
        }

        :global(.ant-tree-checkbox) {
            @apply ml-1 my-auto !important;
        }
    }
</style>
