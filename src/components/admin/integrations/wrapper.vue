<template>
    <div v-if="isLoading" class="flex items-center justify-center h-full">
        <AtlanIcon icon="Loader" class="h-10 animate-spin" />
    </div>
    <div v-else-if="error" class="flex items-center justify-center h-full">
        <ErrorView />
    </div>
    <main v-else-if="isReady" class="mx-4 my-9">
        <h1 class="mb-8 text-3xl">Integrations</h1>
        <template v-for="i in allIntegrations" :key="i.id">
            <IntegrationCardWrapper
                v-if="integrationExist(i.name)"
                :integration-data="getData(i.name)"
            />
            <AddIntegrationCard
                v-else
                :integration="i"
                :integration-data="getData(i.name)"
            />
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

            const getData = (alias) => ({
                ...integrationData[alias],
                link: getIntegrationLink(alias),
            })

            const integrationExist = (alias): boolean =>
                !!store.getIntegration(alias)

            return {
                integrationExist,
                allIntegrations,
                getData,
                isLoading,
                error,
                isReady,
            }
        },
    })
</script>

<style scoped></style>
