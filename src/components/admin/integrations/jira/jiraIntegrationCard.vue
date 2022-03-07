<template>
    <div class="overflow-hidden border border-gray-300 rounded-lg customShadow">
        <a-menu v-model:openKeys="openKeys" mode="inline" :class="$style.menu">
            <a-sub-menu key="jira">
                <template #expandIcon> <AtlanIcon icon="CaretDown" /></template>
                <template #title>
                    <section
                        class="flex items-center h-20 p-6 bg-gray-100 rounded-t-lg gap-x-3"
                    >
                        <div class="flex-grow">
                            <div class="flex items-center gap-x-3">
                                <div
                                    class="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full"
                                >
                                    <AtlanIcon icon="Jira" class="h-8" />
                                </div>
                                <div class="">
                                    <h2 class="text-lg font-bold">Jira</h2>
                                    <span class="text-gray-500">{{
                                        description
                                    }}</span>
                                </div>
                            </div>
                        </div>
                        <div
                            class="px-3 py-1.5 space-y-2 text-primary bg-primary-light rounded"
                        >
                            <div
                                class="flex items-center justify-center rounded gap-x-1"
                            >
                                <AtlanIcon icon="Check" />
                                {{ tenantJiraStatus.orgName }} workspace
                                connected
                            </div>
                            <!-- <div
                                class="flex items-center text-xs text-gray-500 gap-x-1.5 justify-center"
                            >
                                <template v-if="userList[0]">
                                    Added by
                                    <div class="flex justify-center text-xs">
                                        <div class="self-center text-gray-700">
                                            {{ userList[0]?.name }}
                                        </div>
                                    </div>
                                </template>
                                <span>{{
                                    useTimeAgo(tenantJiraStatus.createdAt).value
                                }}</span>
                            </div> -->
                        </div>
                        <div class="">
                            <AtlanIcon
                                icon="CaretDown"
                                class="transition duration-100"
                                :style="
                                    openKeys.includes('jira')
                                        ? 'transform: rotate(180deg)'
                                        : ''
                                "
                            />
                        </div>
                    </section>
                </template>
                <div class="">
                    <MinimalTab
                        v-model:active="activeTabKey"
                        :data="tabConfig"
                        class=""
                    >
                        <template #label="t">
                            {{ t?.data?.label }}
                        </template>
                    </MinimalTab>
                    <template v-if="activeTabKey === 'configuration'">
                        <JiraUpdateConfiguration />
                    </template>
                    <template v-if="activeTabKey === 'overview'">
                        <JiraOverview />
                    </template>
                </div>
            </a-sub-menu>
        </a-menu>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
    import { message, Modal } from 'ant-design-vue'
    import { useTimeAgo } from '@vueuse/core'
    import AtlanButton from '@/UI/button.vue'
    import useTenantData from '~/composables/tenant/useTenantData'

    import integrationStore from '~/store/integrations/index'
    import { integrations } from '~/constant/integrations/integrations'
    import { useUsers } from '~/composables/user/useUsers'
    import MinimalTab from '@/UI/minimalTab.vue'
    import JiraUpdateConfiguration from '@/admin/integrations/jira/updateConfig.vue'
    import JiraOverview from '@/admin/integrations/jira/overview.vue'

    export default defineComponent({
        name: 'JiraIntegrationCard',
        components: {
            AtlanButton,
            JiraOverview,
            JiraUpdateConfiguration,
            MinimalTab,
        },
        setup() {
            const openKeys = ref([])
            const activeTabKey = ref()
            const tabConfig = [
                { key: 'configuration', label: 'Configurations' },
                { key: 'overview', label: 'Overview' },
            ]
            const { name: tenantName } = useTenantData()
            const store = integrationStore()
            const { tenantJiraStatus } = toRefs(store)

            const { description } = integrations.jira

            const userListAPIParams: any = reactive({
                limit: 1,
                offset: 0,
                sort: 'firstName',
                filter: {
                    $and: [
                        {
                            emailVerified: true,
                        },
                        {
                            username: tenantJiraStatus.value.createdBy,
                        },
                    ],
                },
            })

            const {
                userList,
                isLoading: uLoading,
                error: uError,
            } = useUsers(userListAPIParams, true)

            onMounted(() => {
                activeTabKey.value = 'configuration'
            })

            return {
                activeTabKey,
                tabConfig,
                openKeys,
                useTimeAgo,
                userList,
                description,
                tenantJiraStatus,
                tenantName,
            }
        },
    })
</script>

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
