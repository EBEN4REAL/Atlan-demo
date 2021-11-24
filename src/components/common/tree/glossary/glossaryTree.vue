<template>
    <div
        v-if="isLoading && treeData.length == 0"
        class="flex items-center justify-center flex-grow"
    >
        <AtlanIcon icon="Loader" class="w-auto h-10 animate-spin"></AtlanIcon>
    </div>
    <div v-else-if="treeData.length === 0 && !isLoading" class="flex-grow">
        <EmptyView
            empty-screen="EmptyDiscover"
            desc="No terms found"
            button-text="Add Term"
            class="mb-10"
        ></EmptyView>
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
    >
        <template #switcherIcon>
            <AtlanIcon icon="CaretRight" class="my-auto" />
        </template>

        <template #title="entity">
            <GlossaryTreeItem :item="entity" :class="treeItemClass" />
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

    import useGlossaryTree from '~/composables/glossary2/useGlossaryTree'
    import useGlossaryStore from '~/store/glossary'

    export default defineComponent({
        components: {
            GlossaryTreeItem,
            Actions,
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
        },
        emits: ['select'],
        setup(props, { emit }) {
            const router = useRouter()

            const { defaultGlossary, height, treeItemClass } = toRefs(props)
            const glossaryStore = useGlossaryStore()
            // const parentGlossaryQualifiedName = ref('VzA8dZUiZkdY6XbH6BMIU')
            // const parentGlossaryGuid = ref(
            //     '0a4293f3-d7ba-4552-be75-b47af07f250a'
            // )
            const parentGlossaryGuid = computed(() => {
                const selectedGlossary = glossaryStore.list.find(
                    (el) =>
                        el?.attributes?.qualifiedName === defaultGlossary.value
                )
                return selectedGlossary?.guid
            })

            console.log(defaultGlossary.value)
            const {
                onLoadData,
                loadedKeys,
                expandedKeys,
                expandNode,
                selectedKeys,
                selectNode,
                addNode,
                initTreeData,
                treeData,
                isLoading,
                error,
                isReady,
                refetchNode,
                collapseAll,
            } = useGlossaryTree({
                emit,
                parentGlossaryQualifiedName: defaultGlossary,
                parentGlossaryGuid,
            })

            onMounted(() => {
                initTreeData(defaultGlossary.value)
            })
            console.log(parentGlossaryGuid.value)
            watch(defaultGlossary, () => {
                console.log('changed', defaultGlossary.value)

                console.log(parentGlossaryGuid.value)
                console.log(defaultGlossary.value)
                initTreeData(defaultGlossary.value)
            })
            watch(parentGlossaryGuid, () => {
                console.log(parentGlossaryGuid)
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

            const addGTCNode = (asset) => {
                console.log('add node', selectedKeys.value)
                addNode(asset)
            }

            provide('addGTCNode', addGTCNode)
            provide('refetchGlossaryTree', refetchNode)

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
