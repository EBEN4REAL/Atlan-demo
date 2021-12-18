<template>
    <div
        class="flex flex-col items-center w-full h-full bg-white query-explorer"
    >
        <div
            v-if="
                isValid(queryCollections) &&
                !queryCollectionsError &&
                !queryCollectionsLoading
            "
            class="w-full"
        >
            <div
                class="w-full p-4 pb-0 rounded"
                v-if="queryCollections?.length > 0"
            >
                <div class="flex items-center">
                    <CollectionSelector
                        @update:data="updateCollection"
                        @toggleCollectionModal="toggleCollectionModal"
                    ></CollectionSelector>
                    <!-- TODO:@rohan: disable items when its in search mode !searchQuery?.length && !totalFilteredCount -->
                    <a-dropdown
                        :trigger="['click']"
                        class="ml-auto shadow-none h-7"
                        placement="bottomRight"
                    >
                        <div
                            class="flex items-center h-8 px-3 rounded-lg cursor-pointer"
                            :class="$style.filterButton"
                        >
                            <span class="text-xs text-gray-700">New</span>
                        </div>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item
                                    key="0"
                                    v-if="hasWritePermission"
                                    @click="
                                        () =>
                                            toggleCreateQueryModal(
                                                currentSelectedNode
                                            )
                                    "
                                >
                                    <div class="flex items-center">
                                        <AtlanIcon
                                            icon="NewQuery"
                                            color="#5277D7"
                                            class="h-4 mr-2 outline-none hover:text-primary"
                                        />
                                        <span>New Query</span>
                                    </div>
                                </a-menu-item>
                                <a-menu-item
                                    key="1"
                                    @click="createFolderInput"
                                    v-if="hasWritePermission"
                                >
                                    <div class="flex items-center">
                                        <AtlanIcon
                                            color="#5277D7"
                                            icon="NewFolder"
                                            class="h-4 mr-2 outline-none hover:text-primary"
                                        />
                                        <span>New Folder</span>
                                    </div>
                                </a-menu-item>
                                <a-menu-item
                                    key="1"
                                    @click="toggleCollectionModal"
                                >
                                    <div class="flex items-center">
                                        <AtlanIcon
                                            color="#5277D7"
                                            icon="Platform"
                                            class="h-4 mr-2 outline-none hover:text-primary"
                                        />
                                        <span>New Collection</span>
                                    </div>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </div>
                <div class="flex flex-row space-x-2">
                    <a-input
                        v-model:value="searchQuery"
                        class="h-8 mt-2 rounded"
                        :class="$style.inputSearch"
                        placeholder="Search Queries"
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
            <div v-else style="height: 35%"></div>
            <!-- <div class="w-full my-4 border-b"></div> -->
            <div class="w-full h-full mt-2" v-if="queryCollections?.length > 0">
                <div
                    v-if="!searchQuery?.length && !totalFilteredCount"
                    class="relative w-full px-4 pt-0 mt-2 overflow-y-auto"
                    :style="
                        fullSreenState
                            ? 'height: calc( 100vh - 140px )'
                            : 'height: calc( 100vh - 120px )'
                    "
                >
                    <div class="w-full h-full bg-white">
                        <query-tree
                            v-if="!queryCollectionsLoading"
                            @toggleCreateQueryModal="toggleCreateQueryModal"
                            @createFolderInput="createFolderInput"
                            :savedQueryType="savedQueryType"
                            :tree-data="treeData"
                            :on-load-data="onLoadData"
                            :select-node="selectNode"
                            :expand-node="expandNode"
                            :is-loading="isQueriesLoading"
                            :loaded-keys="loadedKeys"
                            :selected-keys="selectedKeys"
                            :expanded-keys="expandedKeys"
                            :showEmptyState="showEmptyState"
                            :refreshQueryTree="refreshQueryTree"
                            :QueriesFetchError="QueriesFetchError"
                        />
                    </div>
                    <!--explorer pane end -->
                </div>
                <div
                    v-else
                    class="relative w-full p-3 pt-0 pl-6 mt-2 overflow-y-auto"
                    :style="
                        fullSreenState
                            ? 'height: calc( 100vh- 140px )'
                            : 'height: calc( 100vh- 120px )'
                    "
                >
                    <div v-if="searchLoading" class="pl-6">
                        <Loader />
                    </div>
                    <div v-else-if="searchResults?.entities?.length">
                        <div class="w-full h-full bg-white">
                            <query-tree
                                @toggleCreateQueryModal="toggleCreateQueryModal"
                                @createFolderInput="createFolderInput"
                                :savedQueryType="savedQueryType"
                                :tree-data="searchTreeData"
                                :on-load-data="onLoadData"
                                :select-node="selectNode"
                                :expand-node="expandNode"
                                :is-loading="isQueriesLoading"
                                :loaded-keys="loadedKeys"
                                :selected-keys="selectedKeys"
                                :expanded-keys="expandedKeys"
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
            <EmptyView
                v-else
                empty-screen="EmptyCollections"
                headline="Collections"
                desc="Organise queries relevant for your project or team into collections and  share it with others. "
                button-text="Create Collection"
                @event="
                    () => {
                        showCollectionModal = true
                    }
                "
            />
        </div>
        <div
            v-else-if="queryCollectionsLoading"
            class="flex items-center justify-center h-full"
        >
            <Loader></Loader>
        </div>
        <div
            v-else-if="queryCollectionsError && !queryCollectionsLoading"
            class="flex items-center justify-center h-full"
        >
            <ErrorView :error="errorObjectForCollection">
                <div class="mt-3">
                    <a-button
                        data-test-id="try-again"
                        size="large"
                        type="primary"
                        ghost
                        @click="
                            () => {
                                refetchQueryCollection()
                            }
                        "
                    >
                        <fa icon="fal sync" class="mr-2"></fa>Try again
                    </a-button>
                </div>
            </ErrorView>
        </div>
        <CreateCollectionModal
            v-if="showCollectionModal"
            v-model:showCollectionModal="showCollectionModal"
            :is-create="true"
        />
        <SaveQueryModal
            v-if="showSaveQueryModal"
            v-model:showSaveQueryModal="showSaveQueryModal"
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
    import { useRouter, useRoute } from 'vue-router'
    import {
        Folder,
        SavedQueryInterface,
        QueryCollection,
    } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import { useConnector } from '~/components/insights/common/composables/useConnector'

    import useQueryCollection from '~/components/insights/explorers/queries/composables/useQueryCollection'
    import EmptyView from '@common/empty/index.vue'

    import { useEditor } from '~/components/insights/common/composables/useEditor'
    import RaisedTab from '~/components/insights/common/raisedTabs/index.vue'
    import QueryTree from './queryTree.vue'
    // import useQueryTree from './composables/useQueryTree'
    import useQueryTree from './composables/useQueryTree'
    import useSearchQueries from './composables/useSearchQueries'

    import CollectionSelector from './collection/collectionSelector.vue'
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
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import Loader from '@common/loaders/page.vue'
    import ErrorView from '@common/error/index.vue'
    import { isValid } from '~/utils/isValid'

    export default defineComponent({
        name: 'QueryExplorer',
        components: {
            EmptyView,
            Loader,
            RaisedTab,
            QueryTree,
            ErrorView,
            // SaveQueryModal,
            QueryFilter,
            LoadingView,
            QueryTreeItem,
            CollectionSelector,
            SaveQueryModal: defineAsyncComponent(
                () =>
                    import(
                        '~/components/insights/playground/editor/saveQuery/index.vue'
                    )
            ),
            CreateCollectionModal: defineAsyncComponent(
                () =>
                    import(
                        '~/components/insights/explorers/queries/collection/createCollectionModal.vue'
                    )
            ),
            AtlanIcon,
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
            resetType: {
                type: String,
                required: false,
            },
        },
        setup(props, { emit }) {
            let { reset, resetParentGuid, resetType } = toRefs(props)
            const route =
                useRoute() /* FIXME: Hardcoded error object error for collection request get's failed */
            const errorObjectForCollection = ref({
                response: {
                    status: 400,
                    data: {
                        errorMessage:
                            'Failed to fetch collections. Please try again',
                    },
                },
            })
            const permissions = inject('permissions') as ComputedRef<any>
            const { qualifiedName } = useAssetInfo()
            const { modifyActiveInlineTab } = useInlineTab()
            const storeDiscovery = useAssetStore()
            const { selectedAsset } = storeToRefs(storeDiscovery)
            const router = useRouter()
            const showSaveQueryModal: Ref<boolean> = ref(false)
            const fullSreenState = inject('fullSreenState') as Ref<boolean>
            const saveQueryLoading = ref(false)
            const showCollectionModal = ref(false)
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
            const { classificationList } = useTypedefData()

            // console.log('hello world: ', classificationList.value)
            const editorInstance = inject('editorInstance') as Ref<any>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>
            const queryFolderNamespace = inject<Ref<Folder>>(
                'queryFolderNamespace',
                ref({}) as Ref<Folder>
            )
            const queryCollections = inject('queryCollections') as ComputedRef<
                QueryCollection[] | undefined
            >
            const queryCollectionsError = inject(
                'queryCollectionsError'
            ) as Ref<any>
            const queryCollectionsLoading = inject(
                'queryCollectionsLoading'
            ) as Ref<Boolean>
            const refetchQueryCollection = inject(
                'refetchQueryCollection'
            ) as Function
            const { setConnectorsDataInInlineTab, getConnectorName } =
                useConnector()
            const { setCollectionsDataInInlineTab } = useQueryCollection()
            const connector = ref(
                getConnectorName(
                    activeInlineTab.value?.explorer?.schema?.connectors
                        ?.attributeValue
                )
            )
            const isCollectionCreatedByCurrentUser = inject(
                'isCollectionCreatedByCurrentUser'
            ) as ComputedRef
            const hasCollectionReadPermission = inject(
                'hasCollectionReadPermission'
            ) as ComputedRef
            const hasCollectionWritePermission = inject(
                'hasCollectionWritePermission'
            ) as ComputedRef

            const hasWritePermission = computed(
                () =>
                    hasCollectionWritePermission.value ||
                    isCollectionCreatedByCurrentUser.value
            )

            // console.log('collection permission: ', {
            //     isCollectionCreatedByCurrentUser,
            //     hasCollectionReadPermission,
            //     hasCollectionWritePermission,
            // })

            const selectedCollection = computed(() => {
                // console.log(
                //     'collections active: ',
                //     activeInlineTab.value.explorer
                // )
                const collection = queryCollections.value?.find(
                    (coll) =>
                        coll.attributes.qualifiedName ===
                        activeInlineTab?.value?.explorer?.queries?.collection
                            ?.qualifiedName
                )
                return collection
            })

            const { focusEditor } = useEditor()
            const BItypes = getBISourceTypes()

            let selectedClassification = ref(
                classificationList.value.length
                    ? classificationList.value[0].name
                    : ''
            )
            const savedQueryType: Ref<object> = ref(classificationList.value[0])

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

            const updateCollection = ({ qname, guid }) => {
                // selectedCollection.value = queryCollections.value?.find(
                //     (coll) =>
                //         coll.attributes.qualifiedName ===
                //         activeInlineTab.value.explorer.queries.collection
                //             .qualifiedName
                // )

                // console.log('selected collection:', selectedCollection)
                console.log('useQueryTree updateCollection', { qname, guid })
                setCollectionsDataInInlineTab(
                    activeInlineTab,
                    inlineTabs,
                    qname,
                    guid
                )
            }

            let selectedFolder = ref({})

            const toggleCreateQueryModal = (item) => {
                console.log('create query modal: ', item)
                // console.log('selected Parent: ', item)

                if (item?.typeName === 'QueryFolderNamespace') {
                    selectedFolder.value = item
                    showSaveQueryModal.value = !showSaveQueryModal.value
                } else if (
                    item?.typeName === 'QueryFolder' ||
                    item?.value?.typeName === 'QueryFolder'
                ) {
                    if (item?.value?.guid) {
                        selectedFolder.value = item
                    } else if (item?.guid) {
                        selectedFolder.value = item
                    }
                    showSaveQueryModal.value = !showSaveQueryModal.value
                    // if (item?.value?.qualifiedName) {
                    //     getRelevantTreeData().parentQualifiedName.value =
                    //         item.value.qualifiedName
                    // } else if (item?.qualifiedName) {
                    //     getRelevantTreeData().parentQualifiedName.value =
                    //         item.qualifiedName
                    // }
                } else {
                    selectedFolder.value = queryFolderNamespace
                    showSaveQueryModal.value = !showSaveQueryModal.value
                }
            }

            const newFolderName = ref('')
            const newFolderCreateable = ref(true)
            let showEmptyState = ref(true)

            const createFolderInput = () => {
                // const inputClassName = `${per_immediateParentGuid.value}_folder_input`
                const inputClassName = `${immediateParentGuid.value}_folder_input`
                console.log('append input')

                const existingInputs =
                    document.getElementsByClassName(inputClassName)
                const guid = getRelevantTreeData().parentGuid.value
                // console.log('tree data: ', getRelevantTreeData())

                // appends the input element into the DOM with all the event listeners attached
                const appendInput = () => {
                    // check if there are existing inputs to avoid duplication
                    if (!existingInputs.length && newFolderCreateable.value) {
                        let parentFolder
                        if (guid === selectedCollection?.value?.guid) {
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
                        if (guid !== selectedCollection?.value?.guid) {
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

                        if (guid !== selectedCollection?.value?.guid) {
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
                                savedQueryType.value?.name,
                                getRelevantTreeData().parentQualifiedName,
                                getRelevantTreeData().parentGuid,
                                selectedCollection
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
                                        await refetchNode(
                                            getRelevantTreeData().parentGuid
                                                .value,
                                            'queryFolder'
                                        )
                                        ul.removeChild(div)
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

                        if (guid === selectedCollection?.value?.guid) {
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
                    guid === selectedCollection?.value?.guid
                ) {
                    appendInput()
                }
                // if the folder is not loaded, don't do anything
            }

            const pushGuidToURL = (item) => {
                const queryParams = {}
                if (item.guid) queryParams.id = item.guid
                if (item?.attributes?.isVisualQuery) queryParams.vqb = true
                // const queryParams = { id: guid }
                // if (route?.query?.vqb) queryParams.vqb = true
                router.push({ path: `insights`, query: queryParams })
            }
            const facets = ref({})
            const onFilterChange = (type, value) => {
                console.log('facet: ', value)
                if (type === 'facets') {
                    facets.value = { ...value }
                }
            }
            const totalFilteredCount = computed(() => {
                let count = 0
                Object.keys(facets.value).forEach((key) => {
                    if (Array.isArray(facets.value[key])) {
                        if (facets.value[key].length > 0) {
                            count += 1
                        }
                    } else if (
                        typeof facets.value[key] === 'object' &&
                        facets.value[key] !== null
                    ) {
                        if (Object.keys(facets.value[key]).length > 0) {
                            count += 1
                        }
                    }
                })
                return count
            })

            const {
                treeData: treeData,
                loadedKeys: loadedKeys,
                isInitingTree: isInitingTree,
                selectedKeys: selectedKeys,
                expandedKeys: expandedKeys,
                immediateParentFolderQF: immediateParentFolderQF,
                onLoadData: onLoadData,
                expandNode: expandNode,
                selectNode: selectNode,
                refetchNode: refetchNode,
                immediateParentGuid: immediateParentGuid,
                nodeToParentKeyMap: nodeToParentKeyMap,
                updateNode: updateNode,
                currentSelectedNode: currentSelectedNode,
                errorReq: QueriesFetchError,
                isLoading: isQueriesLoading,
                initTreeData: refreshQueryTree,
                // addInputBox,
                // removeInputBox,
            } = useQueryTree({
                emit,
                openSavedQueryInNewTab,
                pushGuidToURL,
                connector,
                queryFolderNamespace,
                savedQueryType: selectedClassification,
                /* PERMISSIONS */
                permissions: {
                    readQueries: permissions.value.public.readQueries,
                    readFolders: permissions.value.public.readFolders,
                },
                collection: selectedCollection,
            })

            const { data1: searchResults, isLoading1: searchLoading } =
                useSearchQueries(searchQuery, selectedCollection, facets)

            const getRelevantTreeData = () => {
                return {
                    parentQualifiedName: immediateParentFolderQF,
                    parentGuid: immediateParentGuid,
                    loadedKeys: loadedKeys,
                    expandedKeys: expandedKeys,
                }
            }

            watch(activeInlineTabKey, (newActiveInlineTab) => {
                selectedKeys.value = [newActiveInlineTab]
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
                saveQueryData: any
                assetTerms: any
            }) => {
                console.log('saving query: ', savedQueryType.value)
                const { data } = saveQueryToDatabaseAndOpenInNewTab(
                    saveQueryData,
                    editorInstance,
                    saveQueryLoading,
                    showSaveQueryModal,
                    saveModalRef,
                    router,
                    route,
                    '',
                    saveQueryData.parentQF ??
                        getRelevantTreeData().parentQualifiedName.value,
                    saveQueryData.parentGuid ??
                        getRelevantTreeData().parentGuid.value
                )
                focusEditor(toRaw(editorInstance.value))

                watch(data, (data) => {
                    // console.log('query data: ', data)
                    // console.log('query saveQueryData: ', saveQueryData)
                    if (data) {
                        refetchNode(
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
                const all_guid =
                    nodeToParentKeyMap[guid] ?? queryFolderNamespace.value.guid

                refetchNode(all_guid, type)
            }

            const toggleCollectionModal = () => {
                showCollectionModal.value = !showCollectionModal.value
            }

            onMounted(() => {
                selectedKeys.value = [activeInlineTabKey.value]
            })

            // Providers
            provide('toggleCreateQueryModal', toggleCreateQueryModal)
            provide('savedQueryType', savedQueryType)
            // provide('savedQueryType', savedQueryType)
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
                    updateNode({
                        qualifiedName: qualifiedName(
                            selectedAsset as unknown as assetInterface
                        ),
                        entity: selectedAsset.value as any,
                    })
                    // }
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
                    console.log(
                        'selected collection: ',
                        selectedCollection.value
                    )
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

                                    await refetchNode(guid, resetType.value)
                                }
                            )
                        } else {
                            await refetchNode(
                                resetParentGuid.value,
                                resetType.value
                            )
                        }

                        props.resetQueryTree()
                    }, 750)
                }
            })
            console.log(queryCollectionsError.value, 'queryCollectionsError')

            return {
                isValid,
                refreshQueryTree,
                isQueriesLoading,
                QueriesFetchError,
                errorObjectForCollection,
                queryCollectionsError,
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
                isSavedQueryOpened,
                openSavedQueryInNewTab,
                connector,
                updateConnector,
                savedQueryType,
                treeData,
                loadedKeys,
                isInitingTree,
                selectedKeys,
                expandedKeys,
                onLoadData,
                expandNode,
                selectNode,
                searchQuery,
                facets,
                searchResults,
                searchLoading,
                immediateParentGuid,
                getRelevantTreeData,
                showEmptyState,
                selectedFolder,
                queryFolderNamespace,
                BItypes,
                currentSelectedNode,
                totalFilteredCount,
                updateCollection,
                queryCollections,
                queryCollectionsLoading,
                refetchQueryCollection,
                selectedCollection,
                toggleCollectionModal,
                showCollectionModal,
                isCollectionCreatedByCurrentUser,
                hasCollectionReadPermission,
                hasCollectionWritePermission,
                hasWritePermission,
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
        border: 1px solid #e6e6eb;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
        border-radius: 8px;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
