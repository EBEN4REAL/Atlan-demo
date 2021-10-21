import { useConnectionsStore } from '~/store/connections'

export function useUtils() {
    const getFirstQueryConnection = () => {
        const conenctionStore = useConnectionsStore()
        let firstConnection = conenctionStore?.data?.entities?.find(
            (item) => item.attributes.connectorName === 'snowflake'
        )
        return firstConnection
    }
    return {
        getFirstQueryConnection,
    }
}
