<template>
    <div class="flex h-full">
        <!--Sidebar navigation pane start -->
        <div class="py-3 bg-white border-r sidebar-nav">
            <template v-for="tab in tabsList" :key="tab.id">
                <div
                    class="flex flex-col items-center text-xs  my-7 sidebar-nav-icon"
                    @click="() => changeTab(tab)"
                >
                    <AtlanIcon
                        v-if="tab?.icon"
                        :icon="tab.icon"
                        class="w-6 h-6"
                        :class="activeTabId === tab.id ? 'text-primary' : ''"
                    />
                    <p
                        class="mt-2 mb-0 text-gray"
                        :class="activeTabId === tab.id ? 'text-primary' : ''"
                    >
                        {{ tab.name }}
                    </p>
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
                class="explorer_splitpane"
            >
                <!--explorer pane start -->
                <component
                    v-if="activeTab && activeTab.component"
                    :is="activeTab.component"
                ></component>
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
                    activeInlineTab?.assetSidebar?.isVisible ? 55.5 : 75.5
                "
            >
                <Playground :activeInlineTabKey="activeInlineTabKey" />
            </pane>
            <pane
                :max-size="20"
                :min-size="0"
                :size="
                    activeInlineTab?.assetSidebar?.isVisible
                        ? assetSidebarPaneSize
                        : 0
                "
                v-if="
                    activeInlineTab && activeInlineTab?.assetSidebar?.isVisible
                "
            >
                <AssetSidebar />
            </pane>
        </splitpanes>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, watch, inject, Ref } from 'vue'
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
    // import { useHotKeys } from './common/composables/useHotKeys'

    import { TabInterface } from '~/types/insights/tab.interface'
    import { SavedQuery } from '~/types/insights/savedQuery.interface'

    export default defineComponent({
        components: {
            Playground,
            AssetSidebar,
            schema: Schema,
            queries: Queries,
            history: History,
            schedule: Schedule,
        },
        props: {},
        setup(props) {
            const savedQueryInfo = inject('savedQueryInfo') as Ref<
                SavedQuery | undefined
            >
            const { explorerPaneSize, assetSidebarPaneSize, paneResize } =
                useSpiltPanes()
            // TODO: will be used for HOTKEYs
            // const {explorerPaneToggle,assetSidebarToggle} =useHotKeys();

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
            const activeTabId = ref(tabsList[0].id)

            const activeTab = computed(() =>
                tabsList.find((tab) => tab.id === activeTabId.value)
            )

            const changeTab = (tab: TabInterface) => {
                activeTabId.value = tab.id
            }

            /*---------- PROVIDERS FOR CHILDRENS -----------------
            ---Be careful to add a property/function otherwise it will pollute the whole flow for childrens--
            */
            const provideData: provideDataInterface = {
                activeInlineTab: activeInlineTab,
                activeInlineTabKey: activeInlineTabKey,
                inlineTabs: tabsArray,
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
        margin-left: -1px;
        box-sizing: border-box;
        position: relative;
        touch-action: none;
        border-width: 1.5px !important;
        border-right: 0px !important;
        @apply border-r !important;
        &:hover {
            @apply border-primary;
            border-width: 2px !important;
        }
    }
    :global(.splitpanes--horizontal > .splitpanes__splitter) {
        position: relative;
        margin-top: -1px;
        box-sizing: border-box;
        position: relative;
        touch-action: none;
        border-width: 1.5px !important;
        border-top: 0px !important;
        @apply border-t !important;
        &:hover {
            @apply border-primary;
            border-width: 2px !important;
        }
    }
    :global(.splitpanes--vertical > .splitpanes__splitter):before {
        // content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        background-color: rgba(0, 0, 0, 0.15);
        -webkit-transition: background-color 0.3s;
        transition: background-color 0.3s;

        margin-left: -2px;

        transform: translateY(-50%);
        width: 1px;
        height: 30px;
    }
    :global(.splitpanes--vertical > .splitpanes__splitter):hover:before {
        @apply bg-primary !important;
    }
    :global(.splitpanes--vertical > .splitpanes__splitter):hover:after {
        @apply bg-primary !important;
    }
    :global(.splitpanes--vertical > .splitpanes__splitter):after {
        // content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        background-color: rgba(0, 0, 0, 0.15);
        -webkit-transition: background-color 0.3s;
        transition: background-color 0.3s;

        transform: translateY(-50%);
        width: 1px;
        height: 30px;

        margin-left: 1px;
    }
    :global(.splitpanes--horizontal > .splitpanes__splitter):before {
        // content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        background-color: rgba(0, 0, 0, 0.15);
        -webkit-transition: background-color 0.3s;
        transition: background-color 0.3s;
        margin-top: -2px;
        transform: translateX(-50%);
        width: 30px;
        height: 1px;
    }
    :global(.splitpanes--horizontal > .splitpanes__splitter):after {
        // content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        background-color: rgba(0, 0, 0, 0.15);
        -webkit-transition: background-color 0.3s;
        transition: background-color 0.3s;

        transform: translateX(-50%);
        width: 30px;
        height: 1px;

        margin-top: 1px;
    }
    :global(.splitpanes--horizontal > .splitpanes__splitter):hover:before {
        @apply bg-primary !important;
    }
    :global(.splitpanes--horizontal > .splitpanes__splitter):hover:after {
        @apply bg-primary !important;
    }
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
    .sidebar-nav-icon:first-child {
        @apply mt-0 !important;
    }
    .sidebar-nav {
        /* 60px */
        width: 3.75rem;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
