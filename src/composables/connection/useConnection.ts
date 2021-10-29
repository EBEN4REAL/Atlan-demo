import { ref, watch } from 'vue'
import { useConnectionStore } from '~/store/connection'

import useIndexSearch from '~/composables/discovery/useIndexSearch'
import { ConnectionAttriibutes } from '~/constant/projection'

export const MAX_CONNECTIONS = 100
export const CONNECTION_ASSET_TYPE = 'Connection'
export const CONNECTION_ATTRIBUTES = [
    'allowQuery',
    'allowQueryPreview',
    'queryPreviewConfig',
    'queryConfig',
    'defaultCredentialGuid',
]

export default function useConnection() {
    const { data } = useIndexSearch(
        {
            dsl: {
                size: MAX_CONNECTIONS,
                post_filter: {
                    bool: {
                        filter: [
                            {
                                terms: {
                                    '__typeName.keyword': ['Connection'],
                                },
                            },
                        ],
                    },
                },
                aggs: {
                    group_by_connection: {
                        terms: {
                            field: 'connectionName',
                            size: MAX_CONNECTIONS,
                        },
                    },
                },
            },
            attributes: [...CONNECTION_ATTRIBUTES, ...ConnectionAttriibutes],
        },
        ref('DEFAULT_CONNECTIONS'),
        null,
        true
    )

    const connectionStore = useConnectionStore()
    watch(data, () => {
        connectionStore.setList(data.value?.entities || [])
        connectionStore.setAssetCount(
            data.value?.aggregations?.group_by_connection?.buckets
        )
    })
    return {
        data,
    }
}
