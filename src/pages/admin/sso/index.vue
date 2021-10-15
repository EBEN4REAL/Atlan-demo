<template>
    <div class="w-4/5 p-12 px-12 mx-auto my-8 text-gray-600 bg-white rounded">
        <DisplaySSO
            v-if="identityProviders.length"
            :provider-details="identityProviders[0] || {}"
        />
        <EmptySSOScreen v-else />
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed } from 'vue';
    import EmptySSOScreen from '@/admin/sso/configure/emptySSOScreen.vue';
    import DisplaySSO from '@/admin/sso/update/displaySSO.vue';
    import { useHead } from '@vueuse/head';
    import { useTenantStore } from '~/services/keycloak/tenant/store';

    export default defineComponent({
        components: {
            EmptySSOScreen,
            DisplaySSO,
        },
        setup() {
            useHead({
                title: 'SSO',
            });
            const tenantStore = useTenantStore();

            return {
                identityProviders: computed(
                    () => tenantStore.getIdentityProviders
                ),
            };
        },
    });
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
