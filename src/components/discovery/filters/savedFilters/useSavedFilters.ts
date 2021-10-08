import { Ref, ref, watch, computed } from 'vue'
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'
// import { Search } from '~/api2/search'
import { useAPIAsyncState } from '~/api/useAPI'
import { KeyMaps } from '~/api/keyMap'
import { assetInterface } from '~/types/assets/asset.interface'

export function addSavedFilter(

    immediate?: boolean,
    cancelTokenSource?: CancelTokenSource
) {

    const axiosOpts: AxiosRequestConfig = {
        cancelToken: cancelTokenSource?.token,
    }

    const body = computed(() => ({
        typeName: 'Column',
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: false,
        includeSubTypes: false,

    }))

    const { data, mutate, error, isLoading, isReady } = useAPIAsyncState<any>(
        KeyMaps.asset.SAVED_SEARCH,
        'POST',
        { body, options: axiosOpts },
        { immediate, resetOnExecute: false }
    )

    watch(data, () => {

    })

    return {
        data,

        isLoading,
        error,

        body,
        mutate,
        isReady,
    }
}

export function getSavedFilters(
    initialBody?: any,
    cacheSuffx?: string | '',
    immediate?: boolean,
    cancelTokenSource?: CancelTokenSource
) {
    const list: Ref<assetInterface[]> = ref([])
    const searchScoreList = ref({})

    const axiosOpts: AxiosRequestConfig = {
        cancelToken: cancelTokenSource?.token,
    }

    const body = ref(initialBody)

    const { data, mutate, error, isLoading, isReady } = useAPIAsyncState<any>(
        KeyMaps.asset.SAVED_SEARCH,
        'POST',
        { body, options: axiosOpts },
        { immediate, resetOnExecute: false }
    )

    watch(data, () => {
        if (body?.value?.offset > 0) {
            list.value = list.value.concat(data?.value?.entities)
            searchScoreList.value = {
                ...searchScoreList.value,
                ...data?.value?.searchScore,
            }
        } else if (data.value?.entities) {
            list.value = data.value?.entities
            searchScoreList.value = {
                ...data?.value?.searchScore,
            }
        } else {
            list.value = []
            searchScoreList.value = {}
        }
    })

    const refresh = () => {
        if (cancelTokenSource) {
            if (cancelTokenSource) {
                cancelTokenSource?.cancel('aborted')
            }
            cancelTokenSource = axios.CancelToken.source()
            axiosOpts.cancelToken = cancelTokenSource?.token
        }

        mutate()
    }

    const query = (queryText: string) => {
        body.value.query = queryText
        body.value.offset = 0
        refresh()
    }

    const replaceBody = (payload: any) => {
        body.value = payload
        refresh()
    }

    return {
        data,
        searchScoreList,
        list,
        isLoading,
        error,
        query,
        refresh,
        replaceBody,
        body,
        mutate,
        isReady,
    }
}

