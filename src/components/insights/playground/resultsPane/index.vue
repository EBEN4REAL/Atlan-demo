<template>
    <div class="flex flex-col w-full h-full">
        <a-tabs
            :activeKey="activeResultsPaneTabIndex"
            :class="$style.result_pane"
            @change="
                (activeKey) => resultsPaneTabChange(activeKey, activeInlineTab)
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
        </a-tabs>

        <component :is="activeResultsPaneTab?.component"></component>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        Ref,
        inject,
        computed,
        defineAsyncComponent,
    } from 'vue'
    import useInsightsTabList from './useTabList'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

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
        },
        props: {},
        setup(props) {
            const { allTabs: tabsList } = useInsightsTabList()
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>

            /*
                @params - activeKey: string
                @params - activeInlineTab: activeInlineTabInterface
             */
            const resultsPaneTabChange = inject(
                'resultsPaneTabChange'
            ) as Function

            const activeResultsPaneTabIndex = computed(
                () =>
                    activeInlineTab.value.playground.resultsPane.activeTab ?? 0
            )
            const activeResultsPaneTab = computed(() =>
                tabsList.find(
                    (tab, index) => index === activeResultsPaneTabIndex.value
                )
            )
            return {
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
        :global(.ant-tabs-tab) {
            @apply px-3 !important;
        }

        :global(.ant-tabs-bar) {
            margin-bottom: 0px;
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
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
