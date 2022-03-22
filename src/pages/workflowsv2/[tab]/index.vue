<template>
    <div class="flex flex-col w-full h-full">
        <a-tabs
            v-model:activeKey="activeKey"
            :class="$style.profiletab"
            class="flex-1"
        >
            <a-tab-pane v-for="tab in mainTabs" :key="tab.id" :tab="tab.label">
                <component :is="tab.component" :key="tab.id" />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, defineAsyncComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute, useRouter } from 'vue-router'
    import { mainTabs } from '~/workflowsv2/constants/tabs'

    export default defineComponent({
        name: 'WorkflowV2Tabs',
        components: {
            Monitor: defineAsyncComponent(
                () => import('~/workflowsv2/components/monitor/monitor.vue')
            ),
            Manage: defineAsyncComponent(
                () => import('~/workflowsv2/components/manage/manage.vue')
            ),
            Marketplace: defineAsyncComponent(
                () =>
                    import(
                        '~/workflowsv2/components/marketplace/marketplace.vue'
                    )
            ),
        },
        setup() {
            useHead({
                title: 'Workflows Center V2',
            })
            const route = useRoute()
            const router = useRouter()

            const activeKey = computed({
                get: () => route?.params?.tab,
                set: (key) => {
                    router.push({ params: { tab: key } })
                },
            })
            return { activeKey, mainTabs }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>

<style lang="less" module>
    .profiletab {
        :global(.ant-tabs-tab:first-child) {
            @apply ml-6;
        }

        :global(.ant-tabs-tab-active) {
            -webkit-text-stroke: 0.65px;
            -moz-text-stroke: 0.65px;
        }

        :global(.ant-tabs-nav) {
            background-color: #f6f7f9;
            @apply mb-0 !important;
        }

        :global(.ant-tabs-content-holder) {
            @apply bg-primary-light overflow-y-auto !important;
        }
        :global(.ant-tabs-content) {
            @apply min-h-full !important;
        }
    }
</style>
