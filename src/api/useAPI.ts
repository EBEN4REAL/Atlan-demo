import { reactive, toRefs, UnwrapRef } from "vue";
import { AxiosRequestConfig } from "axios";
import useSWRV, { IConfig } from "swrv";

import { fetcher, fetcherPost, getAxiosClient } from "~/api";
import keyMaps from "~/api/keyMaps/index"


interface useGetAPIParams {
    cache?: boolean,
    params?: Record<string, any>,
    body?: Record<string, any>,
    options?: IConfig & AxiosRequestConfig,
    // swrOptions?: IConfig,
    // axiosOptions?: AxiosRequestConfig
}

export const useAPI = <T>(key: string, method: 'GET' | 'POST', { cache = true, params, body, options }: useGetAPIParams) => {
    const url = keyMaps[key];
    console.log(url)

    if (cache) {
        const { data, error, mutate } = useSWRV<T>(key, () => {
            switch (method) {
                case 'GET':
                    return fetcher(url, params, options);

                case 'POST':
                    return fetcherPost(url, body, options)

                default:
                    return fetcher(url, params, options)
            }
        }, options);

        const isLoading = !data && !error
        return { data, error, isLoading, mutate };
    } else {
        const response = reactive({
            data: null as T | null,
            error: null as any | null,
            isLoading: false
        });

        switch (method) {
            case 'GET':
                getAxiosClient().get<T>(url, { params, ...options })
                    .then((data) => {
                        response.data = data as UnwrapRef<T>
                    })
                    .catch((error) => {
                        response.error = error
                    })
                break;

            case 'POST':
                getAxiosClient().post<T>(url, body, { ...options })
                    .then((data) => {
                        response.data = data as UnwrapRef<T>
                    })
                    .catch((error) => {
                        response.error = error
                    })
                break;

            default:
                break;
        }

        response.isLoading = !response.data && !response.error
        return { ...toRefs(response) };
    }
}



