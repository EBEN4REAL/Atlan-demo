<template>
    <div class="overflow-hidden border border-gray-300 rounded-lg customShadow">
        <a-menu v-model:openKeys="openKeys" mode="inline" :class="$style.menu">
            <a-sub-menu key="slack">
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
                                    <AtlanIcon icon="Slack" class="h-8" />
                                </div>
                                <div class="">
                                    <h2 class="text-lg font-bold">Slack</h2>
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
                                class="flex items-center justify-center text-sm rounded gap-x-1"
                            >
                                <AtlanIcon icon="Check" />
                                {{ tenantSlackStatus.teamName }} workspace
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
                                    useTimeAgo(tenantSlackStatus.createdAt)
                                        .value
                                }}</span>
                            </div> -->
                        </div>
                        <div class="">
                            <AtlanIcon
                                icon="CaretDown"
                                class="transition duration-100"
                                :style="
                                    openKeys.includes('slack')
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
                        <SlackUpdateConfiguration />
                    </template>
                </div>
            </a-sub-menu>
        </a-menu>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, reactive, ref, toRefs } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import useTenantData from '~/composables/tenant/useTenantData'
    import integrationStore from '~/store/integrations/index'
    import access from '~/constant/accessControl/map'
    import { integrations } from '~/constant/integrations/integrations'
    import { useUsers } from '~/composables/user/useUsers'
    import MinimalTab from '@/UI/minimalTab.vue'
    import SlackUpdateConfiguration from '@/admin/integrations/slack/updateConfig.vue'

    export default defineComponent({
        name: 'SlackIntegrationCard',
        components: {
            MinimalTab,
            SlackUpdateConfiguration,
        },
        setup() {
            const { name: tenantName } = useTenantData()
            const store = integrationStore()
            const { tenantSlackStatus } = toRefs(store)
            const activeTabKey = ref()
            const openKeys = ref([])
            const tabConfig = [
                { key: 'configuration', label: 'Configurations' },
            ]
            const { description } = integrations.slack
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
                            username: tenantSlackStatus.value.createdBy,
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
                openKeys,
                tabConfig,
                activeTabKey,
                useTimeAgo,
                userList,
                uLoading,
                uError,
                description,
                tenantSlackStatus,
                tenantName,
                access,
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
