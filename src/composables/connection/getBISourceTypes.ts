import { useConnectionStore } from '~/store/connection'

export function getBISourceTypes() {
    const store = useConnectionStore()
    const BItypes = new Set()
    store.getList.forEach((item) => {
        if (item?.attributes) {
            // console.log('bi: ', item)
            if (
                item.attributes?.category?.toLowerCase() === 'bi' ||
                item.attributes?.connectorName?.toLowerCase() ===
                    'salesforce' ||
                item.attributes?.connectorName?.toLowerCase() === 'glue'
            )
                BItypes.add(item.attributes?.connectorName)
        }
    })
    return Array.from(BItypes)
}
