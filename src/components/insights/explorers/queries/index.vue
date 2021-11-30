<template>
    <div
        class="flex flex-col items-center w-full h-full bg-white query-explorer"
    >
        <div class="w-full p-4 pb-0 rounded">
            <Connector
                :connector="connector"
                @update:data="updateConnector"
                :filterSourceIds="BItypes"
            />
            <div class="flex flex-row space-x-2">
                <a-input
                    v-model:value="searchQuery"
                    class="h-8 mt-2 rounded"
                    :class="$style.inputSearch"
                    placeholder="Search"
                >
                    <template #suffix>
                        <AtlanIcon icon="Search" color="#6F7590" />
                    </template>
                </a-input>
                <a-popover trigger="click" placement="bottomLeft">
                    <a-button
                        class="flex items-center w-8 h-8 p-2 mt-2"
                        :class="$style.filterButton"
                    >
                        <AtlanIcon icon="Filter" />
                    </a-button>
                    <template #content>
                        <QueryFilter @change="onFilterChange" />
                    </template>
                </a-popover>
            </div>
        </div>
        <!-- <div class="w-full my-4 border-b"></div> -->
        <div class="w-full h-full mt-2 h-9">
            <div class="w-full px-4">
                <div
                    class="flex items-end justify-between mb-2 text-gray-500 h-9"
                >
                    <RaisedTab
                        v-model:active="savedQueryType"
                        :data="raisedTabConfig"
                    />
                    <div v-if="!searchQuery?.length" class="flex items-center">
                        <div class>
                            <!-- CREATE QUERY PERMISSIONS -->
                            <a-tooltip
                                placement="top"
                                color="#363636"
                                v-if="
                                    savedQueryType === 'personal' &&
                                    permissions.private.createQuery
                                "
                            >
                                <template #title>
                                    <span>New query</span>
                                </template>
                                <AtlanIcon
                                    @click="
                                        () =>
                                            toggleCreateQueryModal(
                                                queryFolderNamespace
                                            )
                                    "
                                    icon="NewQuery"
                                    color="#5277D7"
                                    class="h-4 m-0 mr-4 -mt-0.5 hover:text-primary outline-none"
                                />
                            </a-tooltip>
                            <a-tooltip
                                placement="top"
                                color="#363636"
                                v-if="
                                    savedQueryType === 'all' &&
                                    permissions.public.createQuery
                                "
                            >
                                <template #title>
                                    <span>New query</span>
                                </template>
                                <AtlanIcon
                                    @click="
                                        () =>
                                            toggleCreateQueryModal(
                                                queryFolderNamespace
                                            )
                                    "
                                    icon="NewQuery"
                                    color="#5277D7"
                                    class="h-4 m-0 mr-4 -mt-0.5 hover:text-primary outline-none"
                                />
                            </a-tooltip>
                            <!-- ----------- -->
                        </div>
                        <div class>
                            <!-- CREATE FOLDER PERMISSIONS -->
                            <a-tooltip
                                placement="top"
                                color="#363636"
                                v-if="
                                    savedQueryType === 'personal' &&
                                    permissions.private.createFolder
                                "
                            >
                                <template #title>
                                    <span>New folder</span>
                                </template>
                                <AtlanIcon
                                    @click="createFolderInput"
                                    color="#5277D7"
                                    icon="NewFolder"
                                    class="h-4 m-0 -mt-0.5 hover:text-primary outline-none"
                                />
                            </a-tooltip>
                            <a-tooltip
                                placement="top"
                                color="#363636"
                                v-if="
                                    savedQueryType === 'all' &&
                                    resolvePublicFolderCreationPermission()
                                "
                            >
                                <template #title>
                                    <span>New folder</span>
                                </template>
                                <AtlanIcon
                                    @click="createFolderInput"
                                    color="#5277D7"
                                    icon="NewFolder"
                                    class="h-4 m-0 -mt-0.5 hover:text-primary outline-none"
                                />
                            </a-tooltip>
                            <!-- CREATE FOLDER PERMISSIONS -->
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="!searchQuery?.length && !Object.keys(facets).length"
                class="relative w-full px-4 pt-0 overflow-y-auto"
                :style="
                    fullSreenState
                        ? 'height: calc( 100vh - 140px )'
                        : 'height: calc( 100vh - 120px )'
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
                        :showEmptyState="showEmptyState"
                        :refreshQueryTree="refreshQueryTree"
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
                        :showEmptyState="showEmptyState"
                        :refreshQueryTree="refreshQueryTree"
                    />
                </div>
                <!--explorer pane end -->
            </div>
            <div
                v-else
                class="relative w-full p-3 pt-0 pl-6 overflow-y-auto"
                :style="
                    fullSreenState
                        ? 'height: calc( 100vh- 140px )'
                        : 'height: calc( 100vh- 120px )'
                "
            >
                <div v-if="searchLoading" class="pl-6">
                    <LoadingView />
                </div>
                <div v-else-if="searchResults?.entities?.length">
                    <div
                        v-if="savedQueryType === 'personal'"
                        class="w-full h-full bg-white"
                    >
                        <query-tree
                            @toggleCreateQueryModal="toggleCreateQueryModal"
                            @createFolderInput="createFolderInput"
                            :savedQueryType="savedQueryType"
                            :tree-data="searchTreeData"
                            :on-load-data="per_onLoadData"
                            :select-node="per_selectNode"
                            :expand-node="per_expandNode"
                            :is-loading="per_isInitingTree"
                            :loaded-keys="per_loadedKeys"
                            :selected-keys="per_selectedKeys"
                            :expanded-keys="per_expandedKeys"
                            :refreshQueryTree="refreshQueryTree"
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
                            :tree-data="searchTreeData"
                            :on-load-data="all_onLoadData"
                            :select-node="all_selectNode"
                            :expand-node="all_expandNode"
                            :is-loading="all_isInitingTree"
                            :loaded-keys="all_loadedKeys"
                            :selected-keys="all_selectedKeys"
                            :expanded-keys="all_expandedKeys"
                            :refreshQueryTree="refreshQueryTree"
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
                        class="my-2 mb-0 mb-6 text-base text-center text-gray-700 max-width-text"
                    >
                        Sorry, we couldn’t find
                        <br />the query you were looking for
                    </p>
                </div>
            </div>
        </div>

        <SaveQueryModal
            v-model:showSaveQueryModal="showSaveQueryModal"
            v-if="showSaveQueryModal"
            :saveQueryLoading="saveQueryLoading"
            :ref="
                (el) => {
                    saveModalRef = el
                }
            "
            :connector="connector"
            :savedQueryType="savedQueryType"
            :parentFolder="selectedFolder"
            @onSaveQuery="saveQuery"
        />
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        inject,
        Ref,
        ComputedRef,
        watch,
        ref,
        toRaw,
        onMounted,
        provide,
        PropType,
        toRefs,
        defineAsyncComponent,
    } from 'vue'
    import { useRouter } from 'vue-router'
    import {
        Folder,
        SavedQueryInterface,
    } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import { useEditor } from '~/components/insights/common/composables/useEditor'
    import RaisedTab from '~/components/insights/common/raisedTabs/index.vue'
    import QueryTree from './queryTree.vue'
    import useQueryTree from './composables/useQueryTree'
    import useSearchQueries from './composables/useSearchQueries'

    import Connector from '~/components/insights/common/connector/connectorOnly.vue'
    // import SaveQueryModal from '~/components/insights/playground/editor/saveQuery/index.vue'
    import LoadingView from '@common/loaders/section.vue'
    import QueryTreeItem from './queryTreeItem.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import useAssetStore from '~/store/asset'
    import { storeToRefs } from 'pinia'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { getBISourceTypes } from '~/composables/connection/getBISourceTypes'
    import QueryFilter from './queryFilter.vue'
    export default defineComponent({
        components: {
            RaisedTab,
            QueryTree,
            Connector,
            // SaveQueryModal,
            QueryFilter,
            LoadingView,
            QueryTreeItem,
            SaveQueryModal: defineAsyncComponent(
                () =>
                    import(
                        '~/components/insights/playground/editor/saveQuery/index.vue'
                    )
            ),
        },
        props: {
            reset: {
                type: Boolean,
                required: true,
                default: false,
            },
            resetParentGuid: {
                type: String,
                required: true,
            },
            resetQueryTree: {
                type: Function,
            },
            refreshQueryTree: {
                type: Function,
            },
            resetType: {
                type: String,
                required: false,
            },
        },
        setup(props, { emit }) {
            let { reset, resetParentGuid, resetType } = toRefs(props)

            const permissions = inject('permissions') as ComputedRef<any>
            const { qualifiedName } = useAssetInfo()
            const { modifyActiveInlineTab } = useInlineTab()
            const storeDiscovery = useAssetStore()
            const { selectedAsset } = storeToRefs(storeDiscovery)
            const router = useRouter()
            const showSaveQueryModal: Ref<boolean> = ref(false)
            const fullSreenState = inject('fullSreenState') as Ref<boolean>
            const saveQueryLoading = ref(false)
            const searchQuery = ref('')
            const raisedTabConfig = [
                { key: 'personal', label: 'Personal' },
                { key: 'all', label: 'All' },
            ]

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
            const queryFolderNamespace = inject<Ref<Folder>>(
                'queryFolderNamespace',
                ref({}) as Ref<Folder>
            )

            const { setConnectorsDataInInlineTab, getConnectorName } =
                useConnector()
            const connector = ref(
                getConnectorName(
                    activeInlineTab.value?.explorer?.schema?.connectors
                        ?.attributeValue
                )
            )
            const { focusEditor } = useEditor()
            const BItypes = getBISourceTypes()

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
            let selectedFolder = ref({})

            const toggleCreateQueryModal = (item) => {
                // console.log('selected Parent: ', item)

                if (item.typeName === 'QueryFolderNamespace') {
                    selectedFolder.value = item
                    getRelevantTreeData().parentGuid.value = item.guid
                } else {
                    if (item.value.guid) {
                        selectedFolder.value = item
                        getRelevantTreeData().parentGuid.value = item.value.guid
                    }
                    if (item.value.qualifiedName) {
                        getRelevantTreeData().parentQualifiedName.value =
                            item.value.qualifiedName
                    }
                }

                showSaveQueryModal.value = !showSaveQueryModal.value
            }

            const newFolderName = ref('')
            const newFolderCreateable = ref(true)
            let showEmptyState = ref(true)

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
                        if (guid === queryFolderNamespace.value.guid) {
                            parentFolder =
                                document.querySelector(
                                    '.query-explorer  .ant-tree'
                                )?.parentNode ??
                                document.querySelector(
                                    '.query-explorer  .query-tree-root-div'
                                )
                        } else {
                            parentFolder = document.querySelector(
                                'div.ant-tree-list .ant-tree-treenode-selected'
                            )
                        }
                        let ul = document.createElement('div')
                        const div = document.createElement('div')

                        showEmptyState.value = false

                        div.classList.add(
                            'flex',
                            'items-center',
                            'active-input',
                            'h-8'
                        )
                        let childCount = 0
                        if (guid !== queryFolderNamespace.value.guid) {
                            console.log(
                                'parentChild: ',
                                parentFolder.children[0].children.length
                            )
                            childCount =
                                parentFolder.children[0].children.length + 1

                            console.log('count: ', childCount)
                        }

                        let spaceEl = null
                        if (childCount) {
                            let space = `<span style="padding-left:${
                                24 * childCount
                            }px;" class="h-2"></span>`
                            spaceEl = new DOMParser().parseFromString(
                                space,
                                'text/html'
                            ).body.firstElementChild
                        }

                        let caret =
                            '<span class="mt-2 -ml-1 ant-tree-switcher ant-tree-switcher_close"><svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-auto ant-tree-switcher-icon" data-v-b3169684="" style="height: 1rem;"><path d="m6 4 3.646 3.646a.5.5 0 0 1 0 .708L6 12" stroke="#6F7590" stroke-linecap="round"></path></svg></span>'

                        if (guid !== queryFolderNamespace.value.guid) {
                            caret =
                                '<span class="mr-0.5 ant-tree-switcher ant-tree-switcher_close"><svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-auto ant-tree-switcher-icon" data-v-b3169684="" style="height: 1rem;"><path d="m6 4 3.646 3.646a.5.5 0 0 1 0 .708L6 12" stroke="#6F7590" stroke-linecap="round"></path></svg></span>'
                        }

                        const caretEl = new DOMParser().parseFromString(
                            caret,
                            'text/html'
                        ).body.firstElementChild

                        const folderSvg =
                            '<span><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 w-auto h-5 my-auto mr-1 -ml-0.5" data-v-a0c5611e="" style="height: 1rem;"><path d="M5.5 2h-2a1 1 0 0 0-1 1v8.5a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-4a1 1 0 0 1-1-1 1 1 0 0 0-1-1Z" fill="#fff" stroke="#5277D7"></path><path d="M13.327 6H2.612a1 1 0 0 0-.995 1.106l.587 5.5a1 1 0 0 0 .994.894h9.249a1 1 0 0 0 .987-.842l.88-5.5A1 1 0 0 0 13.327 6Z" fill="#fff" stroke="#5277D7"></path></svg></span>'
                        const folderSvgEl = new DOMParser().parseFromString(
                            folderSvg,
                            'text/html'
                        ).body.firstElementChild

                        if (spaceEl) {
                            div.appendChild(spaceEl)
                        }
                        div.appendChild(caretEl)
                        div.appendChild(folderSvgEl)

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
                                            ul.removeChild(div)
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
                                            ul.removeChild(div)
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
                            `outline-none py-0 rounded my-1 w-auto ${inputClassName}`
                        )
                        input.setAttribute('placeholder', 'Name your folder')
                        input.addEventListener('input', (e) => {
                            newFolderName.value = e.target?.value
                        })

                        input.addEventListener('keydown', (e) => {
                            if (e.key === 'Escape') {
                                newFolderName.value = ''
                                ul.removeChild(div)
                                // removeInputBox()
                                showEmptyState.value = true
                            }
                            if (e.key === 'Enter') {
                                // create folder request
                                if (newFolderName.value.length) {
                                    makeCreateFolderRequest()
                                    newFolderName.value = ''
                                    showEmptyState.value = false
                                } else {
                                    newFolderName.value = ''
                                    ul.removeChild(div)
                                    showEmptyState.value = true
                                    // removeInputBox()
                                }
                            }
                        })
                        input.addEventListener('blur', (e) => {
                            if (newFolderName.value.length) {
                                makeCreateFolderRequest()
                                showEmptyState.value = false
                            } else {
                                div.removeChild(input)
                                div.setAttribute('class', 'hidden')
                                // removeInputBox()
                                newFolderName.value = ''
                                newFolderCreateable.value = false
                                setTimeout(() => {
                                    newFolderCreateable.value = true
                                    showEmptyState.value = true
                                }, 300)
                            }
                        })

                        div.appendChild(input)
                        ul.appendChild(div)
                        // console.log('child: ul: ', ul)

                        if (guid === queryFolderNamespace.value.guid) {
                            parentFolder.prepend(ul)
                            // console.log('input parent append')
                        } else {
                            parentFolder.parentNode.insertBefore(
                                ul,
                                parentFolder.nextSibling
                            )
                        }

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
                if (
                    (loaded && expanded) ||
                    guid === queryFolderNamespace?.value.guid
                ) {
                    appendInput()
                }
                // if the folder is not loaded, don't do anything
            }

            const pushGuidToURL = (guid: string) => {
                router.push(`/insights?id=${guid}`)
            }
            const facets = ref({})
            // const sortOrderTable = ref('')
            // const sortOrderColumn = ref('')
            const onFilterChange = (type, value) => {
                // if (type === 'sortOrderTable') {
                //     sortOrderTable.value = value
                // }
                // if (type === 'sortOrderColumn') {
                //     sortOrderColumn.value = value
                // }
                if (type === 'facets') {
                    facets.value = { ...value }
                }
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
                updateNode: per_updateNode,
            } = useQueryTree({
                emit,
                openSavedQueryInNewTab,
                pushGuidToURL,
                connector,
                queryFolderNamespace,
                savedQueryType: ref('personal'),
                /* PERMISSIONS */
                permissions: {
                    readQueries: permissions.value.private.readQueries,
                    readFolders: permissions.value.private.readFolders,
                },
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
                updateNode: all_updateNode,
                // addInputBox,
                // removeInputBox,
            } = useQueryTree({
                emit,
                openSavedQueryInNewTab,
                pushGuidToURL,
                connector,
                queryFolderNamespace,
                savedQueryType: ref('all'),
                /* PERMISSIONS */
                permissions: {
                    readQueries: permissions.value.public.readQueries,
                    readFolders: permissions.value.public.readFolders,
                },
            })

            const { data1: searchResults, isLoading1: searchLoading } =
                useSearchQueries(searchQuery, savedQueryType, facets)

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

                watch(data, (data) => {
                    if (data) {
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

            const resolvePublicFolderCreationPermission = () => {
                // if(all_selectNodeapply.root!=='root'){
                //     if(permissions.value.public.createNestedQuery) return true;
                //     if(permissions.value.public.createNestedFolder) return true;
                //     return false;

                // }

                return true
            }

            const refetchParentNode = (
                guid: string,
                type: 'query' | 'queryFolder',
                tree?: 'personal' | 'all'
            ) => {
                const per_guid =
                    per_nodeToParentKeyMap[guid] ??
                    queryFolderNamespace.value.guid
                const all_guid =
                    all_nodeToParentKeyMap[guid] ??
                    queryFolderNamespace.value.guid

                if (!tree || tree === 'personal')
                    per_refetchNode(per_guid, type)
                if (!tree || tree === 'all') all_refetchNode(all_guid, type)
            }

            const refetchNode = (
                guid: string,
                type: 'query' | 'queryFolder',
                tree?: 'personal' | 'all'
            ) => {
                if (!tree || tree === 'personal') per_refetchNode(guid, type)
                if (!tree || tree === 'all') all_refetchNode(guid, type)
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
            provide('refetchNode', refetchNode)

            /* Watcher for updating the node in tree */
            watch(selectedAsset, () => {
                /* For classificationNames len ==1 for public */
                const inlineTab = inlineTabs.value.find(
                    (tab) => tab?.queryId === selectedAsset.value?.guid
                )
                const activeInlineTabCopy: activeInlineTabInterface =
                    Object.assign({}, activeInlineTab.value)
                if (selectedAsset.value?.guid) {
                    if (
                        selectedAsset.value?.classificationNames?.length == 1 &&
                        inlineTab
                    ) {
                        per_updateNode({
                            qualifiedName: qualifiedName(
                                selectedAsset as unknown as assetInterface
                            ),
                            entity: selectedAsset.value as any,
                        })
                    } else {
                        all_updateNode({
                            qualifiedName: qualifiedName(
                                selectedAsset as unknown as assetInterface
                            ),
                            entity: selectedAsset.value as any,
                        })
                    }
                    activeInlineTabCopy.status = selectedAsset.value.attributes
                        .certificateStatus as string
                    activeInlineTabCopy.attributes =
                        selectedAsset.value.attributes

                    modifyActiveInlineTab(
                        activeInlineTabCopy,
                        inlineTabs,
                        activeInlineTabCopy.isSaved
                    )
                }
            })

            let searchTreeData = ref([])
            const returnTreeDataItemAttributes = (item) => {
                return {
                    attributes: item.attributes,
                    key: item.guid,
                    qualifiedName: item.attributes.qualifiedName,
                    class: item.guid,
                    guid: item.guid,
                    title: item.attributes.name,
                    typeName: item.typeName,
                    classifications: item.classifications,
                    // ...item.attributes,
                    isLeaf: item.typeName === 'Query' ? true : false,
                    entity: item,
                }
            }

            watch(
                [searchResults, searchLoading],
                () => {
                    console.log('queries: ', searchResults.value)
                    console.log('queries loading: ', searchLoading.value)
                    searchTreeData.value = []
                    if (searchResults.value?.entities?.length) {
                        searchResults.value.entities.forEach((query) => {
                            console.log('queries append')
                            searchTreeData.value.push(
                                returnTreeDataItemAttributes(query)
                            )
                        })
                    }
                },
                { immediate: true }
            )

            watch(reset, () => {
                // console.log('queryTree query: ', reset.value)
                if (reset.value) {
                    // console.log('queryTree inside if')
                    setTimeout(async () => {
                        // console.log(
                        //     'queryTree: ',
                        //     getRelevantTreeData().parentGuid.value
                        // )
                        console.log('reset type: ', resetType.value)
                        console.log('reset id: ', resetParentGuid.value)

                        if (Array.isArray(resetParentGuid.value)) {
                            console.log(
                                'reset parent guid: ',
                                resetParentGuid.value
                            )
                            resetParentGuid.value.forEach(
                                async (guid, index) => {
                                    // console.log('reset: ', index)

                                    await all_refetchNode(guid, resetType.value)
                                    await per_refetchNode(guid, resetType.value)
                                }
                            )
                        } else {
                            await all_refetchNode(
                                resetParentGuid.value,
                                resetType.value
                            )
                            await per_refetchNode(
                                resetParentGuid.value,
                                resetType.value
                            )
                        }

                        // console.log('reset type: ', resetType.value)
                        // console.log('reset id: ', resetParentGuid.value)

                        // console.log('not wait 1')
                        // await per_refetchNode(
                        //     resetParentGuid.value,
                        //     resetType.value
                        // )
                        // console.log('not wait 2')

                        props.resetQueryTree()
                    }, 750)
                }
            })

            return {
                searchTreeData,
                onFilterChange,
                resolvePublicFolderCreationPermission,
                permissions,
                raisedTabConfig,
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
                facets,
                searchResults,
                searchLoading,
                all_immediateParentGuid,
                per_immediateParentGuid,
                getRelevantTreeData,
                showEmptyState,
                selectedFolder,
                queryFolderNamespace,
                BItypes,
                // refetchTreeData,
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

<style lang="css" module>
    .inputSearch {
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05) !important;
        background-color: #fff !important;
        border: 1px solid #e9ebf1 !important;
        color: #6f7590 !important;
        border-radius: 8px !important;
    }
    :global(.ant-input) {
        color: #6f7590 !important;
    }
    input::placeholder {
        color: #6f7590 !important;
    }
    .filterButton {
        background: #ffffff;
        border: 1px solid #e9ebf1;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
        border-radius: 8px;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
