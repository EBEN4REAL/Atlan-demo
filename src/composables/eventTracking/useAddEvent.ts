import { watch } from 'vue'
import keyMap from '~/composables/eventTracking/keyMap'
import { useTenantStore } from '~/store/tenant'
import { useAuthStore } from '~/store/auth'
import { usePurposeStore } from '~/store/purpose'
import { usePersonaStore } from '~/store/persona'
import { storeToRefs } from 'pinia'
import { Replicated } from '~/services/service/replicated'

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
            })
        }
    }
}

export const identifyGroup = async () => {
    await addDelay(1800)
    if (window?.analytics) {
        // const groupTraits = window?.analytics?.group()?.traits()
        const { data, isReady, error, isLoading } = Replicated.getLicense()
        watch(
            isLoading,
            (value) => {
                if (!value) {
                    console.log('replicated value loaded', data.value)
                    const tenantStore = useTenantStore()
                    const purposeStore = usePurposeStore()
                    const personaStore = usePersonaStore()

                    const purposeCount = (purposeStore.list || []).length
                    const personaCount = (personaStore.list || []).length

                    const domain = window.location.host
                    const groupId = domain
                    // group
                    if (window?.analytics?.group) {
                        window?.analytics?.group(groupId, {
                            domain,
                            name: tenantStore.displayName,
                            purpose_count: purposeCount,
                            persona_count: personaCount,
                            license_type: data?.value?.license || '',
                        })
                    }
                }
            },
            { immediate: true }
        )
    }
}

export default useAddEvent
