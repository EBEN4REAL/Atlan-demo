import { Ref, ref } from "vue";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import useSWRV, { IConfig } from "swrv";

import { fetcher, fetcherPost, getAxiosClient, deleter, updater } from "~/api";
import keyMaps from "~/api/keyMaps/index";
import { AsyncStateOptions, useAsyncState } from "@vueuse/core";

interface useGetAPIParams {
  cache?: boolean;
  params?: Record<string, any>;
  body?: Record<string, any>;
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
    cache = true,
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
        return key && dependantFetchingKey.value;
      }
      return key;
    };
    const { data, error, mutate, isValidating } = useSWRV<T>(
      getKey,
      () => {
        // Choose the fetcher function based on the method type
        switch (method) {
          case "GET":
            return fetcher(url, params, options?.value);
          case "POST":
            return fetcherPost(url, body, options?.value);
          case "DELETE":
            return deleter(url, options?.value);
          case "PUT":
            return updater(url, body, options?.value);
          default:
            return fetcher(url, params, options?.value);
        }
      },
      options?.value
    );

    const isLoading = ref(!data && !error);
    return { data, error, isLoading, mutate, isValidating };
  } else {

    function getRequest(): any {

      switch (method) {
        case "POST":
          return getAxiosClient()
            .post<T>(url, body, { ...options?.value });
        case "DELETE":
          return getAxiosClient()
            .delete<T>(url, { ...options?.value });
        case "PUT":
          return getAxiosClient()
            .put<T>(url, body, { ...options?.value });
        default:
          return getAxiosClient()
            .get<T>(url, { params, ...options?.value });
      }
    }
    const { state, execute, isReady, error } = useAsyncState(() => getRequest(), {}, {
      immediate: options?.value.immediate
    });
    const isLoading = ref(!isReady);
    return {
      data: state, mutate: execute, error, isLoading
    }
  }
};
