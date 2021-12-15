import keyMap from '~/composables/eventTracking/keyMap'

const useAddEvent = (category, obj, action, props = {}) => {
    // construct params for adding events
    const event = keyMap[category][obj][action]
    const eventName = event.action
    const eventProperties = () => {
        if (event?.properties) return event?.properties(props)
        return undefined
    }

    // API call for adding event to segment
    const properties = eventProperties ? eventProperties() : {}
    console.log('analytics track', { eventName, properties })
    if (eventProperties) {
        ;(window as any).analytics.track(eventName, properties)
    } else {
        ;(window as any).analytics.track(eventName)
    }
}
export default useAddEvent
