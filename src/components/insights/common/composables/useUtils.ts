import { useConnectionStore } from '~/store/connection/index'
import { getBISourceTypes } from '~/composables/connection/getBISourceTypes'

export function useUtils() {
    const getFirstQueryConnection = () => {
        const connectionStore = useConnectionStore()
        let BItypes = getBISourceTypes()?.map((item: string) =>
            item.toLowerCase()
        )
        console.log('connection store: ', connectionStore)
        if (connectionStore?.list?.length > 0) {
            let filteredConnectionsList = connectionStore?.list.filter(
                (connection) =>
                    !BItypes.includes(
                        connection.attributes.connectorName?.toLowerCase()
                    )
            )
            if (filteredConnectionsList.length > 0) {
                return filteredConnectionsList[0]
            }
        }
        return undefined
    }

    const checkConnection = (connector) => {
        let attribute = connector?.attributeValue?.split('/')
        let connection = undefined
        if (attribute?.length > 2) {
            connection = attribute.slice(0, 3).join('/')
        }
        const connectionStore = useConnectionStore()
        let selectedConnection = connectionStore?.list.find(
            (item) => item.attributes.qualifiedName === connection
        )

        // console.log('connection selected: ', finalConnection)

        return selectedConnection ? true : false
    }

    function getFormattedTimeFromMilliSeconds(ms) {
        var minutes = Math.floor(ms / 60000)
        var seconds = (ms % 60000) / 1000
        return seconds === 60
            ? minutes + 1 + 'm'
            : minutes > 0
            ? minutes +
              '.' +
              (seconds.toFixed(0) < 10 ? '0' : '') +
              seconds.toFixed(0) +
              'm'
            : seconds.toFixed(0) > 0
            ? seconds.toFixed(2) + 's'
            : ms + 'ms'
    }
    return {
        getFirstQueryConnection,
        checkConnection,
        getFormattedTimeFromMilliSeconds,
    }
}
