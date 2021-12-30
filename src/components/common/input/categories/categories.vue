<template>
    <div class="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <a-popover
            placement="leftBottom"
            class="ant-select-open"
            :overlay-class-name="$style.categoryPopover"
            :trigger="['click']"
            @visibleChange="onPopoverClose"
        >
            <template #content>
                <a-tree-select
                    v-model:value="checkedKeys"
                    :tree-data="treeData"
                    :loadData="onLoadData"
                    :treeCheckStrictly="true"
                    :getPopupContainer="getContainer"
                    :defaultOpen="true"
                    :open="true"
                    :loading="true"
                    treeNodeFilterProp="title"
                    style="width: 100%"
                    :dropdownStyle="{ position: 'static', overflow: 'hidden' }"
                    tree-checkable
                    allow-clear
                    :show-checked-strategy="SHOW_ALL"
                    placeholder="Search categories"
                    ref="treeSelectRef"
                >
                    <template #suffixIcon><AtlanIcon icon="Search" /></template>
                    <template #title="item"
                        ><AtlanIcon :icon="icon(item.node)" />
                        {{ item.title }}</template
                    >
                </a-tree-select>
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
        <div class="flex flex-wrap gap-1 text-sm">
            <template v-for="category in checkedKeys" :key="category.value">
                <div
                    class="flex items-center py-0.5 pl-1 pr-2 text-gray-700 bg-white border border-gray-200 rounded-full cursor-pointer hover:bg-purple hover:border-purple group hover:shadow hover:text-white"
                >
                    <AtlanIcon
                        :icon="icon(category)"
                        class="group-hover:text-white text-purple mb-0.5"
                    ></AtlanIcon>

                    <div class="ml-1 group-hover:text-white">
                        {{ category.label }}
                    </div>
                </div>
            </template>
            <span
                v-if="!editPermission && checkedKeys?.length < 1"
                class="-ml-1 text-gray-500"
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

    export default defineComponent({
        name: 'CategoriesWidget',
        components: { GlossaryTree },
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
            const checkedKeys = ref(
                modelValue.value.map((category) => ({
                    label: category.attributes?.name,
                    value: category.guid,
                }))
            )
            const SHOW_ALL = TreeSelect.SHOW_ALL

            const hasBeenEdited = ref(false)
            const treeSelectRef = ref(null)
            const getContainer = () => {
                return document.getElementById('categoryWidget')
            }

            const { initCategories, treeData, onLoadData } =
                useCategoriesWidget({
                    parentGlossaryQf:
                        selectedAsset.value.attributes.anchor.uniqueAttributes
                            .qualifiedName ?? '',
                })

            const onPopoverClose = (visible) => {
                console.log(visible, localValue.value, checkedKeys.value)
                if (!visible) {
                    modelValue.value = checkedKeys.value.map((cat) => ({
                        guid: cat.value,
                        typeName: 'AtlasGlossaryCategory',
                        attributes: {
                            name: cat.label,
                        },
                    }))
                    emit('change', localValue.value)
                    hasBeenEdited.value = false
                }
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

            const onCheck = (checkedNodes) => {
                localValue.value = []
                checkedNodes.forEach((term) => {
                    localValue.value.push(term)
                })
                hasBeenEdited.value = true
            }

            onMounted(async () => {
                await initCategories()
            })
            /* Adding this when parent data change, sync it with local */
            watch(modelValue, () => {
                localValue.value = modelValue.value
                checkedKeys.value = modelValue.value.map((category) => ({
                    label: category.attributes.name,
                    value: category.guid,
                }))
            })

            return {
                icon,
                onCheck,
                onPopoverClose,
                localValue,
                checkedKeys,
                initCategories,
                treeData,
                onLoadData,
                SHOW_ALL,
                getContainer,
                treeSelectRef,
            }
        },
    })
</script>
<style lang="less" module>
    .categoryPopover {
        -webkit-transition: border 500ms ease-out;
        -moz-transition: border 500ms ease-out;
        -o-transition: border 500ms ease-out;
        transition: border 500ms ease-out;

        :global(.ant-popover-inner-content) {
            @apply p-4 !important;
            width: 350px !important;
        }
        :global(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
            @apply border-0 border-b border-gray-200 rounded-none;
        }
        :global(.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input) .ant-select-selector) {
            @apply border-primary border-b border-solid border-t-0 border-l-0 border-r-0  !important;
            outline: 0 !important;
            box-shadow: none;
        }
        :global(.ant-select-tree) {
            @apply -ml-2;
        }

    }

    .categoryWidget {
        max-height: 200px;
        min-height: 100px;
        @apply overflow-y-auto overflow-x-hidden;

        div {
            position: static !important;
        }
        :global(.ant-select-dropdown) {
            box-shadow: none;
            width: 100% !important;
        }
    }
</style>
