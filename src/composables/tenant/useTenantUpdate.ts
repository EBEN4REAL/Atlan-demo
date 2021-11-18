import { watch } from 'vue'
import { useTenantStore } from '~/store/tenant'
import { Tenant } from '~/services/service/tenant'

export default function useTenantUpdate(body: any) {
    const { data, mutate, error, isLoading } = Tenant.UpdateTenant(body, {
        asyncOptions: {},
    })
    const tenantStore = useTenantStore()
    watch(data, () => {
        tenantStore.setTenant(data.value)
    })
    return {
        data,
        mutate,
        error,
        isLoading,
    }
}
