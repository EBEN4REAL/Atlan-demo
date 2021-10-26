<template>
    <div class="flex flex-col justify-center h-full bg-primary-light">
        <component
            :is="identityProviders.length ? 'router-view' : 'EmptySSOScreen'"
            class="flex flex-col justify-center h-3/4"
        />
        <!-- <DisplaySSO
            v-if="identityProviders.length"
            :provider-details="identityProviders[0] || {}"
        />
        <div v-else class="flex flex-col justify-center h-3/4">
            <EmptySSOScreen />
        </div> -->
    </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useHead } from '@vueuse/head'
import EmptySSOScreen from '@/admin/sso/configure/emptySSOScreen.vue'
import DisplaySSO from '@/admin/sso/update/displaySSO.vue'
import { useTenantStore } from '~/services/keycloak/tenant/store'

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
        return {
            identityProviders,
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
