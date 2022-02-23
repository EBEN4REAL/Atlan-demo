import { ref, watch } from 'vue'
import { useConnectionStore } from '~/store/connection'

import { useBody } from '~/composables/discovery/useBody'
import useIndexSearch from '~/composables/discovery/useIndexSearch'
import { ConnectionAttriibutes } from '~/constant/projection'
import { assetInterface } from '~/types/assets/asset.interface'

export const MAX_CONNECTIONS = 200
export const CONNECTION_ASSET_TYPE = 'Connection'
export const CONNECTION_ATTRIBUTES = [
    'allowQuery',
    'allowQueryPreview',
    'queryPreviewConfig',
    'queryConfig',
    'defaultCredentialGuid',
]

const GROUP_AGGREATION = 'group_by_connection'

export function useConnection() {
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
            suppressLogs: true,
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

export function useConnectionByConnectorName(connectorName) {
    const defaultBody = ref({})

    const defaultAttributes = ref([
        'connectorName',
        'connectionName',
        'connectionQualifiedName',
        'defaultSchemaQualifiedName',
        'defaultDatabaseQualifiedName',
    ])

    const generateBody = () => {
        const dsl = useBody(
            '',
            0,
            MAX_CONNECTIONS,
            { connector: connectorName },
            { typeName: 'Connection' },
            ['connection'],
            {}
        )
        defaultBody.value = {
            dsl,
            attributes: defaultAttributes?.value,
            suppressLogs: true,
        }
    }

    const localKey = ref(connectorName)

    generateBody()
    const { data, isLoading, mutate, cancelRequest, error, aggregationMap } =
        useIndexSearch<assetInterface>(defaultBody, localKey, false, false, 1)

    const list = ref<assetInterface[]>([])

    watch(data, () => {
        if (data.value?.entities) {
            list.value = [...data?.value?.entities]
            list.value?.forEach((element, index) => {
                const aggr = aggregationMap(GROUP_AGGREATION).find(
                    (item) => item.key === element.attributes?.qualifiedName
                )
                if (aggr) {
                    element.assetCount = aggr.doc_count + 1
                } else {
                    element.assetCount = 0 + 1
                }
            })
        } else {
            list.value = []
        }
    })

    return { data, list, isLoading, error, mutate }
}
