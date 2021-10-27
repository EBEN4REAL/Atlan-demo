import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { useTenantStore } from '~/store/tenant'
import { Tenant } from '~/services/service/tenant'

import { watch } from 'vue'

export default function useTenantData() {
    const tenantStore = useTenantStore()

    const updateSMTPConfig = (value) => {
        tenantStore.setSMTPConfig(value)
    }

    return {
        name: tenantStore.displayName,
        displayNameHtml: tenantStore.displayNameHtml,
        identityProviders: tenantStore.identityProviders,
        identityMappers: tenantStore.identityMappers,
        smtpServer: tenantStore.smtpServer,
        updateSMTPConfig,
    }
}
