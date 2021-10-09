<template>
    <div class="flex flex-col w-full h-full">
        <div class="flex justify-end">
            <!-- <a-tabs
                :activeKey="activeResultsPaneTabIndex"
                :class="$style.result_pane"
                @change="
                    (activeKey) =>
                        resultsPaneTabChange(activeKey, activeInlineTab)
                "
            >
                <a-tab-pane
                    v-for="(tab, index) in tabsList"
                    :key="index"
                    class="px-4 overflow-y-auto"
                >
                    <template #tab>
                        {{ tab.name }}
                    </template>
                </a-tab-pane>
            </a-tabs> -->
            <div class="mt-2 mr-3">
                <a-input
                    v-model:value="searchText"
                    :class="$style.input_class"
                    placeholder="Search"
                >
                    <template #suffix>
                        <AtlanIcon
                            icon="Search"
                            class="flex-none pl-2 pr-1 text-gray-500"
                        />
                    </template>
                </a-input>
            </div>
        </div>

        <!-- <component :is="activeResultsPaneTab?.component"></component> -->
        <component :is="'result'"></component>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        Ref,
        inject,
        computed,
        defineAsyncComponent,
    } from 'vue'
    import useInsightsTabList from './useTabList'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useResultPane } from '~/components/insights/playground/resultsPane/common/composables/useResultPane'
    import SearchAndFilter from '~/components/common/input/searchAndFilter.vue'

    export default defineComponent({
        components: {
            result: defineAsyncComponent(() => import('./result.vue')),
            metadata: defineAsyncComponent(() => import('./metadata.vue')),
            queries: defineAsyncComponent(() => import('./queries.vue')),
            filters: defineAsyncComponent(() => import('./filters.vue')),
            joins: defineAsyncComponent(() => import('./joins.vue')),
            downstream: defineAsyncComponent(() => import('./downstream.vue')),
            impersonation: defineAsyncComponent(
                () => import('./impersonation.vue')
            ),
            sqlHelp: defineAsyncComponent(() => import('./sqlHelp.vue')),
            SearchAndFilter,
        },
        props: {},
        setup(props) {
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >
            const { filteredTabs: tabsList } = useInsightsTabList()
            const { resultsPaneTabChange } = useResultPane(inlineTabs)
            const searchText = ref('')
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>

            const activeResultsPaneTabIndex = computed(
                () => activeInlineTab.value?.playground?.resultsPane?.activeTab
            )
            const activeResultsPaneTab = computed(() =>
                tabsList.find(
                    (tab, index) => index === activeResultsPaneTabIndex.value
                )
            )
            return {
                searchText,
                resultsPaneTabChange,
                activeResultsPaneTab,
                activeResultsPaneTabIndex,
                activeInlineTab,
                tabsList,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .box {
        height: 90.5%;
    }
    .tab__height {
        height: calc(100vh - 33.2rem);
    }
</style>
<style lang="less" module>
    .result_pane {
        width: 120px;
        :global(.ant-tabs-tab) {
            @apply p-1 pb-2 !important;
            @apply mx-3;
        }

        :global(.ant-tabs-bar) {
            margin-bottom: 0px;
            border-bottom: none !important;
        }
        :global(.ant-tabs-content) {
            @apply px-0 !important;
        }
        :global(.ant-tabs-ink-bar) {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
        :global(.ant-tabs-tabpane) {
            @apply px-0 !important;
            @apply pb-0 !important;
        }
    }
    .input_class {
        padding: 2px 8px !important;
        @apply text-sm !important;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
