<template>
    <div class="flex flex-col w-full h-full">
        <a-tabs
            v-model:activeKey="activeKey"
            :class="$style.profiletab"
            class="flex-1"
        >
            <a-tab-pane v-for="tab in mainTabs" :key="tab.id">
                <template #tab>
                    <router-link
                        :to="{ params: { tab: tab.id } }"
                        class="select-none"
                        @click.stop=""
                    >
                        {{ tab.label }}
                    </router-link>
                </template>
                <component
                    :is="tab.component"
                    :key="tab.id"
                    style="height: calc(100vh - 86px)"
                />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, defineAsyncComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import { whenever } from '@vueuse/core'
    import { useRoute, useRouter } from 'vue-router'
    import { mainTabs } from '~/workflowsv2/constants/tabs'
    import {
        featureEnabledMap,
        WORKFLOW_CENTER_V2,
    } from '~/composables/labs/labFeatureList'

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
            const route = useRoute()
            const router = useRouter()

            const getTitle = (key: string) => {
                switch (key) {
                    case 'monitor':
                        return 'Monitor Workflows'
                    case 'manage':
                        return 'Manage Workflows'
                    case 'marketplace':
                        return 'Metadata Marketplace'
                    default:
                        return 'Workflow Center'
                }
            }

            if (featureEnabledMap.value[WORKFLOW_CENTER_V2]) {
                if ((route.params.tab?.length || 0) > 17) {
                    const newRoute = route.fullPath.replace(
                        '/workflows/',
                        '/workflows/profile/'
                    )
                    router.replace(newRoute)
                }
            }

            const activeKey = computed({
                get: () => route?.params?.tab,
                set: (key) => {
                    router.push({ params: { tab: key } })
                },
            })

            useHead({
                title: 'Workflow Center',
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
