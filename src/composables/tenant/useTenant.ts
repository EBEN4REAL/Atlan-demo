import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { useTenantStore } from '~/store/tenant'
import { Tenant } from '~/services/service/tenant'

import { watch } from 'vue'

export default function useTenant() {
    const { data } = Tenant.GetTenant()
    const tenantStore = useTenantStore()
    watch(data, () => {
        tenantStore.setTenant(data.value)
    })
    return {
        data,
    }
}
