import { Ref, ref } from "vue";
import { AxiosRequestConfig } from "axios";
import useSWRV, { IConfig } from "swrv";

import { fetcher, fetcherPost, getAxiosClient, deleter } from "~/api";
import keyMaps from "~/api/keyMaps/index"


interface useGetAPIParams {
    cache?: boolean,
    params?: Record<string, any>,
    body?: Record<string, any>,
    pathVariables?: Record<string, any>,
    options?: IConfig & AxiosRequestConfig,
    dependantFetchingKey?: Ref,
    // swrOptions?: IConfig,
    // axiosOptions?: AxiosRequestConfig
}

/***
 * @param key - Used as an identifier for the cache when making requests with SWRV
 * @param method - The HTTP reqeust method to use
 * @param param - The query params to send while making a `GET` request
 * @param body - The payload to send while making a `POST` request
 * @param options - SWRV or Axios specefic configuration objects
 */
export const useAPI = <T>(key: string, method: 'GET' | 'POST' | 'DELETE', { cache = true, params, body, pathVariables, options, dependantFetchingKey }: useGetAPIParams) => {
    const url = keyMaps[key]({ ...pathVariables });
    if (cache) {
        // If using cache, make a generic swrv request
        const getKey = () => {
            if (dependantFetchingKey) {
                return key && dependantFetchingKey.value
            }
            return key
        }
        console.log(getKey())
        const { data, error, mutate } = useSWRV<T>(getKey, () => {
            // Choose the fetcher function based on the method type
            switch (method) {
                case 'GET':
                    return fetcher(url, params, options);

                case 'POST':
                    return fetcherPost(url, body, options)

                case 'DELETE':
                    return deleter(url)

                default:
                    return fetcher(url, params, options)
            }
        }, options);

        const isLoading = ref(!data && !error);
        return { data, error, isLoading, mutate };
    } else {
        // If not using cache, use Axios

        const data = ref<T>()
        const error = ref()
        const isLoading = ref<boolean>(false)

        switch (method) {
            case 'GET':
                getAxiosClient().get<T>(url, { params, ...options })
                    .then((resp) => {
                        data.value = resp as unknown as T
                    })
                    .catch((e) => {
                        error.value = e
                    })
                break;

            case 'POST':
                getAxiosClient().post<T>(url, body, { ...options })
                    .then((resp) => {
                        data.value = resp as unknown as T
                    })
                    .catch((e) => {
                        error.value = e
                    })
                break;

            case 'DELETE':
                getAxiosClient().delete<T>(url, { ...options })
                    .then((resp) => {
                        data.value = resp as unknown as T
                    })
                    .catch((e) => {
                        error.value = e
                    })
                break;

            default:
                break;
        }

        isLoading.value = !data.value && !error.value

        return { data, error, isLoading };
    }
}



