import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { watch } from 'vue'
import { useTenantStore } from '~/store/tenant'
import { Tenant } from '~/services/service/tenant'

export default function useTenant() {
    const { data } = Tenant.GetTenant()
    const tenantStore = useTenantStore()
    watch(data, () => {
        tenantStore.setTenant(data.value)
        console.log(tenantStore.tenantRaw)
    })
    return {
        data,
    }
}
