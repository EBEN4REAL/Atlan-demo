import { fetcherPost, getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import { Components } from "./client";
import useSWRV, { IConfig, } from "swrv";
import { reactive, ref, Ref, toRef, toRefs } from "vue";

const serviceAlias = "auth/atlas";

const Basic = (
  body?: Components.Schemas.SearchParameters,
  options?: AxiosRequestConfig,

) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, "/search/basic"),
    body,
    options
  );
};


const BasicSearch = (
  body?: Components.Schemas.SearchParameters,
  options?: AxiosRequestConfig,
  config?: IConfig
) => {
  const { data, error, mutate } = useSWRV([getAPIPath(serviceAlias, "/search/basic"), body, options], fetcherPost, config);
  const response = data as Ref<Components.Schemas.AtlasSearchResult>
  const loading = ref(false)
  loading.value = !error && !data
  return {
    response,
    loading,
    error: error,
    mutate,
  }
};



export const Search = {
  Basic,
  BasicSearch,
};
