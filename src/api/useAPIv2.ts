import { Ref, ref } from "vue";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import useSWRV, { IConfig } from "swrv";

import { fetcher, fetcherPost, getAxiosClient, deleter, updater } from "~/api";
import keyMaps from "~/api/keyMaps/index";
import { AsyncStateOptions, useAsyncState } from "@vueuse/core";

interface useGetAPIParams {
  cache?: string;
  params?: Record<string, any>;
  body?: Ref<Record<string, any>>;
  pathVariables?: Record<string, any>;
  options?: Ref<IConfig & AxiosRequestConfig & AsyncStateOptions>;
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
            return fetcher(url, params, options?.value);
          case "POST":
            return fetcherPost(url, body?.value, options?.value);
          case "DELETE":
            return deleter(url, options?.value);
          case "PUT":
            return updater(url, body?.value, options?.value);
          default:
            return fetcher(url, params, options?.value);
        }
      },
      options?.value
    );

    const isLoading = ref(!data && !error);
    return { data, error, isLoading, mutate, isValidating };
  } else {
    console.log("not cached", url);
    function getRequest(): any {

      switch (method) {
        case "POST":
          return getAxiosClient()
            .post<T>(url, body?.value, { params, ...options?.value });
        case "DELETE":
          return getAxiosClient()
            .delete<T>(url, { ...options?.value });
        case "PUT":
          return getAxiosClient()
            .put<T>(url, body?.value, { params, ...options?.value });
        default:
          return getAxiosClient()
            .get<T>(url, { params, ...options?.value });
      }
    }
    const { state, execute, isReady, error } = useAsyncState(() => getRequest(), {}, {
      immediate: options?.value.immediate
    });


    return {
      data: state, mutate: execute, error, isReady
    }
  }
};
