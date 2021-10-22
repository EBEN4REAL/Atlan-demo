<template>
    <div class="px-12 mx-auto my-8 text-gray-600 bg-white rounded">
        <DisplaySSO
            v-if="identityProviders.length"
            :provider-details="identityProviders[0] || {}"
        />
        <div class="p-12" v-else>
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
