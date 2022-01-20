<template>
    <div id="fullScreenId" class="flex h-full overflow-x-hidden">
        <!--Sidebar navigation pane start -->
        <div class="bg-white border-r sidebar-nav">
            <template v-for="tab in tabsList" :key="tab.id">
                <a-tooltip placement="right" color="#363636">
                    <template #title> {{ tab.title }} </template>

                    <div
                        class="relative flex flex-col items-center text-xs sidebar-nav-icon"
                        @click="() => changeTab(tab)"
                    >
                        <AtlanIcon
                            v-if="tab?.icon"
                            :icon="
                                activeTabId === tab.id
                                    ? `${tab.icon}Active`
                                    : `${tab.icon}`
                            "
                            class="w-6 h-6"
                        />
                        <div
                            class="absolute top-0 right-0 h-full"
                            style="width: 3px"
                            :class="activeTabId === tab.id ? 'bg-primary' : ''"
                        ></div>
                    </div>
                </a-tooltip>
            </template>
        </div>
        <!--Sidebar navigation pane end -->
        <div ref="splitpaneRef">
            <splitpanes
                :class="[
                    $style.splitpane__styles,
                    activeInlineTab?.assetSidebar?.isVisible
                        ? 'show-assetsidebar'
                        : 'hide-assetsidebar',
                ]"
                class="parent_splitpanes"
                @resize="paneResize"
                :dbl-click-splitter="false"
            >
                <pane
                    :max-size="maxExplorerSize"
                    :size="explorerPaneSize"
                    :min-size="minExplorerSize"
                    class="relative explorer_splitpane"
                >
                    <!--explorer pane start -->
                    <div
                        :class="
                            activeTab.component === 'schema' ? 'z-30' : 'z-10'
                        "
                        class="absolute h-full full-width"
                    >
                        <Schema />
                    </div>
                    <div
                        :class="
                            activeTab.component === 'queries' ? 'z-30' : 'z-10'
                        "
                        class="absolute h-full full-width"
                    >
                        <Queries
                            :reset="resetTree"
                            :reset-query-tree="resetQueryTree"
                            :reset-parent-guid="resetParentGuid"
                            :reset-type="resetType"
                            :refresh-query-tree="refreshQueryTree"
                        />
                    </div>
                    <div
                        :class="
                            activeTab.component === 'variables'
                                ? 'z-30'
                                : 'z-10'
                        "
                        class="absolute h-full full-width"
                    >
                        <Variables />
                    </div>
                    <!--explorer pane end -->
                </pane>
                <pane
                    :size="
                        activeInlineTab?.assetSidebar?.isVisible
                            ? 100 - explorerPaneSize - assetSidebarPaneSize
                            : 100 - explorerPaneSize
                    "
                    :style="{
                        marginLeft: explorerPaneSize === 0 ? '-1px' : '0px',
                    }"
                >
                    <Playground
                        :active-inline-tab-key="activeInlineTabKey"
                        :refresh-query-tree="refreshQueryTree"
                    />
                </pane>
                <pane
                    :max-size="
                        activeInlineTab?.assetSidebar?.isVisible
                            ? sidebarPaneSize
                            : 0
                    "
                    class="assetSidebar"
                    :min-size="sidebarPaneSize"
                    :size="sidebarPaneSize"
                >
                    <AssetSidebar />
                </pane>
            </splitpanes>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        computed,
        watch,
        inject,
        nextTick,
        onUpdated,
        Ref,
        toRaw,
        onUnmounted,
        onMounted,
    } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import Playground from '~/components/insights/playground/index.vue'
    import AssetSidebar from '~/components/insights/assetSidebar/index.vue'
    import Schema from './explorers/schema/index.vue'
    import Queries from './explorers/queries/index.vue'
    import Variables from './explorers/variables/index.vue'
    import History from './explorers/history.vue'
    import Schedule from './explorers/schedule.vue'

    import useInsightsTabList from './common/composables/useTabList'
    import { useLocalStorageSync } from './common/composables/useLocalStorageSync'
    import { useSpiltPanes } from './common/composables/useSpiltPanes'
    import {
        useProvide,
        provideDataInterface,
    } from './common/composables/useProvide'
    import { useInlineTab } from './common/composables/useInlineTab'
    // import { useEditor } from './common/composables/useEditor'
    import { useEditorPreference } from './common/composables/useEditorPreference'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import { useHotKeys } from './common/composables/useHotKeys'
    import { useFullScreen } from './common/composables/useFullScreen'

    import { TabInterface } from '~/types/insights/tab.interface'
    import { SavedQuery } from '~/types/insights/savedQuery.interface'
    import { QueryCollection } from '~/types/insights/savedQuery.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'
    import { generateUUID } from '~/utils/helper/generator'
    import useQueryCollection from '~/components/insights/explorers/queries/composables/useQueryCollection'
    import { message } from 'ant-design-vue'
    import useCollectionAccess from '~/components/insights/explorers/queries/composables/useCollectionAccess'
    import useActiveQueryAccess from '~/components/insights/explorers/queries/composables/useActiveQueryAccess'

    import {
        explorerPaneSize,
        minExplorerSize,
        maxExplorerSize,
        currentNormalExplorerSize,
    } from './common/composables/useSpiltPanes'
    export default defineComponent({
        components: {
            Playground,
            AssetSidebar,
            Schema,
            Queries,
            Variables,
            History,
            Schedule,
        },
        props: {},
        setup(props) {
            const observer = ref()
            const splitpaneRef = ref()

            const savedQueryInfo = inject('savedQueryInfo') as Ref<
                SavedQuery | undefined
            >
            const runQuery = inject('runQuery')
            const refetchQueryCollection = inject(
                'refetchQueryCollection'
            ) as Ref<Function>

            const isCollectionCreated = inject(
                'isCollectionCreated'
            ) as Ref<Boolean>

            const {
                MIN_EXPLORER_WIDTH,
                MAX_EXPLORER_WIDTH,
                ASSET_SIDEBAR_WIDTH,
                EXPLORER_WIDTH,
                assetSidebarPaneSize,
                outputPaneSize,
                paneResize,
            } = useSpiltPanes()
            const route = useRoute()
            // TODO: will be used for HOTKEYs
            const {
                explorerPaneToggle,
                resultsPaneSizeToggle,
                assetSidebarToggle,
            } = useHotKeys()
            const {
                queryCollectionsError,
                getQueryCollections,
                queryCollections,
                queryCollectionsLoading,
                selectFirstCollectionByDefault,
                // selectCollectionFromUrl,
            } = useQueryCollection()
            const { editorConfig, editorHoverConfig } = useEditorPreference()
            const { fullSreenState } = useFullScreen()
            const savedQueryGuidFromURL = ref(route.query?.id)

            const databaseQualifiedNameFromURL = inject(
                'databaseQualifiedNameFromURL'
            )
            const schemaNameFromURL = inject('schemaNameFromURL')
            const tableNameFromURL = inject('tableNameFromURL')
            const columnNameFromURL = inject('columnNameFromURL')

            const collectionGuidFromURL = inject('collectionGuidFromURL')

            const { queryRun } = useRunQuery()
            const showVQB = ref(false)

            const router = useRouter()

            // const schemaNameFromURL = ref(route.query?.schemaNameFromURL)
            // const tableNameFromURL = ref(route.query?.tableNameFromURL)
            // const columnNameFromURL = ref(route.query?.columnNameFromURL)

            const { filteredTabs: tabsList } = useInsightsTabList()
            const {
                setUserPreferenceToLocalStorage,
                syncInlineTabsInLocalStorage,
                syncActiveInlineTabKeyInLocalStorage,
            } = useLocalStorageSync()
            const {
                tabsArray,
                activeInlineTabKey,
                activeInlineTab,
                inlineTabAdd,
                modifyActiveInlineTabEditor,
            } = useInlineTab(undefined, !savedQueryGuidFromURL.value)

            const { openSavedQueryInNewTab } = useSavedQuery(
                tabsArray,
                activeInlineTab,
                activeInlineTabKey
            )

            const {
                isCollectionCreatedByCurrentUser,
                hasCollectionReadPermission,
                hasCollectionWritePermission,
            } = useCollectionAccess(activeInlineTab)

            const {
                isQueryCreatedByCurrentUser,
                hasQueryReadPermission,
                hasQueryWritePermission,
                activeTabCollection,
            } = useActiveQueryAccess(activeInlineTab)

            watch(activeInlineTab, () => {})

            const sidebarPaneSize = computed(() =>
                activeInlineTab.value?.assetSidebar?.isVisible
                    ? assetSidebarPaneSize.value
                    : 0
            )
            const activeTabId = ref(tabsList[0].id)

            const activeTab = computed(() =>
                tabsList.find((tab) => tab.id === activeTabId.value)
            )

            const changeTab = (tab: TabInterface) => {
                console.log('new tab', tab)
                activeTabId.value = tab.id
            }
            const editorInstance: Ref<any> = ref()
            const monacoInstance: Ref<any> = ref()

            const editorContentSelectionState: Ref<boolean> = ref(false)

            const setEditorInstance = (
                editorInstanceParam: any,
                monacoInstanceParam?: any
            ) => {
                console.log(
                    editorInstanceParam,
                    monacoInstanceParam,
                    'settingInstance'
                )
                editorInstance.value = editorInstanceParam
                if (monacoInstanceParam)
                    monacoInstance.value = monacoInstanceParam
                console.log(editorInstanceParam, editorInstance, 'fxn')
            }

            const resetTree = ref(false)
            const resetParentGuid = ref(null)
            const resetType = ref(null)
            const refreshQueryTree = (guid, type) => {
                resetTree.value = true
                resetParentGuid.value = guid
                resetType.value = type
                // console.log('QueryTree refresh: ', resetTree.value)
            }
            const resetQueryTree = () => {
                resetTree.value = false
                resetParentGuid.value = null
                resetType.value = null
                // console.log('QueryTree reset: ', resetTree.value)
            }

            const assetSidebarUpdatedData = ref({})

            /* ---------- PROVIDERS FOR CHILDRENS -----------------
            ---Be careful to add a property/function otherwise it will pollute the whole flow for childrens--
            */

            const provideData: provideDataInterface = {
                activeInlineTab,
                queryCollections,
                queryCollectionsLoading,
                queryCollectionsError,
                activeInlineTabKey,
                inlineTabs: tabsArray,
                editorInstance,
                editorConfig,
                editorHoverConfig,
                monacoInstance,
                explorerPaneSize,
                outputPaneSize,
                fullSreenState,
                setEditorInstance,
                isCollectionCreatedByCurrentUser,
                hasCollectionReadPermission,
                hasCollectionWritePermission,
                isQueryCreatedByCurrentUser,
                hasQueryReadPermission,
                hasQueryWritePermission,
                activeTabCollection,
                editorContentSelectionState,
                refreshQueryTree,
                assetSidebarUpdatedData,
            }
            useProvide(provideData)
            /*-------------------------------------*/

            /* Watchers for syncing in localstorage */
            watch(activeInlineTabKey, () => {
                syncActiveInlineTabKeyInLocalStorage(activeInlineTabKey.value)
                syncInlineTabsInLocalStorage(tabsArray.value)
            })

            /* Watcher for all the things changes in activeInline tab */
            watch(
                () => activeInlineTab.value?.playground.vqb,
                () => {
                    syncInlineTabsInLocalStorage(tabsArray.value)
                },
                { deep: true }
            )

            watch(savedQueryInfo, () => {
                if (savedQueryInfo.value?.guid) {
                    openSavedQueryInNewTab({
                        ...savedQueryInfo.value,
                        parentTitle:
                            savedQueryInfo.value?.attributes?.parent?.attributes
                                ?.name,
                    })

                    // console.log('run query: ', savedQueryInfo.value)

                    if (runQuery.value === 'true') {
                        queryRun(
                            activeInlineTab,
                            getData,
                            limitRows,
                            null,
                            null,
                            savedQueryInfo.value?.attributes.rawQuery,
                            editorInstance,
                            monacoInstance,
                            showVQB
                        )
                    }
                }
            })
            watch(editorConfig, () => {
                console.log('editorConfig CHanged')
                setUserPreferenceToLocalStorage(editorConfig.value)
            })
            const _keyListener = (e) => {
                if (e.key === 'b') {
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault()
                        explorerPaneToggle(explorerPaneSize)
                    }
                    // prevent the default action
                }
                if (e.key === 'j') {
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault()
                        resultsPaneSizeToggle(outputPaneSize)
                    }
                    // prevent the default action
                }
                if (e.key === 'm') {
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault()
                        if (activeInlineTab.value) {
                            activeInlineTab.value.assetSidebar.isVisible =
                                !activeInlineTab.value.assetSidebar.isVisible
                        }
                    }
                    // prevent the default action
                }
            }

            const getData = (activeInlineTab, dataList, columnList) => {
                if (activeInlineTab && tabsArray?.value) {
                    const activeInlineTabCopy: activeInlineTabInterface =
                        JSON.parse(JSON.stringify(toRaw(activeInlineTab.value)))
                    activeInlineTabCopy.playground.editor.dataList = dataList

                    activeInlineTabCopy.playground.editor.columnList =
                        columnList
                    const saveQueryDataInLocalStorage = false
                    modifyActiveInlineTabEditor(
                        activeInlineTabCopy,
                        tabsArray,
                        saveQueryDataInLocalStorage
                    )
                    // setSelection(
                    //     toRaw(editorInstanceRef.value),
                    //     toRaw(monacoInstanceRef.value),
                    //     selectionObject.value
                    // )
                    // focusEditor(toRaw(editorInstanceRef.value))
                }
            }

            const limitRows = ref({
                checked: true,
                rowsCount: 100,
            })

            // FIXME: refactor it

            const detectQuery = () => {
                const queryTab: activeInlineTabInterface = {
                    key: generateUUID(),
                    label: `${tableNameFromURL} preview`,
                    isSaved: false,
                    queryId: undefined,
                    status: 'is_null',
                    connectionId: '',
                    description: '',
                    qualifiedName: '',
                    parentGuid: '',
                    parentQualifiedName: '',
                    isSQLSnippet: false,
                    savedQueryParentFolderTitle: undefined,
                    explorer: {
                        schema: {
                            connectors: {
                                attributeName: undefined,
                                attributeValue: undefined,
                            },
                        },
                        queries: {
                            connectors: {
                                connector: undefined,
                            },
                            collection: {
                                guid: '',
                                qualifiedName: undefined,
                                parentQualifiedName: undefined,
                            },
                        },
                    },
                    playground: {
                        isVQB: false,
                        vqb: {
                            selectedTables: [],
                            panels: [
                                {
                                    order: 1,
                                    id: 'columns',
                                    hide: false,
                                    subpanels: [
                                        {
                                            id: '1',
                                            tableQualifiedName: undefined,
                                            columns: ['all'],
                                            tableData: {
                                                certificateStatus: undefined,
                                                assetType: undefined,
                                                item: {},
                                            },
                                            columnsData: [],
                                        },
                                    ],
                                    expand: true,
                                },
                            ],
                        },
                        editor: {
                            text: '',
                            context: {
                                attributeName: undefined,
                                attributeValue: undefined,
                            },
                            dataList: [],
                            columnList: [],
                            variables: [],
                            savedVariables: [],
                            limitRows: {
                                checked: false,
                                rowsCount: -1,
                            },
                        },
                        resultsPane: {
                            activeTab: 0,
                            result: {
                                title: `Result`,
                                runQueryId: undefined,
                                isQueryRunning: '',
                                queryErrorObj: {},
                                totalRowsCount: -1,
                                executionTime: -1,
                                errorDecorations: [],
                                eventSourceInstance: undefined,
                                buttonDisable: false,
                                isQueryAborted: false,
                            },
                            metadata: {},
                            queries: {},
                            joins: {},
                            filters: {},
                            impersonation: {},
                            downstream: {},
                            sqlHelp: {},
                        },
                    },

                    favico: 'https://atlan.com/favicon.ico',
                    assetSidebar: {
                        isVisible: false,
                        assetInfo: {},
                        title: '',
                        id: '',
                    },
                }

                let newQuery
                if (columnNameFromURL) {
                    // newQuery = `\/* ${tableNameFromURL} preview *\/\nSELECT ${columnNameFromURL} FROM \"${tableNameFromURL}\" LIMIT 50;\n`
                    newQuery = `-- ${tableNameFromURL} preview \nSELECT ${columnNameFromURL} FROM \"${tableNameFromURL}\" LIMIT 50;\n`
                } else {
                    // newQuery = `\/* ${tableNameFromURL} preview *\/\nSELECT * FROM \"${tableNameFromURL}\" LIMIT 50;\n`
                    newQuery = `-- ${tableNameFromURL} preview \nSELECT * FROM \"${tableNameFromURL}\" LIMIT 50;\n`
                }

                const attributeName = 'schemaQualifiedName'
                const attributeValue = `${databaseQualifiedNameFromURL}/${schemaNameFromURL}`

                // const newText = `${newQuery}${prevText}`
                queryTab.playground.editor.text = newQuery

                queryTab.playground.editor.context = {
                    attributeName,
                    attributeValue,
                }

                queryTab.explorer.schema.connectors = {
                    attributeName,
                    attributeValue,
                }

                inlineTabAdd(queryTab, tabsArray, activeInlineTabKey)

                console.log('detect query: ', newQuery)
                queryRun(
                    activeInlineTab,
                    getData,
                    limitRows,
                    null,
                    null,
                    newQuery,
                    editorInstance,
                    monacoInstance
                )
            }

            const fetchQueryCollections = () => {
                const { data, error, isLoading, mutate } = getQueryCollections()
                refetchQueryCollection.value = mutate
                queryCollectionsLoading.value = true
                watch([data, error, isLoading], () => {
                    queryCollectionsLoading.value = true
                    if (isLoading.value === false) {
                        queryCollectionsLoading.value = false
                        if (error.value === undefined) {
                            console.log(
                                'queryCollections: ',
                                data.value.entities
                            )
                            if (
                                data.value?.entities &&
                                data.value?.entities?.length > 0
                            ) {
                                queryCollections.value = data.value.entities
                            } else {
                                queryCollections.value = []
                            }

                            console.log('collection create:')
                            if (activeInlineTab.value?.queryId) {
                                const queryParams = {
                                    id: activeInlineTab.value?.queryId,
                                }
                                router.push({
                                    path: `insights`,
                                    query: queryParams,
                                })
                            } else {
                                router.push({
                                    path: `insights`,
                                })
                            }

                            selectFirstCollectionByDefault(
                                queryCollections.value,
                                activeInlineTab,
                                tabsArray,
                                isCollectionCreated,
                                collectionGuidFromURL
                            )
                            queryCollectionsError.value = undefined
                        } else {
                            queryCollectionsLoading.value = false
                            queryCollectionsError.value = error.value

                            message.error({
                                content: `Error fetching collections`,
                            })
                        }
                    }
                })
            }

            onMounted(() => {
                fetchQueryCollections()
                window.addEventListener('keydown', _keyListener)

                if (
                    databaseQualifiedNameFromURL &&
                    schemaNameFromURL &&
                    tableNameFromURL
                ) {
                    console.log('url params: ', {
                        databaseQualifiedNameFromURL,
                        schemaNameFromURL,
                        tableNameFromURL,
                    })
                    // if (columnNameFromURL.value) {
                    // } else {
                    // }

                    detectQuery()
                }
            })
            const onResize = () => {
                console.log('resize')
                const offsetWidth = splitpaneRef?.value?.offsetWidth
                if (offsetWidth > EXPLORER_WIDTH) {
                    if (explorerPaneSize.value !== 0) {
                        explorerPaneSize.value =
                            (EXPLORER_WIDTH / offsetWidth) * 100 // calculating in percent for EXPLORER_WIDTH
                    }
                    currentNormalExplorerSize.value =
                        (EXPLORER_WIDTH / offsetWidth) * 100

                    minExplorerSize.value =
                        (MIN_EXPLORER_WIDTH / offsetWidth) * 100
                    maxExplorerSize.value =
                        (MAX_EXPLORER_WIDTH / offsetWidth) * 100
                }
                if (offsetWidth > ASSET_SIDEBAR_WIDTH + EXPLORER_WIDTH) {
                    assetSidebarPaneSize.value =
                        (ASSET_SIDEBAR_WIDTH / offsetWidth) * 100 // calculating in percent for ASSET_SIDEBAR_WIDTH
                }
            }
            onMounted(() => {
                const offsetWidth = splitpaneRef?.value?.offsetWidth
                observer.value = new ResizeObserver(onResize).observe(
                    splitpaneRef.value
                )
                if (offsetWidth > EXPLORER_WIDTH) {
                    currentNormalExplorerSize.value =
                        (EXPLORER_WIDTH / offsetWidth) * 100
                    explorerPaneSize.value =
                        (EXPLORER_WIDTH / offsetWidth) * 100 // calculating in percent for EXPLORER_WIDTH
                    minExplorerSize.value =
                        (MIN_EXPLORER_WIDTH / offsetWidth) * 100
                    maxExplorerSize.value =
                        (MAX_EXPLORER_WIDTH / offsetWidth) * 100
                }
                if (offsetWidth > ASSET_SIDEBAR_WIDTH + EXPLORER_WIDTH) {
                    assetSidebarPaneSize.value =
                        (ASSET_SIDEBAR_WIDTH / offsetWidth) * 100 // calculating in percent for ASSET_SIDEBAR_WIDTH
                }
            })
            onUpdated(() => {
                nextTick(() => {
                    const offsetWidth = splitpaneRef?.value?.offsetWidth
                    if (explorerPaneSize.value !== 0) {
                        explorerPaneSize.value =
                            (EXPLORER_WIDTH / offsetWidth) * 100
                    }
                    currentNormalExplorerSize.value =
                        (EXPLORER_WIDTH / offsetWidth) * 100
                    minExplorerSize.value =
                        (MIN_EXPLORER_WIDTH / offsetWidth) * 100
                    maxExplorerSize.value =
                        (MAX_EXPLORER_WIDTH / offsetWidth) * 100
                    assetSidebarPaneSize.value =
                        (ASSET_SIDEBAR_WIDTH / offsetWidth) * 100
                })
            })
            onUnmounted(() => {
                window.removeEventListener('keydown', _keyListener)
                observer?.value?.unobserve(splitpaneRef?.value)
            })

            const onDetectCollection = () => {
                activeTabId.value = 'queries'
                selectFirstCollectionByDefault(
                    queryCollections.value,
                    activeInlineTab,
                    tabsArray,
                    isCollectionCreated,
                    collectionGuidFromURL
                )
            }

            watch(
                [collectionGuidFromURL, queryCollections],
                () => {
                    if (
                        collectionGuidFromURL.value ||
                        savedQueryGuidFromURL.value
                    ) {
                        onDetectCollection()
                    }
                },
                { immediate: true }
            )

            // provide('refreshQueryTree', refreshQueryTree)
            // provide('resetQueryTree', resetQueryTree)

            return {
                minExplorerSize,
                maxExplorerSize,
                splitpaneRef,
                editorConfig,
                activeTab,
                activeTabId,
                tabsList,
                activeInlineTabKey,
                activeInlineTab,
                tabsArray,
                explorerPaneSize,
                assetSidebarPaneSize,
                paneResize,
                changeTab,
                resetTree,
                refreshQueryTree,
                resetQueryTree,
                resetParentGuid,
                resetType,
                sidebarPaneSize,
            }
        },
    })
