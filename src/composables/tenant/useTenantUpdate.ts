import { watch } from 'vue'
import { useTenantStore } from '~/store/tenant'
import { Tenant } from '~/services/service/tenant'

export default function useTenantUpdate(body: any) {
    // displayNameHtml had some html code in starting, have to unset it else it gets blocked by xss - slack ref: https://atlanhq.slack.com/archives/C02R5TGJX0R/p1642001739135100
    if (body.displayNameHtml) {
        // eslint-disable-next-line no-param-reassign
        body.displayNameHtml = ''
    }
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
