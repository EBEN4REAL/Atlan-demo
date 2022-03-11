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
                            :icon="`${tab.icon}`"
                            class="w-6 h-6"
                            :color="
                                activeTabId === tab.id ? '#5277D7' : '#6f7590'
                            "
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
        <div ref="splitpaneRef" :class="$style.splitpane_insights">
            <splitpanes
                class="parent_splitpanes"
                :class="[
                    activeInlineTab?.assetSidebar?.isVisible
                        ? 'show-assetsidebar'
                        : 'hide-assetsidebar',
                ]"
                @resize="paneResize"
                :dbl-click-splitter="false"
            >
                <pane
                    :max-size="maxExplorerSize"
                    :size="explorerPaneSize"
                    :min-size="minExplorerSize"
                    class="relative explorer_splitpane vertical_pane"
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
                        <!-- <Variables /> -->
                        <History />
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
                    class="vertical_pane"
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
                    class="assetSidebar vertical_pane"
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
    import History from './explorers/history/index.vue'
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
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'
    import { generateUUID } from '~/utils/helper/generator'
    import useQueryCollection from '~/components/insights/explorers/queries/composables/useQueryCollection'
    import { message } from 'ant-design-vue'
    import useCollectionAccess from '~/components/insights/explorers/queries/composables/useCollectionAccess'
    import useActiveQueryAccess from '~/components/insights/explorers/queries/composables/useActiveQueryAccess'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import { getDialectInfo } from '~/components/insights/common/composables/getDialectInfo'
    import { useQuery } from '~/components/insights/common/composables/useQuery'

    import { useRunQueryUtils } from '~/components/insights/common/composables/useRunQueryUtils'
    import { instances } from '~/components/insights/playground/editor/monaco/useMonaco'

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
            History,
            Schedule,
        },
        props: {},
        setup(props) {
            const observer = ref()
            const splitpaneRef = ref()
            const showcustomToolBar = ref(false) // custom variables toolbar
            const refetchQueryNode = ref({
                guid: '',
            }) // for triggering the refetch node function in query explorer from playground

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
            const collectionSelectorChange = ref(false)

            const {
                MIN_EXPLORER_WIDTH,
                MAX_EXPLORER_WIDTH,
                ASSET_SIDEBAR_WIDTH,
                EXPLORER_WIDTH,
                assetSidebarPaneSize,
                paneResize,
            } = useSpiltPanes()
            const { getDetectQueryTab } = useQuery()
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
                readAccessCollections,
                writeAccessCollections,
                queryCollectionsLoading,
                selectFirstCollectionByDefault,
                // selectCollectionFromUrl,
            } = useQueryCollection()
            const { editorConfig, editorHoverConfig } = useEditorPreference()
            const { getConnectorName } = useConnector()
            const { fullSreenState } = useFullScreen()
            const savedQueryGuidFromURL = ref(route.query?.id)

            const databaseQualifiedNameFromURL = inject(
                'databaseQualifiedNameFromURL'
            )
            const schemaNameFromURL = inject('schemaNameFromURL')
            const tableNameFromURL = inject('tableNameFromURL')
            const columnNameFromURL = inject('columnNameFromURL')

            const openVQB = inject('openVQB')

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
                setActiveExplorerTab,
                getActiveExplorerTab,
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
                fetchSelectedCollectionData,
                isCollectionCreatedByCurrentUser,
                hasCollectionReadPermission,
                hasCollectionWritePermission,
            } = useCollectionAccess(activeInlineTab, collectionSelectorChange)

            const {
                fetchActiveQueryAcessCollection,
                isQueryCreatedByCurrentUser,
                hasQueryReadPermission,
                hasQueryWritePermission,
                activeTabCollection,
            } = useActiveQueryAccess(activeInlineTab)

            fetchActiveQueryAcessCollection()
            fetchSelectedCollectionData()

            const sidebarPaneSize = computed(() =>
                activeInlineTab.value?.assetSidebar?.isVisible
                    ? assetSidebarPaneSize.value
                    : 0
            )
            const activeTabId = ref(getActiveExplorerTab() || tabsList[0].id)

            const activeTab = computed(() =>
                tabsList.find((tab) => tab.id === activeTabId.value)
            )

            const changeTab = (tab: TabInterface) => {
                console.log('new tab', tab)
                activeTabId.value = tab.id
                setActiveExplorerTab(tab.id)
            }
            const editorInstance: Ref<any> = ref()
            const monacoInstance: Ref<any> = ref()

            const { onRunCompletion, onQueryIdGeneration } = useRunQueryUtils(
                editorInstance,
                monacoInstance
            )

            const editorContentSelectionState: Ref<boolean> = ref(false)

            const limitRows = ref({
                checked: true,
                rowsCount: 100,
            })

            const setEditorInstance = (
                editorInstanceParam: any,
                monacoInstanceParam?: any
            ) => {
                instances.monaco = monacoInstanceParam
                instances.editor = editorInstanceParam
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
            const updateAssetCheck = ref(false)

            /* ---------- PROVIDERS FOR CHILDRENS -----------------
            ---Be careful to add a property/function otherwise it will pollute the whole flow for childrens--
            */

            const provideData: provideDataInterface = {
                showcustomToolBar,
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
                readAccessCollections,
                writeAccessCollections,
                limitRows: limitRows,
                updateAssetCheck,
                collectionSelectorChange,
                refetchQueryNode,
            }
            useProvide(provideData)
            /*-------------------------------------*/

            /* Watchers for syncing in localstorage */
            watch(
                activeInlineTabKey,
                (newKey) => {
                    syncActiveInlineTabKeyInLocalStorage(
                        activeInlineTabKey.value
                    )
                    syncInlineTabsInLocalStorage(toRaw(tabsArray.value))
                    fetchSelectedCollectionData()
                    fetchActiveQueryAcessCollection()
                    const index = tabsArray.value.findIndex(
                        (tab) => tab.key === newKey
                    )
                    if (index > -1) {
                        if (tabsArray.value[index].playground.isVQB) {
                            showcustomToolBar.value = false
                        }
                    }
                },
                { deep: true }
            )

            /* Watcher for all the things changes in activeInline tab */
            watch(
                () => activeInlineTab.value?.playground.vqb,
                () => {
                    console.log('editor data')
                    syncInlineTabsInLocalStorage(toRaw(tabsArray.value))
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

                    selectFirstCollectionByDefault(
                        queryCollections.value,
                        activeInlineTab,
                        tabsArray,
                        false,
                        undefined
                    )

                    // console.log('run query: ', savedQueryInfo.value)

                    const activeInlineTabKeyCopy = activeInlineTabKey.value

                    const tabIndex = tabsArray.value.findIndex(
                        (tab) => tab.key === activeInlineTabKeyCopy
                    )

                    if (
                        tabsArray.value[tabIndex].playground.editor?.variables
                            ?.length > 0 &&
                        !tabsArray.value[tabIndex].playground.isVQB
                    ) {
                        showcustomToolBar.value = true
                    }

                    if (runQuery.value === 'true') {
                        queryRun(
                            tabIndex,
                            getData,
                            limitRows,
                            onRunCompletion,
                            onQueryIdGeneration,
                            savedQueryInfo.value?.attributes.rawQuery,
                            editorInstance,
                            monacoInstance,
                            showVQB,
                            tabsArray
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
                        resultsPaneSizeToggle(activeInlineTab, tabsArray)
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

            const getData = (
                activeInlineTab,
                dataList,
                columnList,
                executionTime,
                index
            ) => {
                if (activeInlineTab && tabsArray?.value) {
                    // const activeInlineTabCopy: activeInlineTabInterface =
                    //     JSON.parse(JSON.stringify(toRaw(activeInlineTab.value)))
                    tabsArray.value[index].playground.editor.dataList = dataList
                    tabsArray.value[index].playground.editor.columnList =
                        columnList
                    // const saveQueryDataInLocalStorage = false
                    // modifyActiveInlineTabEditor(
                    //     activeInlineTabCopy,
                    //     tabsArray,
                    //     false,
                    //     saveQueryDataInLocalStorage
                    // )
                }
            }

            const detectQuery = () => {
                const queryTab = getDetectQueryTab({
                    databaseQualifiedNameFromURL,
                    schemaNameFromURL,
                    tableNameFromURL,
                    openVQB,
                    columnNameFromURL,
                    activeInlineTab,
                })

                inlineTabAdd(queryTab, tabsArray, activeInlineTabKey)
                let vqb = openVQB === 'true' ? true : false
                const activeInlineTabKeyCopy = activeInlineTabKey.value

                const tabIndex = tabsArray.value.findIndex(
                    (tab) => tab.key === activeInlineTabKeyCopy
                )
                if (
                    tabsArray.value[tabIndex].playground.editor?.variables
                        ?.length > 0 &&
                    !tabsArray.value[tabIndex].playground.isVQB
                ) {
                    showcustomToolBar.value = true
                }
                queryRun(
                    tabIndex,
                    getData,
                    limitRows,
                    onRunCompletion,
                    onQueryIdGeneration,
                    queryTab.playground.editor.text,
                    editorInstance,
                    monacoInstance,
                    ref(vqb),
                    tabsArray
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
                            if (
                                data.value?.entities &&
                                data.value?.entities?.length > 0
                            ) {
                                queryCollections.value = data.value.entities
                            } else {
                                queryCollections.value = []
                            }

                            if (!savedQueryGuidFromURL) {
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
                const horizontalSplitpaneElements =
                    document.getElementsByClassName('horizontal_splitpane')

                const verticalSplitpaneElements =
                    document.getElementsByClassName('vertical_pane')

                setTimeout(() => {
                    Array.from(horizontalSplitpaneElements).forEach((el) => {
                        el.style.transition = 'height .2s ease-out'
                    })
                    Array.from(verticalSplitpaneElements).forEach((el) => {
                        el.style.transition = 'width .2s ease-out'
                    })
                }, 100)
                fetchQueryCollections()
                window.addEventListener('keydown', _keyListener)

                if (
                    databaseQualifiedNameFromURL &&
                    schemaNameFromURL &&
                    tableNameFromURL
                ) {
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
    .splitpane_insights {
        :global(.splitpanes__splitter) {
            background-color: #fff;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            position: relative;
            -ms-flex-negative: 0;
            z-index: 3 !important;
            flex-shrink: 0;
        }
        :global(.splitpanes--vertical .splitpanes__pane) {
            transition: none;
        }

        :global(.splitpanes--vertical > .splitpanes__splitter) {
            position: relative;
            touch-action: none;
            border-width: 0.5px !important;
            &:before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                // transition: opacity 0.4s;
                @apply bg-primary;
                opacity: 0;
                z-index: 1;
                left: -1px;
                right: -1px;
                height: 100%;
            }

            &:hover {
                &:before {
                    opacity: 1;
                    width: 2.5px !important;
                }
            }
            &:after {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                opacity: 0;
                z-index: 1;
                left: -8px;
                right: -8px;
                height: 100%;
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
    }
</style>
<style lang="less" scoped>
    // .placeholder {
    //     background-color: #f4f4f4;
    // }
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
