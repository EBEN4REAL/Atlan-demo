import { watch } from 'vue'
import { useTenantStore } from '~/store/tenant'
import { Tenant } from '~/services/service/tenant'

export default function useTenant(immediate = true) {
    const { data, mutate } = Tenant.GetTenant({ asyncOptions: { immediate } })
    const tenantStore = useTenantStore()
    watch(data, () => {
        tenantStore.setTenant(data.value)
        console.log(tenantStore.tenantRaw)
    })
    return {
        data, mutate
    }
}