</script>
<style lang="less" module>
    :global(.splitpanes__splitter) {
        background-color: #fff;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        position: relative;
        -ms-flex-negative: 0;
        z-index: 3 !important;
        flex-shrink: 0;
    }

    :global(.splitpanes--vertical > .splitpanes__splitter) {
        position: relative;
        box-sizing: border-box;
        position: relative;
        touch-action: none;
        border-right: 0px !important;
        // margin-right: -0.5px;
        // @apply border-r !important;
        border-width: 1px !important;
        // margin-left: -0.5px !important;
        &:hover {
            @apply bg-primary !important;
            &:before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                @apply bg-primary;
                -webkit-transition: background-color 0.3s;
                transition: background-color 0.3s;
                margin-left: 0px;
                transform: translateY(-50%) translateX(-35%);
                width: 2px;
                height: 101%;
                @apply z-50 !important;
            }
            &:after {
                content: '';
                position: absolute;
                top: 50%;
                left: -10%;
                @apply bg-transparent;
                -webkit-transition: background-color 0.3s;
                transition: background-color 0.3s;
                transform: translateY(-50%);
                width: 15px;
                height: 100%;
                margin-left: -8px;
                @apply z-50 !important;
            }
        }
        &:after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            @apply bg-transparent;
            transform: translateY(-50%);
            width: 10px;
            height: 100%;
            margin-left: 0px;
            @apply z-50 !important;
        }
    }
    // asset sidebar resize disabled
    :global(.splitpanes__splitter:nth-child(4)) {
        cursor: default !important;
        &:after {
            display: none !important;
            cursor: default !important;
        }
        &:hover {
            &:before {
                display: none !important;
                cursor: default !important;
            }
            &:after {
                display: none !important;
                cursor: default !important;
            }
        }
    }
    :global(.splitpanes--horizontal > .splitpanes__splitter) {
        position: relative;
        margin-top: -1px;
        box-sizing: border-box;
        position: relative;
        touch-action: none;
        @apply border-t !important;
        &:hover {
            // border-width: 1.5px !important;
            @apply bg-primary !important;
            &:before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                -webkit-transition: background-color 0.3s;
                transition: background-color 0.3s;
                margin-top: -2px;
                transform: translateX(-50%);
                width: 100%;
                height: 2px;
                @apply z-50 bg-primary !important;
            }
            &:after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                @apply z-50 bg-transparent !important;
                -webkit-transition: background-color 0.3s;
                transition: background-color 0.3s;
                margin-top: -2px;
                transform: translateX(-50%);
                width: 100%;
                height: 8px;
            }
        }
    }
</style>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .active-placeholder {
        @apply bg-primary;
    }
    .tabHeight {
        height: calc(100vh - 3rem);
    }
    .parent_splitpanes {
        width: calc(100vw - 3.75rem);
    }
    .explorer_splitpane {
        background-color: white;
    }
    .sidebar-nav-icon {
        padding-top: 16px;
        padding-bottom: 16px;
    }
    .sidebar-nav {
        /* 60px */
        width: 3.75rem;
    }
    .show-assetsidebar {
        // width: calc(100vw - 3.75rem - 420px);
    }
    .hide-assetsidebar {
        // width: calc(100vw - 3.75rem);
    }
    .full-width {
        width: 99.9%;
    }
    .assetSidebar {
        z-index: 51 !important;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
