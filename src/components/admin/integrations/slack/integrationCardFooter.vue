<template>
    <section class="flex items-center justify-between px-6 py-4 pt-0 gap-x-3">
        <AtlanButton
            v-auth="access.DELETE_INTEGRATION"
            color="secondary"
            size="sm"
            padding="compact"
            class="text-red-500"
            :is-loading="isLoading"
            @click="handleDisconnect"
        >
            Disconnect
        </AtlanButton>
        <AtlanButton
            :is-loading="updateLoading"
            class="px-6"
            :disabled="!unsavedChanges"
            size="sm"
            padding="compact"
            @click="update"
        >
            Update
        </AtlanButton>
    </section>
</template>

<script setup lang="ts">
    import { message, Modal } from 'ant-design-vue'
    import { computed, ref, watch, h, onMounted, toRefs } from 'vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import {
        archiveSlack,
        UpdateSlackConfig,
        checkAtlanBotInChannels,
    } from '~/composables/integrations/slack/useSlack'
    import { refetchIntegration } from '~/composables/integrations/useIntegrations'

    import access from '~/constant/accessControl/map'
    import ProjectSelector from '@/common/integrations/jira/jiraProjectsSelect.vue'
    import integrationStore from '~/store/integrations/index'
    import { integrations } from '~/constant/integrations/integrations'
    import { useVModels } from '@vueuse/core'
    import { invoke, until, watchOnce } from '@vueuse/core'

    const props = defineProps({
        workflowChannel: {
            type: Object,
            required: true,
        },
        channels: {
            type: Array,
            required: true,
        },
        queryOutputChannels: {
            type: Array,
            required: true,
        },
        unsavedChanges: { type: Boolean, required: true },
    })

    const emit = defineEmits(['handleFailedChannels'])

    const { workflowChannel, channels } = toRefs(props)
    const { unsavedChanges, queryOutputChannels } = useVModels(props, emit)

    const store = integrationStore()
    const { tenantSlackStatus } = toRefs(store)
    const { updateIntegration: updateStore } = store

    const pV = computed(() => ({ id: tenantSlackStatus.value.id }))

    const body = computed(() => ({
        channels: channels.value.map((c) => ({ name: c.name })),
        queryOutputChannels: queryOutputChannels.value.map((c) => ({
            name: c.name,
        })),

        ...(workflowChannel.value.name
            ? {
                  alertsWorkflowChannel: {
                      name: workflowChannel.value.name,
                  },
              }
            : {}),
    }))

    const { data, isLoading, error, disconnect } = archiveSlack(pV)

    const {
        data: updateData,
        isLoading: updateLoading,
        error: updateError,
        mutate: update,
    } = UpdateSlackConfig(pV, body, { immediate: false })

    const AtlanBotBody = ref({})

    const {
        data: atlanBotData,
        isLoading: atlanBotIsLoading,
        error: atlanBotError,
        mutate: atlanBotMutate,
    } = checkAtlanBotInChannels(AtlanBotBody, {
        immediate: false,
    })

    watchOnce(queryOutputChannels, () => {
        AtlanBotBody.value = {
            channels: queryOutputChannels.value.map((channel) => channel?.id),
        }
        atlanBotMutate()
    })

    const updateChannelState = () => {
        try {
            invoke(async () => {
                await until(atlanBotIsLoading).toBe(true)
                if (atlanBotError.value) {
                    console.error(
                        atlanBotError.value,
                        'Error in checking atlan bot in channels'
                    )
                } else if (atlanBotData.value) {
                    watch(atlanBotData, () => {
                        if (!atlanBotData.value?.channelList) return
                        queryOutputChannels.value =
                            queryOutputChannels.value.map((channel) => {
                                if (
                                    atlanBotData.value?.channelList?.includes(
                                        channel?.id
                                    )
                                ) {
                                    return {
                                        ...channel,
                                        atlanBotAdded: true,
                                    }
                                } else {
                                    return {
                                        ...channel,
                                        atlanBotAdded: false,
                                    }
                                }
                            })
                    })
                }
            })
        } catch (e) {
            console.error(e)
        }
    }
    updateChannelState()

    watch([updateLoading, updateError], () => {
        if (updateLoading.value) {
            message.loading({
                content: 'Adding channels...',
                key: 'addChannel',
                duration: 2,
            })
        } else if (updateError.value) {
            const errMsg = updateError.value?.response?.data?.errorMessage || ''
            const generalError = 'Network error'
            const e = errMsg || generalError
            message.error({
                content: e,
                key: 'addChannel',
                duration: 2,
            })
        } else {
            let updatedChannelCount = channels.value.length
            // inserting id for atlan bot check
            updateData.value?.config?.queryOutputChannels?.forEach(
                (_channel, index) => {
                    queryOutputChannels.value[index] = {
                        id: _channel.id,
                        ...queryOutputChannels.value[index],
                        atlanBotAdded: true,
                    }
                }
            )

            AtlanBotBody.value = {
                channels: queryOutputChannels.value
                    .filter((channel) => channel?.id)
                    .map((channel) => channel.id),
            }
            atlanBotMutate().then(() => {
                updateChannelState()
            })

            if (updateData.value?.failedChannels) {
                const { failedChannels } = updateData.value
                emit('handleFailedChannels', failedChannels)
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
            useAddEvent('integration', 'slack', 'share_channels_updated', {
                channel_count: updatedChannelCount,
                workflow_alert_channel_present: !!workflowChannel.value.name,
            })

            message.success({
                content: 'Updated channels successfully.',
                key: 'addChannel',
                duration: 2,
            })
            unsavedChanges.value = false
        }
    })

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
</script>

<style scoped></style>
