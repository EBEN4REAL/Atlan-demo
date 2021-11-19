<template>
    <main class="mx-4 my-9">
        <h1 class="mb-8 text-3xl">Integrations</h1>
        <template v-for="i in allIntegrations" :key="i.id">
            <IntegrationCardWrapper
                v-if="integrationExist(i.name)"
                :integration-data="getData(i.name)"
                :integration="{ id: `0c6495c0-2b2f-4fd1-8876-b5d9e0ad4a35` }"
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
    import { defineComponent } from 'vue'
    import {
        getIntegrationTypes,
        getIntegrationLink,
        getIntegrationsList,
    } from './useIntegrations'
    import AddIntegrationCard from './addIntegrationCard.vue'
    import IntegrationCardWrapper from './integrationCardWrapper.vue'
    import { integrationData } from '~/constant/integrations'

    export default defineComponent({
        name: 'IntegrationsWrapper',
        components: { AddIntegrationCard, IntegrationCardWrapper },
        setup() {
            const {
                data: allIntegrations,
                isLoading,
                error,
            } = getIntegrationTypes()

            const {
                data: currentIntegrations,
                isLoading: currentLoading,
                error: currentError,
            } = getIntegrationsList()

            const getData = (alias) => ({
                ...integrationData[alias],
                link: getIntegrationLink(alias),
            })

            const integrationExist = (alias) => true

            return {
                integrationExist,
                currentIntegrations,
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
