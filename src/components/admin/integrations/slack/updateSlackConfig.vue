<template>
    <section class="">
        <MinimalTab v-model:active="activeTabKey" :data="tabConfig" class="">
            <template #label="t">
                {{ t?.data?.label }}
            </template>
        </MinimalTab>
        <template v-if="activeTabKey === 'configuration'">
            <section class="grid grid-cols-3 gap-10 p-6">
                <div class="">
                    <h2 class="mb-1 font-bold">Channels</h2>
                    <div class="text-sm text-gray-500">
                        {{ channel_description }}
                    </div>
                </div>
                <div
                    class="flex flex-wrap items-center col-span-2 gap-2 p-1 mb-5 border border-gray-300 rounded min-h-10"
                >
                    <Chip
                        v-for="(channel, x) in channels"
                        :key="channel.name"
                        :index="x"
                        :content="channel.name"
                        icon="Number"
                        :class="
                            channel.invalid
                                ? 'border border-dashed border-red-500'
                                : ''
                        "
                        @remove="removeChannel"
                    />

                    <div class="flex-grow inline-block mx-3">
                        <input
                            v-model="channelValue"
                            class="w-full focus:outline-none"
                            placeholder="Add public channels"
                            @keydown.enter="addChannel"
                            @blur="addChannel"
                            @keydown.backspace="
                                (e) => {
                                    if (!e?.target?.value)
                                        removeChannel(
                                            channelValue.valueOf.length - 1
                                        )
                                }
                            "
                            @keydown.tab="
                                (e) => {
                                    e.preventDefault()
                                    addChannel(e)
                                }
                            "
                        />
                    </div>
                </div>

                <AddWorkflowChannel
                    v-model:workflowChannel="workflowChannel.name"
                    :invalid="workflowChannel.invalid"
                    @change="handleWorkflowChannelChange"
                />
            </section>
        </template>
        <template v-if="activeTabKey === 'overview'">
            <SlackOverview
                :avatar-u-r-l="avatarURL"
                :user="userList?.length && userList[0]"
                :created-at="tenantSlackStatus.createdAt"
            />
        </template>
        <Footer
            v-model:unsavedChanges="unsavedChanges"
            :workflow-channel="workflowChannel"
            :channels="channels"
            @handleFailedChannels="handleFailed"
        />
    </section>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        onMounted,
        reactive,
        Ref,
        ref,
        toRefs,
    } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import useTenantData from '~/composables/tenant/useTenantData'
    import integrationStore from '~/store/integrations/index'
    import access from '~/constant/accessControl/map'
    import { integrations } from '~/constant/integrations/integrations'
    import { useUsers } from '~/composables/user/useUsers'
    import MinimalTab from '@/UI/minimalTab.vue'
    import SlackOverview from '@/admin/integrations/slack/overview.vue'
    import Footer from '@/admin/integrations/slack/integrationCardFooter.vue'
    import AddWorkflowChannel from '@/admin/integrations/slack/misc/addWorkflowChannel.vue'
    import Chip from '@/UI/chip.vue'

    export default defineComponent({
        name: 'SlackIntegrationCard',
        components: {
            MinimalTab,
            Chip,
            Footer,
            SlackOverview,
            AddWorkflowChannel,
        },
        setup() {
            const unsavedChanges = ref(false)
            const { name: tenantName } = useTenantData()
            const store = integrationStore()
            const { tenantSlackStatus } = toRefs(store)
            const activeTabKey = ref()
            const openKeys = ref([])
            const tabConfig = [
                { key: 'configuration', label: 'Configurations' },
                { key: 'overview', label: 'Overview' },
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

            const avatarURL = computed(
                () =>
                    `${window.location.origin}/api/service/avatars/${tenantSlackStatus.value.createdBy}`
            )

            const channels: Ref<{ name: string; invalid?: boolean }[]> = ref([])
            const { channel_description } = integrations.slack

            const channelValue = ref([])
            const workflowChannel = ref({ name: '', invalid: false })

            const handleFailed = (failedC) => {
                failedC.forEach((c) => {
                    if (c === workflowChannel.value.name)
                        workflowChannel.value.invalid = true
                    const index = channels.value.findIndex(
                        (ch) => ch.name === c
                    )
                    if (index > -1) {
                        channels.value[index].invalid = true
                    }
                })
            }

            const addChannel = (e) => {
                const value = e?.target?.value.trim() ?? null
                if (value) {
                    channels.value.push({ name: value })
                    unsavedChanges.value = true
                }
                channelValue.value = []
            }

            const removeChannel = (i) => {
                const index = i
                channels.value.splice(index, 1)
                unsavedChanges.value = true
                emit('change', channels.value)
            }

            const handleWorkflowChannelChange = (v) => {
                unsavedChanges.value = true
                if (!v) workflowChannel.value = { name: '', invalid: false }
            }

            onMounted(() => {
                activeTabKey.value = 'configuration'

                channels.value = tenantSlackStatus.value.channels as any
                workflowChannel.value.name =
                    tenantSlackStatus.value?.alertsWorkflowChannel?.name || ''
            })

            return {
                channelValue,
                workflowChannel,
                channels,
                unsavedChanges,
                channel_description,
                handleFailed,
                addChannel,
                removeChannel,
                handleWorkflowChannelChange,
                avatarURL,
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
