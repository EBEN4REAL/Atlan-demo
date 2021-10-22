<template>
    <div class="relative w-full h-full bg-white rounded">
        <div class="w-full h-full overflow-hidden rounded">
            <div class="flex items-center justify-between w-full px-3 my-2">
                <div class="flex items-center text-base">
                    <div
                        class="flex items-center mr-3"
                        v-if="activeInlineTab?.queryId"
                    >
                        <span class="mr-1">{{ activeInlineTab?.label }}</span>
                        <div class="-mt-0.5">
                            <StatusBadge
                                :status-id="activeInlineTab.status"
                                show-no-status
                            ></StatusBadge>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <a-tooltip>
                            <template #title>Custom variables</template>
                            <div
                                class="items-center justify-center px-1 rounded cursor-pointer  hover:bg-gray-300"
                                :class="showcustomToolBar ? 'bg-gray-300' : ''"
                                @click="toggleCustomToolbar"
                            >
                                {&nbsp;}
                            </div>
                        </a-tooltip>
                        <a-tooltip>
                            <template #title>Format text</template>
                            <div
                                class="
                                    items-center
                                    justify-center
                                    px-1
                                    ml-2
                                    py-0.5
                                    -mt-0.5
                                    rounded
                                    cursor-pointer
                                    hover:bg-gray-300
                                    group
                                "
                                @click="formatDocument"
                            >
                                <AtlanIcon icon="Readme" class="w-5 h-5" />
                            </div>
                        </a-tooltip>

                        <div
                            :class="fullSreenState ? 'bg-gray-300' : ''"
                            class="
                                items-center
                                justify-center
                                px-1
                                ml-1
                                py-0.5
                                -mt-0.5
                                rounded
                                cursor-pointer
                                hover:bg-gray-300
                                group
                            "
                        >
                            <div
                                class="
                                    items-center
                                    justify-center
                                    rounded
                                    cursor-pointer
                                    hover:bg-gray-300
                                    py-0.5
                                "
                                @click="tFullScreen"
                            >
                                <a-tooltip v-if="fullSreenState">
                                    <template #title>
                                        Exit full screen
                                    </template>
                                    <AtlanIcon
                                        class="w-4 h-4 border-gray-500"
                                        icon="ExitFullScreen"
                                    />
                                </a-tooltip>
                                <a-tooltip
                                    v-else
                                    :overlayClassName="$style.tooltip"
                                >
                                    <template #title> Go full screen </template>
                                    <AtlanIcon
                                        class="w-4 h-4 border-gray-500"
                                        icon="FullScreen"
                                    />
                                </a-tooltip>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center">
                    <div class="flex text-sm">
                        <div class="flex">
                            <AtlanBtn
                                class="flex items-center h-6 button-shadow"
                                size="sm"
                                color="primary"
                                padding="compact"
                                :disabled="
                                    activeInlineTab.playground.resultsPane
                                        .result.buttonDisable
                                "
                                @click="toggleRun"
                            >
                                <div class="flex items-center">
                                    <AtlanIcon
                                        v-if="
                                            isQueryRunning === 'loading'
                                                ? false
                                                : true
                                        "
                                        style="margin-right: 2.5px"
                                        icon="Play"
                                        class="text-white rounded button-shadow"
                                    ></AtlanIcon>
                                    <AtlanIcon
                                        v-else
                                        icon="CircleLoader"
                                        style="margin-right: 2.5px"
                                        class="w-4 h-4 text-white animate-spin"
                                    ></AtlanIcon>

                                    <span
                                        v-if="
                                            !activeInlineTab.playground
                                                .resultsPane.result.runQueryId
                                        "
                                        class="text-white"
                                        >Run</span
                                    >
                                    <span
                                        v-else-if="
                                            activeInlineTab.playground
                                                .resultsPane.result
                                                .runQueryId &&
                                            !activeInlineTab.playground
                                                .resultsPane.result
                                                .buttonDisable
                                        "
                                        class="text-white"
                                        >Abort</span
                                    >
                                    <span
                                        v-else-if="
                                            activeInlineTab.playground
                                                .resultsPane.result
                                                .buttonDisable
                                        "
                                        class="text-white"
                                        >Aborting</span
                                    >
                                </div>
                            </AtlanBtn>
                        </div>
                        <a-button
                            v-if="
                                activeInlineTab.queryId &&
                                !activeInlineTab.isSaved
                            "
                            class="
                                flex
                                items-center
                                justify-between
                                button-shadow
                                border-none
                                ml-2
                                h-6
                                py-0.5
                            "
                            :loading="isUpdating"
                            :class="isUpdating ? 'px-4.5' : 'px-2'"
                            :disabled="
                                activeInlineTab.queryId &&
                                activeInlineTab.isSaved
                            "
                            @click="updateQuery"
                        >
                            <template #icon>
                                <AtlanIcon class="mr-1" icon="Save" />
                            </template>

                            Update
                        </a-button>

                        <div
                            v-else-if="
                                activeInlineTab.queryId &&
                                activeInlineTab.isSaved
                            "
                        >
                            <a-tooltip
                                class="
                                    opacity-70
                                    flex
                                    px-2
                                    items-center
                                    button-shadow
                                    border-none
                                    cursor-pointer
                                    ml-2
                                    h-6
                                    py-0.5
                                "
                            >
                                <template #title
                                    >{{
                                        useTimeAgo(activeInlineTab?.updateTime)
                                    }}
                                    by {{ activeInlineTab.updatedBy }}</template
                                >
                                <AtlanIcon
                                    class="mr-1 text-primary"
                                    icon="Check"
                                />

                                Saved
                            </a-tooltip>
                        </div>
                        <a-button
                            v-else
                            class="
                                flex
                                items-center
                                button-shadow
                                border-none
                                px-3
                                ml-2
                                h-6
                                py-0.5
                            "
                            @click="openSaveQueryModal"
                        >
                            <template #icon>
                                <AtlanIcon class="mr-1" icon="Save" />
                            </template>

                            Save
                        </a-button>
                        <a-dropdown>
                            <template #overlay>
                                <a-menu>
                                    <a-menu-item key="1" @click="copyURL">
                                        Copy link
                                    </a-menu-item>
                                    <!-- <a-menu-item key="2">
                            Share via other integration
                        </a-menu-item>
                        <a-menu-item key="3"> Share via slack </a-menu-item> -->
                                </a-menu>
                            </template>
                            <a-button
                                class="
                                    flex
                                    items-center
                                    ml-2
                                    h-6
                                    py-0.5
                                    button-shadow
                                    border-none
                                "
                            >
                                <AtlanIcon class="mr-1" icon="Share" /><span
                                    >Share</span
                                ></a-button
                            >
                        </a-dropdown>
                        <ThreeDotMenu />
                    </div>
                </div>
            </div>
            <CustomVariablesNav v-if="editorInstance && showcustomToolBar" />
            <SaveQueryModal
                v-model:showSaveQueryModal="showSaveQueryModal"
                :saveQueryLoading="saveQueryLoading"
                :ref="
                    (el) => {
                        saveModalRef = el
                    }
                "
                @onSaveQuery="saveQuery"
            />
            <Monaco @editorInstance="setInstance" />

            <div
                class="absolute bottom-0 left-0 flex items-center justify-between w-full px-3 pt-1 pb-1 text-xs text-gray-500 bg-white "
            >
                <div class="flex items-center">
                    <!-- <WarehouseConnector /> -->
                    <div class="flex items-center">
                        <AtlanIcon
                            @click="toggleExplorerPane"
                            icon="ExplorerTrigger"
                            class="w-4 h-4 mr-4"
                        />
                        <!-- <span class="mr-4">
                            Output limit:&nbsp;{{ limitRows.rowsCount }}
                        </span> -->
                        <div class="flex items-center">
                            <a-checkbox
                                :class="$style.checkbox_style"
                                v-model:checked="limitRows.checked"
                                class="text-xs"
                            >
                                <span class="text-gray-500">
                                    Limit to
                                    {{ limitRows.rowsCount }}
                                    rows
                                </span>
                            </a-checkbox>
                        </div>
                    </div>
                </div>

                <div class="flex items-center">
                    <div class="flex" v-if="editorFocused">
                        <span class="mr-2">
                            Ln:&nbsp;{{ editorPos.lineNumber }}
                        </span>
                        <span class="mr-2">
                            Col:&nbsp; {{ editorPos.column }}
                        </span>
                    </div>
                    <span class="ml-2 mr-4">
                        Spaces:&nbsp;{{ editorConfig.tabSpace }}
                    </span>
                    <div class="flex items-center justify-center">
                        <div class="" @click="togglePane">
                            <a-tooltip>
                                <template #title
                                    >Toggle output pane ( ctrl + j )</template
                                >

                                <AtlanIcon
                                    icon="OutputpaneTrigger"
                                    class="w-4 h-4 text-gray-500"
                                />
                            </a-tooltip>
                        </div>
                        <div class="ml-2" @click="toggleAssetPreview">
                            <a-tooltip>
                                <template #title>Toggle asset preview</template>

                                <AtlanIcon
                                    icon="SidebarTrigger"
                                    class="w-4 h-4 text-gray-500"
                                />
                            </a-tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        inject,
        Ref,
        defineAsyncComponent,
        ref,
        ComputedRef,
        watch,
        toRaw,
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import useRunQuery from '../common/composables/useRunQuery'
    import CustomVariablesNav from '~/components/insights/playground/editor/customVariablesNav/index.vue'
    import ThreeDotMenu from '~/components/insights/playground/editor/threeDotMenu/index.vue'
    import { editor } from 'monaco-editor'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { useFullScreen } from '~/components/insights/common/composables/useFullScreen'
    import SaveQueryModal from '~/components/insights/playground/editor/saveQuery/index.vue'
    // import ActionButtons from '~/components/insights/playground/editor/actionButtons/index.vue'
    import WarehouseConnector from '~/components/insights/playground/editor/warehouse/index.vue'
    import { useHotKeys } from '~/components/insights/common/composables/useHotKeys'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { editorConfigInterface } from '~/types/insights/editoConfig.interface'

    import AtlanBtn from '~/components/UI/button.vue'
    import { copyToClipboard } from '~/utils/clipboard'
    import { message } from 'ant-design-vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import { useRouter } from 'vue-router'
    import {
        useProvide,
        provideDataInterface,
    } from '~/components/insights/common/composables/useProvide'
    import { useTimeAgo } from '@vueuse/core'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import { useAccess } from '~/components/insights/common/composables/useAccess'
    import { useEditor } from '~/components/insights/common/composables/useEditor'
    import { useConnector } from '~/components/insights/common/composables/useConnector'
    import { LINE_ERROR_NAMES } from '~/components/insights/common/constants'
    import HEKA_SERVICE_API from '~/services/heka/index'

    export default defineComponent({
        components: {
            Monaco: defineAsyncComponent(() => import('./monaco/monaco.vue')),
            CustomVariablesNav,
            SaveQueryModal,
            AtlanBtn,
            ThreeDotMenu,
            StatusBadge,
            WarehouseConnector,
        },
        props: {},
        setup() {
            const router = useRouter()

            // TODO: will be used for HOTKEYs
            const { canUserUpdateQuery } = useAccess()
            const { getDatabaseName, getConnectionQualifiedName } =
                useConnector()
            const { resetErrorDecorations, setErrorDecorations } = useEditor()
            const { resultsPaneSizeToggle, explorerPaneToggle } = useHotKeys()
            const { queryRun } = useRunQuery()
            const { modifyActiveInlineTabEditor, modifyActiveInlineTab } =
                useInlineTab()
            const { toggleFullScreenMode } = useFullScreen()
            const editorPos: Ref<{ column: number; lineNumber: number }> = ref({
                column: 0,
                lineNumber: 0,
            })
            const editorFocused: Ref<boolean> = ref(false)
            const saveModalRef = ref()
            const limitRows = ref({
                checked: true,
                rowsCount: 100,
            })
            const showcustomToolBar = ref(false)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const editorConfig = inject(
                'editorConfig'
            ) as Ref<editorConfigInterface>
            const fullSreenState = inject('fullSreenState') as Ref<boolean>
            const queryExecutionTime = inject(
                'queryExecutionTime'
            ) as Ref<number>
            const outputPaneSize = inject('outputPaneSize') as Ref<number>
            const explorerPaneSize = inject('explorerPaneSize') as Ref<number>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>
            const editorInstance = inject('editorInstance') as Ref<any>
            const monacoInstance = inject('monacoInstance') as Ref<any>
            const setEditorInstanceFxn = inject('setEditorInstance') as Function
            const saveQueryLoading = ref(false)
            const { closeAssetSidebar, openAssetSidebar } = useAssetSidebar(
                inlineTabs,
                activeInlineTab
            )

            const { updateSavedQuery, saveQueryToDatabase } = useSavedQuery(
                inlineTabs,
                activeInlineTab,
                activeInlineTabKey
            )
            const isQueryRunning = computed(
                () =>
                    activeInlineTab.value.playground.resultsPane.result
                        .isQueryRunning
            )
            const showSaveQueryModal: Ref<boolean> = ref(false)
            const isUpdating: Ref<boolean> = ref(false)
            const openSaveQueryModal = () => {
                showSaveQueryModal.value = true
            }

            // callback fxn
            const getData = (dataList, columnList, executionTime) => {
                console.log(queryExecutionTime, executionTime, 'extime')
                if (activeInlineTab && inlineTabs?.value) {
                    const activeInlineTabCopy: activeInlineTabInterface =
                        JSON.parse(JSON.stringify(toRaw(activeInlineTab.value)))
                    activeInlineTabCopy.playground.editor.dataList = dataList

                    activeInlineTabCopy.playground.editor.columnList =
                        columnList
                    const saveQueryDataInLocalStorage = false
                    modifyActiveInlineTabEditor(
                        activeInlineTabCopy,
                        inlineTabs,
                        saveQueryDataInLocalStorage
                    )
                }
            }
            /* sucess| error */
            const onRunCompletion = (status: string) => {
                if (status === 'success') {
                    /* Resetting the red dot from the editor if it error is not line type */
                    resetErrorDecorations(
                        activeInlineTab,
                        toRaw(editorInstance.value)
                    )
                } else if ((status = 'error')) {
                    resetErrorDecorations(
                        activeInlineTab,
                        toRaw(editorInstance.value)
                    )
                    /* If it is a line error i,e VALIDATION_ERROR | QUERY_PARSING_ERROR */
                    const errorName =
                        activeInlineTab.value?.playground?.resultsPane?.result
                            ?.queryErrorObj?.errorName
                    if (LINE_ERROR_NAMES.includes(errorName)) {
                        setErrorDecorations(
                            activeInlineTab,
                            toRaw(editorInstance),
                            toRaw(monacoInstance)
                        )
                    }
                }
            }
            const onQueryIdGeneration = (queryId: string, eventSource: any) => {
                /* Setting the particular instance to this tab */
                activeInlineTab.value.playground.resultsPane.result.runQueryId =
                    queryId
                activeInlineTab.value.playground.resultsPane.result.eventSourceInstance =
                    eventSource
            }
            const toggleRun = () => {
                const queryId =
                    activeInlineTab.value.playground.resultsPane.result
                        .runQueryId
                const currState = !queryId ? 'run' : 'abort'
                if (currState === 'run') {
                    useAddEvent('insights', 'query', 'run', undefined)
                    queryRun(
                        activeInlineTab,
                        getData,
                        limitRows,
                        onRunCompletion,
                        onQueryIdGeneration
                    )
                } else {
                    /* Abort Query logic */
                    activeInlineTab.value.playground.resultsPane.result.buttonDisable =
                        true
                    const body = {
                        queryId:
                            activeInlineTab.value.playground.resultsPane.result
                                .runQueryId,
                        dataSourceName: getConnectionQualifiedName(
                            activeInlineTab.value.explorer.schema.connectors
                                .attributeValue
                        ),
                    }
                    /* Change loading state */
                    HEKA_SERVICE_API.Insights.AbortQuery(body).then(() => {
                        activeInlineTab.value.playground.resultsPane.result.isQueryRunning =
                            ''
                        if (
                            activeInlineTab.value.playground.resultsPane.result
                                .eventSourceInstance?.close
                        ) {
                            activeInlineTab.value.playground.resultsPane.result.eventSourceInstance?.close()
                            activeInlineTab.value.playground.resultsPane.result.eventSourceInstance =
                                undefined

                            activeInlineTab.value.playground.resultsPane.result.buttonDisable =
                                false
                            activeInlineTab.value.playground.resultsPane.result.runQueryId =
                                undefined
                            /* For syncing with local storage */
                            const activeInlineTabCopy: activeInlineTabInterface =
                                Object.assign({}, activeInlineTab.value)
                            modifyActiveInlineTab(
                                activeInlineTabCopy,
                                inlineTabs,
                                activeInlineTabCopy.isSaved
                            )
                            console.log('connection closed succesfully')
                        }
                    })
                }
            }

            const setInstance = (
                editorInstanceParam: editor.IStandaloneCodeEditor,
                monacoInstanceParam?: any
            ) => {
                setEditorInstanceFxn(editorInstanceParam, monacoInstanceParam)
            }
            const updateQuery = () => {
                updateSavedQuery(
                    editorInstance,
                    isUpdating,
                    activeInlineTab.value
                )
            }

            const copyURL = () => {
                const URL = window.location.href
                copyToClipboard(URL)
                message.success({
                    content: 'Link Copied!',
                })
                useAddEvent('insights', 'query', 'link_copied', undefined)
            }
            const toggleCustomToolbar = () => {
                showcustomToolBar.value = !showcustomToolBar.value
            }
            const saveQuery = (saveQueryData: any) => {
                saveQueryToDatabase(
                    saveQueryData,
                    saveQueryLoading,
                    showSaveQueryModal,
                    saveModalRef,
                    router,
                    'personal',
                    saveQueryData.parentQF,
                    saveQueryData.parentGuid,
                    activeInlineTab.value
                )
            }
            const formatDocument = () => {
                const editorInstanceRaw = toRaw(editorInstance.value)
                editorInstanceRaw.trigger(
                    'editor',
                    'editor.action.formatDocument'
                )
            }
            const togglePane = () => {
                console.log('called')
                resultsPaneSizeToggle(outputPaneSize)
            }
            const toggleExplorerPane = () => {
                console.log('explorer pane toggled')
                explorerPaneToggle(explorerPaneSize)
            }
            const tFullScreen = () => {
                toggleFullScreenMode(fullSreenState)
            }
            const toggleAssetPreview = () => {
                const activeInlineTabCopy: activeInlineTabInterface =
                    Object.assign({}, activeInlineTab.value)
                if (activeInlineTab.value.assetSidebar.isVisible) {
                    activeInlineTabCopy.assetSidebar.isVisible = false
                    closeAssetSidebar(activeInlineTabCopy)
                } else {
                    activeInlineTabCopy.assetSidebar.isVisible = true
                    openAssetSidebar(activeInlineTabCopy, 'editor')
                }
            }

            /*---------- PROVIDERS FOR CHILDRENS -----------------
                ---Be careful to add a property/function otherwise it will pollute the whole flow for childrens--
                */
            const provideData: provideDataInterface = {
                editorPos: editorPos,
                editorFocused: editorFocused,
            }
            useProvide(provideData)
            /*-------------------------------------*/

            watch(editorInstance, () => {
                if (toRaw(editorInstance.value)) {
                    const pos = toRaw(editorInstance.value).getPosition()
                    editorPos.value.column = pos.column
                    editorPos.value.lineNumber = pos.lineNumber
                    console.log(pos)
                }
            })

            /* Handlng the Fullscreen esc key logic */
            // const _keyListener = (e) => {
            //     if (e.key === 'Escape') {
            //         setFullScreenState(false, fullSreenState)
            //         console.log('key pressed', e.key, e)
            //         //prevent the default action
            //     }
            // }
            // onMounted(() => {
            //     window.addEventListener('keydown', _keyListener)
            // })
            // onUnmounted(() => {
            //     window.removeEventListener('keydown', _keyListener)
            // })

            /* ------------------------------------------ */
            return {
                toggleExplorerPane,
                editorConfig,
                canUserUpdateQuery,
                toggleAssetPreview,
                tFullScreen,
                fullSreenState,
                togglePane,
                outputPaneSize,
                useTimeAgo,
                editorFocused,
                editorPos,
                limitRows,
                isUpdating,
                showcustomToolBar,
                saveModalRef,
                saveQueryLoading,
                showSaveQueryModal,
                editorInstance,
                activeInlineTab,
                isQueryRunning,
                formatDocument,
                toggleCustomToolbar,
                copyURL,
                updateQuery,
                openSaveQueryModal,
                saveQuery,
                setInstance,
                toggleRun,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .footer {
        height: 1rem;
    }
    .editor_height {
        height: 95%;
    }
    .button-shadow {
        box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.12);
    }
    .run-three-dot {
        border-left: 1px solid rgba(255, 255, 255, 0.203);
    }
</style>
<style lang="less" module>
    .checkbox_style {
        margin-top: 2.65px;
        :global(.ant-checkbox-inner::after) {
            width: 4px !important;
            height: 7px !important;
        }
        :global(.ant-checkbox-inner) {
            width: 13.5px !important;
            height: 13px !important;
        }
        :global(.ant-checkbox + span) {
            @apply px-1 !important;
        }
    }

    .tooltip {
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
