<template>
    <div class="border shadow-sm drop-shadow wrapper">
        <section class="flex items-center p-6 border-b gap-x-3">
            <AtlanIcon icon="Slack" class="h-10" />
            <h2 class="flex-grow text-lg font-bold">{{ meta.name }}</h2>
            <div
                style="color: #00a680"
                class="flex items-center h-8 px-3 bg-gray-100 rounded gap-x-2"
            >
                <AtlanIcon icon="Check" /> {{ tenantName }} Workspace connected
            </div>
        </section>
        <section class="flex flex-col p-6 border-b gap-y-3">
            <h2 class="text-lg font-bold">Channels</h2>
            <p>
                {{ meta.description_conected }}
            </p>
            <div class="p-3 border rounded">
                <span
                    class="px-3 py-2 rounded-full"
                    style="background: #f3f3f3"
                >
                    <AtlanIcon icon="Number" class="mb-1 text-gray-500" />
                    Channel 1
                </span>
                <div class="inline-block w-48 mx-3">
                    <input
                        class="focus:outline-none"
                        placeholder="Enter to add channels"
                    />
                </div>
            </div>
        </section>
        <section class="flex items-center justify-between p-6 gap-x-3">
            <AtlanButton
                color="minimal"
                class="text-red-500"
                @click="disconnect"
            >
                Disconnect
            </AtlanButton>
            <AtlanButton class="w-16" @click="update">Save</AtlanButton>
        </section>
    </div>
</template>

<script lang="ts">
    import { defineComponent, inject } from 'vue'
    import AtlanButton from '@/UI/button.vue'
    import useTenantData from '~/composables/tenant/useTenantData'
    import {
        UpdateIntegration,
        archiveIntegration,
    } from '@/integrations/useIntegrations'

    export default defineComponent({
        name: 'SlackIntegrationCard',
        components: { AtlanButton },
        setup() {
            const { name: tenantName } = useTenantData()

            const meta = inject('data')
            const integration = inject('integration')
            const pV = { id: `0c6495c0-2b2f-4fd1-8876-b5d9e0ad4a35` }

            const body = {
                source_metadata: {
                    default_channels: ['team-platform', 'team-product'],
                },
            }
            const {
                data,
                isLoading,
                error,
                mutate: disconnect,
            } = archiveIntegration(pV, { immediate: false })

            const {
                data: updateData,
                isLoading: updateLoading,
                error: updateError,
                mutate: update,
            } = UpdateIntegration(pV, body, { immediate: false })

            return { meta, tenantName, integration, disconnect, update }
        },
    })
</script>

<style scoped>
    .wrapper {
        background: url('~/assets/images/integrations/slack-bg.svg') no-repeat
            99.5% 3%;
    }
</style>
