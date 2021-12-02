<template>
    <div v-if="isLoading" class="flex items-center justify-center h-full">
        <AtlanIcon icon="Loader" class="h-10 animate-spin" />
    </div>
    <div v-else-if="error" class="flex items-center justify-center h-full">
        <ErrorView />
    </div>
    <main v-else-if="isReady" class="mx-4 my-9">
        <h1 class="mb-8 text-3xl">Integrations</h1>
        <template v-for="integration in allIntegrations" :key="integration.id">
            <IntegrationCardWrapper
                v-if="isIntegrationConfigured(integration.name)"
                :integration-data="integration"
            />
            <AddIntegrationCard v-else :integration="integration" />
        </template>
    </main>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { getIntegrationTypes } from '~/composables/integrations/useIntegrations'
import { getIntegrationLink } from '~/composables/integrations/useSlack'
import AddIntegrationCard from './addIntegrationCard.vue'
import IntegrationCardWrapper from './integrationCardWrapper.vue'
import { integrationData } from '~/constant/integrations'
import integrationStore from '~/store/integrations/index'
import { useAuthStore } from '~/store/auth'
import ErrorView from '@/common/error/index.vue'

export default defineComponent({
    name: 'IntegrationsWrapper',
    components: { AddIntegrationCard, IntegrationCardWrapper, ErrorView },
    setup() {
        const store = integrationStore()
        const authStore = useAuthStore()

        const {
            data: allIntegrations,
            isLoading,
            error,
            isReady,
        } = getIntegrationTypes()
        console.log('authStore.id', authStore.id)

        const isIntegrationConfigured = (alias): boolean => {
            const isTenantLevelIntegrationConfigured =
                store.hasConfiguredTenantLevelIntegration(alias)
            return isTenantLevelIntegrationConfigured
        }

        return {
            isIntegrationConfigured,
            allIntegrations,
            isLoading,
            error,
            isReady,
        }
    },
})
</script>

<style scoped></style>
