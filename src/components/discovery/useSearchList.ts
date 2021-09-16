import { Ref, ref, watch } from 'vue'
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios'
import { BaseAttributes, tableauAttributes } from '~/constant/projection'
// import { Search } from '~/api2/search'
import { useAPIAsyncState } from '~/api/useAPI'
import { KeyMaps } from '~/api/keyMap'
import { assetInterface } from '~/types/assets/asset.interface'

export default function useSearchList(
    typeName: string,
    attributes: string[],
    initialBody?: any,
    cacheSuffx?: string | '',
    immediate?: boolean,
    cancelTokenSource?: CancelTokenSource
) {
    const list: Ref<assetInterface[]> = ref([])
    const axiosOpts: AxiosRequestConfig = {
        cancelToken: cancelTokenSource?.token,
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
        ...initialBody,
    })

    // const cachekey = ref(`${cacheSuffx}`)

    // const { data, mutate, error, isLoading, isLoading } =
    //     SearchBasic.BasicV2(cachekey.value, body, axiosOpts, dependentKey)

    const { data, mutate, error, isLoading } = useAPIAsyncState<any>(
        KeyMaps.asset.BASIC_SEARCH,
        'POST',
        { body, options: axiosOpts },
        { immediate }
    )

    watch(data, () => {
        if (body?.value?.offset > 0) {
            list.value = list.value.concat(data?.value?.entities)
        } else if (data.value?.entities) {
            list.value = data.value?.entities
        } else {
            list.value = []
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
        list,
        isLoading,
        error,
        query,
        refresh,
        replaceBody,
        body,
        mutate,
    }
}
