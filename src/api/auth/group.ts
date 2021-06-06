import { fetcher, getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import useSWRV from "swrv";

const serviceAlias = "auth";

const listGroup = (params?: any, options?: AxiosRequestConfig) => {
  console.log(params)
  const { data, error } = useSWRV([getAPIPath(serviceAlias, "/groups/v2"), params, options], fetcher);
  return {
    data,
    isLoading: !error && !data,
    isError: error
  }
}

export const GroupApi = {
  listGroup
};

