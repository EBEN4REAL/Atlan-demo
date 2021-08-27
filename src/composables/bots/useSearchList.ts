import { computed, Ref, ref, watch } from 'vue'
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'
import { IConfig } from 'swrv'
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'
import { BaseAttributes, tableauAttributes } from '~/constant/projection'
// import { Search } from '~/api2/search'
import { SearchBasic } from '~/api/atlas/searchbasic'

import { Components } from '~/api/atlas/client'
import { AssetTypeList } from '~/constant/assetType'

export default function useSearchList(
    typeName: string,
    list: any,
    attributes: string[],
    dependentKey?: Ref<any>,
    initialBody?: any,
    cacheSuffx?: string | '',
    isLocalStorage?: boolean,
    cancelTokenSource?: Ref<CancelTokenSource>,
    quickChange?: boolean
) {
    const asyncOptions: IConfig & AxiosRequestConfig = {
        dedupingInterval: 0,
        shouldRetryOnError: false,
        revalidateOnFocus: false,
        revalidateDebounce: 0,
    }
    if (isLocalStorage) {
        asyncOptions.cache = new LocalStorageCache()
    }
    if (cancelTokenSource) {
        asyncOptions.cancelToken = cancelTokenSource.value.token
    }

    const body = ref({
        typeName,
        excludeDeletedEntities: true,
        includeClassificationAttributes: false,
        includeSubClassifications: false,
        includeSubTypes: true,
        limit: 100,
        offset: 0,
        attributes: [...BaseAttributes, ...attributes, ...tableauAttributes],
        entityFilters: {},
        aggregationAttributes: [],
        ...initialBody,
    })

    const cachekey = ref(`${cacheSuffx}`)

    const { data, mutate, error, isLoading, isValidating } =
        SearchBasic.BasicV2(cachekey.value, body, asyncOptions, dependentKey)

    const searchScoreList = ref({})

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
            if (isValidating?.value && cancelTokenSource.value) {
                cancelTokenSource?.value.cancel('aborted')
            }
            cancelTokenSource.value = axios.CancelToken.source()
            asyncOptions.cancelToken = cancelTokenSource?.value.token
        }
        if (quickChange) {
            cachekey.value = `${cacheSuffx}_${Date.now().toString()}`
        } else {
            mutate()
        }
    }

    const asyncRefresh = () => {
        if (cancelTokenSource) {
            if (isValidating?.value && cancelTokenSource.value) {
                cancelTokenSource?.value.cancel('aborted')
            }
            cancelTokenSource.value = axios.CancelToken.source()
            asyncOptions.cancelToken = cancelTokenSource?.value.token
        }
        return mutate()
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

    const replaceBodyAsync = async (payload: any) => {
        body.value = payload
        await asyncRefresh()
    }

    const replaceFilters = (filters: Components.Schemas.FilterCriteria) => {
        body.value.entityFilters = {
            ...filters,
        }
        refresh()
    }

    const assetTypeMap = computed(() => {
        if (data.value?.aggregations) {
            return data.value?.aggregations['__typeName.keyword']
        }
        return {}
    })

    const assetTypeList = computed(() => {
        const tempList = AssetTypeList.filter((item) => item.isDiscoverable)
        tempList.forEach((item) => {
            item.count = assetTypeMap.value[item.id]
        })
        return tempList
    })
    const assetTypeSum = computed(() => {
        const initialValue = 0
        const sum = assetTypeList.value.reduce(
            (accumulator, currentValue) => accumulator + currentValue.count,
            initialValue
        )
        return sum
    })

    return {
        data,
        list,
        isLoading,
        error,
        isValidating,
        query,
        replaceFilters,
        refresh,
        replaceBody,
        body,
        mutate,
        assetTypeMap,
        assetTypeList,
        assetTypeSum,
        asyncRefresh,
        replaceBodyAsync,
        searchScoreList,
    }
}
