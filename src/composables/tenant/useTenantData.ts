import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { watch } from 'vue'
import { useTenantStore } from '~/store/tenant'
import { Tenant } from '~/services/service/tenant'

export default function useTenantData() {
    const tenantStore = useTenantStore()

    console.log(tenantStore)
    const updateSMTPConfig = (value) => {
        tenantStore.setSMTPConfig(value)
    }

    return {
        name: tenantStore.displayName,
        displayNameHtml: tenantStore.displayNameHtml,
        identityProviders: tenantStore.identityProviders,
        identityMappers: tenantStore.identityMappers,
        smtpServer: tenantStore.smtpServer,
        loginWithEmailAllowed: tenantStore.loginWithEmailAllowed,
        announcementTitle: tenantStore.announcementTitle,
        announcementDescription: tenantStore.announcementDescription,
        announcementType: tenantStore.announcementType,
        tenantRaw: tenantStore.tenantRaw,
        updateSMTPConfig,
    }
}
