<template>
    <div
        v-if="isLoading && treeData.length == 0"
        class="flex items-center justify-center flex-grow h-full"
    >
        <AtlanIcon icon="Loader" class="w-auto h-10 animate-spin"></AtlanIcon>
    </div>
    <div
        v-else-if="treeData.length === 0 && !isLoading"
        class="flex items-center justify-center h-full"
    >
        <AddGtcModal
            entityType="AtlasGlossaryTerm"
            @add="reInitTree"
            :glossary-qualified-name="defaultGlossary"
        >
            <template #trigger>
                <div class="flex-grow">
                    <EmptyView
                        empty-screen="EmptyGlossary"
                        desc="No terms found"
                        button-text="Add Term"
                    ></EmptyView>
                </div>
            </template>
        </AddGtcModal>
    </div>
    <a-tree
        :class="$style.glossaryTree"
        :tree-data="treeData"
        :draggable="false"
        :block-node="true"
        :load-data="onLoadData"
        :treeDataSimpleMode="true"
        @select="handleSelect"
        :auto-expand-parent="false"
        @expand="expandNode"
        :height="height"
        :loadedKeys="loadedKeys"
        :selected-keys="selectedKeys"
        :expanded-keys="expandedKeys"
        :checked-keys="checkedKeys"
        :checkable="checkable"
        :checkStrictly="false"
        @check="onCheck"
        :blockNode="true"
    >
        <template #switcherIcon>
            <AtlanIcon icon="CaretRight" class="my-auto" />
        </template>

        <template #title="entity">
            <GlossaryTreeItem
                :item="entity"
                :checkable="checkable"
                :class="treeItemClass"
                @addSelectedKey="handleAddSelectedKey"
            />
        </template>
    </a-tree>
</template>
<script lang="ts">
    // library
    import {
        defineComponent,
        computed,
        toRefs,
        onMounted,
        watch,
        ref,
        provide,
        PropType,
    } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useVModels } from '@vueuse/core'

    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/discover.vue'
    import GlossaryTreeItem from './glossaryTreeItem.vue'
    import Actions from './actions.vue'
    import AddGtcModal from '@/glossary/modal/addGtcModal.vue'

    import useGlossaryTree from '~/composables/glossary2/useGlossaryTree'
    import useGlossaryStore from '~/store/glossary'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        components: {
            GlossaryTreeItem,
            Actions,
            AddGtcModal,
            EmptyView,
            ErrorView,
        },
        props: {
            list: {
                type: Array,
                required: false,
                default: () => [],
            },
            defaultGlossary: {
                type: String,
                required: false,
                default: () => '',
            },
            height: {
                type: Number,
                required: false,
            },
            treeItemClass: {
                type: String,
                required: false,
                default: () => '',
            },
            checkable: {
                type: Boolean,
                required: false,
                default: false,
            },
            checkedGuids: {
                type: Object as PropType<string[]>,
                required: false,
            },
        },
        emits: ['select', 'check', 'update:checkedGuids'],
        setup(props, { emit }) {
            const router = useRouter()

            const route = useRoute()
            const profileId = computed(() => route?.params?.id || null)
            const { defaultGlossary, height, treeItemClass } = toRefs(props)
            const { checkedGuids } = useVModels(props, emit)
            const { selectedGlossary } = useAssetInfo()
            const glossaryStore = useGlossaryStore()
            const parentGlossaryGuid = computed(() => {
                const selectedGtc = glossaryStore.list.find(
                    (el) =>
                        el?.attributes?.qualifiedName === defaultGlossary.value
                )
                return selectedGtc?.guid
            })
            const {
                onLoadData,
                loadedKeys,
                expandedKeys,
                expandNode,
                selectedKeys,
                selectNode,
                addNode,
                deleteNode,
                initTreeData,
                treeData,
                isLoading,
                error,
                isReady,
                collapseAll,
                updateNode,
                checkedKeys,
            } = useGlossaryTree({
                emit,
                parentGlossaryQualifiedName: defaultGlossary,
                parentGlossaryGuid,
                checkable: props.checkable,
                checkedGuids: checkedGuids.value,
            })

            const addGlossary = (asset) => {
                addNode(asset)
            }
            const collapseTree = () => {
                collapseAll()
            }
            // const addTerm = (asset) => {
            //     addNode(asset)
            // }

            // const addCategory = (asset) => {
            //     addNode(asset)
            // }

            const addGTCNode = (asset, entity = {}) => {
                if (entity !== {}) addNode(asset, entity)
                else addNode(asset)
            }
            const deleteGTCNode = (asset, entity = {}) => {
                if (entity !== {}) deleteNode(asset, entity)
                else deleteNode(asset)
            }
            const reInitTree = () => {
                initTreeData(defaultGlossary.value)
            }
            const onCheck = (e, { checkedNodes, checked, node }) => {
                if (checkedKeys) {
                    if (checked) {
                        checkedKeys.value.push(node.key)
                        checkedGuids?.value?.push(node.guid)
                    } else {
                        checkedKeys.value = checkedKeys.value.filter(
                            (key) => key !== node.key
                        )
                        checkedGuids.value = checkedGuids?.value?.filter(
                            (guid) => guid !== node.guid
                        )
                    }
                    // checkedKeys.value = checkedNodes.map((node) => node.key)
                }
                emit('check', checkedNodes, { checkedKeys: e, checked })
            }
            const updateTreeNode = (asset) => {
                updateNode(asset)
            }
            onMounted(() => {
                reInitTree()
            })
            const handleSelect = (selected: any, event: any) => {
                if (
                    props.checkable &&
                    event?.node?.typeName === 'AtlasGlossaryTerm'
                ) {
                    // const found = checkedKeys.value.find(
                    //     (el) => el === event?.node?.key
                    // )
                    // onCheck(event, {
                    //     checkedNodes: event.selectedNodes,
                    //     checked: !found,
                    //     node: event.node,
                    // })
                } else selectNode(selected, event)
            }
            const handleAddSelectedKey = (key) => {
                selectedKeys.value = [key]
            }
            provide('addGTCNode', addGTCNode)
            provide('deleteGTCNode', deleteGTCNode)
            return {
                onLoadData,
                loadedKeys,
                expandNode,
                expandedKeys,
                selectNode,
                selectedKeys,
                addGlossary,
                treeData,
                addNode,
                defaultGlossary,
                isLoading,
                error,
                isReady,
                height,
                handleSelect,
                // addTerm,
                // addCategory,
                treeItemClass,
                collapseTree,
                addGTCNode,
                reInitTree,
                onCheck,
                checkedKeys,
                updateTreeNode,
                profileId,
                selectedGlossary,
                handleAddSelectedKey,
            }
            // data
        },
    })
</script>
<style lang="less" module>
    .glossaryTree {
        :global(.ant-tree-switcher) {
            margin-right: -1px !important;
        }
        :global(.ant-tree-switcher_open) {
            transform: rotate(90deg);
        }
        :global(.ant-tree-treenode) {
            padding-bottom: 0px !important;
            @apply hover:bg-primary-light rounded mt-1 !important;
        }
        :global(.ant-tree-title) {
            @apply flex;
        }
        :global(.ant-tree-node-content-wrapper) {
            @apply hover:bg-primary-light !important;
            transition: none !important;
        }

        :global(.ant-tree-list-holder-inner) {
            @apply px-3 !important;
        }
        :global(.ant-tree-treenode-selected) {
            @apply bg-primary-light !important;
        }
    }
</style>
