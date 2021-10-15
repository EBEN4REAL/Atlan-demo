import keyMap from '~/composables/eventTracking/keyMap'

const useAddEvents = (category, obj, action, props) => {
    // construct params for adding events
    const event = keyMap[category][obj][action]
    const eventName = event.action
    const eventProperties = () => {
        if (event?.properties) return event?.properties(props)
        return undefined
    }

    console.log(eventName)
    console.log(eventProperties())
    // API call for adding event to segment
    // if (eventProperties) {
    //     ;(window as any).analytics.track(eventName, eventProperties())
    // } else {
    //     ;(window as any).analytics.track(eventName)
    // }
}
export default useAddEvents
