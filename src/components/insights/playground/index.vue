<template>
    <div
        class="flex flex-col w-full h-full bg-white"
        :style="
            fullSreenState ? 'height: calc( 100vh - 40px )' : 'height:100vh'
        "
    >
        <div class="relative flex flex-col bg-gray-light">
            <div class="flex w-full text-gray">
                <a-tabs
                    v-model:activeKey="activeInlineTabKey"
                    :class="$style.inline_tabs"
                    hide-add
                    type="editable-card"
                    class="insights-tabs"
                    @change="onTabClick"
                    @edit="onEdit"
                >
                    <template #rightExtra>
                        <div class="inline-flex items-center ml-1 mr-2">
                            <a-tooltip placement="top">
                                <template #title>New query</template>
                                <span
                                    class="inline-flex items-center justify-center p-0.5 rounded-sm btn-add cross-hover mt-1"
                                    @click="handleAdd"
                                >
                                    <!-- <fa icon="fal plus" class="text-gray-700" /> -->
                                    <AtlanIcon icon="Add" />
                                </span>
                            </a-tooltip>
                        </div>
                    </template>

                    <a-tab-pane
                        v-for="tab in tabs"
                        :key="tab.key"
                        :closable="true"
                    >
                        <template #tab>
                            <a-dropdown
                                :trigger="['click']"
                                :visible="
                                    unsavedPopover.show &&
                                    unsavedPopover.key === tab.key
                                "
                            >
                                <div
                                    class="flex items-center inline_tab"
                                    :style="{
                                        width:
                                            tabs.length == 1 ? '65px' : '49px',
                                        'max-width':
                                            tabs.length == 1 ? '65px' : '49px',
                                    }"
                                    @mouseenter="setTabHover(tab)"
                                    @mouseleave="setTabHover(null)"
                                >
                                    <div
                                        class="flex items-center text-gray-700"
                                    >
                                        <span
                                            class="text-sm inline_tab_label"
                                            :class="
                                                tab.key !== activeInlineTabKey
                                                    ? 'text-gray-500'
                                                    : ''
                                            "
                                            >{{ tab.label }}</span
                                        >
                                    </div>
                                    <div
                                        v-if="!tab.isSaved"
                                        class="flex items-center unsaved-dot"
                                    >
                                        <div
                                            v-if="
                                                tab.playground.editor.text
                                                    .length > 0 || tab?.queryId
                                            "
                                            class="w-1.5 h-1.5 rounded-full bg-primary absolute right-3"
                                        ></div>
                                    </div>
                                </div>
                                <template #overlay>
                                    <a-menu>
                                        <UnsavedPopover
                                            @closeTab="closeTabConfirm"
                                            @closePopup="closePopOver"
                                            @saveTab="
                                                () => saveTabConfirm(tab.key)
                                            "
                                            :unsavedPopover="unsavedPopover"
                                            :isSaving="isSaving"
                                        />
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </template>

                        <template #closeIcon>
                            <AtlanIcon
                                v-if="tabs.length >= 2"
                                icon="Close"
                                class="w-4 h-4 rounded-sm cross-hover"
                                :style="{
                                    opacity: tabHover === tab.key ? 1 : 0,
                                }"
                                @mouseenter="setTabHover(tab)"
                                @mouseleave="setTabHover(null)"
                            />
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>

        <div
            v-if="activeInlineTabKey"
            class="w-full"
            style="max-height: 100%; min-height: 92%"
        >
            <splitpanes horizontal :push-other-panes="false">
                <pane
                    :max-size="100"
                    :size="100 - outputPaneSize"
                    min-size="30"
                    class="overflow-x-hidden"
                >
                    <Editor :refreshQueryTree="refreshQueryTree" />
                </pane>
                <pane min-size="0" :size="outputPaneSize" max-size="70">
                    <ResultsPane />
                </pane>
            </splitpanes>
        </div>
        <ResultPaneFooter v-if="activeInlineTabKey" />
        <NoActiveInlineTab @handleAdd="handleAdd" v-else />
        <SaveQueryModal
            v-model:showSaveQueryModal="showSaveQueryModal"
            :saveQueryLoading="saveQueryLoading"
            :ref="
                (el) => {
                    saveModalRef = el
                }
            "
            :connector="
                activeInlineTab?.explorer?.queries?.connectors?.connector
            "
            @onSaveQuery="saveQueryOnCloseTab"
        />
    </div>
</template>

