<template>
    <router-view />
</template>

<script lang="ts">
    import { defineComponent, ref, watch, inject, computed } from 'vue'
    import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
    import { Tenant } from './api2/tenant'

    import { useConnectionsStore } from './store/connections'
    import useConnectionsList from './composables/bots/useConnectionList'

    import { CONNECTION_FETCH_LIST } from './constant/cache'
    import { useTenantStore } from './services/keycloak/tenant/store'
    import { useClassificationStore } from '~/components/admin/classifications/_store'
    import useCheckAccess from '~/services/access/useCheckAccess'
    import { useRouter } from 'vue-router'

    export default defineComponent({
        setup(props, context) {
            const tenantStore = useTenantStore()
            const router = useRouter()
            const { currentRoute } = router
            const curPath = computed(() => currentRoute.value.name)
            const asyncOptions = {
                dedupingInterval: 0,
                shouldRetryOnError: false,
                revalidateOnFocus: false,
                cache: new LocalStorageCache(),
            }

            const isAuth = ref(false)
            const { data: tenantData } = Tenant.GetTenant(
                asyncOptions,
                ref(''),
                isAuth
            )

            const initialBody = {
                limit: 100,
            }
            const { refreshWorkspacePermissions } = useCheckAccess()
            useConnectionsList(isAuth, initialBody, CONNECTION_FETCH_LIST)
            useClassificationStore()

            watch(curPath, () => {
                // track first page load and router switch
                ;(window as any).analytics.page(curPath.value)
            })
            watch(
                () => tenantStore.isAuthenticated,
                () => {
                    isAuth.value = true
                    refreshWorkspacePermissions()
                    // event for identity
                    ;(window as any).analytics.identify(
                        tenantStore?.token?.userId,
                        {
                            name: tenantStore?.token?.name ?? '',
                            email: tenantStore?.token?.email ?? '',
                            username: tenantStore?.token?.username ?? '',
                            roles: tenantStore?.token?.roles ?? '',
                        }
                    )
                }
            )

            watch(tenantData, () => {
                tenantStore.setData(tenantData.value)
            })
            return {
                tenantData,
            }
        },
    })
</script>
