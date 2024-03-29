<template>
    <section
        class="flex items-center h-32 p-6 border shadow rounded-xl gap-x-5"
        :class="$style.addCard"
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
        <div class="">
            <AtlanButton2
                v-if="
                    tenantSlackStatus.created && !tenantSlackStatus.configured
                "
                v-auth="access.DELETE_INTEGRATION"
                color="secondary"
                class="text-red-500"
                size="large"
                label="Disconnect"
                :loading="isLoading"
                @click="handleDisconnect"
            />
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
                <AtlanButton2
                    v-auth="access.CREATE_INTEGRATION"
                    label="Add to Slack"
                    suffixIcon="ArrowRight"
                />
            </div>
            <AtlanButton2
                v-else
                v-auth="access.CREATE_INTEGRATION"
                size="large"
                label="Connect"
                suffixIcon="ArrowRight"
                @click="$emit('openConfig')"
            />
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
    import { integrations } from '~/constant/integrations'
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
    .addCard {
        background: url('~/assets/images/admin/integrations/add-slack-bg.svg')
            no-repeat;
        background-size: contain;
        background-position-x: right;
    }
    .inviteModal {
        :global(.ant-modal-content) {
            @apply rounded-lg;
        }
    }
</style>
