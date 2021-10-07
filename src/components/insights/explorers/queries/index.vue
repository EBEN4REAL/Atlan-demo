<template>
    <div class="flex flex-col items-center w-full h-full bg-white border-r">
        <div class="w-full p-4 pb-0 rounded">
            <Connector :connector="connector" @update:data="updateConnector" />
            <div class="flex flex-row space-x-2">
                <a-input-search v-model:value="searchQuery" class="mt-2 rounded" placeholder="Search" />
                <a-button class="flex items-center w-8 h-8 p-2 mt-2 rounded">
                    <AtlanIcon icon="Filter" />
                </a-button>
            </div>
        </div>
        <div class="w-full my-4 border-b"></div>
        <div class="w-full h-full">
            <div class="w-full p-4 pt-0">
                <div class="flex justify-between text-gray-500">
                    <div class="px-3 py-1 rounded shadow">
                        <span
                            class="mr-4 cursor-pointer hover:text-primary-400"
                            :class="
                                isSelectedType('personal') ? ' text-primary' : ''
                            "
                            @click="() => onSelectQueryType('personal')"
                            >Personal</span
                        >
                        <span
                            class="cursor-pointer hover:text-primary-400"
                            :class="isSelectedType('all') ? ' text-primary' : ''"
                            @click="() => onSelectQueryType('all')"
                            >All</span
                        >
                    </div>
                    <div v-if="!searchQuery?.length"  class="flex items-center">
                        <div class="">
                            <AtlanIcon
                                @click="toggleCreateQueryModal"
                                icon="NewQuery"
                                class="h-4 m-0 mr-4 -mt-0.5 hover:text-primary"
                            />
                        </div>
                        <div class="">
                            <AtlanIcon
                                @click="toggleCreateQueryFolderModal"
                                icon="NewFolder"
                                class="h-4 m-0 -mt-0.5 hover:text-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="!searchQuery?.length" 
                class="relative w-full h-full p-3 pt-0 overflow-y-auto  scrollable-container"
            >
                <!--explorer pane start -->
                <div
                    class="absolute w-full h-full bg-white"
                    :class="savedQueryType === 'personal' ? 'z-2' : 'z-1'"
                >
                    <query-tree
                        :tree-data="per_treeData"
                        :on-load-data="per_onLoadData"
                        :select-node="per_selectNode"
                        :expand-node="per_expandNode"
                        :is-loading="per_isInitingTree"
                        :loaded-keys="per_loadedKeys"
                        :selected-keys="per_selectedKeys"
                        :expanded-keys="per_expandedKeys"
                    />
                </div>
                <div
                    class="absolute w-full h-full bg-white"
                    :class="savedQueryType === 'all' ? 'z-2' : 'z-1'"
                >
                    <query-tree
                        :tree-data="all_treeData"
                        :on-load-data="all_onLoadData"
                        :select-node="all_selectNode"
                        :expand-node="all_expandNode"
                        :is-loading="all_isInitingTree"
                        :loaded-keys="all_loadedKeys"
                        :selected-keys="all_selectedKeys"
                        :expanded-keys="all_expandedKeys"
                    />
                </div>
                <!--explorer pane end -->
            </div>
            <div v-else class="relative w-full h-full p-3 pl-6 pt-0 overflow-y-auto  scrollable-container">
            <div v-if="searchLoading">
                <LoadingView />
            </div>
            <div v-else-if="searchResults?.entities?.length">
                <div v-for="query in searchResults?.entities" :key="query.guid" class="">
                        <QueryTreeItem
                            :item="{
                                selected: false,
                                title: query.displayText,
                                attributes: query.attributes
                            }"
                            :expandedKeys="per_expandedKeys"
                        />
                </div>
            </div>
            <div v-else-if="!searchResults?.entities">
                No results
            </div>
        </div>
    </div>

        <SaveQueryModal
            v-model:showSaveQueryModal="showSaveQueryModal"
            :createEntityType="createEntityType"
            :saveQueryLoading="saveQueryLoading"
            :ref="
                (el) => {
                    saveModalRef = el
                }
            "
            @onSaveQuery="saveQuery"
        />
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        inject,
        Ref,
        ComputedRef,
        watch,
        ref,
        toRaw,
        onMounted,
    } from 'vue'
    import { useRouter } from 'vue-router'
    import { SavedQueryInterface } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import { useEditor } from '~/components/insights/common/composables/useEditor'

    import QueryTree from './queryTree.vue'
    import useQueryTree from './composables/useQueryTree'
    import useSearchQueries from './composables/useSearchQueries'

    import Connector from '~/components/insights/common/connector/connectorOnly.vue'
    import SaveQueryModal from '~/components/insights/playground/editor/saveQuery/index.vue'
    import LoadingView from '@common/loaders/section.vue'
    import QueryTreeItem from './queryTreeItem.vue'

    export default defineComponent({
        components: { QueryTree, Connector, SaveQueryModal, LoadingView, QueryTreeItem },
        props: {},
        setup(props, { emit }) {
            const router = useRouter()
            const showSaveQueryModal: Ref<boolean> = ref(false)
            const saveQueryLoading = ref(false)
            const createEntityType = ref<'query' | 'queryFolder'>('query')
            const searchQuery = ref('');

            const saveModalRef = ref()
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const savedQueryType: Ref<'personal' | 'all'> = ref('personal')
            const editorInstance = inject('editorInstance') as Ref<any>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>

            const { setConnectorsDataInInlineTab, getConnectorName } =
                useConnector()
            const connector = ref(
                getConnectorName(
                    activeInlineTab.value.explorer.schema.connectors
                        .attributeValue
                )
            )
            const { focusEditor } = useEditor()

            const isSelectedType = (type: 'personal' | 'all') => {
                return savedQueryType.value === type
            }
            const onSelectQueryType = (type: 'personal' | 'all') => {
                savedQueryType.value = type
            }

            const {
                openSavedQueryInNewTab,
                saveQueryToDatabaseAndOpenInNewTab,
                createFolder,
            } = useSavedQuery(inlineTabs, activeInlineTab, activeInlineTabKey)
            const isSavedQueryOpened = (savedQuery: SavedQueryInterface) => {
                let bool = false
                inlineTabs.value.forEach((tab) => {
                    if (tab.key === savedQuery.id) bool = true
                })
                return bool
            }

            const updateConnector = (value: string) => {
                connector.value = value
                setConnectorsDataInInlineTab(
                    activeInlineTab,
                    inlineTabs,
                    connector,
                    'queries'
                )
            }
            const toggleCreateQueryModal = () => {
                createEntityType.value = 'query'
                showSaveQueryModal.value = !showSaveQueryModal.value
            }
            const toggleCreateQueryFolderModal = () => {
                createEntityType.value = 'queryFolder'
                showSaveQueryModal.value = !showSaveQueryModal.value
            }
            const pushGuidToURL = (guid: string) => {
                router.push(`/insights?id=${guid}`)
            }

            const {
                treeData: per_treeData,
                loadedKeys: per_loadedKeys,
                isInitingTree: per_isInitingTree,
                selectedKeys: per_selectedKeys,
                expandedKeys: per_expandedKeys,
                onLoadData: per_onLoadData,
                expandNode: per_expandNode,
                selectNode: per_selectNode,
                refetchNode: per_refetchNode,
                immediateParentFolderQF: per_immediateParentFolderQF,
                immediateParentGuid: per_immediateParentGuid,
            } = useQueryTree({
                emit,
                openSavedQueryInNewTab,
                pushGuidToURL,
                connector,
                savedQueryType: ref('personal'),
            })
            const {
                treeData: all_treeData,
                loadedKeys: all_loadedKeys,
                isInitingTree: all_isInitingTree,
                selectedKeys: all_selectedKeys,
                expandedKeys: all_expandedKeys,
                immediateParentFolderQF: all_immediateParentFolderQF,
                onLoadData: all_onLoadData,
                expandNode: all_expandNode,
                selectNode: all_selectNode,
                refetchNode: all_refetchNode,
                immediateParentGuid: all_immediateParentGuid,
            } = useQueryTree({
                emit,
                openSavedQueryInNewTab,
                pushGuidToURL,
                connector,
                savedQueryType: ref('all'),
            })
            const { data: searchResults, isLoading: searchLoading} = useSearchQueries(searchQuery)

            const getRelevantQFandGuid = (type: 'personal' | 'all') => {
                if(type === 'personal') return {
                    qualifiedName: per_immediateParentFolderQF,
                    guid: per_immediateParentGuid
                };
                 else return {
                    qualifiedName: all_immediateParentFolderQF,
                    guid: all_immediateParentGuid
                }
            }

            watch(activeInlineTabKey, (newActiveInlineTab) => {
                per_selectedKeys.value = [newActiveInlineTab]
                all_selectedKeys.value = [newActiveInlineTab]
            })

            watch(activeInlineTab, (newActiveInlineTab) => {
                if (newActiveInlineTab) {
                    connector.value =
                        newActiveInlineTab?.explorer?.queries?.connectors?.connector
                }
            })
            const saveQuery = async (saveQueryData: any) => {
                if (createEntityType.value === 'query') {
                    const { data } = saveQueryToDatabaseAndOpenInNewTab(
                        saveQueryData,
                        editorInstance,
                        saveQueryLoading,
                        showSaveQueryModal,
                        saveModalRef,
                        router,
                        getRelevantQFandGuid(savedQueryType.value).qualifiedName,
                        getRelevantQFandGuid(savedQueryType.value).guid
                    )
                    focusEditor(toRaw(editorInstance.value))

                    watch(data, (newData) => {
                        if (newData) {
                            per_refetchNode(
                                getRelevantQFandGuid(savedQueryType.value).guid.value,
                                createEntityType.value
                            )
                            all_refetchNode(
                                getRelevantQFandGuid(savedQueryType.value).guid.value,
                                createEntityType.value
                            )
                        }
                    })
                } else if (createEntityType.value === 'queryFolder') {
                    const { data } = createFolder(
                        saveQueryData,
                        saveQueryLoading,
                        showSaveQueryModal,
                        saveModalRef,
                        getRelevantQFandGuid(savedQueryType.value).qualifiedName,
                        getRelevantQFandGuid(savedQueryType.value).guid
                    )
                    watch(data, (newData) => {
                        if (newData) {
                            per_refetchNode(getRelevantQFandGuid(savedQueryType.value).guid.value, createEntityType.value)
                            all_refetchNode(getRelevantQFandGuid(savedQueryType.value).guid.value, createEntityType.value)
                        }
                    })
                }
            }

            onMounted(() => {
                per_selectedKeys.value = [activeInlineTabKey.value]
                all_selectedKeys.value = [activeInlineTabKey.value]
            })

            return {
                saveModalRef,
                saveQueryLoading,
                showSaveQueryModal,
                createEntityType,
                saveQuery,
                toggleCreateQueryModal,
                toggleCreateQueryFolderModal,
                onSelectQueryType,
                isSelectedType,
                isSavedQueryOpened,
                openSavedQueryInNewTab,
                connector,
                updateConnector,
                savedQueryType,
                per_treeData,
                per_loadedKeys,
                per_isInitingTree,
                per_selectedKeys,
                per_expandedKeys,
                per_onLoadData,
                per_expandNode,
                per_selectNode,
                all_treeData,
                all_loadedKeys,
                all_isInitingTree,
                all_selectedKeys,
                all_expandedKeys,
                all_onLoadData,
                all_expandNode,
                all_selectNode,
                searchQuery,
                searchResults,
                searchLoading
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .active-placeholder {
        @apply bg-primary text-white;
    }
    .z-2 {
        z-index: 2;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
