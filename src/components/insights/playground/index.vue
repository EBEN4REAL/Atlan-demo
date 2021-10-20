<template>
    <div class="flex flex-col w-full h-full bg-white playground-height">
        <div class="relative flex flex-col">
            <div class="flex w-full bg-gray-light text-gray">
                <a-tabs
                    v-model:activeKey="activeInlineTabKey"
                    :class="$style.inline_tabs"
                    hide-add
                    type="editable-card"
                    class="insights-tabs"
                    @change="onTabClick"
                    @edit="onEdit"
                >
                    <template #tabBarExtraContent>
                        <div class="inline-flex items-center ml-1 mr-2">
                            <a-tooltip placement="top">
                                <template #title>New query</template>
                                <span
                                    class="inline-flex items-center justify-center p-2 rounded-full  btn-add hover:bg-gray-300"
                                    @click="handleAdd"
                                >
                                    <fa icon="fal plus" class="" />
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
                                    class="flex items-center justify-between  inline_tab"
                                >
                                    <div
                                        class="flex items-center text-gray-700"
                                    >
                                        <span
                                            class="
                                                text-sm
                                                truncate
                                                ...
                                                inline_tab_label
                                            "
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
                                        class="flex items-center mr-2  unsaved-dot"
                                    >
                                        <div
                                            class="
                                                w-1.5
                                                h-1.5
                                                rounded-full
                                                bg-primary
                                                -mt-0.5
                                                absolute
                                                right-2.5
                                            "
                                        ></div>
                                    </div>
                                </div>
                                <template #overlay>
                                    <a-menu>
                                        <UnsavedPopover
                                            @closeTab="closeTabConfirm"
                                            @saveTab="saveTabConfirm"
                                            :unsavedPopover="unsavedPopover"
                                            :isSaving="isSaving"
                                        />
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </template>
                    </a-tab-pane>
                </a-tabs>
            </div>
            <div
                class="absolute bottom-0 flex-1 w-full bg-white"
                style="height: 3px"
            ></div>
        </div>

        <div v-if="activeInlineTabKey" class="w-full h-full">
            <splitpanes horizontal :push-other-panes="false">
                <pane
                    :max-size="95.5"
                    :size="100 - outputPaneSize"
                    min-size="30"
                    class="overflow-x-hidden"
                >
                    <Editor
                /></pane>
                <pane min-size="4.5" :size="outputPaneSize" max-size="70">
                    <ResultsPane
                /></pane>
            </splitpanes>
        </div>
        <NoActiveInlineTab @handleAdd="handleAdd" v-else />
        <SaveQueryModal
            v-model:showSaveQueryModal="showSaveQueryModal"
            :saveQueryLoading="saveQueryLoading"
            :ref="
                (el) => {
                    saveModalRef = el
                }
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
    import { useRouter } from 'vue-router'

    // import { useHotKeys } from '~/components/insights/common/composables/useHotKeys'

    export default defineComponent({
        components: {
            Editor,
            ResultsPane,
            NoActiveInlineTab,
            UnsavedPopover,
            SaveQueryModal,
        },
        props: {
            activeInlineTabKey: {
                type: String,
                required: true,
            },
        },
        setup(props, { emit }) {
            const router = useRouter()
            const isSaving = ref(false)
            const showSaveQueryModal = ref(false)
            const saveCloseTabKey = ref()
            const saveQueryLoading = ref(false)
            const saveModalRef = ref()
            const saveQueryData = ref()

            const { queryRun } = useRunQuery()
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
            const handleAdd = () => {
                const key = String(new Date().getTime())
                const inlineTabData: activeInlineTabInterface = {
                    label: 'untitled',
                    key,
                    favico: 'https://atlan.com/favicon.ico',
                    isSaved: false,
                    queryId: undefined,
                    status: 'DRAFT',
                    connectionId: '',
                    description: '',
                    qualifiedName: '',
                    isSQLSnippet: false,
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
                        },
                    },
                    playground: {
                        editor: {
                            text: '',
                            dataList: [],
                            columnList: [],
                            variables: [],
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
                        isVisible:
                            activeInlineTab.value?.assetSidebar?.isVisible ??
                            false,
                        assetInfo: {},
                        title: activeInlineTab.value?.assetSidebar.title ?? '',
                        id: activeInlineTab.value?.assetSidebar.id ?? '',
                    },
                }
                inlineTabAdd(inlineTabData, tabs, activeInlineTabKey)
                router.push(`/insights`)
            }
            const pushGuidToURL = (guid: string | undefined) => {
                if (guid) router.push(`/insights?id=${guid}`)
                else router.push(`/insights`)
            }
            const onTabClick = (activeKey) => {
                setActiveTabKey(activeKey, activeInlineTabKey)
                pushGuidToURL(activeInlineTab.value?.queryId)
            }
            const onEdit = (targetKey: string | MouseEvent, action: string) => {
                if (action === 'add') {
                    handleAdd()
                } else {
                    console.log(targetKey)
                    let crossedTabState: boolean = false
                    tabs.value.forEach((tab) => {
                        if (tab.key === targetKey) {
                            crossedTabState = tab.isSaved
                        }
                    })
                    /* If it is unsaved then show popover confirm */
                    if (!crossedTabState) {
                        unsavedPopover.value.key = targetKey as string
                        unsavedPopover.value.show = true
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
                        'personal',
                        saveQueryData.value.parentQF,
                        saveQueryData.value.parentGuid,
                        tabData as activeInlineTabInterface,
                        tabRemoveCallbackFunction,
                        false
                    )
                }
            }
            const saveTabConfirm = (key: string) => {
                /* Saving the key */
                saveCloseTabKey.value = key
                let tabData: activeInlineTabInterface | undefined
                tabs.value.forEach((tab) => {
                    if (tab.key === key) {
                        tabData = tab
                    }
                })

                if (tabData?.queryId) {
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

            return {
                saveModalRef,
                saveQueryLoading,
                showSaveQueryModal,
                openSaveQueryModal,
                saveQueryOnCloseTab,
                saveTabConfirm,
                closeTabConfirm,
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
            }
        },
    })
</script>
<style lang="less">
    .insights-tabs {
        .ant-tabs-nav-container {
            height: 30px !important;
        }
        .ant-tabs-extra-content {
            line-height: 30px !important;
        }

        .ant-tabs-tab {
            height: 100%;
            border-radius: 0px !important;
            margin-right: 0px !important;
            border-left: 0px !important;
            border-right: 0px !important;
            border-top: 0px !important;
            padding: 0 12px !important;
            height: 30px !important;
            @apply bg-gray-light !important;

            > div {
                height: 100%;
            }

            &.ant-tabs-tab-active {
                border-bottom: 1px solid !important;
                @apply bg-white !important;
            }
            .ant-tabs-close-x {
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
            }
        }
    }
</style>
<style lang="less" scoped>
    .btn {
        border: 1px solid #f06;
        padding: 10px 16px;
        border-radius: 2px;
        border: 1px solid #fff;
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
    // .inline_tab {
    //     max-width: 4.2rem;
    //     overflow: hidden;
    //     // min-width: 3rem
    // }
    .inline_tab_label {
        max-width: 5.8rem;
        overflow: hidden;
    }
    .playground-height {
        // @apply bg-gray-light !important;
    }
</style>
<style lang="less" module>
    .inline_tabs {
        :global(.ant-tabs-tab > div) {
            @apply flex items-center !important;
        }
        :global(.ant-tabs-bar) {
            @apply m-0 bg-gray-light !important;
        }
        :global(.ant-tabs-nav .ant-tabs-tab-active) {
            @apply text-white !important;
        }
        :global(.ant-tabs-top-content) {
            @apply hidden !important;
        }
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
