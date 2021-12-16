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

const GROUP_AGGREATION = 'group_by_connection'

export default function useConnection() {
    const { data, aggregationMap } = useIndexSearch(
        {
            dsl: {
                size: MAX_CONNECTIONS,
                query: {
                    bool: {
                        filter: [
                            {
                                term: {
                                    __state: 'ACTIVE',
                                },
                            },
                            {
                                bool: {
                                    must_not: {
                                        terms: {
                                            '__typeName.keyword': [
                                                'Process',
                                                'ColumnProcess',
                                            ],
                                        },
                                    },
                                },
                            },
                        ],
                    },
                },
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
                    [GROUP_AGGREATION]: {
                        terms: {
                            field: 'connectionQualifiedName',
                            size: MAX_CONNECTIONS,
                        },
                    },
                },
            },
            attributes: [...CONNECTION_ATTRIBUTES, ...ConnectionAttriibutes],
        },
        ref('DEFAULT_CONNECTIONS'),
        false
    )
    const connectionStore = useConnectionStore()
    watch(data, () => {
        connectionStore.setList(data?.value.entities || [])
        connectionStore.setAssetCount(aggregationMap(GROUP_AGGREATION) || [])
    })
}
