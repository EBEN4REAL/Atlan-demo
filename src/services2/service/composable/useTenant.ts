import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { useTenantStore } from '~/store/tenant'
import { Tenant } from '~/services2/service/tenant'

import { watch } from 'vue'

export default function useTenant() {
    const { data } = Tenant.GetTenant({
        cacheKey: 'DEFAULT_TENANT',
        cacheOptions: {
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            cache: new LocalStorageCache(),
            dedupingInterval: 1,
        },
    })
    const tenantStore = useTenantStore()
    watch(data, () => {
        tenantStore.setTenant(data.value)
    })

    return {
        data,
    }
}
