<template>
    <div
        v-if="isLoading || route.query.close_tab == 'true'"
        class="flex items-center justify-center h-full"
    >
        <AtlanLoader class="h-10" />
    </div>
    <div v-else-if="error" class="flex items-center justify-center h-full">
        <ErrorView />
    </div>
    <main class="mx-4 my-9">
        <h1 class="mb-8 text-3xl">Integrations</h1>
        <template v-for="i in integrations" :key="i.id">
            <component :is="i.component" />
        </template>
    </main>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'
    import integrationStore from '~/store/integrations/index'
    import ErrorView from '@/common/error/index.vue'
    import { integrations } from '~/constant/integrations'
    import useIntegrations from '~/composables/integrations/useIntegrations'
    import { useRouter, useRoute } from 'vue-router'
    import slack from '@/admin/integrations/slack/index.vue'

    export default defineComponent({
        name: 'IntegrationsWrapper',
        components: {
            ErrorView,
            slack,
        },
        setup() {
            const store = integrationStore()
            const route = useRoute()

            const { tenantSlackStatus } = toRefs(store)

            const { isLoading, error, isReady, call } = useIntegrations(false)

            if (route.query.close_tab == 'true') window.close()

            return {
                route,
                isLoading,
                error,
                isReady,
                tenantSlackStatus,
                store,
                integrations,
            }
        },
    })
</script>

<style scoped></style>
