<template>
    <div
        class="flex flex-col justify-center h-full bg-primary-light"
        v-if="isAccess"
    >
        <DisplaySSO
            v-if="identityProviders.length"
            :provider-details="identityProviders[0] || {}"
        />
        <div class="flex flex-col justify-center h-3/4" v-else>
            <EmptySSOScreen />
        </div>
    </div>
    <NoAccess v-else />
</template>
<script lang="ts">
    import { defineComponent } from 'vue'
    import EmptySSOScreen from '@/admin/sso/configure/emptySSOScreen.vue'
    import DisplaySSO from '@/admin/sso/update/displaySSO.vue'
    import { useHead } from '@vueuse/head'
    import useAuth from '~/services2/service/composable/useAuth'
    import NoAccess from '@/admin/common/noAccessPage.vue'

    import useTenantData from '~/services2/service/composable/useTenantData'

    export default defineComponent({
        name: 'SSO',
        components: {
            EmptySSOScreen,
            DisplaySSO,
            NoAccess,
        },
        setup() {
            useHead({
                title: 'SSO',
            })

            const { identityProviders } = useTenantData()
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
    permissions: [UPDATE_WORKSPACE]
</route>
