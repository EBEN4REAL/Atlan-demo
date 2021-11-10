import { useConnectionStore } from '~/store/connection/index'

export function useUtils() {
    const getFirstQueryConnection = () => {
        const conenctionStore = useConnectionStore()
        let firstConnection = conenctionStore?.data?.entities?.find(
            (item) => item.attributes.connectorName === 'snowflake'
        )
        return firstConnection
    }
    return {
        getFirstQueryConnection,
    }
}
