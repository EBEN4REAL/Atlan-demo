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
</template>

<script setup lang="ts">
    import { message, Modal } from 'ant-design-vue'
    import { toRefs, computed, h, onMounted, ref, Ref, watch } from 'vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

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

    onMounted(() => {
        channels.value = tenantSlackStatus.value.channels as any
        workflowChannel.value.name =
            tenantSlackStatus.value?.alertsWorkflowChannel?.name || ''
    })
</script>

<style scoped></style>
