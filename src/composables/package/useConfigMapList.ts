import axios from 'axios'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { Ref, ref, watch } from 'vue'
import { useOptions } from '~/services/api/common'
import { Workflows } from '~/services/service/workflows'

interface ConfigListParams {
    isCache?: boolean
    isLocal?: boolean
    ttl?: Number | 0
    dependentKey?: Ref<any>
    queryText?: Ref<any>
    filter?: Ref<any>
    limit?: Ref<Number> | 20
    offset?: Ref<Number> | 0
    preference?: Ref<any>
}

export function useConfigMapList({
    isCache,
    dependentKey,
    filter,
    limit = ref(20),
    isLocal,
    ttl,
    offset = ref(0),
}: ConfigListParams) {
    const options: useOptions = {}
    let cancel = axios.CancelToken.source()
    options.options = ref({
        cancelToken: cancel.token,
    })

    const buildFilters = (initial) => {
        let temp = {
            $and: [
                {
                    labels: {
                        $elemMatch: {
                            'com.atlan.orchestration/verified': 'true',
                        },
                    },
                },
            ],
        }

        if (initial) {
            temp = {
                $and: [
                    {
                        metadata: {
                            $elemMatch: {
                                labels: {
                                    'com.atlan.orchestration/verified': 'true',
                                },
                            },
                        },
                    },
                    ...(Object.keys(initial).length ? [initial] : []),
                ],
            }
        }

        return temp
    }

    const localFilter = ref(buildFilters(filter?.value))

    if (!isCache) {
        if (dependentKey) {
            if (!dependentKey.value) {
                options.asyncOptions = ref({
                    immediate: false,
                })
            }
        } else {
            options.asyncOptions = ref({
                immediate: true,
            })
        }
    } else {
        options.cacheOptions = ref({
            dedupingInterval: 0,
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            ttl,
            revalidateDebounce: 0,
        })
        if (isLocal) {
            options.cacheOptions.cache = new LocalStorageCache()
        }
        options.cacheKey = dependentKey
    }

    const params = ref(new URLSearchParams())
    // const sort = ref()
    params.value.append('limit', limit?.value.toString())
    params.value.append('offset', offset.value.toString())
    params.value.append('filter', JSON.stringify(localFilter?.value))

    const { data, error, isLoading, mutate } =
        Workflows.getWorkflowPackagesConfigMap({
            options,
            params,
        })

    const list = ref([])
    const totalCount = ref()
    const filter_record = ref()
    watch(data, () => {
        if (!data?.value?.records) return
        totalCount.value = data.value.total_record
        filter_record.value = data.value.filter_record
        list.value.push(...data.value.records)
    })

    const loadMore = () => {
        params.value.offset += params.value.limit
        if (params.value.offset > totalCount.value)
            params.value.offset = totalCount.value
        mutate()
    }

    const refresh = (AllFilters) => {
        // rest list
        list.value = []
        // reset offset
        offset.value = 0
        params.value.set('offset', '0')
        mutate()
    }

    return {
        list,
        data,
        loadMore,
        filter_record,
        totalCount,
        error,
        isLoading,
        refresh,
        mutate,
        buildFilters,
    }
}
