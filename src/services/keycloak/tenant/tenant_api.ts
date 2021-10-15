import { AxiosRequestConfig } from "axios";
import { getAPIPath, getAxiosClient } from '~/api'
import { useAPI } from '~/api/useAPI'
import { GET_TENANT } from '@services/keycloak/tenant/tenant_keymap'

const serviceAlias = 'service'

const getTenant = (params?: any, options?: AxiosRequestConfig) =>
    getAxiosClient().get(getAPIPath(serviceAlias, GET_TENANT), {
        params,
        ...options,
    })


export const Tenant = {
    getTenant,
};







