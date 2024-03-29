<template>
    <div
        v-if="isLoading && treeData.length == 0"
        class="flex items-center justify-center flex-grow h-full"
    >
        <AtlanLoader class="h-10" />
    </div>
    <div
        v-else-if="treeData.length === 0 && !isLoading && !checkable"
        class="flex items-center justify-center h-full"
    >
        <AddGtcModal
            v-if="termAddPermission"
            entityType="AtlasGlossaryTerm"
            @add="reInitTree"
            :glossary-qualified-name="defaultGlossary"
            :glossaryName="parentGlossary?.displayText"
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
        <template v-else>
            <EmptyView
                empty-screen="EmptyGlossary"
                desc="No terms found"
            ></EmptyView>
        </template>
    </div>
    <div v-else-if="treeData.length === 0 && !isLoading && checkable">
        <EmptyView
            empty-screen="EmptyGlossary"
            desc="No terms found"
        ></EmptyView>
    </div>
    <a-tree
        :key="defaultGlossary"
        class="glossary-tree"
        :tree-data="treeData"
        :draggable="isDraggable"
        :block-node="true"
        :load-data="onLoadData"
        :treeDataSimpleMode="true"
        @select="handleSelect"
        :auto-expand-parent="false"
        @expand="expandNode"
        :height="height"
        :selected-keys="selectedKeys"
        :expanded-keys="expandedKeys"
        :checked-keys="checkedKeys"
        :checkable="checkable"
        :checkStrictly="false"
        @check="onCheck"
        :blockNode="true"
        @drop="dragAndDropNode"
        @dragend="dragEnd"
        @dragstart="dragStart"
        :multiple="true"
    >
        <template #switcherIcon>
            <AtlanIcon icon="CaretRight" class="my-auto" />
        </template>

        <template #title="entity">
            <GlossaryPopover
                :passing-fetched-term="true"
                :fetched-term="entity"
                :is-fetched-term-loading="false"
                placement="right"
                :mouse-enter-delay="mouseEnterDelay"
            >
                <GlossaryTreeItem
                    :item="entity"
                    :checkable="checkable"
                    :class="treeItemClass"
                    :is-animating="isTreeNodeAnimating"
                    @addSelectedKey="handleAddSelectedKey"
                    @changeEditMode="handleChangeEditMode"
                    @mouseenter="enteredPill"
                    @mouseleave="leftPill"
                />
            </GlossaryPopover>
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
    import GlossaryPopover from '@common/popover/glossary/index.vue'
    import { useMouseEnterDelay } from '~/composables/classification/useMouseEnterDelay'

    export default defineComponent({
        components: {
            GlossaryPopover,
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
            termAddPermission: {
                type: Boolean,
                required: true,
            },
            checkedGuids: {
                type: Object as PropType<string[]>,
                required: false,
            },
            disabledGuids: {
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
            const isTreeNodeAnimating = ref(false)
            const glossaryStore = useGlossaryStore()
            const isDraggable = ref(true)
            const parentGlossary = computed(() =>
                glossaryStore.getGlossaryByQualifiedName(defaultGlossary.value)
            )

            const localCheckedNodes = ref([])
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
                dragAndDropNode,
                nodeToParentKeyMap,
                allKeys,
                checkDuplicateCategoryNames,
                dragStart,
            } = useGlossaryTree({
                emit,
                parentGlossaryQualifiedName: defaultGlossary,
                parentGlossaryGuid,
                checkable: props.checkable,
                checkedGuids: checkedGuids.value,
                disabledGuids: props.disabledGuids,
                localCheckedNodes,
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
                console.log(
                    asset?.typeName,
                    asset?.attributes?.anchor?.guid,
                    'add'
                )
                glossaryStore.updateAssetCount(
                    asset?.typeName,
                    asset?.attributes?.anchor?.guid,
                    'add'
                )

                console.log(asset, entity)
                if (entity !== {}) {
                    console.log('add')
                    addNode(asset, entity)
                } else addNode(asset)
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
                }
                localCheckedNodes.value = checkedNodes
                emit('check', checkedNodes)
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
                    const found = checkedKeys.value.find(
                        (el) => el === event?.node?.key
                    )
                    let newCheckedNodes
                    if (found) {
                        newCheckedNodes = localCheckedNodes.value.filter(
                            (localNode: any) =>
                                localNode.guid !== event.node.guid
                        )
                    } else {
                        newCheckedNodes = [
                            ...localCheckedNodes.value,
                            event.node,
                        ]
                    }
                    onCheck(event, {
                        checkedNodes: newCheckedNodes,
                        checked: !found,
                        node: event.node,
                    })
                } else selectNode(selected, event)
            }
            const handleAddSelectedKey = (key) => {
                selectedKeys.value = []
                selectedKeys.value.push(key)
                const selectedTerm = selectedKeys.value[0]?.split('_')[1]
                allKeys.value?.forEach((el) => {
                    if (
                        el?.endsWith(selectedTerm) &&
                        !selectedKeys.value?.includes(el)
                    ) {
                        selectedKeys.value.push(el)
                    }
                })
            }

            watch(checkedGuids, (newCheckedGuids) => {
                localCheckedNodes.value = localCheckedNodes.value.filter(
                    (localNode: any) =>
                        newCheckedGuids?.includes(localNode.guid)
                )
                checkedKeys.value = localCheckedNodes.value.map(
                    (localNode: any) => localNode.key
                )
            })

            const handleChangeEditMode = (val) => {
                isDraggable.value = !val
            }

            provide('addGTCNode', addGTCNode)
            provide('deleteGTCNode', deleteGTCNode)
            provide('treeData', treeData)
            provide('checkDuplicateCategoryNames', checkDuplicateCategoryNames)
            const { enteredPill, mouseEnterDelay, leftPill } =
                useMouseEnterDelay()

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
                dragAndDropNode,
                isTreeNodeAnimating,
                checkDuplicateCategoryNames,
                parentGlossary,
                isDraggable,
                handleChangeEditMode,
                dragStart,
                enteredPill,
                mouseEnterDelay,
                leftPill,
            }
        },
    })
</script>
