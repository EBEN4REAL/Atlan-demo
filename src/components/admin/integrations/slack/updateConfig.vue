<template>
    <section class="flex flex-col p-6 gap-y-3">
        <div class="">
            <h2 class="mb-1 font-bold">Channels</h2>
            <div class="text-sm text-gray-500">
                {{ channel_description }}
            </div>
        </div>
        <div
            class="flex flex-wrap items-center h-12 gap-2 p-1 mb-5 border rounded"
        >
            <Chip
                v-for="(channel, x) in channels"
                :key="channel.name"
                :index="x"
                :content="channel.name"
                icon="Number"
                :class="
                    channel.invalid ? 'border border-dashed border-red-500' : ''
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
                                removeChannel(channelValue.valueOf.length - 1)
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

        <div class="grid grid-cols-2">
            <AddWorkflowChannel
                v-model:workflowChannel="workflowChannel.name"
                :invalid="workflowChannel.invalid"
                @change="handleWorkflowChannelChange"
            />
        </div>
    </section>
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
        <!-- v-auth="access.UPDATE_INTEGRATIONS" -->
        <AtlanButton
            :is-loading="updateLoading"
            class="px-6"
            :disabled="!isEdit"
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
    import { toRefs, computed, h, onMounted, ref, Ref, watch } from 'vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import {
        archiveSlack,
        UpdateSlackConfig,
    } from '~/composables/integrations/slack/useSlack'
    import { refetchIntegration } from '~/composables/integrations/useIntegrations'
    import integrationStore from '~/store/integrations/index'
    import access from '~/constant/accessControl/map'
    import Chip from '@/UI/chip.vue'
    import AddWorkflowChannel from '@/admin/integrations/slack/misc/addWorkflowChannel.vue'
    import { integrations } from '~/constant/integrations/integrations'

    const props = defineProps({})
    const emit = defineEmits(['change', 'update'])
    const isEdit = ref(false)
    const store = integrationStore()
    const channels: Ref<[{ name: string; invalid?: boolean }]> = ref([])
    const { channel_description } = integrations.slack

    const channelValue = ref([])
    const workflowChannel = ref({ name: '', invalid: false })

    const { tenantSlackStatus } = toRefs(store)

    const pV = computed(() => ({ id: tenantSlackStatus.value.id }))

    const body = computed(() => ({
        channels: channels.value.map((c) => ({ name: c.name })),

        ...(workflowChannel.value.name
            ? {
                  alertsWorkflowChannel: {
                      name: workflowChannel.value.name,
                  },
              }
            : {}),
    }))

    // TODO @SAMIRAN HANDLE FAILED CHANNEL FOR WORKFLOW CHANNEL
    const handleFailed = (failedC) => {
        failedC.forEach((c) => {
            if (c === workflowChannel.value.name)
                workflowChannel.value.invalid = true
            const index = channels.value.findIndex((ch) => ch.name === c)
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
    } = UpdateSlackConfig(pV, body, { immediate: false })

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
            useAddEvent('integration', 'slack', 'share_channels_updated', {
                channel_count: updatedChannelCount,
            })

            message.success({
                content: 'Updated channels successfully.',
                key: 'addChannel',
                duration: 2,
            })
            isEdit.value = false
        }
    })

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
        emit('change', channels.value)
    }

    const handleWorkflowChannelChange = (v) => {
        isEdit.value = true
        if (!v) workflowChannel.value = { name: '', invalid: false }
    }

    const { data, isLoading, error, disconnect } = archiveSlack(pV)

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

    onMounted(() => {
        channels.value = tenantSlackStatus.value.channels as any
        workflowChannel.value.name =
            tenantSlackStatus.value?.alertsWorkflowChannel?.name || ''
    })
</script>

<style scoped></style>
