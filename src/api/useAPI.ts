import { Ref, ref, watch } from "vue";
import { AxiosRequestConfig } from "axios";
import useSWRV, { IConfig } from "swrv";

import { fetcher, fetcherPost, getAxiosClient, deleter, updater } from "~/api";
import keyMaps from "~/api/keyMaps/index";
import { AsyncStateOptions, useAsyncState } from "@vueuse/core";

interface useGetAPIParams {
  cache?: string | boolean;
  params?: Record<string, any> | URLSearchParams;
  body?: Ref<Record<string, any>> | Record<string, any>;
  pathVariables?: Record<string, any>;
  options?: Ref<IConfig & AxiosRequestConfig & AsyncStateOptions> | (IConfig & AxiosRequestConfig & AsyncStateOptions);
  dependantFetchingKey?: Ref;
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

export const useAPI = <T>(
  key: string,
  method: "GET" | "POST" | "DELETE" | "PUT",
  {
    cache = "",
    params,
    body,
    pathVariables,
    options,
    dependantFetchingKey,
  }: useGetAPIParams
) => {
  const url = keyMaps[key]({ ...pathVariables });

  const requestBody = isRef(body) ? body.value : body
  const requestOptions = isRef(options) ? options.value : options;  

  if (cache) {
    // If using cache, make a generic swrv request
    const getKey = () => {
      if (dependantFetchingKey) {
        return dependantFetchingKey.value ? `${key}_${cache}` : null;
      }
      return `${key}_${cache}`;
    };

    const { data, error, mutate, isValidating } = useSWRV<T>(
      getKey,
      () => {
        // Choose the fetcher function based on the method type
        switch (method) {
          case "GET":
            return fetcher(url, params, requestOptions);
          case "POST":
            return fetcherPost(url, requestBody, requestOptions);
          case "DELETE":
            return deleter(url, requestOptions);
          case "PUT":
            return updater(url, requestBody, requestOptions);
          default:
            return fetcher(url, params, requestOptions);
        }
      },
      requestOptions
    );

    const isLoading = ref(!data && !error);
    return { data, error, isLoading, mutate, isValidating };
  } else {
    function getRequest(): any {
      switch (method) {
        case "POST":
          return getAxiosClient().post<T>(url, requestBody, {
            params,
            ...requestOptions,
          });
        case "DELETE":
          return getAxiosClient().delete<T>(url, { ...requestOptions });
        case "PUT":
          return getAxiosClient().put<T>(url, requestBody, {
            params,
            ...requestOptions,
          });
        default:
          return getAxiosClient().get<T>(url, { params, ...requestOptions });
      }
    }
    const isLoading = ref(true);
    const { state, execute, isReady, error } = useAsyncState<T>(
      () => getRequest(),
      <T>{},
      {
        immediate: requestOptions?.immediate,
      }
    );
    
    watch([state, error], () => {
      if (state || error) isLoading.value = false;
    });

    return {
      data: state,
      mutate: execute,
      error,
      isReady,
      isLoading,
    };
  }
};

function isRef(arg: any): arg is Ref {
  return arg && arg.value && typeof(arg.value) == 'object';
}