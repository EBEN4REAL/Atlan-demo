<template>
    <div class="flex h-full" id="fullScreenId">
        <!--Sidebar navigation pane start -->
        <div class="bg-white border-r sidebar-nav">
            <template v-for="tab in tabsList" :key="tab.id">
                <div
                    class="
                        relative
                        flex flex-col
                        items-center
                        text-xs
                        sidebar-nav-icon
                    "
                    @click="() => changeTab(tab)"
                >
                    <AtlanIcon
                        v-if="tab?.icon"
                        :icon="tab.icon"
                        class="w-6 h-6"
                        :class="activeTabId === tab.id ? 'text-primary' : ''"
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
            @resize="paneResize"
            class="parent_splitpanes"
        >
            <pane
                :max-size="24.5"
                :size="explorerPaneSize"
                :min-size="0"
                class="relative explorer_splitpane"
            >
                <!--explorer pane start -->
                <div
                    v-if="activeTab.component === 'schema'"
                    class="absolute h-full full-width"
                >
                    <Schema />
                </div>
                <div
                    v-if="activeTab.component === 'queries'"
                    class="absolute h-full full-width"
                >
                    <Queries />
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
            >
                <Playground :activeInlineTabKey="activeInlineTabKey" />
            </pane>
            <pane
                :max-size="25"
                :min-size="0"
                :size="
                    activeInlineTab?.assetSidebar?.isVisible
                        ? assetSidebarPaneSize
                        : 0
                "
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
        onUnmounted,
        onMounted,
    } from 'vue'
    import Playground from '~/components/insights/playground/index.vue'
    import AssetSidebar from '~/components/insights/assetSidebar/index.vue'
    import Schema from './explorers/schema/index.vue'
    import Queries from './explorers/queries/index.vue'
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
    import { useSavedQuery } from '~/components/insights/explorers/composables/useSavedQuery'
    // import { useConnector } from './common/composables/useConnector'
    import { useHotKeys } from './common/composables/useHotKeys'
    import { useFullScreen } from './common/composables/useFullScreen'

    import { TabInterface } from '~/types/insights/tab.interface'
    import { SavedQuery } from '~/types/insights/savedQuery.interface'
    import useRunQuery from '~/components/insights/playground/common/composables/useRunQuery'

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
            const savedQueryInfo = inject('savedQueryInfo') as Ref<
                SavedQuery | undefined
            >
            const {
                explorerPaneSize,
                assetSidebarPaneSize,
                outputPaneSize,
                paneResize,
            } = useSpiltPanes()
            // TODO: will be used for HOTKEYs
            const { explorerPaneToggle, resultsPaneSizeToggle } = useHotKeys()
            const { fullSreenState } = useFullScreen()

            const { filteredTabs: tabsList } = useInsightsTabList()
            const {
                syncInlineTabsInLocalStorage,
                syncActiveInlineTabKeyInLocalStorage,
            } = useLocalStorageSync()

            const { tabsArray, activeInlineTabKey, activeInlineTab } =
                useInlineTab()

            const { openSavedQueryInNewTab } = useSavedQuery(
                tabsArray,
                activeInlineTab,
                activeInlineTabKey
            )
            const { isQueryRunning, queryExecutionTime } = useRunQuery()
            const activeTabId = ref(tabsList[0].id)

            const activeTab = computed(() =>
                tabsList.find((tab) => tab.id === activeTabId.value)
            )

            const changeTab = (tab: TabInterface) => {
                activeTabId.value = tab.id
            }
            const editorInstance: Ref<any> = ref()
            const monacoInstance: Ref<any> = ref()

            const setEditorInstance = (
                editorInstanceParam: any,
                monacoInstanceParam?: any
            ) => {
                editorInstance.value = editorInstanceParam
                if (monacoInstanceParam)
                    monacoInstance.value = monacoInstanceParam
                console.log(editorInstanceParam, editorInstance, 'fxn')
            }

            /*---------- PROVIDERS FOR CHILDRENS -----------------
            ---Be careful to add a property/function otherwise it will pollute the whole flow for childrens--
            */
            const provideData: provideDataInterface = {
                activeInlineTab: activeInlineTab,
                activeInlineTabKey: activeInlineTabKey,
                inlineTabs: tabsArray,
                isQueryRunning: isQueryRunning,
                editorInstance: editorInstance,
                monacoInstance: monacoInstance,
                outputPaneSize: outputPaneSize,
                queryExecutionTime: queryExecutionTime,
                fullSreenState: fullSreenState,
                setEditorInstance: setEditorInstance,
            }
            useProvide(provideData)
            /*-------------------------------------*/

            /* Watchers for syncing in localstorage*/
            watch(activeInlineTabKey, () => {
                syncActiveInlineTabKeyInLocalStorage(activeInlineTabKey.value)
                syncInlineTabsInLocalStorage(tabsArray.value)
            })
            watch(savedQueryInfo, () => {
                if (savedQueryInfo.value !== undefined) {
                    // const savedQueryInlineTab =
                    //     transformSavedQueryResponseInfoToInlineTab(
                    //         savedQueryInfo as Ref<SavedQuery>
                    //     )
                    openSavedQueryInNewTab(savedQueryInfo.value)
                }
            })
            const _keyListener = (e) => {
                if (e.key === 'b' && e.ctrlKey) {
                    e.preventDefault()
                    explorerPaneToggle(explorerPaneSize)
                    //prevent the default action
                }
                if (e.key === 'j' && e.ctrlKey) {
                    e.preventDefault()
                    resultsPaneSizeToggle(outputPaneSize)
                    //prevent the default action
                }
            }
            onMounted(() => {
                window.addEventListener('keypress', _keyListener)
            })
            onUnmounted(() => {
                window.removeEventListener('keypress', _keyListener)
            })

            return {
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
        border-width: 1.5px !important;
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
                transform: translateY(-50%);
                width: 2px;
                height: 100%;
                @apply z-50 !important;
            }
            &:after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                @apply bg-transparent;
                -webkit-transition: background-color 0.3s;
                transition: background-color 0.3s;
                transform: translateY(-50%);
                width: 5px;
                height: 100%;
                margin-left: 0px;
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
