import keyMap from '~/composables/eventTracking/keyMap'

const useAddEvents = (category, obj, action, props) => {
    // construct params for adding events
    const event = keyMap[category][obj][action]
    const eventName = event.action
    const eventProperties = event.properties(props)

    console.log(eventName)
    console.log(eventProperties)
    // API call for adding event to segment
    ;(window as any).analytics.track(eventName, eventProperties)
}
export default useAddEvents
