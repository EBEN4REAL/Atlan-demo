import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { useTenantStore } from '~/store/tenant'
import { Tenant } from '~/services2/service/tenant'

import { watch } from 'vue'

export default function useTenantUpdate(body: any) {
    const { data, mutate, error, isLoading } = Tenant.UpdateTenant(body, {
        asyncOptions: {},
    })
    // const tenantStore = useTenantStore()
    // watch(data, () => {
    //     tenantStore.setTenant(data.value)
    // })
    return {
        data,
        mutate,
        error,
        isLoading,
    }
}
