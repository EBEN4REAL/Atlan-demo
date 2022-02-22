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
                <a-tree
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
                <div :class="$style.categoryWidget" id="categoryWidget"></div>
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
                        classes="cursor-pointer text-gray-700 hover:text-white ml-0.5"
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
    import { useVModels } from '@vueuse/core'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { TreeSelect } from 'ant-design-vue'

    import GlossaryTree from '~/components/glossary/index.vue'
    import useCategoriesWidget from './useCategoriesWidget'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import Tooltip from '@common/ellipsis/index.vue'

    export default defineComponent({
        name: 'CategoriesWidget',
        components: { GlossaryTree, Tooltip },
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

            const onCheck = (e, { checkedNodes, checked, node }) => {
                console.log({ checkedNodes, checked, node })
                console.log(checkedKeys.value)
                console.log(checkedKeysSnapshot)
                if (checkedNodeKeys.value?.includes(node.guid)) {
                    checkedNodeKeys.value = checkedNodeKeys.value.filter(
                        (i) => i !== node?.guid
                    )
                    checkedKeys.value = checkedKeys.value?.filter(
                        (i) => i?.value !== node?.guid
                    )
                } else {
                    checkedNodeKeys.value.push(node.key)
                    checkedKeys.value.push({
                        label: node?.title,
                        value: node?.guid,
                        attributes: node?.attributes,
                    })
                }
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
            })

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
        }
 
        :global(.ant-tree-checkbox) {
            @apply ml-1 my-auto !important;
        }
    }
</style>
