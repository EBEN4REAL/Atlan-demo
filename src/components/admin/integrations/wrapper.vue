<template>
    <div v-if="isLoading" class="flex items-center justify-center h-full">
        <AtlanIcon icon="Loader" class="h-10 animate-spin" />
    </div>
    <div v-else-if="error" class="flex items-center justify-center h-full">
        <ErrorView />
    </div>
    <main class="mx-4 my-9">
        <h1 class="mb-8 text-3xl">Integrations</h1>
        <template v-for="i in integrationList" :key="i.id">
            <IntegrationCardWrapper
                v-if="tenantSlackStatus.configured"
                :integration-type-object="i"
            />
            <AddIntegrationCardWrapper v-else :integration-type-object="i" />
        </template>
    </main>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs, watch } from 'vue'
    import IntegrationCardWrapper from './integrationCardWrapper.vue'
    import AddIntegrationCardWrapper from './addCardWrapper.vue'
    import integrationStore from '~/store/integrations/index'
    import ErrorView from '@/common/error/index.vue'
    import { integrationList } from '~/constant/integration'
    import useIntegrations from '~/composables/integrations/useIntegrations'
    import { useRouter, useRoute } from 'vue-router'

    export default defineComponent({
        name: 'IntegrationsWrapper',
        components: {
            IntegrationCardWrapper,
            ErrorView,
            AddIntegrationCardWrapper,
        },
        setup() {
            const store = integrationStore()
            const route = useRoute()

            const { tenantSlackStatus } = toRefs(store)

            const { isLoading, error, isReady, call } = useIntegrations(false)
            // call()

            return {
                isLoading,
                error,
                isReady,
                tenantSlackStatus,
                store,
                integrationList,
            }
        },
    })
</script>

<style scoped></style>
