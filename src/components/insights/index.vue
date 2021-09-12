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
                    :is="activeTab.component"
                    @openSavedQueryInNewTab="openSavedQueryInNewTab"
                    v-if="activeTab && activeTab.component"
                ></component>
                <!--explorer pane end -->
            </pane>
            <pane max-size="100" min-size="60">
                <Playground
                    :tabs="tabsArray"
                    v-model:activeInlineTabKey="activeInlineTabKey"
                    v-model:tabRef="inlineTabRef"
                />
            </pane>
            <pane max-size="20" min-size="0">
                <AssetSidebar />
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
                        isVisible: true,
                        assetInfo: {},
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
                        isVisible: true,
                        assetInfo: {},
                    },
                },
            ])
            const activeTab = computed(() =>
                tabsList.find((tab) => tab.id === activeTabId.value)
            )
            const changeTab = (tab: TabInterface) => {
                activeTabId.value = tab.id
            }
            const openSavedQueryInNewTab = (
                savedQuery: SavedQueryInterface
            ) => {
                console.log(savedQuery, 'savedQUery')
                const key = 'tab' + Date.now()
                inlineTabRef.value.addTab({
                    label: savedQuery.label,
                    key,
                    favico: 'https://atlan.com/favicon.ico',
                    isSaved: true,
                    queryId: 'abcd-01-01',
                    explorer: {},
                    playground: {
                        editorTitle: savedQuery.editor,
                        resultTitle: savedQuery.result,
                    },
                    assetSidebar: {
                        isVisible: true,
                        assetInfo: {},
                    },
                })
                activeInlineTabKey.value = key
            }
            return {
                activeTab,
                activeTabId,
                tabsList,
                activeInlineTabKey,
                inlineTabRef,
                tabsArray,
                changeTab,
                openSavedQueryInNewTab,
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
        left: -15px !important;
        right: -15px !important;
        height: 100% !important;
    }
    :global(.splitpanes--horizontal > .splitpanes__splitter):before {
        top: -15px !important;
        bottom: -15px !important;
        width: 100% !important;
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
