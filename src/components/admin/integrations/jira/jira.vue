<template>
    <div
        class="overflow-hidden border rounded-lg customShadow"
        :class="
            openKeys.includes('jira')
                ? ' border-primary-focus'
                : 'border-gray-300'
        "
    >
        <a-menu v-model:openKeys="openKeys" mode="inline" :class="$style.menu">
            <a-sub-menu key="jira">
                <!--  a-menu  all of these is getting mounted twice ? find out why -->

                <template #expandIcon> <AtlanIcon icon="CaretDown" /></template>
                <template #title>
                    <JiraHeader :is-open="openKeys.includes('jira')" />
                </template>

                <UpdateJiraConfig v-if="tenantJiraStatus.configured" />
                <template v-else>
                    <OverviewBanner
                        class="flex flex-col p-4 m-6 border rounded-lg gap-y-3"
                    />
                </template>
            </a-sub-menu>
        </a-menu>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, ref, toRefs, watch } from 'vue'
    import v from 'event-source-polyfill'
    import { useTimeAgo } from '@vueuse/core'
    import OverviewBanner from '@/admin/integrations/jira/misc/overviewBannerCard.vue'

    import integrationStore from '~/store/integrations/index'
    import { useUsers } from '~/composables/user/useUsers'
    import JiraHeader from '@/admin/integrations/jira/jiraHeader.vue'
    import UpdateJiraConfig from '@/admin/integrations/jira/updateJiraConfig.vue'

    export default defineComponent({
        name: 'JiraIntegrationCard',
        components: {
            JiraHeader,
            UpdateJiraConfig,
            OverviewBanner,
        },
        setup() {
            const openKeys = ref(['jira'])

            const store = integrationStore()
            const { tenantJiraStatus } = toRefs(store)

            return {
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
            :global(.ant-menu-title-content + svg) {
                @apply hidden !important;
            }
        }

        :global(.ant-menu) {
        }

        :global(.ant-menu-inline) {
            @apply bg-white !important;
        }
    }
</style>
