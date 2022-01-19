<template>
    <div class="border shadow-sm drop-shadow wrapper">
        <section class="flex items-center p-6 border-b gap-x-3">
            <AtlanIcon icon="Slack" class="h-8" />
            <h2 class="flex-grow text-lg font-bold">Slack</h2>
            <div
                style="color: #00a680"
                class="flex items-center h-8 px-3 bg-gray-100 rounded gap-x-2"
            >
                <AtlanIcon icon="Check" />
                {{ tenantSlackStatus.teamName }} workspace connected
            </div>
        </section>
        <section class="flex flex-col p-6 border-b gap-y-3">
            <div class="flex items-center gap-x-1.5">
                <h2 class="text-lg font-bold">Channels</h2>
                <a-tooltip
                    title="These are the channels where users will be able share Atlan assets"
                    ><AtlanIcon class="mb-0.5" icon="Info"
                /></a-tooltip>
            </div>
            <div class="flex flex-wrap items-center gap-2 p-1 border rounded">
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
                        placeholder="Add channels"
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
                @click="disconnect"
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
        inject,
        onMounted,
        Ref,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import { message } from 'ant-design-vue'
    import AtlanButton from '@/UI/button.vue'
    import useTenantData from '~/composables/tenant/useTenantData'
    import {
        UpdateIntegration,
        archiveIntegration,
        getIntegrationById,
    } from '~/composables/integrations/useIntegrations'
    import integrationStore from '~/store/integrations/index'
    import Chip from '@/UI/chip.vue'
    import access from '~/constant/accessControl/map'
    import { archiveSlack } from '~/composables/integrations/useSlack'

    export default defineComponent({
        name: 'SlackIntegrationCard',
        components: { AtlanButton, Chip },
        setup() {
            const { name: tenantName } = useTenantData()

            const store = integrationStore()
            const { updateIntegration: updateStore } = store

            const { tenantSlackStatus } = toRefs(store)
            const meta = inject('integrationTypeObject')

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

            const refetchIntegration = (id) => {
                const {
                    data: i,
                    isLoading: loading,
                    error: e,
                } = getIntegrationById(id)

                watch(i, (v) => {
                    if (v) store.updateIntegration(v)
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
                        content: 'Adding channel(s)...',
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
                    if (updateData.value?.failedChannels) {
                        const { failedChannels } = updateData.value
                        handleFailed(failedChannels)
                        message.error({
                            content: `Unable to add some channels: "${failedChannels.join(
                                ', '
                            )}"`,
                            key: 'failedChannels',
                            duration: 4,
                        })
                    }
                    refetchIntegration(pV.value.id)
                    message.success({
                        content: 'Updated channel(s) successfully.',
                        key: 'addChannel',
                        duration: 2,
                    })
                }
            })

            return {
                tenantSlackStatus,
                body,
                removeChannel,
                meta,
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
    .wrapper {
        background: url('~/assets/images/integrations/slack-bg.svg') no-repeat
            99.5% 3%;
    }
</style>
