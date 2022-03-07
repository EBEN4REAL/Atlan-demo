<template>
    <section
        class="flex items-center h-20 p-6 border border-gray-300 rounded-lg gap-x-5 customShadow"
        style=""
    >
        <div class="flex-grow">
            <div class="flex items-center gap-x-3">
                <div
                    class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full"
                >
                    <AtlanIcon icon="Slack" class="h-7" />
                </div>
                <div class="">
                    <h2 class="text-lg font-bold">Slack</h2>
                    <span class="text-gray-500">{{ description }}</span>
                </div>
            </div>
        </div>
        <div class="">
            <AtlanButton
                v-if="
                    tenantSlackStatus.created && !tenantSlackStatus.configured
                "
                v-auth="access.DELETE_INTEGRATION"
                color="minimal"
                class="text-red-500"
                :is-loading="isLoading"
                size="lg"
                @click="handleDisconnect"
            >
                Disconnect
            </AtlanButton>
        </div>
        <div class="">
            <div
                v-if="
                    tenantSlackStatus.created &&
                    !tenantSlackStatus.configured &&
                    tenantLevelOauthUrl
                "
                @click="() => openSlackOAuth({ tenant: true })"
            >
                <AtlanButton
                    size="sm"
                    padding="compact"
                    v-auth="access.CREATE_INTEGRATION"
                >
                    Add to Slack <AtlanIcon icon="ArrowRight" />
                </AtlanButton>
            </div>
            <AtlanButton
                v-else
                v-auth="access.CREATE_INTEGRATION"
                @click="$emit('openConfig')"
                size="sm"
                padding="compact"
            >
                Connect
                <AtlanIcon icon="ArrowRight" />
            </AtlanButton>
        </div>
    </section>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, toRefs, h } from 'vue'
    import AtlanButton from '@/UI/button.vue'
    import access from '~/constant/accessControl/map'
    import integrationStore from '~/store/integrations/index'
    import {
        tenantLevelOauthUrl,
        archiveSlack,
        openSlackOAuth,
    } from '~/composables/integrations/slack/useSlack'
    import { integrations } from '~/constant/integrations/integrations'
    import { Modal } from 'ant-design-vue'

    export default defineComponent({
        name: 'AddSlackIntegrationCard',
        components: { AtlanButton },
        emits: ['openConfig'],
        setup() {
            const store = integrationStore()

            const { tenantSlackStatus } = toRefs(store)

            const pV = computed(() => ({ id: tenantSlackStatus.value.id }))

            const { data, isLoading, error, disconnect } = archiveSlack(pV)
            const { description } = integrations.slack

            const handleDisconnect = () => {
                Modal.confirm({
                    class: '',
                    icon: null,
                    content: () =>
                        h('div', { class: [''] }, [
                            h(
                                'h1',
                                {
                                    class: ['font-bold -mt-4 mb-3'],
                                },
                                ['Disconnect Slack']
                            ),
                            h(
                                'div',
                                {
                                    class: ['font-normal', 'mb-3'],
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
                    },
                })
            }

            return {
                handleDisconnect,
                description,
                openSlackOAuth,
                disconnect,
                tenantSlackStatus,
                isLoading,
                store,
                access,
                tenantLevelOauthUrl,
            }
        },
    })
</script>

<style lang="less" module>
    .inviteModal {
        :global(.ant-modal-content) {
            @apply rounded-lg;
        }
    }
</style>

<style scoped>
    .customShadow:hover {
        box-shadow: 0px 8px 24px rgba(25, 32, 56, 0.04);
    }
</style>
