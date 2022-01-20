<template>
    <div class="relative w-full h-full bg-white rounded">
        <div class="w-full h-full overflow-hidden rounded">
            <EditorContext
                :isUpdating="isUpdating"
                :isQueryRunning="isQueryRunning"
                @onClickSaveQuery="saveOrUpdate"
                @onClickRunQuery="toggleRun"
                v-if="
                    !(
                        !isQueryCreatedByCurrentUser &&
                        !hasQueryReadPermission &&
                        !hasQueryWritePermission
                    )
                "
            />
            <SaveQueryModal
                v-model:showSaveQueryModal="showSaveQueryModal"
                :saveQueryLoading="saveQueryLoading"
                :ref="
                    (el) => {
                        saveModalRef = el
                    }
                "
                :savedQueryType="defaultClassification"
                :parentFolder="queryFolderNamespace"
                :connector="
                    activeInlineTab?.explorer?.queries?.connectors?.connector
                "
                @onSaveQuery="saveQuery"
            />

            <!-- no query access case -->
            <NoAccess
                v-if="
                    !isQueryCreatedByCurrentUser &&
                    !hasQueryReadPermission &&
                    !hasQueryWritePermission
                "
                :collection="activeTabCollection"
            />
            <VQB v-if="showVQB" />
            <Monaco @editorInstance="setInstance" />

            <!-- START: EDITOR FOOTER -->
            <div
                class="absolute bottom-0 left-0 flex flex-col w-full"
                v-if="
                    !(
                        !isQueryCreatedByCurrentUser &&
                        !hasQueryReadPermission &&
                        !hasQueryWritePermission
                    )
                "
            >
                <CustomVariablesNav
                    v-if="editorInstance && showcustomToolBar"
                    class="border-t"
                />
                <div
                    class="flex items-center justify-between w-full px-3 pt-1 pb-1 text-xs text-gray-500 bg-white"
                    style="z-index: 2"
                >
                    <div class="flex items-center">
                        <!-- <WarehouseConnector /> -->
                        <div class="flex items-center">
                            <!-- explorer toggle -->
                            <a-tooltip
                                color="#363636"
                                :mouseEnterDelay="
                                    lastTooltipPresence !== undefined
                                        ? ADJACENT_TOOLTIP_DELAY
                                        : MOUSE_ENTER_DELAY
                                "
                            >
                                <template #title>Toggle sidebar</template>
                                <div
                                    class="p-1 mr-2 rounded cursor-pointer hover:bg-gray-300 group"
                                    @click="toggleExplorerPane"
                                    @mouseout="recordTooltipPresence"
                                >
                                    <AtlanIcon
                                        icon="ExplorerTrigger"
                                        class="w-4 h-4"
                                    />
                                </div>
                            </a-tooltip>
                            <!-- full screen button -->

                            <a-tooltip
                                :mouseEnterDelay="
                                    lastTooltipPresence !== undefined
                                        ? ADJACENT_TOOLTIP_DELAY
                                        : MOUSE_ENTER_DELAY
                                "
                                color="#363636"
                                v-if="fullSreenState"
                            >
                                <template #title> Exit full screen</template>
                                <div
                                    class="p-1 mr-2 rounded cursor-pointer hover:bg-gray-300"
                                    :class="fullSreenState ? 'bg-gray-300' : ''"
                                    @click="tFullScreen"
                                    @mouseout="recordTooltipPresence"
                                >
                                    <div
                                        class="items-center justify-center group"
                                    >
                                        <div
                                            class="items-center justify-center"
                                        >
                                            <AtlanIcon
                                                class="w-4 h-4 border-gray-500"
                                                icon="ExitFullScreen"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </a-tooltip>
                            <a-tooltip
                                :mouseEnterDelay="
                                    lastTooltipPresence !== undefined
                                        ? ADJACENT_TOOLTIP_DELAY
                                        : MOUSE_ENTER_DELAY
                                "
                                color="#363636"
                                v-else
                            >
                                <template #title> Go full screen</template>
                                <div
                                    class="p-1 mr-2 rounded cursor-pointer hover:bg-gray-300"
                                    :class="fullSreenState ? 'bg-gray-300' : ''"
                                    @click="tFullScreen"
                                    @mouseout="recordTooltipPresence"
                                >
                                    <div
                                        class="items-center justify-center group"
                                    >
                                        <div
                                            class="items-center justify-center"
                                        >
                                            <AtlanIcon
                                                class="w-4 h-4 border-gray-500"
                                                icon="FullScreen"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </a-tooltip>

                            <!-- format sql -->
                            <a-tooltip
                                v-if="!showVQB"
                                color="#363636"
                                :mouseEnterDelay="
                                    lastTooltipPresence !== undefined
                                        ? ADJACENT_TOOLTIP_DELAY
                                        : MOUSE_ENTER_DELAY
                                "
                            >
                                <template #title>Format SQL</template>
                                <div
                                    class="items-center justify-center p-1 mr-2 rounded cursor-pointer hover:bg-gray-300 group"
                                    @click="formatDocument"
                                    @mouseout="recordTooltipPresence"
                                >
                                    <AtlanIcon
                                        icon="FormatText"
                                        class="w-4 h-4"
                                    />
                                </div>
                            </a-tooltip>
                            <!-- preview sql -->
                            <a-popover
                                placement="bottom"
                                trigger="click"
                                :overlayStyle="{ padding: '0px !important' }"
                                :destroyTooltipOnHide="true"
                                @visibleChange="
                                    (visible) => {
                                        if (!visible) {
                                            showQueryPreview = false
                                        }
                                    }
                                "
                            >
                                <template #content>
                                    <div>
                                        <VQBSQLPreview />
                                    </div>
                                </template>
                                <a-tooltip
                                    color="#363636"
                                    v-if="showVQB"
                                    :mouseEnterDelay="
                                        lastTooltipPresence !== undefined
                                            ? ADJACENT_TOOLTIP_DELAY
                                            : MOUSE_ENTER_DELAY
                                    "
                                >
                                    <template #title>Preview SQL</template>
                                    <div
                                        v-if="showVQB"
                                        class="items-center justify-center p-1 mr-2 rounded cursor-pointer hover:bg-gray-300"
                                        :class="
                                            showQueryPreview
                                                ? 'bg-gray-300'
                                                : ''
                                        "
                                        @click="toggleQueryPreviewPopover"
                                        @mouseout="recordTooltipPresence"
                                    >
                                        <AtlanIcon
                                            icon="Info"
                                            class="w-4 h-4 text-gray-500"
                                        />
                                    </div>
                                </a-tooltip>
                            </a-popover>
                            <!-- Custom variables -->
                            <a-tooltip
                                color="#363636"
                                v-if="!showVQB"
                                :mouseEnterDelay="
                                    lastTooltipPresence !== undefined
                                        ? ADJACENT_TOOLTIP_DELAY
                                        : MOUSE_ENTER_DELAY
                                "
                            >
                                <template #title>Custom variables</template>
                                <div
                                    class="items-center justify-center p-1 mr-2 rounded cursor-pointer hover:bg-gray-300"
                                    :class="
                                        showcustomToolBar ? 'bg-gray-300' : ''
                                    "
                                    @click="toggleCustomToolbar"
                                    @mouseout="recordTooltipPresence"
                                >
                                    <AtlanIcon
                                        icon="CustomVariable"
                                        class="w-4 h-4"
                                    />
                                </div>
                            </a-tooltip>
                            <!-- limit 100 -->
                            <div class="flex items-center px-1">
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
                            <div
                                class="flex items-center px-1"
                                v-if="
                                    isFilterIsInteractive(
                                        VQBfilterPanel?.subpanels
                                    )
                                "
                            >
                                <a-popover
                                    placement="top"
                                    :mouseEnterDelay="0.5"
                                >
                                    <template #content>
                                        <div
                                            class="flex flex-col justify-center p-2 rounded"
                                            style="
                                                background: rgba(0, 0, 0, 0.8);
                                                width: 208px;
                                            "
                                        >
                                            <div class="w-full mb-3">
                                                <AtlanIcon
                                                    icon="InteractiveVariableIllustration"
                                                    style="height: 111px"
                                                />
                                            </div>
                                            <p class="text-xs text-white">
                                                Change the results of query by
                                                adjusting the values of
                                                interactive input blocks
                                            </p>
                                        </div>
                                    </template>

                                    <div
                                        class="px-2 py-1 align-middle rounded cursor-pointer bg-pink-light"
                                    >
                                        <AtlanIcon
                                            icon="GlowFlash"
                                            class="w-4 h-4 mr-1"
                                        />
                                        <span
                                            class="text-xs"
                                            style="color: #f34d77"
                                            >This query is interactive</span
                                        >
                                    </div>
                                </a-popover>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center">
                        <div class="flex" v-if="editorFocused">
                            <span class="mr-2"
                                >Ln:&nbsp;{{ editorPos.lineNumber }}</span
                            >
                            <span class="mr-2"
                                >Col:&nbsp; {{ editorPos.column }}</span
                            >
                        </div>
                        <!-- <span class="ml-2 mr-4"
                            >Spaces:&nbsp;{{ editorConfig.tabSpace }}</span
                        > -->
                        <div class="flex items-center justify-center">
                            <div
                                class
                                @click="togglePane"
                                @mouseout="recordTooltipPresence"
                            >
                                <div
                                    class="p-1 rounded cursor-pointer hover:bg-gray-300 group"
                                    @mouseout="recordTooltipPresence"
                                >
                                    <AtlanIcon
                                        icon="OutputpaneTrigger"
                                        class="w-4 h-4 text-gray-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div
                                class="ml-2"
                                @click="toggleAssetPreview"
                                @mouseout="recordTooltipPresence"
                            >
                                <a-tooltip
                                    placement="topRight"
                                    color="#363636"
                                    :mouseEnterDelay="
                                        lastTooltipPresence !== undefined
                                            ? 0.1
                                            : 0.5
                                    "
                                >
                                    <template #title
                                        >Toggle asset preview</template
                                    >
                                    <div
                                        class="p-1 rounded cursor-pointer hover:bg-gray-300 group"
                                        @mouseout="recordTooltipPresence"
                                    >
                                        <AtlanIcon
                                            icon="SidebarTrigger"
                                            class="w-4 h-4 text-gray-500 outline-none"
                                        />
                                    </div>
                                </a-tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- END: EDITOR FOOTER -->
        </div>
    </div>
