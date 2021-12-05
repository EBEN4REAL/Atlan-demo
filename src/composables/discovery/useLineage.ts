import { Ref, ref, computed, watch } from 'vue'

import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

import axios from 'axios'

import { Search } from '~/services/meta/search'
import { useOptions } from '~/services/api/common'
import {
    getLineageOptions,
    lineageServiceAPI,
} from '~/services/meta/lineage/lineage_api'

export default function useLineage(
    guid: string,
    params?: Ref<getLineageOptions>,
    dependentKey?: Ref<any>
) {
    const options: useOptions = {}

    let cancel = axios.CancelToken.source()
    options.options = ref({
        cancelToken: cancel.token,
    })

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

    const { data, mutate, error, isLoading, isValidating, isReady } =
        lineageServiceAPI.getLineageUpdated(guid, params, options)

    const cancelRequest = () => {
        if (cancel) {
            cancel.cancel('operation cancelled')
        }
        cancel = axios.CancelToken.source()
        options.options.value = {
            cancelToken: cancel.token,
        }
    }

    const upstreamGuids = ref([])
    const downstreamGuids = ref([])

    const guidList = ref([])
    watch(data, () => {
        if (data.value?.guidEntityMap) {
            guidList.value = Object.keys(data.value.guidEntityMap)

            upstreamGuids.value = []
            downstreamGuids.value = []
            data.value.relations.forEach((relation) => {
                if (relation.fromEntityId === data.value.baseEntityGuid) {
                    downstreamGuids.value.push(relation.toEntityId)
                }
                if (relation.toEntityId === data.value.baseEntityGuid) {
                    upstreamGuids.value.push(relation.fromEntityId)
                }
            })
        }
    })

    const refresh = () => {
        cancelRequest()
        mutate()
    }

    return {
        data,
        options,
        cancel,
        mutate,
        refresh,
        isReady,
        error,
        isLoading,
        isValidating,
        cancelRequest,
        guidList,
        downstreamGuids,
        upstreamGuids,
    }
}
