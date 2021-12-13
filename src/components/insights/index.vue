<template>
    <div id="fullScreenId" class="flex h-full">
        <!--Sidebar navigation pane start -->
        <div class="bg-white border-r sidebar-nav">
            <template v-for="tab in tabsList" :key="tab.id">
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
                    <!-- <p
                        class="mt-1 mb-0 text-xs text-gray"
                        :class="activeTabId === tab.id ? 'text-primary' : ''"
                    >
                        {{ tab.name }}
                    </p> -->
                    <div
                        class="absolute top-0 right-0 h-full"
                        style="width: 3px"
                        :class="activeTabId === tab.id ? 'bg-primary' : ''"
                    ></div>
                </div>
            </template>
        </div>
        <!--Sidebar navigation pane end -->
        <splitpanes
            :class="$style.splitpane__styles"
            class="parent_splitpanes"
            @resize="paneResize"
        >
            <pane
                :max-size="24.5"
                :size="explorerPaneSize"
                :min-size="0"
                class="relative explorer_splitpane"
            >
                <!--explorer pane start -->
                <div
                    :class="activeTab.component === 'schema' ? 'z-30' : 'z-10'"
                    class="absolute h-full full-width"
                >
                    <Schema />
                </div>
                <div
                    :class="activeTab.component === 'queries' ? 'z-30' : 'z-10'"
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
                        activeTab.component === 'variables' ? 'z-30' : 'z-10'
                    "
                    class="absolute h-full full-width"
                >
                    <Variables />
                </div>
                <!--explorer pane end -->
            </pane>
            <pane
                :max-size="100"
                :size="
                    activeInlineTab?.assetSidebar?.isVisible
                        ? 100 - (explorerPaneSize + assetSidebarPaneSize)
                        : 100 - explorerPaneSize
                "
                :min-size="
                    activeInlineTab?.assetSidebar?.isVisible ? 50.5 : 75.5
                "
                :style="{ marginLeft: explorerPaneSize === 0 ? '-1px' : '0px' }"
            >
                <Playground
                    :active-inline-tab-key="activeInlineTabKey"
                    :refresh-query-tree="refreshQueryTree"
                />
            </pane>
            <pane
                :max-size="activeInlineTab?.assetSidebar?.isVisible ? 25 : 0"
                :min-size="0"
                :size="sidebarPaneSize"
            >
                <AssetSidebar />
            </pane>
        </splitpanes>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        computed,
        watch,
        inject,
        Ref,
        toRaw,
        onUnmounted,
        onMounted,
    } from 'vue'
    import { useRoute } from 'vue-router'
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
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'
    import { inlineTabsDemoData } from '~/components/insights/common/dummyData/demoInlineTabData'
    import { generateUUID } from '~/utils/helper/generator'

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
            const savedQueryInfo = inject('savedQueryInfo') as Ref<
                SavedQuery | undefined
            >
            const runQuery = inject('runQuery')

            const {
                explorerPaneSize,
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
            const { editorConfig, editorHoverConfig } = useEditorPreference()
            const { fullSreenState } = useFullScreen()
            const savedQueryGuidFromURL = ref(route.query?.id)

            const databaseQualifiedNameFromURL = inject(
                'databaseQualifiedNameFromURL'
            )
            const schemaNameFromURL = inject('schemaNameFromURL')
            const tableNameFromURL = inject('tableNameFromURL')
            const columnNameFromURL = inject('columnNameFromURL')

            const { queryRun } = useRunQuery()

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

            /* ---------- PROVIDERS FOR CHILDRENS -----------------
            ---Be careful to add a property/function otherwise it will pollute the whole flow for childrens--
            */
            const provideData: provideDataInterface = {
                activeInlineTab,
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
            }
            useProvide(provideData)
            /*-------------------------------------*/

            /* Watchers for syncing in localstorage */
            watch(activeInlineTabKey, () => {
                syncActiveInlineTabKeyInLocalStorage(activeInlineTabKey.value)
                syncInlineTabsInLocalStorage(tabsArray.value)
            })
            watch(savedQueryInfo, () => {
                if (savedQueryInfo.value?.guid) {
                    // const savedQueryInlineTab =
                    //     transformSavedQueryResponseInfoToInlineTab(
                    //         savedQueryInfo as Ref<SavedQuery>
                    //     )
                    // openSavedQueryInNewTab(savedQueryInfo.value)

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
                            monacoInstance
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

            const getData = (dataList, columnList) => {
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

            const demoTab: activeInlineTabInterface = inlineTabsDemoData[0]

            const detectQuery = () => {
                const queryTab: activeInlineTabInterface = {
                    key: generateUUID(),
                    label: `${tableNameFromURL} preview`,
                    isSaved: false,
                    queryId: undefined,
                    status: 'DRAFT',
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
                        vqb: {
                            panels: [
                                {
                                    order: 1,
                                    id: 'columns',
                                    hide: false,
                                    subpanels: [
                                        {
                                            id: '1',
                                            tableQualifiedName: undefined,
                                            columns: [],
                                            columnsData: [],
                                        },
                                    ],
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
                    newQuery = `\/* ${tableNameFromURL} preview *\/\nSELECT ${columnNameFromURL} FROM \"${tableNameFromURL}\" LIMIT 50;\n`
                } else {
                    newQuery = `\/* ${tableNameFromURL} preview *\/\nSELECT * FROM \"${tableNameFromURL}\" LIMIT 50;\n`
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

            onMounted(() => {
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
            onUnmounted(() => {
                window.removeEventListener('keydown', _keyListener)
            })

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

            // provide('refreshQueryTree', refreshQueryTree)
            // provide('resetQueryTree', resetQueryTree)

            return {
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
    // :global(.splitpanes--horizontal > .splitpanes__splitter) {
    //     position: relative;
    //     margin-top: -1px;
    //     box-sizing: border-box;
    //     position: relative;
    //     touch-action: none;
    //     border-width: 1.5px !important;
    //     @apply border-t !important;
    //     &:hover {
    //         // @apply border-primary;
    //         // border-width: 2px !important;
    //     }
    // }

    // :global(.splitpanes--horizontal > .splitpanes__splitter):before {
    //     content: '';
    //     position: absolute;
    //     top: 50%;
    //     left: 50%;
    //     background-color: rgba(0, 0, 0, 0.15);
    //     -webkit-transition: background-color 0.3s;
    //     transition: background-color 0.3s;
    //     margin-top: -2px;
    //     transform: translateX(-50%);
    //     width: 30px;
    //     height: 1px;
    // }
    // :global(.splitpanes--horizontal > .splitpanes__splitter):after {
    //     // content: '';
    //     position: absolute;
    //     top: 50%;
    //     left: 50%;
    //     background-color: rgba(0, 0, 0, 0.15);
    //     -webkit-transition: background-color 0.3s;
    //     transition: background-color 0.3s;

    //     transform: translateX(-50%);
    //     width: 30px;
    //     height: 1px;

    //     margin-top: 1px;
    // }
    // :global(.splitpanes--horizontal > .splitpanes__splitter):hover:before {
    //     @apply bg-primary !important;
    // }
    // :global(.splitpanes--horizontal > .splitpanes__splitter):hover:after {
    //     @apply bg-primary !important;
    // }
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
        width: 20.75rem;
        background-color: white;
    }
    // .sidebar-nav-icon:first-child {
    //     @apply pt-2 !important;
    // }
    .sidebar-nav-icon {
        padding-top: 16px;
        padding-bottom: 16px;
    }
    .sidebar-nav {
        /* 60px */
        width: 3.75rem;
    }
    .full-width {
        width: 99.9%;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
