import keyMap from '~/composables/eventTracking/keyMap'
import { useTenantStore } from '~/store/tenant'
import { useAuthStore } from '~/store/auth'

const useAddEvent = (category, obj, action, props = {}) => {
    if (!(window as any).analytics || !(window as any).analytics.track) {
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

export const identifyUser = () => {
    const authStore = useAuthStore()
    if ((window as any).analytics) {
        if ((window as any).analytics.identify) {
            ;(window as any).analytics.identify(authStore?.id, {
                name: authStore.name || '',
                firstName: authStore.firstName,
                lastName: authStore.lastName,
                email: authStore.email || '',
                username: authStore.username || '',
                roles: authStore.roles || [],
            })
        }
    }
}

export const identifyGroup = () => {
    if ((window as any).analytics) {
        const tenantStore = useTenantStore()
        const domain = window.location.host
        const groupId = domain
        // group
        if ((window as any).analytics.group) {
            ;(window as any).analytics.group(groupId, {
                tenant_domain: domain,
                tenant_name: tenantStore.displayName,
            })
        }
    }
}

export default useAddEvent
