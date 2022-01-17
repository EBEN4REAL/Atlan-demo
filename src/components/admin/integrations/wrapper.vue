<template>
    <div v-if="isLoading" class="flex items-center justify-center h-full">
        <AtlanLoader class="h-10" />
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
    import AddIntegrationCard from './addIntegrationCard.vue'
    import IntegrationCardWrapper from './integrationCardWrapper.vue'
    import integrationStore from '~/store/integrations/index'
    // import { useAuthStore } from '~/store/auth'
    import ErrorView from '@/common/error/index.vue'

    export default defineComponent({
        name: 'IntegrationsWrapper',
        components: { AddIntegrationCard, IntegrationCardWrapper, ErrorView },
        setup() {
            const store = integrationStore()

            const {
                data: allIntegrations,
                isLoading,
                error,
                isReady,
            } = getIntegrationTypes()

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
