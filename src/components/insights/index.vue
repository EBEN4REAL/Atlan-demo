<template>
    <div class="flex h-full">
        <div class="w-24 sidebar">
            <template v-for="tab in tabsList" :key="tab.id">
                <div
                    class="flex flex-col items-center my-2 text-xs"
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
        <splitpanes>
            <pane max-size="27" size="27" min-size="0" class="border-r">
                <component :is="activeTab.component"></component>
            </pane>
            <pane>
                <Playground
                    :tabs="tabsArray"
                    v-model:activeInlineTabKey="activeInlineTabKey"
                />
            </pane>
            <pane class="" max-size="20" size="20" min-size="0">
                <AssetSidebar />
            </pane>
        </splitpanes>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, Ref, computed } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import Sidebar from '~/components/insights/sidebar/index.vue'
    import Playground from '~/components/insights/playground/index.vue'
    import AssetSidebar from '~/components/insights/assetSidebar.vue'
    import useInsightsTabList from './useTabList'
    import { TabInterface } from '~/types/insights/tab.interface'
    import Schema from './sidebar/explorers/schema.vue'
    import Queries from './sidebar/explorers/queries.vue'
    import History from './sidebar/explorers/history.vue'
    import Schedule from './sidebar/explorers/schedule.vue'

    export default defineComponent({
        components: {
            Sidebar,
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
            return {
                activeTab,
                activeTabId,
                tabsList,
                activeInlineTabKey,
                tabsArray,
                changeTab,
            }
        },
    })
</script>
<style lang="less" module>
    .splitpane {
        :global(.splitpanes__splitter:before) {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            transition: opacity 0.4s;
            background-color: rgba(255, 0, 0, 0.3);
            opacity: 0;
            z-index: 1;
        }
        :global(.splitpanes--vertical > .splitpanes__splitter:before) {
            left: -30px;
            right: -30px;
            height: 100%;
        }
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
