<template>
    <a-modal
        :visible="showSlackConfigModal"
        :destroy-on-close="true"
        :footer="null"
        :closable="false"
        :width="692"
        :class="$style.inviteModal"
        @cancel="closeSlackConfigModal"
    >
        <SlackConfigModal @close="closeSlackConfigModal" />
    </a-modal>
    <section
        class="flex items-center h-32 p-6 border shadow rounded-xl gap-x-5 addCard"
    >
        <div class="">
            <AtlanIcon icon="Slack" class="h-12 bg-white" />
        </div>
        <div class="flex-grow">
            <h2 class="mb-2 text-xl font-bold">Connect Atlan with Slack</h2>
            <p class="font-lg tex-gray-500">
                🚀 Share asset profile, terms, queries with your team
            </p>
        </div>
        <div class="">
            <AtlanButton
                v-if="
                    tenantSlackStatus.created && !tenantSlackStatus.configured
                "
                v-auth="access.DELETE_INTEGRATION"
                color="minimal"
                class="px-0 text-red-500"
                :is-loading="isLoading"
                @click="disconnect"
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
                @click="() => openSlackOAuth({ tenant: true, emit: $emit })"
            >
                <AtlanButton v-auth="access.CREATE_INTEGRATION">
                    Configure <AtlanIcon icon="ArrowRight" />
                </AtlanButton>
            </div>
            <AtlanButton
                v-else
                v-auth="access.CREATE_INTEGRATION"
                @click="openSlackConfigModal"
            >
                Connect
                <AtlanIcon icon="ArrowRight" />
            </AtlanButton>
        </div>
    </section>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, toRefs } from 'vue'
    import AtlanButton from '@/UI/button.vue'
    import useTenantData from '~/composables/tenant/useTenantData'
    import access from '~/constant/accessControl/map'
    import SlackConfigModal from './slackConfigModal.vue'
    import integrationStore from '~/store/integrations/index'
    import {
        getSlackInstallUrlState,
        tenantLevelOauthUrl,
        archiveSlack,
        openSlackOAuth,
    } from '~/composables/integrations/useSlack'

    export default defineComponent({
        name: 'AddSlackIntegrationCard',
        components: { AtlanButton, SlackConfigModal },
        props: {},
        setup(props) {
            // store
            const store = integrationStore()

            const { tenantSlackStatus } = toRefs(store)

            // variables
            const showSlackConfigModal = ref(false)
            const { name: tenantName } = useTenantData()

            // methods
            const closeSlackConfigModal = () => {
                showSlackConfigModal.value = false
            }
            const openSlackConfigModal = () => {
                showSlackConfigModal.value = true
            }

            const pV = computed(() => ({ id: tenantSlackStatus.value.id }))

            const { data, isLoading, error, disconnect } = archiveSlack(pV)

            return {
                openSlackOAuth,
                disconnect,
                tenantSlackStatus,
                isLoading,
                store,
                tenantName,
                access,
                showSlackConfigModal,
                closeSlackConfigModal,
                openSlackConfigModal,
                tenantLevelOauthUrl,
            }
        },
    })
</script>

<style lang="less" module>
    .addCard {
        background: url('~/assets/images/integrations/add-slack-bg.svg')
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
