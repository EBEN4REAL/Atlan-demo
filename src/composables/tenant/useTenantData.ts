import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTenantStore } from '~/store/tenant'
import { Tenant } from '~/services/service/tenant'

export default function useTenantData() {
    const tenantStore = useTenantStore()

    console.log(tenantStore)
    const setSMTPConfig = (value) => {
        tenantStore.setSMTPConfig(value)
    }
    const {
        displayName: name,
        displayNameHtml,
        identityProviders,
        identityMappers,
        smtpServer,
        loginWithEmailAllowed,
        tenantRaw,
        announcementTitle,
        announcementMessage,
        announcementType,
        announcementUpdatedAt,
        announcementUpdatedBy,
    } = storeToRefs(tenantStore)
    return {
        name,
        displayNameHtml,
        identityProviders,
        identityMappers,
        smtpServer,
        loginWithEmailAllowed,
        tenantRaw,
        announcementTitle,
        announcementMessage,
        announcementType,
        announcementUpdatedAt,
        announcementUpdatedBy,
        setSMTPConfig,
    }
    // return {
    //     name: tenantStore.displayName,
    //     displayNameHtml: tenantStore.displayNameHtml,
    //     identityProviders: tenantStore.identityProviders,
    //     identityMappers: tenantStore.identityMappers,
    //     smtpServer: ref(tenantStore.smtpServer),
    //     loginWithEmailAllowed: tenantStore.loginWithEmailAllowed,
    //     announcementTitle: tenantStore.announcementTitle,
    //     announcementMessage: tenantStore.announcementMessage,
    //     announcementType: tenantStore.announcementType,
    //     tenantRaw: tenantStore.tenantRaw,
    //     updateSMTPConfig,
    // }
}
