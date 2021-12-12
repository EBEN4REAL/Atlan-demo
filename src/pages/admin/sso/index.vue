<template>
    <div class="flex flex-col justify-center h-full">
        <component
            v-if="isAccess"
            :is="
                identityProviders.length && alias
                    ? 'router-view'
                    : 'EmptySSOScreen'
            "
            class="flex flex-col justify-center h-3/4"
        />
       <NoAccess v-else />
    </div>
</template>
<script lang="ts">
    import { defineComponent, computed } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRouter } from 'vue-router'
    import EmptySSOScreen from '@/admin/sso/configure/emptySSOScreen.vue'
    import DisplaySSO from '@/admin/sso/update/displaySSO.vue'
    import { useTenantStore } from '~/store/tenant'
    import NoAccess from '@/common/secured/access.vue'
    import useAuth from '~/composables/auth/useAuth'

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
            const router = useRouter()
            const tenantStore = useTenantStore()
            const identityProviders = computed(
                () => tenantStore.identityProviders
            )
            const alias = computed(
                () => identityProviders?.value?.find((idp) => idp.alias)?.alias
            )

            if (
                alias.value &&
                identityProviders.value &&
                identityProviders.value.length
            )
                router.push(`/admin/sso/${alias.value}`)
                
            const { isAccess } = useAuth()
            return {
                identityProviders,
                alias,
                isAccess
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
