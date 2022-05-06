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
    const properties = eventProperties ? eventProperties() : {}
    properties.domain = window.location.host
    console.log('analytics track', eventName, properties)
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

export const identifyUser = async () => {
    await addDelay(1800)
    const authStore = useAuthStore()
    if ((window as any).analytics) {
        if ((window as any).analytics.identify) {
            const userWorkspaceRole = (authStore.roles || []).find((role) => {
                const roleName = role?.name?.startsWith('$')
                return roleName
            })
            ;(window as any).analytics.identify(authStore?.id, {
                name: authStore.name || '',
                firstName: authStore.firstName,
                lastName: authStore.lastName,
                email: authStore.email || '',
                username: authStore.username || '',
                role: userWorkspaceRole?.name?.slice(1) || '',
                domain: window.location.host,
                persona_count: authStore.personas
                    ? authStore.personas.length
                    : 0,
                purpose_count: authStore.purposes
                    ? authStore.purposes.length
                    : 0,
                created_at: authStore.createdAt ? authStore.createdAt : '',
            })
        }
    }
}

export const identifyGroup = async () => {
    await addDelay(1800)
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
            // is_logo added or not
            // user count
            // assets count
            // smtp enabled
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
        try {
            const { data, isReady, error, isLoading } = Replicated.getLicense()
            watchOnce(
                isLoading,
                (value) => {
                    if (!value) {
                        // console.log('replicated value loaded', data.value)
                        groupBody.license_type = data?.value?.license || ''
                        groupBody.salesforce_account_id =
                            data?.value?.salesforceAccountId || ''
                        // group
                        if (window?.analytics?.group) {
                            window?.analytics?.group(groupId, groupBody)
                        }
                    }
                },
                { immediate: false }
            )
        } catch (error) {
            console.error('group identify error', error)
            if (window?.analytics?.group) {
                window?.analytics?.group(groupId, groupBody)
            }
        }
    }
}

export default useAddEvent
