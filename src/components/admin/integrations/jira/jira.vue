<template>
    <div
        class="overflow-hidden border rounded-lg customShadow"
        :class="
            openKeys.includes('jira')
                ? ' border-primary-focus'
                : 'border-gray-300'
        "
    >
        <a-menu
            v-model:openKeys="openKeys"
            :force-sub-menu-render="false"
            mode="inline"
            :class="$style.menu"
            trigger-sub-menu-action="click"
        >
            <a-sub-menu key="jira" mode="inline">
                <template #title>
                    <JiraHeader
                        class="cursor-pointer"
                        :is-open="openKeys.includes('jira')"
                        :jira-app-installed="jiraAppInstalled"
                        :jira-app-status-loading="countLoading"
                    />
                </template>
                <a-menu-item>
                    <!-- <template v-if="!countReady">
                        <div
                            class="flex items-center justify-center w-full h-40"
                        >
                            <AtlanLoader class="h-10" />
                        </div>
                    </template> -->
                    <UpdateJiraConfig
                        v-if="tenantJiraStatus.configured && jiraAppInstalled"
                    />
                    <template v-else>
                        <OverviewBanner
                            class="flex flex-col p-4 m-6 border rounded-lg gap-y-3"
                        />
                    </template>
                </a-menu-item>
            </a-sub-menu>
        </a-menu>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        toRefs,
        defineAsyncComponent,
        computed,
        watch,
    } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import OverviewBanner from '@/admin/integrations/jira/misc/overviewBannerCard.vue'

    import integrationStore from '~/store/integrations/index'
    import JiraHeader from '@/admin/integrations/jira/jiraHeader.vue'
    import { issuesCount } from '~/composables/integrations/jira/useJiraTickets'

    export default defineComponent({
        name: 'JiraIntegrationCard',
        components: {
            JiraHeader,
            UpdateJiraConfig: defineAsyncComponent(
                () => import('@/admin/integrations/jira/updateJiraConfig.vue')
            ),
            OverviewBanner,
        },
        setup() {
            const openKeys = ref<String[]>([])

            const store = integrationStore()
            const { tenantJiraStatus } = toRefs(store)

            const {
                count,
                isReady: countReady,
                mutate,
                isLoading: countLoading,
            } = issuesCount(false, false)

            watch(
                () => tenantJiraStatus.value.configured,
                (v) => {
                    if (v) mutate()
                },
                { immediate: true }
            )

            const jiraAppInstalled = computed(
                () => countReady?.value && !!count.value
            )

            return {
                countLoading,
                countReady,
                jiraAppInstalled,
                openKeys,
                useTimeAgo,
                tenantJiraStatus,
            }
        },
    })
</script>

<style scoped>
    .customShadow:hover {
        box-shadow: 0px 8px 24px rgba(25, 32, 56, 0.04);
    }
</style>

<style lang="less" module>
    .menu {
        div {
            line-height: normal;
        }
        @apply border-none  !important;
        :global(.ant-menu-submenu-title) {
            @apply h-full p-0 m-0 !important;
            :global(.ant-menu-submenu-arrow) {
                @apply hidden !important;
            }
        }

        :global(.ant-menu-title-content) {
            @apply cursor-default;
        }

        :global(.ant-menu-item) {
            @apply h-full  bg-white px-0 !important;
        }

        :global(.ant-menu-submenu-title:active) {
            @apply bg-transparent;
        }

        :global(.ant-menu-inline) {
            @apply bg-white !important;
        }

        :global(.ant-menu-item-selected) {
            @apply text-gray-700;
        }
        :global(.ant-menu-item:hover) {
            @apply text-gray-700;
        }
    }
    :global(.ant-menu-item::after) {
        @apply border-r-0 !important;
    }
</style>
