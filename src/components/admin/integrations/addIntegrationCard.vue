<template>
    <a-modal
        :visible="showSlackConfigModal"
        :destroy-on-close="true"
        :footer="null"
        :closable="false"
        :width="470"
        wrap-class-name="inviteModal"
        @cancel="closeSlackConfigModal"
    >
        <SlackConfigModal @close="closeSlackConfigModal" />
    </a-modal>
    <section
        class="flex items-center h-32 p-6 border rounded shadow gap-x-5 addCard"
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
                v-if="!isTenantIntegrationPresent(integration.name)"
                v-auth="access.CREATE_INTEGRATION"
                @click="openSlackConfigModal"
            >
                Configure <AtlanIcon icon="ArrowRight" />
            </AtlanButton>
            <a
                v-else-if="
                    !intStore.hasConfiguredTenantLevelIntegration(
                        integration.name
                    )
                "
                :href="tenantLevelOauthUrl"
                target="_blank"
            >
                <AtlanButton v-auth="access.CREATE_INTEGRATION">
                    Add to Slack <AtlanIcon icon="ArrowRight" />
                </AtlanButton>
            </a>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref, computed, toRefs } from 'vue'
import AtlanButton from '@/UI/button.vue'
import useTenantData from '~/composables/tenant/useTenantData'
import access from '~/constant/accessControl/map'
import SlackConfigModal from './slack/slackConfigModal.vue'
import integrationStore from '~/store/integrations/index'
import {
    getSlackInstallUrlState,
    tenantLevelOauthUrl,
} from '~/composables/integrations/useSlack'

export default defineComponent({
    name: 'AddIntegrationCard',
    components: { AtlanButton, SlackConfigModal },
    props: {
        integration: { type: Object, required: true },
    },
    setup(props) {
        // store
        const intStore = integrationStore()

        // variables
        const showSlackConfigModal = ref(false)
        const { name: tenantName } = useTenantData()
        const { integration } = toRefs(props)

        // methods
        const closeSlackConfigModal = () => {
            showSlackConfigModal.value = false
        }
        const openSlackConfigModal = () => {
            showSlackConfigModal.value = true
        }
        const isTenantIntegrationPresent = (alias): boolean => {
            const integration = intStore.getIntegration(alias, true)
            return !!integration
        }

        return {
            tenantName,
            access,
            showSlackConfigModal,
            closeSlackConfigModal,
            openSlackConfigModal,
            isTenantIntegrationPresent,
            intStore,
            tenantLevelOauthUrl,
        }
    },
})
</script>

<style scoped>
.addCard {
    background: url('~/assets/images/integrations/add-slack-bg.svg') no-repeat;
    background-size: contain;
}
</style>
