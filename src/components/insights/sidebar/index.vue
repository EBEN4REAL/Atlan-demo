<template>
    <div class="w-full bg-white">
        <!-- <a-tabs
            v-model:activeKey="activeTabId"
            :class="$style.sidebartab"
            tab-position="left"
            class="h-full"
        >
            <a-tab-pane v-for="tab in tabsList" :key="tab.id" class="px-4">
                <template #tab>
                    <div class="flex flex-col items-center my-2 text-xs">
                        <AtlanIcon
                            v-if="tab?.icon"
                            :icon="tab.icon"
                            :class="
                                activeTabId === tab.id ? 'text-primary' : ''
                            "
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
                            :class="
                                activeTabId === tab.id ? 'text-primary' : ''
                            "
                        >
                            {{ tab.name }}
                        </p>
                    </div>
                </template>

                <div class="tabHeight">
                    <component :is="tab.component"></component>
                </div>
            </a-tab-pane>
        </a-tabs> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, defineAsyncComponent, PropType, ref } from 'vue'
    import { TabInterface } from '~/types/insights/tab.interface'
    import Schema from './explorers/schema.vue'
    import useInsightsTabList from './useTabList'

    export default defineComponent({
        components: {
            schema: Schema,
            queries: defineAsyncComponent(
                () => import('./explorers/queries.vue')
            ),
            activity: defineAsyncComponent(
                () => import('./explorers/schema.vue')
            ),
            history: defineAsyncComponent(
                () => import('./explorers/history.vue')
            ),
            schedule: defineAsyncComponent(
                () => import('./explorers/schedule.vue')
            ),
        },
        props: {
            selectedTab: {
                type: Object as PropType<TabInterface>,
                required: false,
            },
        },
        setup(props) {
            // default id is schema
            const { allTabs: tabsList } = useInsightsTabList()
            const activeTabId = ref(tabsList[0].id)
            return {
                activeTabId,
                tabsList,
            }
        },
    })
</script>
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
<style lang="less" module>
    .sidebartab {
        :global(.ant-tabs-tab) {
            @apply px-4 !important;
        }
        :global(.ant-tabs-ink-bar) {
            @apply hidden !important;
        }

        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0 !important;
        }

        :global(.ant-tabs-bar) {
            margin-bottom: 0px;
            @apply bg-gray-100;
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
