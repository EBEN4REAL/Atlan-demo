import { useConnectionStore } from '~/store/connection'

export function getBISourceTypes(paramStore?: any) {
    let store = paramStore
    if (!paramStore) {
        store = useConnectionStore()
    }

    const BItypes = new Set()
    store.getList.forEach((item) => {
        if (item?.attributes) {
            if (
                item.attributes?.category?.toLowerCase() === 'bi' ||
                item.attributes?.connectorName?.toLowerCase() ===
                    'salesforce' ||
                item.attributes?.connectorName?.toLowerCase() === 's3' ||
                item.attributes?.connectorName?.toLowerCase() === 'glue' ||
                item.attributes?.connectorName?.toLowerCase() === 'netsuite'
            )
                BItypes.add(item.attributes?.connectorName)
        }
    })
    return Array.from(BItypes)
}
