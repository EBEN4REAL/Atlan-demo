<template>
    <div class="flex flex-col justify-center h-full bg-primary-light">
        <DisplaySSO
            v-if="identityProviders.length"
            :provider-details="identityProviders[0] || {}"
        />
        <div class="flex flex-col justify-center h-3/4" v-else>
            <EmptySSOScreen />
        </div>
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import EmptySSOScreen from '@/admin/sso/configure/emptySSOScreen.vue'
    import DisplaySSO from '@/admin/sso/update/displaySSO.vue'
    import { useHead } from '@vueuse/head'
    import { useTenantStore } from '~/services/keycloak/tenant/store'
    import useAuth from '~/services2/service/composable/useAuth'

    export default defineComponent({
        name: 'SSO',
        components: {
            EmptySSOScreen,
            DisplaySSO,
        },
        setup() {
            useHead({
                title: 'SSO',
            })

            const tenantStore = useTenantStore()
            const identityProviders = computed(
                () => tenantStore.getIdentityProviders
            )

            const { isAccess } = useAuth()

            return {
                identityProviders,
                isAccess,
            }
        },
    })
</script>
<style lang="less" module>
    .ssoPage {
        max-height: 90vh;
        overflow-y: auto;
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
