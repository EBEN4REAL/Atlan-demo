<template>
    <router-view />
</template>

<script lang="ts">
    import { defineComponent, ref, watch, inject } from 'vue'
    import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
    import { Tenant } from './api2/tenant'

    import { useConnectionsStore } from './store/connections'
    import useConnectionsList from './composables/bots/useConnectionList'

    import { CONNECTION_FETCH_LIST } from './constant/cache'
    import { useTenantStore } from './store/tenants'
    import { useClassificationStore } from '~/components/admin/classifications/_store'

    export default defineComponent({
        setup(props, context) {
            const tenantStore = useTenantStore()
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

            useConnectionsList(isAuth, initialBody, CONNECTION_FETCH_LIST)
            useClassificationStore()

            watch(
                () => tenantStore.isAuthenticated,
                () => {
                    isAuth.value = true
                }
            )

            watch(tenantData, () => {
                tenantStore.setData(tenantData.value)
            })

            // (window as any).analytics.identify(tenantStore?.token?.userId, {
            //             name: tenantStore?.token?.name ?? '',
            //             email: tenantStore?.token?.email ?? '',
            //             username: tenantStore?.token?.username ?? '',
            //             roleCode: tenantStore?.token?.roleCode ?? '',
            // });

            return {
                tenantData,
            }
        },
    })
</script>
