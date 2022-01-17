<template>
    <!-- <div v-if="isLoading" class="flex items-center justify-center h-full">
        <AtlanIcon icon="Loader" class="h-10 animate-spin" />
    </div>
    <div v-else-if="error" class="flex items-center justify-center h-full">
        <ErrorView />
    </div> -->
    <main class="mx-4 my-9">
        <h1 class="mb-8 text-3xl">Integrations</h1>
        <template
            v-for="integration in store.integrationTypes"
            :key="integration.id"
        >
            <IntegrationCardWrapper
                v-if="
                    store.integrationStatus[integration.name].tenant.configured
                "
                :integration-type-object="integration"
            />
            <AddIntegrationCardWrapper
                v-else
                :integration-type-object="integration"
            />
        </template>
    </main>
</template>

<script lang="ts">
    import { computed, defineComponent, watch } from 'vue'
    import IntegrationCardWrapper from './integrationCardWrapper.vue'
    import AddIntegrationCardWrapper from './addCardWrapper.vue'
    import integrationStore from '~/store/integrations/index'
    import ErrorView from '@/common/error/index.vue'

    export default defineComponent({
        name: 'IntegrationsWrapper',
        components: {
            IntegrationCardWrapper,
            ErrorView,
            AddIntegrationCardWrapper,
        },
        setup() {
            const store = integrationStore()

            return {
                store,
            }
        },
    })
</script>

<style scoped></style>
