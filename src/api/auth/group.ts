import { fetcher, getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import useSWRV from "swrv";


const serviceAlias = "auth";

export const URL = {
  GroupList: "/groups"
}

// const listGroup = (params?: any, options?: AxiosRequestConfig) => {
//   const { data, error, mutate } = useSWRV([getAPIPath(serviceAlias, "/groups/v2"), params, options], fetcher);
//   return {
//     data,
//     isLoading: !error && !data,
//     isError: error,
//     mutate
//   }
// }

const ListV2 = (params?: any, options?: AxiosRequestConfig) => {
  return getAxiosClient().get(getAPIPath(serviceAlias, URL.GroupList), {
    params,
    ...options,
  });
};


export const Group = {
  ListV2,
};









