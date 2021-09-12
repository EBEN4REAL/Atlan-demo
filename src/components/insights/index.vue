<template>
    <div class="flex h-full">
        <!--Sidebar navigation pane start -->
        <div class="w-20 sidebar">
            <template v-for="tab in tabsList" :key="tab.id">
                <div
                    class="flex flex-col items-center my-8 text-xs"
                    @click="() => changeTab(tab)"
                >
                    <AtlanIcon
                        v-if="tab?.icon"
                        :icon="tab.icon"
                        :class="activeTabId === tab.id ? 'text-primary' : ''"
                    />
                    <div
                        class="w-6 h-6 rounded"
                        :class="
                            activeTabId === tab.id
                                ? 'active-placeholder'
                                : 'placeholder'
                        "
                    ></div>
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
        <splitpanes :class="$style.splitpane__styles">
            <pane max-size="20" min-size="0">
                <!--explorer pane start -->
                <component
                    v-if="activeTab && activeTab.component && activeInlineTab"
                    :is="activeTab.component"
                    :inlineTabs="inlineTabs"
                    :activeInlineTab="activeInlineTab"
                    @openSavedQueryInNewTab="openSavedQueryInNewTab"
                    @openAssetSidebar="openAssetSidebar"
                ></component>
                <!--explorer pane end -->
            </pane>
            <pane
                :size="activeInlineTab?.assetSidebar?.isVisible ? 60 : 80"
                :min-size="activeInlineTab?.assetSidebar?.isVisible ? 60 : 80"
            >
                <Playground
                    :tabs="tabsArray"
                    v-model:activeInlineTabKey="activeInlineTabKey"
                    v-model:tabRef="inlineTabRef"
                />
            </pane>
            <pane
                max-size="20"
                :size="activeInlineTab?.assetSidebar?.isVisible ? 20 : 0"
                min-size="0"
                v-if="
                    activeInlineTab && activeInlineTab?.assetSidebar?.isVisible
                "
            >
                <AssetSidebar
                    :activeTab="activeInlineTab"
                    @closeAssetSidebar="closeAssetSidebar"
                />
            </pane>
        </splitpanes>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, Ref, computed } from 'vue'
    import Playground from '~/components/insights/playground/index.vue'
    import AssetSidebar from '~/components/insights/assetSidebar.vue'
    import Schema from './explorers/schema.vue'
    import Queries from './explorers/queries.vue'
    import History from './explorers/history.vue'
    import Schedule from './explorers/schedule.vue'

    import useInsightsTabList from './useTabList'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { TabInterface } from '~/types/insights/tab.interface'
    import { SavedQueryInterface } from '~/types/insights/savedQuery.interface'
    import { tableInterface } from '~/types/insights/table.interface'

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
            const { allTabs: tabsList } = useInsightsTabList()
            const inlineTabRef = ref()
            const activeTabId = ref(tabsList[0].id)
            const activeInlineTabKey = ref('1')
            const tabsArray: Ref<activeInlineTabInterface[]> = ref([
                {
                    key: '1',
                    label: 'ABCDE',
                    isSaved: true,
                    queryId: 'abcd-01-01',
                    explorer: {},
                    playground: {
                        editorTitle: 'ABCDE EDITOR',
                        resultTitle: 'ABCDE Result',
                    },
                    favico: 'https://atlan.com/favicon.ico',
                    assetSidebar: {
                        isVisible: false,
                        assetInfo: {},
                        title: '',
                        id: '',
                    },
                },
                {
                    key: '2',
                    label: 'ADBE',
                    isSaved: false,
                    queryId: undefined,
                    explorer: {},
                    playground: {
                        editorTitle: 'ADBE EDITOR',
                        resultTitle: 'ADBE Result',
                    },
                    favico: 'https://atlan.com/favicon.ico',
                    assetSidebar: {
                        isVisible: false,
                        assetInfo: {},
                        title: '',
                        id: '',
                    },
                },
                {
                    key: '3',
                    label: 'BCDE',
                    isSaved: false,
                    queryId: undefined,
                    explorer: {},
                    playground: {
                        editorTitle: 'BCDE EDITOR',
                        resultTitle: 'BCDE Result',
                    },
                    favico: 'https://atlan.com/favicon.ico',
                    assetSidebar: {
                        isVisible: false,
                        assetInfo: {},
                        title: '',
                        id: '',
                    },
                },
            ])

            const activeTab = computed(() =>
                tabsList.find((tab) => tab.id === activeTabId.value)
            )
            const activeInlineTab = computed(() =>
                tabsArray.value.find(
                    (tab) => tab.key === activeInlineTabKey.value
                )
            )
            const inlineTabs = computed(() => inlineTabRef.value?.tabs ?? [])
            const changeTab = (tab: TabInterface) => {
                activeTabId.value = tab.id
            }
            const isInlineTabAlreadyOpened = (
                inlineTab: activeInlineTabInterface
            ) => {
                let bool = false
                inlineTabRef.value.tabs.forEach((tab) => {
                    if (tab.key === inlineTab.key) bool = true
                })
                return bool
            }
            const openSavedQueryInNewTab = (
                savedQuery: SavedQueryInterface
            ) => {
                const newTab = {
                    label: savedQuery.label,
                    key: savedQuery.id,
                    favico: 'https://atlan.com/favicon.ico',
                    isSaved: true,
                    queryId: savedQuery.id,
                    explorer: {},
                    playground: {
                        editorTitle: savedQuery.editor,
                        resultTitle: savedQuery.result,
                    },
                    assetSidebar: {
                        isVisible: false,
                        assetInfo: {},
                        title: '',
                        id: '',
                    },
                }
                if (!isInlineTabAlreadyOpened(newTab)) {
                    inlineTabRef.value.addTab(newTab)
                    activeInlineTabKey.value = newTab.key
                } else {
                    // show user that this tab is already opened
                }
            }
            const closeAssetSidebar = (activeTab: activeInlineTabInterface) => {
                const index = tabsArray.value.findIndex(
                    (tab) => tab.key === activeTab.key
                )
                if (index !== -1) {
                    tabsArray.value[index].assetSidebar.isVisible = false
                    tabsArray.value[index].assetSidebar.title = ''
                    tabsArray.value[index].assetSidebar.id = ''
                }
                console.log(tabsArray, 'tabsArray')
            }

            const openAssetSidebar = (table: tableInterface) => {
                const index = tabsArray.value.findIndex(
                    (tab) => tab.key === activeInlineTab.value.key
                )
                if (index !== -1) {
                    tabsArray.value[index].assetSidebar.isVisible = true
                    tabsArray.value[index].assetSidebar.title = table.label
                    tabsArray.value[index].assetSidebar.id = table.id
                }
            }
            return {
                inlineTabs,
                activeTab,
                activeTabId,
                tabsList,
                activeInlineTabKey,
                activeInlineTab,
                inlineTabRef,
                tabsArray,
                changeTab,
                openSavedQueryInNewTab,
                closeAssetSidebar,
                openAssetSidebar,
            }
        },
    })
</script>
<style lang="less" module>
    :global(.splitpanes__splitter) {
        background-color: #e5e7eb;
        position: relative;
    }
    :global(.splitpanes__splitter):hover {
        @apply bg-primary;
    }
    :global(.splitpanes__splitter):before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        z-index: 1;
    }
    :global(.splitpanes__splitter):hover:before {
        opacity: 1;
    }
    :global(.splitpanes--vertical > .splitpanes__splitter):before {
        left: -15px;
        right: -15px;
        height: 100%;
    }
    :global(.splitpanes--horizontal > .splitpanes__splitter):before {
        top: -15px;
        bottom: -15px;
        width: 100%;
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
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
