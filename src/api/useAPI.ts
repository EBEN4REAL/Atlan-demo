import { ref } from "vue";
import { AxiosRequestConfig } from "axios";
import useSWRV, { IConfig } from "swrv";

import { fetcher, fetcherPost, getAxiosClient } from "~/api";
import keyMaps from "~/api/keyMaps/index"


interface useGetAPIParams {
    cache?: boolean,
    params?: Record<string, any>,
    body?: Record<string, any>,
    pathVariables?: Record<string, any>,
    options?: IConfig & AxiosRequestConfig,
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
export const useAPI = <T>(key: string, method: 'GET' | 'POST', { cache = true, params, body, pathVariables, options }: useGetAPIParams) => {
    const url = keyMaps[key]({ ...pathVariables });

    if (cache) {
        // If using cache, make a generic swrv request
        const { data, error, mutate } = useSWRV<T>(key, () => {
            // Choose the fetcher function based on the method type
            switch (method) {
                case 'GET':
                    return fetcher(url, params, options);

                case 'POST':
                    return fetcherPost(url, body, options)

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

            default:
                break;
        }

        isLoading.value = !data.value && !error.value

        return { data, error, isLoading };
    }
}



