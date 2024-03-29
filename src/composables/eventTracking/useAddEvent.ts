import { watch, toRefs } from 'vue'
import keyMap from '~/composables/eventTracking/keyMap'
import { useTenantStore } from '~/store/tenant'
import { useAuthStore } from '~/store/auth'
import { usePurposeStore } from '~/store/purpose'
import { usePersonaStore } from '~/store/persona'
import integrationStore from '~/store/integrations/index'
import { storeToRefs } from 'pinia'
import { Replicated } from '~/services/service/replicated'
import { watchOnce } from '@vueuse/core'
import { useConnectionStore } from '~/store/connection'
import useGlossaryStore from '~/store/glossary'
import { featureEnabledMap } from '~/composables/labs/labFeatureList'
import { getUserRole } from '~/composables/user/useUsers'

const useAddEvent = (category, obj, action, props = {}) => {
    if (!window.analytics || !window.analytics.track) {
        return
    }
    // construct params for adding events
    const event = keyMap[category][obj][action]
    const eventName = event.action
    const eventProperties = () => {
        if (event?.properties) return event?.properties(props)
        return undefined
    }

    // API call for adding event to segment
    const properties = eventProperties() ? eventProperties() : {}
    properties.domain = window.location.host
    if (eventProperties) {
        ;(window as any).analytics.track(eventName, properties)
    } else {
        ;(window as any).analytics.track(eventName)
    }
}

export const useTrackPage = (category, name, props = {}) => {
    const baseProps = {
        referrer: document.referrer,
        path: window.location.pathname,
        search: window.location.search,
        url: window.location.href,
        domain: window.location.host,
    }
    props = {
        ...props,
        ...baseProps,
    }
    console.log('analytics page', { category, name, props })
    if (!(window as any).analytics || !(window as any).analytics.page) {
        return
    }
    ;(window as any).analytics.page(category, name, props)
}

const addDelay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

let licenseType = ''
let salesforceAccountId = ''

const fetchLicense = async () => {
    await addDelay(2000)
    console.log('fetchLicense called')
    try {
        const { data, isReady, error, isLoading } = Replicated.getLicense()
        watchOnce(
            isLoading,
            (value) => {
                console.log('fetchLicense loading over', data.value)
                if (!value) {
                    licenseType = data?.value?.license || ''
                    salesforceAccountId = data?.value?.salesforceAccountId || ''
                }
            },
            { immediate: false }
        )
    } catch (error) {
        console.error('error fetching license', error)
    }
}

fetchLicense()

export const identifyUser = async () => {
    await addDelay(3800)
    const authStore = useAuthStore()
    const tenantStore = useTenantStore()
    if ((window as any).analytics) {
        if ((window as any).analytics.identify) {
            const roleNames = authStore.roles.map((roleObj) => roleObj?.name)
            const userWorkspaceRole = getUserRole({
                roles: roleNames,
                defaultRoles: authStore.defaultRoles,
            })

            const { createdAt: tenantCreatedAt } =
                tenantStore.tenantRaw.attributes || '  '
            const tenantCreatedAtIso = `${tenantCreatedAt.split(' ')[0]}T${
                tenantCreatedAt.split(' ')[1]
            }Z`

            const detailsObj = {
                name: authStore.name || '',
                firstName: authStore.firstName,
                lastName: authStore.lastName,
                email: authStore.email || '',
                username: authStore.username || '',
                role: userWorkspaceRole?.name?.toLowerCase() || '',
                domain: window.location.host,
                persona_count: authStore.personas
                    ? authStore.personas.length
                    : 0,
                purpose_count: authStore.purposes
                    ? authStore.purposes.length
                    : 0,
                created_at: authStore.createdAt ? authStore.createdAt : '',
                tenant_created_at: tenantCreatedAtIso,
                license_type: licenseType,
                salesforce_account_id: salesforceAccountId,
                res_width: window.screen.availWidth,
                res_height: window.screen.availHeight,
            }
            ;(window as any).analytics.identify(authStore?.id, detailsObj, {
                integrations: {
                    All: true,
                    Salesforce: true,
                },
            })
        }
    }
}

export const identifyGroup = async () => {
    await addDelay(3800)
    console.log('identifyGroup called', featureEnabledMap.value)
    if (window?.analytics) {
        const tenantStore = useTenantStore()
        const purposeStore = usePurposeStore()
        const personaStore = usePersonaStore()
        const intStore = integrationStore()
        const connectionStore = useConnectionStore()
        const glossaryStore = useGlossaryStore()
        const { getTenantLevelIntegrationNames } = toRefs(intStore)

        const purposeCount = (purposeStore.list || []).length
        const personaCount = (personaStore.list || []).length

        const domain = window.location.host
        const groupId = domain
        const identityProviders = tenantStore.identityProviders || []
        const { createdAt } = tenantStore.tenantRaw.attributes || '  '
        const createdAtIso = `${createdAt.split(' ')[0]}T${
            createdAt.split(' ')[1]
        }Z`
        console.log('group identify createdAtIso', createdAtIso)
        const configuredSso = identityProviders.length
            ? identityProviders[0].alias
            : ''
        const groupBody = {
            domain,
            name: tenantStore.displayName,
            purpose_count: purposeCount,
            persona_count: personaCount,
            tenant_created_at: createdAtIso,
            createdAt: createdAtIso,
            id: domain,
            configured_sso: configuredSso || undefined,
            configured_integrations: getTenantLevelIntegrationNames.value || [],
            connection_count: (connectionStore?.list || []).length,
            glossary_count: (glossaryStore?.list || []).length,
            labs: featureEnabledMap.value,
            license_type: licenseType,
            salesforce_account_id: salesforceAccountId,
            configured_connectors:
                connectionStore.getSourceList.map((i) => i.id) || [],
            // is_logo added or not
            // user count
            // assets count
            // smtp enabled
        }
        if (window?.analytics?.group) {
            window?.analytics?.group(groupId, groupBody)
        }
        // group
        // if (window?.analytics?.group) {
        //     window?.analytics?.group(groupId, {
        //         domain,
        //         name: tenantStore.displayName,
        //         purpose_count: purposeCount,
        //         persona_count: personaCount,
        //     })
        // }
        // const groupTraits = window?.analytics?.group()?.traits()
    }
}

export default useAddEvent