<script lang="ts">
    import {
        watch,
        ComputedRef,
        defineComponent,
        computed,
        Ref,
        inject,
        ref,
    } from 'vue'
    import Editor from '~/components/insights/playground/editor/index.vue'
    import ResultsPane from '~/components/insights/playground/resultsPane/index.vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import NoActiveInlineTab from './noActiveInlineTab.vue'
    import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import SaveQueryModal from '~/components/insights/playground/editor/saveQuery/index.vue'
    import UnsavedPopover from '~/components/insights/common/unsavedPopover/index.vue'
    import { useUtils } from '~/components/insights/common/composables/useUtils'
    import ResultPaneFooter from '~/components/insights/playground/resultsPane/result/resultPaneFooter.vue'
    import { useRouter, useRoute } from 'vue-router'
    import { generateUUID } from '~/utils/helper/generator'
    // import { useHotKeys } from '~/components/insights/common/composables/useHotKeys'

    export default defineComponent({
        components: {
            Editor,
            ResultsPane,
            NoActiveInlineTab,
            UnsavedPopover,
            SaveQueryModal,
            ResultPaneFooter,
        },
        props: {
            activeInlineTabKey: {
                type: String,
                required: true,
            },
            refreshQueryTree: {
                type: Function,
            },
        },
        setup(props, { emit }) {
            const route = useRoute()
            const fullSreenState = inject('fullSreenState') as Ref<boolean>
            const router = useRouter()
            const isSaving = ref(false)
            const showSaveQueryModal = ref(false)
            const saveCloseTabKey = ref()
            const saveQueryLoading = ref(false)
            const saveModalRef = ref()
            const saveQueryData = ref()

            const { queryRun } = useRunQuery()
            const { getFirstQueryConnection } = useUtils()
            const { inlineTabRemove, inlineTabAdd, setActiveTabKey } =
                useInlineTab()

            const unsavedPopover = ref({
                show: false,
                key: undefined,
            })
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const outputPaneSize = inject('outputPaneSize') as Ref<number>
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const editorInstance = inject('editorInstance') as Ref<any>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>
            const isActiveInlineTabSaved = computed(
                () => activeInlineTab.value.isSaved
            )
            const { updateSavedQuery, saveQueryToDatabase } = useSavedQuery(
                tabs,
                activeInlineTab,
                activeInlineTabKey
            )
            const checkIfItsAFirstTab = () => {
                if (tabs.value.length < 1) return true
                return false
            }
            const getLastUntitledNumber = () => {
                let max_number = 1
                const untitledRegex = /(?:Untitled )([0-9]+)/gim
                tabs.value?.forEach((tab) => {
                    const d = [...tab.label.matchAll(untitledRegex)]
                    if (d.length > 0) {
                        max_number = Math.max(Number(d[0][1]) + 1, 1)
                    }
                })
                return max_number
            }

            const handleAdd = () => {
                // const key = String(new Date().getTime())
                const key = generateUUID()
                const inlineTabData: activeInlineTabInterface = {
                    label: `Untitled ${getLastUntitledNumber()}`,
                    key,
                    favico: 'https://atlan.com/favicon.ico',
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
                    collectionQulaifiedName: '',
                    explorer: {
                        schema: {
                            connectors: {
                                attributeName:
                                    activeInlineTab.value?.explorer?.schema
                                        ?.connectors?.attributeName,
                                attributeValue:
                                    activeInlineTab.value?.explorer?.schema
                                        ?.connectors?.attributeValue,
                            },
                        },
                        queries: {
                            connectors: {
                                connector:
                                    activeInlineTab.value?.explorer?.queries
                                        .connectors.connector,
                            },
                            collection: {
                                guid: activeInlineTab.value?.explorer?.queries
                                    ?.collection?.guid,
                                qualifiedName:
                                    activeInlineTab.value?.explorer?.queries
                                        ?.collection?.qualifiedName,
                                parentQualifiedName:
                                    activeInlineTab.value?.explorer?.queries
                                        ?.collection?.guid,
                            },
                        },
                    },

                    playground: {
                        vqb: {
                            panels: [
                                {
                                    order: 1,
                                    id: 'columns',
                                    hide: true,
                                    columns: [],
                                    columnsData: [],
                                },
                            ],
                        },
                        editor: {
                            context: {
                                attributeName:
                                    activeInlineTab.value?.playground?.editor
                                        ?.context?.attributeName,
                                attributeValue:
                                    activeInlineTab.value?.playground?.editor
                                        ?.context?.attributeValue,
                            },
                            text: '',
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
                            activeTab:
                                activeInlineTab.value?.playground?.resultsPane
                                    ?.activeTab ?? 0,
                            result: {
                                title: `${key} Result`,
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
                    assetSidebar: {
                        // for taking the previous state from active tab
                        openingPos: undefined,
                        isVisible: false,
                        assetInfo: {},
                        title: activeInlineTab.value?.assetSidebar.title ?? '',
                        id: activeInlineTab.value?.assetSidebar.id ?? '',
                    },
                }

                inlineTabAdd(inlineTabData, tabs, activeInlineTabKey)
                const queryParams = {}
                if (route?.query?.vqb) queryParams.vqb = true
                router.push({ path: `insights`, query: queryParams })
            }
            const pushGuidToURL = (guid: string | undefined) => {
                const queryParams = {}
                if (route?.query?.vqb) queryParams.vqb = true
                if (guid) {
                    queryParams.id = guid
                    router.push({ path: `insights`, query: queryParams })
                } else {
                    router.push({ path: `insights`, query: queryParams })
                }
            }
            const onTabClick = (activeKey) => {
                setActiveTabKey(activeKey, activeInlineTabKey)
                pushGuidToURL(activeInlineTab.value?.queryId)
            }
            const onEdit = (targetKey: string | MouseEvent, action: string) => {
                if (action === 'add') {
                    handleAdd()
                } else {
                    /* For closing the tab */
                    console.log(targetKey)
                    let crossedTabState: boolean = false
                    tabs.value.forEach((tab) => {
                        if (tab.key === targetKey) {
                            crossedTabState = tab.isSaved
                        }
                    })
                    /* If it is unsaved then show popover confirm */
                    if (!crossedTabState) {
                        /* If content is empty */
                        const tab = tabs.value.find(
                            (tab) => tab.key === targetKey
                        )
                        if (tab?.playground?.editor?.text?.length > 0) {
                            unsavedPopover.value.key = targetKey as string
                            unsavedPopover.value.show = true
                        } else {
                            /* Delete the tab if content is empty */
                            inlineTabRemove(
                                targetKey as string,
                                tabs,
                                activeInlineTabKey,
                                pushGuidToURL
                            )
                        }
                    } else {
                        inlineTabRemove(
                            targetKey as string,
                            tabs,
                            activeInlineTabKey,
                            pushGuidToURL
                        )
                    }
                }
            }
            const openSaveQueryModal = () => {
                showSaveQueryModal.value = true
            }
            const closeTabConfirm = (key: string) => {
                console.log(key, 'close')
                inlineTabRemove(
                    key as string,
                    tabs,
                    activeInlineTabKey,
                    pushGuidToURL
                )
                unsavedPopover.value.key = undefined
                unsavedPopover.value.show = false
            }
            const closePopOver = () => {
                if (unsavedPopover?.value?.show) {
                    unsavedPopover.value.key = undefined
                    unsavedPopover.value.show = false
                }
            }

            const saveQueryOnCloseTab = (saveQueryDataParam: any) => {
                saveQueryData.value = saveQueryDataParam
                const key = saveCloseTabKey.value
                let tabData: activeInlineTabInterface | undefined
                tabs.value.forEach((tab) => {
                    if (tab.key === key) {
                        tabData = tab
                    }
                })
                const tabRemoveCallbackFunction = (error: any) => {
                    if (!error) {
                        inlineTabRemove(
                            key as string,
                            tabs,
                            activeInlineTabKey,
                            pushGuidToURL
                        )
                        saveCloseTabKey.value = undefined
                    }
                }
                if (saveQueryData.value) {
                    saveQueryToDatabase(
                        saveQueryData.value,
                        saveQueryLoading,
                        showSaveQueryModal,
                        saveModalRef,
                        router,
                        route,
                        'personal',
                        saveQueryData.value.parentQF,
                        saveQueryData.value.parentGuid,
                        tabData as activeInlineTabInterface,
                        tabRemoveCallbackFunction,
                        false
                    )
                    props.refreshQueryTree(
                        saveQueryData.value.parentGuid,
                        'query'
                    )
                }
            }
            const saveTabConfirm = (key: string) => {
                console.log(key, 'keyyy')
                /* Saving the key */
                saveCloseTabKey.value = key
                let tabData: activeInlineTabInterface | undefined
                tabs.value.forEach((tab) => {
                    if (tab.key === key) {
                        tabData = tab
                    }
                })

                if (tabData?.queryId) {
                    console.log(tabData, key, 'updayte')
                    /* If this tab already saved to database */
                    updateSavedQuery(editorInstance, isSaving, tabData)
                    inlineTabRemove(
                        key as string,
                        tabs,
                        activeInlineTabKey,
                        pushGuidToURL
                    )
                } else {
                    /* If this tab need to save into database */
                    unsavedPopover.value.key = undefined
                    unsavedPopover.value.show = false
                    openSaveQueryModal()
                }

                console.log('save', key)
            }

            let tabHover = ref(null)
            const setTabHover = (val) => {
                // console.log('tab: ', val)
                if (val) {
                    tabHover.value = val.key
                } else {
                    tabHover.value = null
                }
            }

            return {
                fullSreenState,
                saveModalRef,
                saveQueryLoading,
                showSaveQueryModal,
                openSaveQueryModal,
                saveQueryOnCloseTab,
                saveTabConfirm,
                closeTabConfirm,
                closePopOver,
                unsavedPopover,
                isActiveInlineTabSaved,
                activeInlineTab,
                tabs,
                activeInlineTabKey,
                outputPaneSize,
                handleAdd,
                onEdit,
                onTabClick,
                queryRun,
                setTabHover,
                tabHover,
                isSaving,
            }
        },
    })
</script>
<style lang="less">
    .insights-tabs {
        .ant-tabs-nav-container {
            height: 28px !important;
        }
        .ant-tabs-extra-content {
            line-height: 28px !important;
        }

        .ant-tabs-tab {
            height: 100%;
            border-radius: 0px !important;
            margin-right: 0px !important;
            border-left: 0px !important;
            border-right: 0px !important;
            border-top: 0px !important;
            border-bottom: 0px !important;
            padding: 0 12px !important;
            height: 28px !important;
            @apply bg-gray-light !important;

            > div {
                height: 100%;
            }

            &.ant-tabs-tab-active {
                // border-bottom: 1px solid !important;
                @apply bg-white !important;

                &:hover {
                    background-color: #fafafa !important;
                }
            }
            .ant-tabs-close-x {
                visibility: hidden;
                transition: none !important;
            }
            .ant-tabs-tab-remove .anticon {
                visibility: hidden;
                transition: none !important;
            }
            &:hover {
                .unsaved-dot {
                    visibility: hidden;
                }
                .ant-tabs-close-x {
                    visibility: visible !important;
                }

                .ant-tabs-tab-remove .anticon {
                    visibility: visible !important;
                }
            }
        }
    }
</style>
<style lang="less" scoped>
    .btn {
        // border: 1px solid #f06;
        padding: 10px 16px;
        border-radius: 2px;
        // border: 1px solid #fff;
        box-shadow: 0 3px 1px -2px #00000033, 0 2px 2px 0 rgba(0, 0, 0, 0.14),
            0 1px 5px 0 rgba(0, 0, 0, 0.12);
        background-color: #fff;
        user-select: none;
        cursor: pointer;
    }

    .btn + .btn {
        margin-left: 30px;
    }

    .btns {
        padding: 50px 30px;
    }
    .children_spiltpanes {
        height: calc(100vh - 19rem);
    }
    .inline_tab {
        max-width: 49px;
        width: 49px;
        min-width: 49px;
        overflow: hidden;
        height: 28px !important;
        // min-width: 3rem
    }
    .cross-hover:hover {
        // width: 16px;
        // height: 16px;
        background: #ededed;
        // border-radius: 2px;
    }
    .inline_tab_label {
        max-width: 53px;
        // overflow: hidden;
    }
    .playground-height {
        // @apply bg-gray-light !important;
        height: calc(100vh - 40px);
    }
</style>
<style lang="less" module>
    .inline_tabs {
        height: 28px !important;

        :global(.ant-tabs-tab > div) {
            @apply flex items-center !important;
        }
        :global(.ant-tabs-nav .ant-tabs-tab-active) {
            @apply text-white !important;
        }
        :global(.ant-tabs-nav) {
            margin: 0 !important;
        }
        :global(.ant-tabs-top-content) {
            @apply hidden !important;
        }
        :global(.ant-tabs-tab) {
            margin: 0 !important;
        }

        :global(.ant-tabs-nav)::before {
            border-bottom: none !important;
        }
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
