<template>
    <div
        v-if="currentLoading || isLoading"
        class="flex items-center justify-center h-full"
    >
        <AtlanIcon icon="Loader" class="h-10 animate-spin" />
    </div>
    <div
        v-else-if="currentError || error"
        class="flex items-center justify-center h-full"
    >
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
    import { getIntegrationLink } from './useIntegrationsData'
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
            } = getIntegrationTypes()

            const getData = (alias) => ({
                ...integrationData[alias],
                link: getIntegrationLink(alias),
            })

            const integrationExist = (alias): Object | Boolean | undefined =>
                store.getIntegrationList.find(
                    (i) => i.name.toLowerCase() === alias.toLowerCase()
                )

            return {
                integrationExist,
                allIntegrations,
                getData,
                isLoading,
                error,
                integrationData,
            }
        },
    })
</script>

<style scoped></style>
