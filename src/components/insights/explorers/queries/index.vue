<template>
    <div
        class="flex flex-col items-center w-full h-full bg-white query-explorer"
    >
        <div class="w-full p-4 pb-0 rounded">
            <Connector
                :connector="connector"
                @update:data="updateConnector"
                :filterSourceIds="['tableau', 'athena']"
            />
            <div class="flex flex-row space-x-2">
                <a-input-search
                    v-model:value="searchQuery"
                    class="mt-2 rounded"
                    placeholder="Search"
                />
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
                                isSelectedType('personal')
                                    ? ' text-primary'
                                    : ''
                            "
                            @click="() => onSelectQueryType('personal')"
                            >Private</span
                        >
                        <span
                            class="cursor-pointer hover:text-primary-400"
                            :class="
                                isSelectedType('all') ? ' text-primary' : ''
                            "
                            @click="() => onSelectQueryType('all')"
                            >All</span
                        >
                    </div>
                    <div v-if="!searchQuery?.length" class="flex items-center">
                        <div class="">
                            <AtlanIcon
                                @click="() => toggleCreateQueryModal()"
                                icon="NewQuery"
                                class="h-4 m-0 mr-4 -mt-0.5 hover:text-primary"
                            />
                        </div>
                        <div class="">
                            <AtlanIcon
                                @click="createFolderInput"
                                icon="NewFolder"
                                class="h-4 m-0 -mt-0.5 hover:text-primary"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="!searchQuery?.length"
                class="relative w-full h-full px-4 pt-0 overflow-y-auto"
                :style="
                    fullSreenState
                        ? 'height: calc( 100vh - 140px )'
                        : 'height: calc( 100vh - 40px )'
                "
            >
                <!--explorer pane start -->
                <div
                    v-if="savedQueryType === 'personal'"
                    class="w-full h-full bg-white"
                >
                    <query-tree
                        @toggleCreateQueryModal="toggleCreateQueryModal"
                        @createFolderInput="createFolderInput"
                        :savedQueryType="savedQueryType"
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
                    v-if="savedQueryType === 'all'"
                    class="w-full h-full bg-white"
                >
                    <query-tree
                        @toggleCreateQueryModal="toggleCreateQueryModal"
                        @createFolderInput="createFolderInput"
                        :savedQueryType="savedQueryType"
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
            <div
                v-else
                class="relative w-full h-full p-3 pt-0 pl-6 overflow-y-auto"
                :style="
                    fullSreenState
                        ? 'height: calc( 100vh- 140px )'
                        : 'height: calc( 100vh- 40px )'
                "
            >
                <div v-if="searchLoading">
                    <LoadingView />
                </div>
                <div v-else-if="searchResults?.entities?.length">
                    <div
                        v-for="query in searchResults?.entities"
                        :key="query.guid"
                        class=""
                    >
                        <QueryTreeItem
                            :item="{
                                selected: false,
                                title: query.displayText,
                                attributes: query.attributes,
                            }"
                            :expandedKeys="per_expandedKeys"
                        />
                    </div>
                </div>
                <div
                    v-else-if="!searchResults?.entities"
                    class="flex flex-col items-center justify-center mt-14"
                >
                    <AtlanIcon
                        icon="EmptySearchQuery"
                        class="h-32 no-svaved-query-icon text-primary"
                    />
                    <p
                        class="my-2 mb-0 mb-6 text-base text-center text-gray-700  max-width-text"
                    >
                        Sorry, we couldn’t find<br />
                        the query you were looking for
                    </p>
                </div>
            </div>
        </div>

        <SaveQueryModal
            v-model:showSaveQueryModal="showSaveQueryModal"
            :saveQueryLoading="saveQueryLoading"
            :ref="
                (el) => {
                    saveModalRef = el
                }
            "
            :connector="connector"
            :savedQueryType="savedQueryType"
            :parentFolderQF="getRelevantTreeData().parentQualifiedName.value"
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
        provide,
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
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        components: {
            QueryTree,
            Connector,
            SaveQueryModal,
            LoadingView,
            QueryTreeItem,
        },
        props: {},
        setup(props, { emit }) {
            const router = useRouter()
            const showSaveQueryModal: Ref<boolean> = ref(false)
            const fullSreenState = inject('fullSreenState') as Ref<boolean>
            const saveQueryLoading = ref(false)
            const searchQuery = ref('')

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
                    activeInlineTab.value?.explorer?.schema?.connectors
                        ?.attributeValue
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
            const toggleCreateQueryModal = (
                guid?: string,
                qualifiedName?: string
            ) => {
                showSaveQueryModal.value = !showSaveQueryModal.value
                if (guid) {
                    getRelevantTreeData().parentGuid.value = guid
                }
                if (qualifiedName) {
                    getRelevantTreeData().parentQualifiedName.value =
                        qualifiedName
                }
            }

            const newFolderName = ref('')
            const newFolderCreateable = ref(true)

            const createFolderInput = () => {
                const inputClassName = `${per_immediateParentGuid.value}_folder_input`

                const existingInputs =
                    document.getElementsByClassName(inputClassName)
                const guid = getRelevantTreeData().parentGuid.value

                // appends the input element into the DOM with all the event listeners attached
                const appendInput = () => {
                    // check if there are existing inputs to avoid duplication
                    if (!existingInputs.length && newFolderCreateable.value) {
                        let parentFolder
                        if (guid === 'root') {
                            parentFolder =
                                document.querySelector(
                                    '.query-explorer  .ant-tree'
                                )?.parentNode ??
                                document.querySelector(
                                    '.query-explorer  .query-tree-root-div'
                                )
                            console.log(parentFolder)
                        } else {
                            parentFolder = document.getElementsByClassName(
                                getRelevantTreeData().parentGuid.value
                            )[0]
                        }
                        let ul = parentFolder.getElementsByTagName('ul')[0]

                        if (!ul) {
                            // if the parentFolder does not have any children, it won't contain a ul element either. So create one and append it
                            ul = document.createElement('ul')
                            parentFolder.prepend(ul)
                        }
                        const li = document.createElement('li')

                        const input = document.createElement('input')

                        // helper function to make the api call and remove the input on completion
                        const makeCreateFolderRequest = () => {
                            const { data } = createFolder(
                                newFolderName.value,
                                saveQueryLoading,
                                savedQueryType.value,
                                getRelevantTreeData().parentQualifiedName,
                                getRelevantTreeData().parentGuid
                            )
                            watch(data, async (newData) => {
                                if (newData) {
                                    useAddEvent(
                                        'insights',
                                        'folder',
                                        'created',
                                        newFolderName.value
                                    )
                                    newFolderName.value = ''
                                    setTimeout(async () => {
                                        if (
                                            savedQueryType.value === 'personal'
                                        ) {
                                            await per_refetchNode(
                                                getRelevantTreeData().parentGuid
                                                    .value,
                                                'queryFolder'
                                            )
                                            ul.removeChild(li)
                                            await all_refetchNode(
                                                getRelevantTreeData().parentGuid
                                                    .value,
                                                'queryFolder'
                                            )
                                        }
                                        if (savedQueryType.value === 'all') {
                                            await all_refetchNode(
                                                getRelevantTreeData().parentGuid
                                                    .value,
                                                'queryFolder'
                                            )
                                            ul.removeChild(li)
                                            await per_refetchNode(
                                                getRelevantTreeData().parentGuid
                                                    .value,
                                                'queryFolder'
                                            )
                                        }
                                    }, 1000)
                                }
                            })
                        }

                        input.setAttribute(
                            'class',
                            `outline-none border py-0 px-1 rounded mx-4 my-1 w-auto ${inputClassName}`
                        )
                        input.setAttribute('placeholder', 'Name your folder')
                        input.addEventListener('input', (e) => {
                            newFolderName.value = e.target?.value
                        })
                        input.addEventListener('keydown', (e) => {
                            if (e.key === 'Escape') {
                                newFolderName.value = ''
                                ul.removeChild(li)
                            }
                            if (e.key === 'Enter') {
                                // create folder request
                                if (newFolderName.value.length) {
                                    makeCreateFolderRequest()
                                    newFolderName.value = ''
                                } else {
                                    newFolderName.value = ''
                                    ul.removeChild(li)
                                }
                            }
                        })
                        input.addEventListener('blur', (e) => {
                            if (newFolderName.value.length) {
                                makeCreateFolderRequest()
                            } else {
                                li.removeChild(input)
                                li.setAttribute('class', 'hidden')
                                newFolderName.value = ''
                                newFolderCreateable.value = false
                                setTimeout(() => {
                                    newFolderCreateable.value = true
                                }, 300)
                            }
                        })

                        li.appendChild(input)
                        ul.prepend(li)
                        input.focus()
                    }
                }

                const loaded = getRelevantTreeData().loadedKeys.value.find(
                    (key) => key === getRelevantTreeData().parentGuid.value
                )
                let expanded = getRelevantTreeData().expandedKeys.value.find(
                    (key) => key === getRelevantTreeData().parentGuid.value
                )

                if (loaded && !expanded) {
                    // if the folder is loaded but not expanded, expand it then add input
                    getRelevantTreeData().expandedKeys.value.push(
                        getRelevantTreeData().parentGuid.value
                    )
                    setTimeout(appendInput, 1000)
                }
                if ((loaded && expanded) || guid === 'root') {
                    appendInput()
                }
                // if the folder is not loaded, don't do anything
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
                nodeToParentKeyMap: per_nodeToParentKeyMap,
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
                nodeToParentKeyMap: all_nodeToParentKeyMap,
            } = useQueryTree({
                emit,
                openSavedQueryInNewTab,
                pushGuidToURL,
                connector,
                savedQueryType: ref('all'),
            })
            const { data: searchResults, isLoading: searchLoading } =
                useSearchQueries(searchQuery, savedQueryType)

            const getRelevantTreeData = (type?: 'personal' | 'all') => {
                const currentType = type ?? savedQueryType.value

                if (currentType === 'personal')
                    return {
                        parentQualifiedName: per_immediateParentFolderQF,
                        parentGuid: per_immediateParentGuid,
                        loadedKeys: per_loadedKeys,
                        expandedKeys: per_expandedKeys,
                    }
                else
                    return {
                        parentQualifiedName: all_immediateParentFolderQF,
                        parentGuid: all_immediateParentGuid,
                        loadedKeys: all_loadedKeys,
                        expandedKeys: all_expandedKeys,
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
                } else {
                    connector.value = undefined
                }
            })
            const saveQuery = async (saveQueryData: {
                title: string
                description: string
                isSQLSnippet: boolean
                certificateStatus: string
                parentQF?: string
                parentGuid?: string
            }) => {
                const { data } = saveQueryToDatabaseAndOpenInNewTab(
                    saveQueryData,
                    editorInstance,
                    saveQueryLoading,
                    showSaveQueryModal,
                    saveModalRef,
                    router,
                    savedQueryType.value,
                    saveQueryData.parentQF ??
                        getRelevantTreeData().parentQualifiedName.value,
                    saveQueryData.parentGuid ??
                        getRelevantTreeData().parentGuid.value
                )
                focusEditor(toRaw(editorInstance.value))

                watch(data, (newData) => {
                    if (newData) {
                        per_refetchNode(
                            saveQueryData.parentGuid ??
                                getRelevantTreeData().parentGuid.value,
                            'query'
                        )
                        all_refetchNode(
                            saveQueryData.parentGuid ??
                                getRelevantTreeData().parentGuid.value,
                            'query'
                        )
                    }
                })
            }

            const refetchParentNode = (
                guid: string | 'root',
                type: 'query' | 'queryFolder',
                tree?: 'personal' | 'all'
            ) => {
                const per_guid = per_nodeToParentKeyMap[guid] ?? 'root'
                const all_guid = all_nodeToParentKeyMap[guid] ?? 'root'

                if (!tree || tree === 'personal')
                    per_refetchNode(per_guid, type)
                if (!tree || tree === 'all') all_refetchNode(all_guid, type)
            }
            onMounted(() => {
                per_selectedKeys.value = [activeInlineTabKey.value]
                all_selectedKeys.value = [activeInlineTabKey.value]
            })

            // Providers
            provide('toggleCreateQueryModal', toggleCreateQueryModal)
            provide('savedQueryType', savedQueryType)
            provide('savedQueryType', savedQueryType)
            provide('refetchParentNode', refetchParentNode)

            return {
                fullSreenState,
                saveModalRef,
                saveQueryLoading,
                showSaveQueryModal,
                saveQuery,
                toggleCreateQueryModal,
                createFolderInput,
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
                searchLoading,
                all_immediateParentGuid,
                per_immediateParentGuid,
                getRelevantTreeData,
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
