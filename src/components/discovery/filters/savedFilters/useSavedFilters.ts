import { Ref, ref, watch, computed } from 'vue'
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'
// import { Search } from '~/api2/search'
import { useAPIAsyncState } from '~/api/useAPI'
import { KeyMaps } from '~/api/keyMap'
import { assetInterface } from '~/types/assets/asset.interface'
import { Components } from '~/api/atlas/client'

interface SavedFilterConfig {
    savedFilterName: Ref<string>
    ownerName: Ref<string>
    appliedFilters: Ref<Components.Schemas.FilterCriteria[]>
}

export function addSavedFilter(
    savedFilterName: Ref<string>,
    ownerName: Ref<string>,
    appliedFilters: Ref<Components.Schemas.FilterCriteria[]>,
) {
    const cancelTokenSource = axios.CancelToken.source()

    const axiosOpts: AxiosRequestConfig = {
        cancelToken: cancelTokenSource?.token,
    }

    const body = computed(() => ({
        name: savedFilterName.value,
        ownerName: ownerName.value,
        searchParameters: {
            entityFilters: {
                condition: "AND",
                criterion: [...appliedFilters.value],
            },
            excludeDeletedEntities: true,
            includeClassificationAttributes: true,
            includeSubClassifications: true,
            includeSubTypes: true,
            typeName: "Catalog"
        },
        searchType: "BASIC",
    }
    ))

    const { data, mutate, error, isLoading, isReady } = useAPIAsyncState<any>(
        KeyMaps.asset.SAVED_SEARCH,
        'POST',
        { body, options: axiosOpts },
        { resetOnExecute: false }
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
) {
    const list: Ref<assetInterface[]> = ref([])

    let cancelTokenSource = axios.CancelToken.source()

    const axiosOpts: AxiosRequestConfig = {
        cancelToken: cancelTokenSource?.token,
    }

    const { data, mutate, error, isLoading, isReady } = useAPIAsyncState<any>(
        KeyMaps.asset.SAVED_SEARCH,
        'GET',
        { options: axiosOpts },
        { resetOnExecute: false }
    )

    watch(data, () => {

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

    return {
        data,
        list,
        isLoading,
        error,
        refresh,
        mutate,
        isReady,
    }
}

export function editSavedFilter(
    oldFilter: Ref<any>,
    appliedFilters: Ref<Components.Schemas.FilterCriteria[]>,
) {
    const cancelTokenSource = axios.CancelToken.source()

    const axiosOpts: AxiosRequestConfig = {
        cancelToken: cancelTokenSource?.token,
    }

    const body = ref({ ...oldFilter.value })

    body.value.searchParameters.entityFilters.criterion = [...appliedFilters.value]

    const { data, mutate, error, isLoading, isReady } = useAPIAsyncState<any>(
        KeyMaps.asset.SAVED_SEARCH,
        'PUT',
        { body, options: axiosOpts },
        { resetOnExecute: false }
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