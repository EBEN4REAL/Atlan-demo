<template>
    <div
        v-if="isLoading && treeData.length == 0"
        class="flex items-center justify-center flex-grow"
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
                        empty-screen="EmptyDiscover"
                        desc="No terms found"
                        button-text="Add Term"
                        class="mb-10"
                    ></EmptyView>
                </div>
            </template>
        </AddGtcModal>
    </div>
    <a-tree
        :tree-data="treeData"
        :draggable="true"
        :block-node="true"
        :load-data="onLoadData"
        :treeDataSimpleMode="true"
        @select="selectNode"
        :auto-expand-parent="false"
        @expand="expandNode"
        :height="height"
        :loadedKeys="loadedKeys"
        :selected-keys="selectedKeys"
        :expanded-keys="expandedKeys"
        :class="$style.glossaryTree"
        :checkable="checkable"
        :checkStrictly="false"
        @check="onCheck"
    >
        <template #switcherIcon>
            <AtlanIcon icon="CaretRight" class="my-auto" />
        </template>

        <template #title="entity">
            <GlossaryTreeItem
                :item="entity"
                :class="treeItemClass"
                :checkable="checkable"
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
    } from 'vue'
    import { useRouter } from 'vue-router'
    import { useVModels } from '@vueuse/core'

    import EmptyView from '@common/empty/index.vue'
    import ErrorView from '@common/error/discover.vue'
    import GlossaryTreeItem from './glossaryTreeItem.vue'
    import Actions from './actions.vue'
    import AddGtcModal from '@/glossary/modal/addGtcModal.vue'

    import useGlossaryTree from '~/composables/glossary2/useGlossaryTree'
    import useGlossaryStore from '~/store/glossary'

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
        },
        emits: ['select', 'check'],
        setup(props, { emit }) {
            const router = useRouter()

            const { defaultGlossary, height, treeItemClass } = toRefs(props)
            const glossaryStore = useGlossaryStore()
            const parentGlossaryGuid = computed(() => {
                const selectedGlossary = glossaryStore.list.find(
                    (el) =>
                        el?.attributes?.qualifiedName === defaultGlossary.value
                )
                return selectedGlossary?.guid
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
            } = useGlossaryTree({
                emit,
                parentGlossaryQualifiedName: defaultGlossary,
                parentGlossaryGuid,
                checkable: props.checkable,
            })

            const addGlossary = (asset) => {
                addNode(asset)
            }
            const collapseTree = () => {
                collapseAll()
            }
            const addTerm = (asset) => {
                addNode(asset)
            }

            const addCategory = (asset) => {
                addNode(asset)
            }

            const addGTCNode = (asset, entity = {}) => {
                if (entity !== {}) addNode(asset, entity)
                else addNode(asset)
            }
            const deleteGTCNode = (asset, entity = {}) => {
                console.log('delete node', selectedKeys.value)
                if (entity !== {}) deleteNode(asset, entity)
                else deleteNode(asset)
            }
            const reInitTree = () => {
                initTreeData(defaultGlossary.value)
            }
            const onCheck = (e, { checkedNodes }) => {
                emit('check', checkedNodes)
            }
            onMounted(() => {
                reInitTree()
            })
            watch(defaultGlossary, () => {
                reInitTree()
            })

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
                addTerm,
                addCategory,
                treeItemClass,
                collapseTree,
                addGTCNode,
                reInitTree,
                onCheck,
            }
            // data
        },
    })
</script>
<style lang="less" module>
    .glossaryTree {
        :global(.ant-tree-switcher) {
            margin-right: -3px !important;
        }
        :global(.ant-tree-switcher_open) {
            transform: rotate(90deg);
        }
        :global(.ant-tree-treenode) {
            padding-bottom: 0px !important;
            @apply hover:bg-primary-light rounded !important;
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
    }
</style>
