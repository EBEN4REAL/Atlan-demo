import { useConnectionStore } from '~/store/connection'

export function getBISourceTypes() {
    const store = useConnectionStore()
    const BItypes = new Set()
    store.getList.forEach((item) => {
        if (item?.attributes) {
            if (item.attributes?.category === 'BI')
                BItypes.add(item.attributes?.connectorName)
        }
    })
    return Array.from(BItypes)
}
