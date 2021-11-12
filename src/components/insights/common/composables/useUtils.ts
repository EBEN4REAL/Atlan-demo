import { useConnectionStore } from '~/store/connection/index'

export function useUtils() {
    const getFirstQueryConnection = () => {
        const connectionStore = useConnectionStore()
        console.log('connection store: ', connectionStore)
        let firstConnection = connectionStore?.list.find(
            (item) => item.attributes.connectorName === 'snowflake'
        )
        return firstConnection
    }
    return {
        getFirstQueryConnection,
    }
}
