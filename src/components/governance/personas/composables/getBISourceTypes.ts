import { useConnectionStore } from '~/store/connection'

export function getBISourceTypes() {
    const store = useConnectionStore()
    const BItypes = new Set()
    store.getList.forEach((item) => {
        if (item?.attributes) {
            if (
                item.attributes?.category.toLowerCase() === 'bi' ||
                item.attributes?.connectorName?.toLowerCase() ===
                    'salesforce' ||
                item.attributes?.connectorName?.toLowerCase() === 's3' ||
                item.attributes?.connectorName?.toLowerCase() === 'glue'
            )
                BItypes.add(item.attributes?.connectorName)
        }
    })
    return Array.from(BItypes)
}
