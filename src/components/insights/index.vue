<template>
    <div id="fullScreenId" class="flex h-full overflow-x-hidden">
        <div class="absolute">
            <div class="text-transparent plex-mono">s</div>
            <div class="text-transparent plex-mono-medium">s</div>
        </div>
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
                    <a-tabs
                        v-model:activeKey="activeTabId"
                        :class="$style.previewtab"
                        :style="'height: calc(100%)'"
                        tab-position="top"
                        @change="changeTab"
                    >
                        <a-tab-pane
                            v-for="tab in tabsList"
                            :key="tab.id"
                            :destroy-inactive-tab-pane="false"
                            :class="
                                tab.id === activeTabId ? 'flex flex-col' : ''
                            "
                        >
                            <template #tab>
                                <div
                                    class="flex flex-row items-center px-3 py-1 flex-grow-1"
                                    :class="
                                        tab.id === activeTabId
                                            ? 'active-tab-indicator'
                                            : ''
                                    "
                                    @click="() => changeTab(tab.id)"
                                >
                                    <AtlanIcon
                                        v-if="tab?.icon"
                                        :icon="`${tab.icon}`"
                                        class="w-4 h-4"
                                        :color="
                                            activeTabId === tab.id
                                                ? '#225BD2'
                                                : '#6A7692'
                                        "
                                    />
                                    <div
                                        :class="
                                            activeTabId === tab.id
                                                ? 'active-tab'
                                                : 'inactive-tab'
                                        "
                                        class="nav-text"
                                    >
                                        {{ tab.name }}
                                    </div>
                                </div>
                            </template>
                            <keep-alive>
                                <component
                                    :is="tab.component"
                                    :key="tab.id"
                                    :reset="resetTree"
                                    :reset-query-tree="resetQueryTree"
                                    :reset-parent-guid="resetParentGuid"
                                    :reset-type="resetType"
                                    :refresh-query-tree="refreshQueryTree"
                                ></component>
                            </keep-alive>
                        </a-tab-pane>
                    </a-tabs>
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
        defineAsyncComponent,
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
    import insightsStore from '~/store/insights/index'
    import { assetInterface } from '~/types/assets/asset.interface'

    import { useRunQueryUtils } from '~/components/insights/common/composables/useRunQueryUtils'
    import { instances } from '~/components/insights/playground/editor/monaco/useMonaco'
    import { Splitpanes, Pane } from '~/components/common/splitpanes/index'
    import {
        explorerPaneSize,
        minExplorerSize,
        maxExplorerSize,
        currentNormalExplorerSize,
    } from './common/composables/useSpiltPanes'
    export default defineComponent({
        components: {
            Splitpanes,
            Pane,
            Playground,
            AssetSidebar,
            schema: defineAsyncComponent(
                () => import('./explorers/schema/index.vue')
            ),
            queries: defineAsyncComponent(
                () => import('./explorers/queries/index.vue')
            ),
            schedule: defineAsyncComponent(
                () => import('./explorers/schedule/index.vue')
            ),
            history: defineAsyncComponent(
                () => import('./explorers/history/index.vue')
            ),
        },
        props: {},
        setup(props) {
            // insights Store initialization
            const store = insightsStore()
            const UrlDetectedAsset = ref()
            const lastPreviewTabElement = ref()
            const refreshSchedulesWorkflowTab = ref()
            const activeKey = ref(0)
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
            const activeResultPreviewTab = ref(false)

            const {
                MIN_EXPLORER_WIDTH,
                MAX_EXPLORER_WIDTH,
                ASSET_SIDEBAR_WIDTH,
                EXPLORER_WIDTH,
                assetSidebarPaneSize,
                paneResize,
            } = useSpiltPanes()
            const { getDetectQueryTab, getAssetInfo } = useQuery()
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
            const assetGuidFromURL = inject('assetGuidFromURL')

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
            } = useInlineTab(undefined, true)

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
            const getActiveExplorerTabId =
                getActiveExplorerTab() &&
                tabsList.find((tab) => tab.id === getActiveExplorerTab())?.id
            const activeTabId = ref(getActiveExplorerTabId || tabsList[0].id)

            const activeTab = computed(() =>
                tabsList.find((tab) => tab.id === activeTabId.value)
            )

            const changeTab = (tabId: string) => {
                // activeTabId.value = tab.id
                setActiveExplorerTab(tabId)
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
                lastPreviewTabElement,
                activeResultPreviewTab,
                activeExplorerTabId: activeTabId,
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
                refreshSchedulesWorkflowTab,
                UrlDetectedAsset,
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
                // debugger
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
                if (e.key === 'ArrowDown') {
                    console.log('ARROW DOWNNNNNNN')
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
                const callbackFunc = (asset: assetInterface) => {
                    UrlDetectedAsset.value = asset
                    // setting tab to schema explorer

                    if (activeTabId.value !== 'schema') {
                        activeTabId.value = 'schema'
                    }
                }
                getAssetInfo({
                    assetGuidFromURL,
                    tabsArray,
                    key: queryTab.key,
                    cb: callbackFunc,
                })
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

            const fetchQueryCollections = ({
                selectOneByDefault,
            }: {
                selectOneByDefault: boolean
            }) => {
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
                            if (selectOneByDefault) {
                                selectFirstCollectionByDefault(
                                    queryCollections.value,
                                    activeInlineTab,
                                    tabsArray,
                                    isCollectionCreated,
                                    collectionGuidFromURL
                                )
                            }

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
                fetchQueryCollections({ selectOneByDefault: true })
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
                activeKey,
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
    html {
        --duration: 0.1s;
        --durationAnimation: 0.2s;
    }

    .splitpane_insights {
        :global(.splitpanes__splitter) {
            @apply bg-new-gray-100;
            // background-color: #fff;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            position: relative;
            -ms-flex-negative: 0;
            z-index: 3 !important;
            flex-shrink: 0;
            @apply border-new-gray-300;
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
    .previewtab {
        &:global(.ant-tabs-top) {
            :global(.ant-tabs-nav) {
                margin: 0 !important;
                height: 40px !important;
                order: 0 !important;
                // min-width: 60px !important;
                // @apply border-r border-b border-gray-300  !important;
            }
            :global(.ant-tabs-nav-wrap) {
                justify-content: center;
                position: relative;
                top: -1px;
                width: 100%;
            }

            :global(.ant-tabs-nav::before) {
                @apply border-new-gray-300 !important;
            }
            :global(.ant-tabs-nav-list .ant-tabs-tab:not(:first-child)) {
                // margin-left: 16px !important;
                margin-left: 0 !important;
            }
            :global(.ant-tabs-nav-list) {
                display: flex;
                position: relative;
                align-items: center;

                justify-content: center;
                width: 100%;
                @apply px-8;
            }

            :global(.ant-tabs-ink-bar) {
                // display: none;
                @apply bg-white rounded-md;
                height: 28px;
                bottom: 6px;
                z-index: -1;
                box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.16);
                transition: width var(--durationAnimation),
                    left var(--durationAnimation),
                    right var(--durationAnimation);
            }

            :global(.ant-tabs-tab) {
                flex-grow: 1;
                display: flex;
                position: relative;
                align-items: center;
                justify-content: center;
                min-width: 30%;

                // When query history tab or any other tab comes in to make total tab count 4
                // min-width: 20%;
            }
            :global(.ant-tabs-tab-active) {
                flex-grow: 2.2;
            }
        }
    }
</style>

<style lang="less">
    .plex-mono {
        font-family: PlexMono !important;
    }
    .plex-mono-medium {
        font-family: PlexMono !important;
        font-weight: bold;
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
        @apply bg-new-gray-100;
    }
    .sidebar-nav-icon {
        padding-top: 16px;
        padding-bottom: 16px;
    }
    .sidebar-nav {
        /* 60px */
        width: 120px;
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
    .active-tab-indicator {
        // @apply bg-white rounded-md;
        // box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.16);
    }
    .active-tab {
        display: block;
        margin-left: 6px;
        position: relative;
        // top: 0.5px !important;
        color: #225bd2;
        @apply h-5;
        // animation: fadeIn ease 1s;
    }
    .inactive-tab {
        display: none;
        color: #6a7692;
        animation: fadeOut ease 2s;
    }

    .nav-text {
        animation: fadeIn ease var(--durationAnimation);
    }
    @keyframes fadeIn {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    @keyframes fadeOut {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
