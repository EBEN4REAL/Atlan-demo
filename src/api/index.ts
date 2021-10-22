import { AxiosResponse } from 'axios'
import { getEnv } from '~/modules/__env'
import { axiosClient } from '~/modules/_axios'

export type PathParams = Record<string, string>
export type APIFn = (arg0: PathParams) => string

export const getAPIPath = (serviceName: string, path = '') => {
    const realm = getEnv().DEFAULT_REALM
    return `${serviceName}${path}`
}

export const getHealthPath = (serviceName: string, path = '') =>
    `${serviceName}${path}`
export const getSavedQueryPath = (serviceName: string, path = '') =>
    `${serviceName}${path}`

export const getAxiosClient = () => axiosClient

export const fetcher = <T>(
    url,
    params,
    options
): Promise<AxiosResponse<T>['data']> =>
    // replacing params:{...params} with params
    // params won't necessarily be a destructurable object ex- URLSearchParams - getting used in ~/components/admin/users/userPreview/accessLogs.vue
    getAxiosClient().get(url, { params, ...options })

export const fetcherPost = <T>(
    url,
    body,
    options
): Promise<AxiosResponse<T>['data']> => {
    return getAxiosClient().post(url, body, options)
}

export const updater = <T>(
    url,
    body,
    options
): Promise<AxiosResponse<T>['data']> => getAxiosClient().put(url, body, options)

export const deleter = <T>(url, options): Promise<AxiosResponse<T>['data']> =>
    getAxiosClient().delete(url, options)

// export const ServiceURLWithoutTenant = (serviceName, path = "") => {
//   return `${getApiPath(serviceName)}${path}`;
// };

// export const getSSRApiPath = (domain, apiPath) => {
//   const env = process.env.NODE_ENV;
//   switch (env) {
//     case "development":
//       return `${DEV_PREFIX_URL}/api/${apiPath}`;
//     default:
//       return `${domain}/api/${apiPath}`;
//   }
// };
