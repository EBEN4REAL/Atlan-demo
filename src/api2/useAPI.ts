import { Ref, ref } from "vue";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";
import useSWRV, { IConfig } from "swrv";

import { fetcher, fetcherPost, deleter, updater } from "./index";
import keyMaps from "./keymap/index";
import useSWRVState from "./useSWRVState";
import { AsyncStateOptions, useAsyncState } from "@vueuse/core";

interface useGetAPIParams {
  cacheSuffix?: string;
  params?: Ref;
  body?: Ref<Record<string, any>>;
  pathVariables?: Record<string, any>;
  options?: IConfig & AxiosRequestConfig;
  dependantFetchingKey?: Ref;
}

const STATES = {
  VALIDATING: 'VALIDATING',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
  STALE_IF_ERROR: 'STALE_IF_ERROR',
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
    cacheSuffix,
    params,
    body,
    pathVariables,
    options,
    dependantFetchingKey,
  }: useGetAPIParams
) => {
  const url = keyMaps[key]({ ...pathVariables });

  const getKey = () => {
    return dependantFetchingKey?.value ? `${key}_${cacheSuffix}` : null;
  };
  const { data, error, mutate, isValidating } = useSWRV<T>(
    getKey,
    () => {
      return getRequest(method, url, body, params, options);
    },
    options
  )
  const { state, STATES } = useSWRVState(data, error, isValidating);

  return { data, error, mutate, state, STATES, isValidating };

};


function getRequest(method, url, body, params, options) {
  switch (method) {
    case "GET":
      return fetcher(url, params?.value, options);
    case "POST":
      return fetcherPost(url, body?.value, options);
    case "DELETE":
      return deleter(url, options);
    case "PUT":
      return updater(url, body?.value, options);
    default:
      return fetcher(url, params?.value, options);
  }
}