</template>

<script lang="ts">
    import {
        onMounted,
        onUnmounted,
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
    import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'
    import CustomVariablesNav from '~/components/insights/playground/editor/customVariablesNav/index.vue'
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
    import { useRouter, useRoute } from 'vue-router'
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
    import EditorContext from '~/components/insights/playground/editor/context/index.vue'
    import useTypedefData from '~/composables/typedefs/useTypedefData'
    import VQBSQLPreview from '~/components/insights/playground/editor/VQBQueryPreview/index.vue'
    import { Folder } from '~/types/insights/savedQuery.interface'
    import VQB from '~/components/insights/playground/editor/vqb/index.vue'
    import NoAccess from '~/components/insights/common/noAccess/noAccess.vue'
    import { generateSQLQuery } from '~/components/insights/playground/editor/vqb/composables/generateSQLQuery'
    import { useTooltipDelay } from '~/components/insights/common/composables/useTooltipDelay'
    import { useFilter } from '~/components/insights/playground/editor/vqb/composables/useFilter'

    import { useAuthStore } from '~/store/auth'
    import { storeToRefs } from 'pinia'

    const Monaco = defineAsyncComponent(() => import('./monaco/monaco.vue'))

    export default defineComponent({
        components: {
            VQB,
            Monaco: Monaco,
            CustomVariablesNav,
            SaveQueryModal,
            AtlanBtn,
            VQBSQLPreview,
            StatusBadge,
            EditorContext,
            WarehouseConnector,
            NoAccess,
        },
        props: {
            refreshQueryTree: {
                type: Function,
            },
        },
        setup(props) {
            const router = useRouter()
            const route = useRoute()
            const vqbQueryRoute = ref(route.query?.vqb)
            const {
                recordTooltipPresence,
                MOUSE_ENTER_DELAY,
                MOUSE_TRACK_MAXIMUM_DELAY,
                ADJACENT_TOOLTIP_DELAY,
                lastTooltipPresence,
            } = useTooltipDelay()

            // const permissions = inject('permissions') as ComputedRef<any>
            // TODO: will be used for HOTKEYs
            const { canUserUpdateQuery } = useAccess()
            const { getDatabaseName, getConnectionQualifiedName } =
                useConnector()
            const { isFilterIsInteractive } = useFilter()
            const { resetErrorDecorations, setErrorDecorations } = useEditor()
            const { resultsPaneSizeToggle, explorerPaneToggle } = useHotKeys()
            const { queryRun, abortQuery } = useRunQuery()
            const {
                modifyActiveInlineTabEditor,
                modifyActiveInlineTab,
                setVQBInInlineTab,
            } = useInlineTab()
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
            const showQueryPreview = ref(false)

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const showVQB = computed(
                () => activeInlineTab.value.playground.isVQB
            )

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

            const authStore = useAuthStore()
            const { permissions } = storeToRefs(authStore)

            let userHasPermission = computed(() => {
                permissions.value.indexOf('CREATE_COLLECTION') >= 0
            })

            const isQueryCreatedByCurrentUser = inject(
                'isQueryCreatedByCurrentUser'
            ) as ComputedRef
            const hasQueryReadPermission = inject(
                'hasQueryReadPermission'
            ) as ComputedRef
            const hasQueryWritePermission = inject(
                'hasQueryWritePermission'
            ) as ComputedRef

            const activeTabCollection = inject(
                'activeTabCollection'
            ) as ComputedRef

            // toRaw(editorInstance.value).updateOptions({
            //     readOnly: hasQueryWritePermission ? false : true,
            // })

            const queryFolderNamespace = inject<Ref<Folder>>(
                'queryFolderNamespace',
                ref({}) as Ref<Folder>
            )

            const { updateSavedQuery, saveQueryToDatabaseWithTerms } =
                useSavedQuery(inlineTabs, activeInlineTab, activeInlineTabKey)
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
            const { classificationList } = useTypedefData()
            let defaultClassification = classificationList.value[0] ?? undefined

            // callback fxn
            const getData = (
                activeInlineTab,
                dataList,
                columnList,
                executionTime
            ) => {
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
                        true,
                        saveQueryDataInLocalStorage
                    )
                }
            }
            /* sucess| error */
            const onRunCompletion = (activeInlineTab, status: string) => {
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
                    // console.log('error deco:', status)
                    /* If it is a line error i,e VALIDATION_ERROR | QUERY_PARSING_ERROR */
                    const errorName =
                        activeInlineTab.value?.playground?.resultsPane?.result
                            ?.queryErrorObj?.errorName

                    console.log(
                        'error data: ',
                        activeInlineTab.value?.playground?.resultsPane?.result
                            ?.queryErrorObj?.errorName
                    )
                    if (LINE_ERROR_NAMES.includes(errorName)) {
                        setErrorDecorations(
                            activeInlineTab,
                            toRaw(editorInstance),
                            toRaw(monacoInstance)
                        )
                    }
                }
            }
            const onQueryIdGeneration = (
                activeInlineTab,
                queryId: string,
                eventSource: any
            ) => {
                /* Setting the particular instance to this tab */
                activeInlineTab.value.playground.resultsPane.result.runQueryId =
                    queryId
                activeInlineTab.value.playground.resultsPane.result.eventSourceInstance =
                    eventSource
            }
            function toggleRun() {
                const activeInlineTabCopy = ref(activeInlineTab.value)

                const queryId =
                    activeInlineTabCopy.value.playground.resultsPane.result
                        .runQueryId
                const currState = !queryId ? 'run' : 'abort'
                if (currState === 'run') {
                    /* If VQB enabled, run VQB Query */
                    let selectedText = ''
                    if (showVQB.value) {
                        selectedText = generateSQLQuery(
                            activeInlineTabCopy.value,
                            limitRows.value
                        )
                    } else {
                        /* Get selected Text from editor */
                        selectedText = toRaw(editorInstance.value)
                            .getModel()
                            .getValueInRange(
                                toRaw(editorInstance.value).getSelection()
                            )
                    }

                    console.log('query selected: ', selectedText)
                    queryRun(
                        activeInlineTabCopy,
                        getData,
                        limitRows,
                        onRunCompletion,
                        onQueryIdGeneration,
                        selectedText,
                        editorInstance,
                        monacoInstance,
                        showVQB
                    )
                } else {
                    abortQuery(
                        activeInlineTabCopy,
                        inlineTabs,
                        editorInstance,
                        monacoInstance
                    )
                }
            }
            const runQuery = () => {
                const queryId =
                    activeInlineTab.value.playground.resultsPane.result
                        .runQueryId
                const currState = !queryId ? 'run' : 'abort'
                if (currState === 'run') {
                    /* If VQB enabled, run VQB Query */
                    let selectedText = ''
                    if (showVQB.value) {
                        selectedText = generateSQLQuery(
                            activeInlineTab.value,
                            limitRows.value
                        )
                    } else {
                        /* Get selected Text from editor */
                        selectedText = toRaw(editorInstance.value)
                            .getModel()
                            .getValueInRange(
                                toRaw(editorInstance.value).getSelection()
                            )
                    }
                    queryRun(
                        activeInlineTab,
                        getData,
                        limitRows,
                        onRunCompletion,
                        onQueryIdGeneration,
                        selectedText,
                        editorInstance,
                        monacoInstance,
                        showVQB
                    )
                }
            }

            // let selectedQuery = computed(() => {
            //     console.log('inside select: ')
            //     if (
            //         toRaw(editorInstance.value) &&
            //         toRaw(editorInstance.value).getSelection()
            //     ) {
            //         return toRaw(editorInstance.value).getSelection()
            //     } else {
            //         return ''
            //     }
            // })

            // watch(selectedQuery, () => {
            //     if (toRaw(editorInstance.value))
            //         console.log('selection happened: ', selectedQuery.value)
            // })

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

            const toggleCustomToolbar = () => {
                showcustomToolBar.value = !showcustomToolBar.value
            }

            const saveQuery = (
                saveQueryData: any,
                assetTerms: any,
                assetClassification: any
            ) => {
                console.log('assetTerms from editor: ', {
                    assetTerms,
                    assetClassification,
                })
                saveQueryToDatabaseWithTerms(
                    assetTerms,
                    assetClassification,
                    saveQueryData,
                    saveQueryLoading,
                    showSaveQueryModal,
                    saveModalRef,
                    router,
                    route,
                    saveQueryData.parentQF,
                    saveQueryData.parentGuid,
                    activeInlineTab.value,
                    props.refreshQueryTree
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
            const saveOrUpdate = () => {
                const queryId = activeInlineTab.value?.queryId
                if (queryId) {
                    updateQuery()
                } else {
                    openSaveQueryModal()
                }
            }

            /* VQB Preview */
            const toggleQueryPreviewPopover = () => {
                showQueryPreview.value = !showQueryPreview.value
            }

            const VQBfilterPanel = computed(() => {
                return activeInlineTab.value?.playground?.vqb?.panels?.find(
                    (panel) => panel.id.toLowerCase() === 'filter'
                )
            })

            /*---------- PROVIDERS FOR CHILDRENS -----------------
            ---Be careful to add a property/function otherwise it will pollute the whole flow for childrens--
            */
            const provideData: provideDataInterface = {
                editorPos: editorPos,
                editorFocused: editorFocused,
                toggleRun: toggleRun,
                runQuery: runQuery,
                saveOrUpdate: saveOrUpdate,
                showcustomToolBar: showcustomToolBar,
                limitRows: limitRows,
            }
            useProvide(provideData)
            /*-------------------------------------*/

            watch(editorInstance, () => {
                // console.log('editorInstance: ', toRaw(editorInstance.value))
                if (toRaw(editorInstance.value)) {
                    const pos = toRaw(editorInstance.value).getPosition()
                    editorPos.value.column = pos.column
                    editorPos.value.lineNumber = pos.lineNumber
                    console.log(pos)
                }
            })

            const readOnly = computed(() =>
                activeInlineTab?.value?.qualifiedName?.length === 0
                    ? false
                    : isQueryCreatedByCurrentUser.value
                    ? false
                    : hasQueryWritePermission.value
                    ? false
                    : true
            )

            watch([activeInlineTab, editorInstance, readOnly], () => {
                if (toRaw(editorInstance.value)) {
                    toRaw(editorInstance.value).updateOptions({
                        readOnly: readOnly.value,
                    })
                }
            })

            // function toggleVQB() {
            //     showVQB.value = !showVQB.value
            // }

            const _keyListener = (e) => {
                if (e.key === 'Enter') {
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault()
                        // toggleRun()
                        // console.log('running: ', isQueryRunning.value)

                        if (
                            !isQueryCreatedByCurrentUser &&
                            !hasQueryReadPermission &&
                            !hasQueryWritePermission
                        ) {
                            if (
                                isQueryRunning.value == '' ||
                                isQueryRunning.value == 'success' ||
                                isQueryRunning.value == 'error'
                            ) {
                                runQuery()
                            }
                        }
                    }
                    //prevent the default action
                }
                if (e.key === 'S') {
                    if (e.metaKey || e.ctrlKey) {
                        e.preventDefault()
                        saveOrUpdate()
                    }
                    //prevent the default action
                }

                /* Toggle VQB CODE */
                // if (e.key === 'Q' || e.key === 'q') {
                //     if (e.ctrlKey) {
                //         e.preventDefault()
                //         if (vqbQueryRoute.value) {
                //             // showVQB.value = !showVQB.value
                //             const activeInlineTabCopy: activeInlineTabInterface =
                //                 Object.assign({}, activeInlineTab.value)

                //             activeInlineTabCopy.playground.isVQB =
                //                 !activeInlineTabCopy?.playground?.isVQB

                //             setVQBInInlineTab(
                //                 activeInlineTabCopy,
                //                 inlineTabs,
                //                 true
                //             )
                //         }
                //     }
                //     //prevent the default action
                // }
                /* ----------------------------- */
            }
            onMounted(() => {
                window.addEventListener('keydown', _keyListener)
            })
            onUnmounted(() => {
                window.removeEventListener('keydown', _keyListener)
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
                lastTooltipPresence,
                toggleQueryPreviewPopover,
                showQueryPreview,
                showVQB,
                // permissions,
                saveOrUpdate,
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
                updateQuery,
                openSaveQueryModal,
                saveQuery,
                setInstance,
                toggleRun,
                queryFolderNamespace,
                defaultClassification,
                recordTooltipPresence,
                MOUSE_ENTER_DELAY,
                MOUSE_TRACK_MAXIMUM_DELAY,
                ADJACENT_TOOLTIP_DELAY,
                isFilterIsInteractive,
                VQBfilterPanel,
                isQueryCreatedByCurrentUser,
                hasQueryReadPermission,
                hasQueryWritePermission,
                activeTabCollection,
                // collectionInfo,
                // hasCollectionReadPermission,
                // hasCollectionWritePermission,
                // isCollectionCreatedByCurrentUser,
                // collectionGuidFromURL
                // toggleVQB,
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
:wq
