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
                    <AtlanIcon icon="Jira" class="h-8" />
                </div>
                <div class="">
                    <h2 class="text-lg font-bold">Jira</h2>
                    <span class="text-gray-500">{{ description }}</span>
                </div>
            </div>
        </div>
        <div class="">
            <AtlanButton
                v-if="tenantJiraStatus.created && !tenantJiraStatus.configured"
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
            <AtlanButton
                v-auth="access.CREATE_INTEGRATION"
                :loading="configLoading"
                @click="handleConnect"
            >
                Connect
                <AtlanIcon icon="ArrowRight" />
            </AtlanButton>
        </div>
    </section>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, toRefs, h } from 'vue'
    import { Modal } from 'ant-design-vue'
    import AtlanButton from '@/UI/button.vue'
    import access from '~/constant/accessControl/map'
    import integrationStore from '~/store/integrations/index'
    import {
        tenantLevelOauthUrl,
        archiveJira,
        openJiraOAuth,
    } from '~/composables/integrations/useJira'
    import { integrations } from '~/constant/integrations'
    import { fetchIntegrationConfig } from '~/composables/integrations/useIntegrations'

    export default defineComponent({
        name: 'AddJiraIntegrationCard',
        components: { AtlanButton },
        emits: ['openConfig'],
        setup() {
            const store = integrationStore()

            const { tenantJiraStatus } = toRefs(store)

            const pV = computed(() => ({ id: tenantJiraStatus.value.id }))

            // const { data, isLoading, error, disconnect } = archiveJira(pV)
            const { description } = integrations.jira

            // const handleDisconnect = () => {
            //     Modal.confirm({
            //         class: '',
            //         icon: null,
            //         content: () =>
            //             h('div', { class: [''] }, [
            //                 h(
            //                     'h1',
            //                     {
            //                         class: ['font-bold -mt-4 mb-3'],
            //                     },
            //                     ['Disconnect Jira']
            //                 ),
            //                 h(
            //                     'div',
            //                     {
            //                         class: ['font-normal', 'mb-3'],
            //                     },
            //                     [
            //                         'Are you sure you want to disconnect ',
            //                         h(
            //                             'b',
            //                             {
            //                                 class: [''],
            //                             },
            //                             'Jira'
            //                         ),
            //                         ' integration?',
            //                     ]
            //                 ),
            //             ]),
            //         okType: 'danger',
            //         autoFocusButton: null,
            //         okButtonProps: {
            //             type: 'primary',
            //         },
            //         okText: 'Disconnect',
            //         cancelText: 'Cancel',
            //         async onOk() {
            //             await disconnect()
            //         },
            //     })
            // }

            const { isLoading: configLoading, call } =
                fetchIntegrationConfig(false)

            const handleConnect = async () => {
                await call()
                openJiraOAuth({ tenant: true })
            }

            return {
                handleConnect,
                configLoading,
                description,
                openJiraOAuth,
                tenantJiraStatus,
                tenantLevelOauthUrl,
                store,
                access,
            }
        },
    })
</script>

<style lang="less" module>
    .addCard {
        // background: url('~/assets/images/admin/integrations/add-slack-bg.svg')
        //     no-repeat;
        // background-size: contain;
        // background-position-x: right;
    }
    .inviteModal {
        :global(.ant-modal-content) {
            @apply rounded-lg;
        }
    }
</style>
