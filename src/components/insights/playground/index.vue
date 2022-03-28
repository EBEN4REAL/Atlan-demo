<template>
    <div
        class="flex flex-col w-full h-full bg-white"
        :style="
            fullSreenState ? 'height: calc( 100vh - 40px )' : 'height:100vh'
        "
    >
        <div class="relative flex flex-col bg-new-gray-100">
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
                            <a-dropdown :trigger="['click']">
                                <span
                                    class="inline-flex items-center justify-center p-0.5 rounded-sm btn-add cross-hover mt-1 cursor-pointer"
                                >
                                    <AtlanIcon icon="Add" />
                                </span>
                                <template #overlay>
                                    <div
                                        style="width: 176px; height: 104px"
                                        class="p-2 mt-2 bg-white newTabDropdown"
                                    >
                                        <div
                                            @click="handleAdd(false)"
                                            class="flex items-center pl-2 newTabDropdownOption newTabDropdownOption1"
                                        >
                                            <AtlanIcon
                                                icon="Query24"
                                                class="w-6 h-6 mr-2"
                                            />
                                            <span class="text-xs font-bold">
                                                New SQL Query
                                            </span>
                                        </div>
                                        <div
                                            @click="handleAdd(true)"
                                            class="flex items-center pl-2 mt-2 newTabDropdownOption newTabDropdownOption2"
                                        >
                                            <AtlanIcon
                                                icon="Vqb24"
                                                class="w-6 h-6 mr-2"
                                            />
                                            <span class="text-xs font-bold">
                                                New Visual Query
                                            </span>
                                        </div>
                                    </div>
                                </template>
                            </a-dropdown>
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
                                            tabs.length == 1 ? '89px' : '73px',
                                        'max-width':
                                            tabs.length == 1 ? '89px' : '73px',
                                    }"
                                    @mouseenter="setTabHover(tab)"
                                    @mouseleave="setTabHover(null)"
                                    @contextmenu.prevent="showContextMenu"
                                >
                                    <div
                                        class="flex items-center text-gray-700 w-full"
                                    >
                                        <span
                                            class="text-sm truncate inline_tab_label w-full"
                                            :class="[
                                                tab.key !== activeInlineTabKey
                                                    ? tabHover === tab.key
                                                        ? 'text-gray-700'
                                                        : 'text-gray-500'
                                                    : '',
                                            ]"
                                            >
                                            <Tooltip
                                                clamp-percentage="99%"
                                                :tooltip-text="tab.label"
                                                :rows="1"
                                                />
                                                </span
                                        >
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
                                v-if="
                                    tab.playground.resultsPane.result
                                        .isQueryRunning === 'error' &&
                                    tab.key !== activeInlineTabKey
                                "
                                icon="FailedQuery"
                                class="absolute w-4 h-4 unsaved-dot right-2 top-1.5"
                            />

                            <AtlanIcon
                                v-else-if="
                                    tab.playground.resultsPane.result
                                        .isQueryRunning === 'loading'
                                "
                                icon="RunningQuery"
                                class="w-4 h-4 animate-spin unsaved-dot absolute right-2 top-1.5"
                            />
                            <AtlanIcon
                                v-else-if="
                                    tab.playground.resultsPane.result
                                        .isQueryRunning === 'success' &&
                                    tab.key !== activeInlineTabKey
                                "
                                icon="SuccessQuery"
                                class="w-3 h-3 unsaved-dot absolute right-2.5 top-2"
                            />
                            <div
                                v-else-if="!tab.isSaved"
                                class="flex items-center unsaved-dot"
                            >
                                <div
                                    v-if="
                                        tab?.playground?.editor?.text?.length >
                                            0 || tab?.queryId
                                    "
                                    class="w-1.5 h-1.5 rounded-full bg-primary absolute right-3.5 top-2.5"
                                ></div>
                            </div>
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
            style="max-height: 100%; height: 100%"
            :class="$style.splitspane_playground"
        >
            <splitpanes
                horizontal
                :push-other-panes="false"
                @resize="onHorizontalResize"
            >
                <pane
                    :max-size="100"
                    class="overflow-x-hidden horizontal_splitpane"
                    :size="
                        100 -
                        (activeInlineTab.playground.resultsPane.outputPaneSize >
                        0
                            ? activeInlineTab.playground.resultsPane
                                  .outputPaneSize
                            : 0)
                    "
                    min-size="30"
                >
                    <Editor :refreshQueryTree="refreshQueryTree" />
                </pane>
                <pane
                    min-size="0"
                    class="horizontal_splitpane"
                    :size="
                        activeInlineTab.playground.resultsPane.outputPaneSize >
                        0
                            ? activeInlineTab.playground.resultsPane
                                  .outputPaneSize
                            : 0
                    "
                    max-size="70"
                >
                    <ResultsPane />
                </pane>
            </splitpanes>
        </div>
        <ResultPaneFooter v-if="activeInlineTabKey" />

        <NoActiveInlineTab @handleAdd="handleAdd(false)" v-else />
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
    import { useInlineTab } from '~/components/insights/common/composables/useInlineTab'
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    import SaveQueryModal from '~/components/insights/playground/editor/saveQuery/index.vue'
    import UnsavedPopover from '~/components/insights/common/unsavedPopover/index.vue'
    import { useUtils } from '~/components/insights/common/composables/useUtils'
    import ResultPaneFooter from '~/components/insights/playground/resultsPane/result/resultPaneFooter.vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useActiveTab } from '~/components/insights/common/composables/useActiveTab'
    import { useSpiltPanes } from '~/components/insights/common/composables/useSpiltPanes'
    import { useDebounceFn } from '@vueuse/core'
    import Tooltip from '@/common/ellipsis/index.vue'

    // import { useHotKeys } from '~/components/insights/common/composables/useHotKeys'

    export default defineComponent({
        components: {
            Editor,
            ResultsPane,
            NoActiveInlineTab,
            UnsavedPopover,
            SaveQueryModal,
            ResultPaneFooter,
            Tooltip
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
            const limitRows = inject('limitRows') as Ref<{
                checked: boolean
                rowsCount: number
            }>

            const { getFirstQueryConnection } = useUtils()
            const { horizontalPaneResize, horizontalPaneAnimation } =
                useSpiltPanes()
            const { inlineTabRemove, inlineTabAdd, setActiveTabKey } =
                useInlineTab()

            const unsavedPopover = ref({
                show: false,
                key: undefined,
            })
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
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

            const handleAdd = (isVQB) => {
                // const key = String(new Date().getTime())
                const { generateNewActiveTab } = useActiveTab()
                const inlineTabData = generateNewActiveTab({
                    activeInlineTab,
                    label: `Untitled ${getLastUntitledNumber()}`,
                    editorText: '',
                    isVQB,
                })

                inlineTabAdd(inlineTabData, tabs, activeInlineTabKey)
                const queryParams = {}
                // if (route?.query?.vqb) queryParams.vqb = true
                if (isVQB) queryParams.vqb = true

                router.push({ path: `insights`, query: queryParams })
            }

            const pushGuidToURL = (guid: string | undefined) => {
                const queryParams = {}
                let isVQB = activeInlineTab.value.playground.isVQB
                if (isVQB) queryParams.vqb = true
                // if (route?.query?.vqb) queryParams.vqb = true

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

                // if (
                //     activeInlineTab.value.playground.resultsPane.result
                //         .isQueryRunning === 'loading'
                // ) {
                //     // activeInlineTab.value.playground.resultsPane.result.tabQueryState =
                //     //     true
                // } else {
                //     activeInlineTab.value.playground.resultsPane.result.tabQueryState =
                //         false
                // }
            }
            const onEdit = (targetKey: string | MouseEvent, action: string) => {
                console.log('edit triggered: ')
                if (action === 'add') {
                    handleAdd(false)
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

            const saveQueryOnCloseTab = (
                saveQueryDataParam: any,
                assetTerms: any,
                assetClassification: any
            ) => {
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
                        {
                            ...saveQueryData.value,
                            assetTerms,
                            assetClassification,
                        },
                        saveQueryLoading,
                        showSaveQueryModal,
                        saveModalRef,
                        router,
                        route,
                        'personal',
                        saveQueryData.value.parentQF,
                        saveQueryData.value.parentGuid,
                        tabData as activeInlineTabInterface,
                        limitRows,
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
                    updateSavedQuery(
                        editorInstance,
                        isSaving,
                        tabData,
                        limitRows
                    )
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
            const contentMenu = ref(true)
            const showContextMenu = () => {
                contentMenu.value = true
            }
            const debouncdedHorizontalPane = useDebounceFn((e) => {
                horizontalPaneResize(e, activeInlineTab, tabs)
            }, 500)

            const onHorizontalResize = (e) => {
                horizontalPaneAnimation()
                debouncdedHorizontalPane(e)
            }

            return {
                onHorizontalResize,
                horizontalPaneResize,
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
                handleAdd,
                onEdit,
                onTabClick,
                setTabHover,
                tabHover,
                isSaving,
                showContextMenu,
                contentMenu,
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
            transition: none !important;

            > div {
                height: 100%;
            }

            &:hover {
                background-color: #fafafa !important;

                // @apply text-gray-700 !important;
                color: #3e4359 !important;
            }

            &.ant-tabs-tab-active {
                // border-bottom: 1px solid !important;
                @apply bg-white !important;

                // &:hover {
                //     background-color: #fafafa !important;
                // }
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
                    visibility: hidden !important;
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
    .newTabDropdown {
        width: 176px;
        height: 104px;

        background: #ffffff;

        box-shadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12),
            0px 6px 16px rgba(0, 0, 0, 0.08),
            0px 9px 28px 8px rgba(0, 0, 0, 0.05);
        border-radius: 4px;
    }
    .newTabDropdownOption {
        width: 160px;
        height: 40px;
        @apply cursor-pointer;

        // background: rgba(82, 119, 215, 0.1);
        border-radius: 4px;
        @apply transition-all;
    }
    .newTabDropdownOption1 {
        background: rgba(82, 119, 215, 0.1);
        color: #5277d7;

        &:hover {
            background: #5277d7;
            color: #fff;
        }
    }
    .newTabDropdownOption2 {
        background: rgba(109, 109, 218, 0.1);
        color: #6d6dda;

        &:hover {
            background: #6d6dda;
            color: #fff;
        }
    }
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
        max-width: 73px;
        width: 73px;
        min-width: 73px;
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
        max-width: 78px;
        // overflow: hidden;
    }
    .playground-height {
        // @apply bg-gray-light !important;
        height: calc(100vh - 40px);
    }
</style>
<style lang="less" module>
    // :global(.unsaved-dot) {
    //     visibility: hidden !important;
    // }
    .splitspane_playground {
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
    }
    :global(.ant-tabs-dropdown-menu-item-remove) {
        visibility: hidden !important;
    }
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
        :global(.ant-tabs-dropdown) {
            width: 117px !important;
        }

        :global(.unsaved-dot) {
            visibility: visible !important;
        }
        // :global(.ant-tabs-dropdown-menu-item-remove) {
        //     visibility: visible !important;
        // }
    }
    :global(.ant-tabs-dropdown-menu-title-content) {
        display: flex !important;
        flex-direction: row !important;
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
