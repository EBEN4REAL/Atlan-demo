import { getAPIPath, getAxiosClient } from '~/api'

import { AxiosRequestConfig } from 'axios'
import { Ref } from 'vue'
import { IRequestActionBody, RequestAttributes } from '~/types/atlas/requests'
import { useAPIPromise, useAPIAsyncState } from '~/api/useAPI'
import { KeyMaps } from '~/api/keyMap'

const serviceAlias = 'heka/api/query'

export const getRequests = (params?: any, options?: AxiosRequestConfig) => {
    const { data, error, mutate, isLoading } = useAPIAsyncState<{
        records: RequestAttributes[]
    }>(KeyMaps.auth.requests.LIST_REQUESTS, 'GET', {
        options,
        params,
    })

    return { response: data, error, mutate, isLoading }
}

// heka/api/query/tenants/default/sql/stream?sql=c2VsZWN0ICogZnJvbSAiV0VCX1NBTEVTIiBsaW1pdCAyMDA%3D&defaultSchema=SNOWFLAKE_SAMPLE_DATA.TPCDS_SF10TCL&dataSourceName=default%2Fsnowflake%2Famit-test-connection

const getData = (params?: any, options?: AxiosRequestConfig) => (
    getAxiosClient().get(
        getAPIPath(
            serviceAlias,
            '/sql/stream?sql=c2VsZWN0ICogZnJvbSAiV0VCX1NBTEVTIiBsaW1pdCAyMDA%3D&defaultSchema=SNOWFLAKE_SAMPLE_DATA.TPCDS_SF10TCL&dataSourceName=default%2Fsnowflake%2Famit-test-connection'
        )
    ),
    {
        params,
        ...options,
    }
)

export const Query = {
    getData,
}
