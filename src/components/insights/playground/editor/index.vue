<template>
    <div class="relative w-full h-full bg-white rounded">
        <div class="w-full h-full px-3 overflow-x-hidden rounded">
            <div class="flex items-center justify-between w-full my-2">
                <div class="flex items-center text-base">
                    <div
                        class="flex items-center mr-4"
                        v-if="activeInlineTab?.isSaved"
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
                        <a-tooltip>
                            <template #title>{{
                                fullSreenState
                                    ? 'Exit full screen'
                                    : 'Go full screen'
                            }}</template>
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
                                        px-1
                                        py-0.5
                                        rounded
                                        cursor-pointer
                                        hover:bg-gray-300
                                    "
                                    @click="tFullScreen"
                                >
                                    <div
                                        class="
                                            w-4
                                            h-4
                                            p-0.5
                                            border border-gray-500
                                            rounded
                                        "
                                        v-if="fullSreenState"
                                    >
                                        <div
                                            class="w-full h-full bg-gray-500 border rounded "
                                        ></div>
                                    </div>
                                    <div
                                        class="
                                            w-4
                                            h-4
                                            p-0.5
                                            border border-gray-500
                                            rounded
                                        "
                                        v-else
                                    >
                                        <div
                                            class="w-full h-full border border-gray-500 rounded "
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </a-tooltip>
                    </div>
                </div>
                <div class="flex items-center">
                    <div class="flex text-sm">
                        <div class="flex">
                            <a-button
                                type="primary"
                                class="
                                    flex
                                    items-center
                                    button-shadow
                                    border-none
                                    py-0.5
                                    h-6
                                    rounded-none rounded-tl rounded-bl
                                "
                                :class="
                                    isQueryRunning === 'loading'
                                        ? 'px-4.5 pr-3.5'
                                        : 'px-2'
                                "
                                :loading="
                                    isQueryRunning === 'loading' ? true : false
                                "
                                @click="run"
                            >
                                <template #icon>
                                    <AtlanIcon
                                        class="mr-1 text-white"
                                        icon="Play"
                                    />
                                </template>
                                Run</a-button
                            >
                            <a-dropdown :trigger="['click']">
                                <div
                                    class="
                                        flex
                                        w-5
                                        items-center
                                        run-three-dot
                                        bg-primary
                                        justify-between
                                        rounded-none rounded-tr rounded-br
                                        h-6
                                        py-0.5
                                    "
                                >
                                    <AtlanIcon
                                        class="text-white"
                                        icon="KebabMenu"
                                    />
                                </div>
                                <template #overlay>
                                    <a-menu>
                                        <div class="p-2">
                                            <a-checkbox
                                                v-model:checked="
                                                    limitRows.checked
                                                "
                                                >Limit to
                                                {{ limitRows.rowsCount }}
                                                rows</a-checkbox
                                            >
                                        </div>
                                    </a-menu>
                                </template>
                            </a-dropdown>
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
                class="absolute bottom-0 left-0 flex items-center justify-between w-full text-xs text-gray-500 bg-white "
            >
                <div class="flex items-center">
                    <WarehouseConnector />
                    <div class="ml-2" v-if="limitRows.checked">
                        <span class="mr-4">
                            Output limit:&nbsp;{{ limitRows.rowsCount }}
                        </span>
                    </div>
                </div>

                <div class="flex items-center mr-2">
                    <div class="flex" v-if="editorFocused">
                        <span class="mr-2">
                            Ln:&nbsp;{{ editorPos.lineNumber }}
                        </span>
                        <span class="mr-2">
                            Col:&nbsp; {{ editorPos.column }}
                        </span>
                    </div>
                    <span class="ml-2 mr-4"> Spaces:&nbsp;4 </span>
                    <div class="group" @click="togglePane">
                        <div
                            class="
                                flex
                                items-end
                                justify-center
                                w-4
                                h-3.5
                                border
                                rounded-sm
                                group-hover:border-primary
                            "
                            :class="
                                outputPaneSize > 0
                                    ? 'border-primary'
                                    : 'border-gray-500'
                            "
                            style="padding: 0px 1px"
                        >
                            <div
                                class="w-full h-1 rounded-sm  group-hover:bg-primary"
                                :class="
                                    outputPaneSize > 0
                                        ? 'bg-primary'
                                        : 'bg-gray-500'
                                "
                                style="margin-bottom: 1px"
                            ></div>
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
            const { resultsPaneSizeToggle } = useHotKeys()
            const { queryRun, modifyQueryExecutionTime } = useRunQuery()
            const { modifyActiveInlineTabEditor } = useInlineTab()
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
            const fullScreen = inject('fullScreen') as Function
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const fullSreenState = inject('fullSreenState') as Ref<boolean>
            const queryExecutionTime = inject(
                'queryExecutionTime'
            ) as Ref<number>
            const outputPaneSize = inject('outputPaneSize') as Ref<number>
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as Ref<string>
            const editorInstance = inject('editorInstance') as Ref<any>
            const setEditorInstanceFxn = inject('setEditorInstance') as Function
            const saveQueryLoading = ref(false)
            const { updateSavedQuery, saveQueryToDatabase } = useSavedQuery(
                inlineTabs,
                activeInlineTab,
                activeInlineTabKey
            )
            const isQueryRunning = inject('isQueryRunning') as Ref<string>
            const showSaveQueryModal: Ref<boolean> = ref(false)
            const isUpdating: Ref<boolean> = ref(false)
            const openSaveQueryModal = () => {
                showSaveQueryModal.value = true
            }

            // callback fxn
            const getData = (dataList, columnList, executionTime) => {
                console.log(queryExecutionTime, executionTime, 'extime')
                modifyQueryExecutionTime(queryExecutionTime, executionTime)
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
            const run = () => {
                queryRun(
                    activeInlineTab.value,
                    getData,
                    isQueryRunning,
                    limitRows
                )
            }

            const setInstance = (
                editorInstanceParam: editor.IStandaloneCodeEditor,
                monacoInstanceParam?: any
            ) => {
                setEditorInstanceFxn(editorInstanceParam, monacoInstanceParam)
            }
            const updateQuery = () => {
                updateSavedQuery(editorInstance, isUpdating)
            }

            const copyURL = () => {
                const URL = window.location.href
                copyToClipboard(URL)
                message.success({
                    content: 'Link Copied!',
                })
            }
            const toggleCustomToolbar = () => {
                showcustomToolBar.value = !showcustomToolBar.value
            }
            const saveQuery = (saveQueryData: any) => {
                saveQueryToDatabase(
                    saveQueryData,
                    editorInstance,
                    saveQueryLoading,
                    showSaveQueryModal,
                    saveModalRef,
                    router,
                    'personal',
                    saveQueryData.parentQF,
                    saveQueryData.parentGuid
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
            const tFullScreen = () => {
                toggleFullScreenMode(fullSreenState)
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
                const pos = toRaw(editorInstance.value).getPosition()
                editorPos.value.column = pos.column
                editorPos.value.lineNumber = pos.lineNumber
                console.log(pos)
            })
            return {
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
                run,
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

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
