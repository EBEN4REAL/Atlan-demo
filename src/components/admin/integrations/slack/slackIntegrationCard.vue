<template>
    <div class="border rounded-lg shadow drop-shadow wrapper">
        <section
            class="flex items-center h-24 p-6 bg-gray-100 border-b rounded-t-lg bg-slack gap-x-3"
        >
            <div class="flex-grow">
                <div class="flex items-center gap-x-3">
                    <div
                        class="flex items-center justify-center w-12 h-12 bg-gray-200 rounded"
                    >
                        <AtlanIcon icon="Slack" class="h-8" />
                    </div>
                    <div class="">
                        <h2 class="text-lg font-bold">Slack</h2>
                        <span class="text-gray-500">{{ description }}</span>
                    </div>
                </div>
            </div>
            <div
                :style="{
                    color: '#00a680',
                    background:
                        'linear-gradient(90deg,#fafafa 0%,#fafafa 65.62%,rgba(250, 250, 250, 0) 95.54%)',
                }"
                class="px-3 py-1.5 space-y-2"
            >
                <div class="flex items-center justify-center rounded gap-x-1">
                    <AtlanIcon icon="Check" />
                    {{ tenantSlackStatus.teamName }} workspace connected
                </div>
                <div
                    class="flex items-center text-xs text-gray-500 gap-x-1.5 justify-center"
                >
                    <template v-if="userList[0]">
                        Added by
                        <div class="flex justify-center text-xs">
                            <!-- <img
                                :src="avatarURL"
                                class="w-4 h-4 rounded-full"
                            /> -->
                            <div class="self-center text-gray-700">
                                {{ userList[0]?.name }}
                            </div>
                        </div>
                    </template>
                    <span>{{
                        useTimeAgo(tenantSlackStatus.createdAt).value
                    }}</span>
                </div>
            </div>
        </section>
        <section class="flex flex-col p-6 border-b gap-y-3">
            <div class="">
                <h2 class="text-lg font-bold">Channels</h2>
                <span class="text-gray-500"> {{ channel_description }} </span>
            </div>
            <div
                class="flex flex-wrap items-center h-12 gap-2 p-1 border rounded"
            >
                <Chip
                    v-for="(channel, x) in channels"
                    :index="x"
                    :key="channel.name"
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
        </section>
        <section class="flex items-center justify-between p-6 gap-x-3">
            <AtlanButton
                v-auth="access.DELETE_INTEGRATION"
                color="minimal"
                class="px-0 text-red-500"
                :is-loading="isLoading"
                @click="handleDisconnect"
            >
                Disconnect
            </AtlanButton>
            <!-- v-auth="access.UPDATE_INTEGRATIONS" -->
            <AtlanButton
                :is-loading="updateLoading"
                class="w-16"
                :disabled="!isEdit"
                @click="update"
            >
                Save
            </AtlanButton>
        </section>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        h,
        inject,
        onMounted,
        reactive,
        Ref,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import { message, Modal } from 'ant-design-vue'
    import AtlanButton from '@/UI/button.vue'
    import useTenantData from '~/composables/tenant/useTenantData'
    import {
        UpdateIntegration,
        archiveIntegration,
        getIntegrationById,
        refetchIntegration,
    } from '~/composables/integrations/useIntegrations'
    import integrationStore from '~/store/integrations/index'
    import Chip from '@/UI/chip.vue'
    import access from '~/constant/accessControl/map'
    import { archiveSlack } from '~/composables/integrations/useSlack'
    import { integrations } from '~/constant/integrations'
    import { useUsers } from '~/composables/user/useUsers'
    import { useTimeAgo } from '@vueuse/core'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'SlackIntegrationCard',
        components: { AtlanButton, Chip },
        setup() {
            const { name: tenantName } = useTenantData()

            const store = integrationStore()
            const { updateIntegration: updateStore } = store

            const { tenantSlackStatus } = toRefs(store)

            const pV = computed(() => ({ id: tenantSlackStatus.value.id }))

            const channels: Ref<[{ name: string; invalid?: boolean }]> = ref([])

            const channelValue = ref([])

            const isEdit = ref(false)

            const addChannel = (e) => {
                const value = e?.target?.value.trim() ?? null
                if (value) {
                    channels.value.push({ name: value })
                    isEdit.value = true
                }
                channelValue.value = []
            }

            const removeChannel = (i) => {
                const index = i
                channels.value.splice(index, 1)
                isEdit.value = true
            }

            onMounted(() => {
                channels.value = tenantSlackStatus.value.channels as any
            })

            const body = computed(() => ({
                channels: channels.value.map((c) => ({ name: c.name })),
            }))

            const { data, isLoading, error, disconnect } = archiveSlack(pV)

            const handleFailed = (failedC) => {
                failedC.forEach((c) => {
                    const index = channels.value.findIndex(
                        (ch) => ch.name === c
                    )
                    if (index > -1) {
                        channels.value[index].invalid = true
                    }
                })
            }

            const {
                data: updateData,
                isLoading: updateLoading,
                error: updateError,
                mutate: update,
            } = UpdateIntegration(pV, body, { immediate: false })

            watch([updateLoading, updateError], () => {
                if (updateLoading.value) {
                    message.loading({
                        content: 'Adding channels...',
                        key: 'addChannel',
                        duration: 2,
                    })
                } else if (updateError.value) {
                    const errMsg =
                        updateError.value?.response?.data?.errorMessage || ''
                    const generalError = 'Network error'
                    const e = errMsg || generalError
                    message.error({
                        content: e,
                        key: 'addChannel',
                        duration: 2,
                    })
                } else {
                    let updatedChannelCount = channels.value.length
                    if (updateData.value?.failedChannels) {
                        const { failedChannels } = updateData.value
                        handleFailed(failedChannels)
                        updatedChannelCount -= failedChannels.length
                        message.error({
                            content: `Unable to add some channels: "${failedChannels.join(
                                ', '
                            )}"`,
                            key: 'failedChannels',
                            duration: 4,
                        })
                    }
                    refetchIntegration(pV.value.id)
                    useAddEvent(
                        'integration',
                        'slack',
                        'share_channels_updated',
                        {
                            channel_count: updatedChannelCount,
                        }
                    )

                    message.success({
                        content: 'Updated channels successfully.',
                        key: 'addChannel',
                        duration: 2,
                    })
                }
            })

            const { description, channel_description } = integrations.slack

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

            const avatarURL = computed(
                () =>
                    `${window.location.origin}/api/service/avatars/${tenantSlackStatus.value.createdBy}`
            )

            const {
                userList,
                isLoading: uLoading,
                error: uError,
            } = useUsers(userListAPIParams, true)

            const handleDisconnect = () => {
                Modal.confirm({
                    class: '',
                    icon: null,
                    content: () =>
                        h('div', { class: [''] }, [
                            h(
                                'h1',
                                {
                                    class: ['font-bold -mt-4 mb-2'],
                                },
                                ['Disconnect Slack']
                            ),

                            h(
                                'div',
                                {
                                    class: ['font-normal'],
                                },
                                [
                                    'Are you sure you want to disconnect ',
                                    h(
                                        'b',
                                        {
                                            class: [''],
                                        },
                                        'Slack'
                                    ),
                                    ' integration?',
                                ]
                            ),
                            h(
                                'div',
                                {
                                    class: ['font-normal', 'mb-2'],
                                },
                                [
                                    'This will also disconnect slack integration for other users.',
                                ]
                            ),
                        ]),
                    okType: 'danger',
                    autoFocusButton: null,
                    okButtonProps: {
                        type: 'primary',
                    },
                    okText: 'Disconnect',
                    cancelText: 'Cancel',
                    async onOk() {
                        await disconnect()
                        useAddEvent('admin', 'integration', 'removed', {
                            integration: 'slack',
                            level: 'tenant',
                        })
                    },
                })
            }

            return {
                handleDisconnect,
                useTimeAgo,
                avatarURL,
                userList,
                uLoading,
                uError,
                channel_description,
                description,
                tenantSlackStatus,
                body,
                removeChannel,
                isLoading,
                tenantName,
                updateLoading,
                channelValue,
                addChannel,
                disconnect,
                update,
                channels,
                isEdit,
                access,
            }
        },
    })
</script>

<style scoped>
    .bg-slack {
        background: url('~/assets/images/admin/integrations/add-slack-bg.svg')
            no-repeat;
        background-size: contain;
        background-position-x: right;
    }
</style>