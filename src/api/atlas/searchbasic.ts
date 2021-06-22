import { getAPIPath, getAxiosClient } from "~/api";
import axios, { AxiosRequestConfig } from "axios";
import { SearchParameters } from "~/types/atlas/attributes";
import { useAPI } from "../useAPIv2";

import { BASIC_SEARCH } from "~/api/keyMaps/search"
import { Ref } from "vue";
import { IConfig } from "swrv";

const serviceAlias = "auth/atlas";


export const URL = {
  SEARCHBASIC: "/search/basic"
}

const Basic = (
  body?: SearchParameters,
  options?: AxiosRequestConfig,
) => {


  return getAxiosClient().post(
    getAPIPath(serviceAlias, URL.SEARCHBASIC),
    body,
    options
  );
};


const BasicV2 = (
  cache?: string,
  body?: Ref<SearchParameters>,
  options?: Ref<IConfig & AxiosRequestConfig>,
  dependantFetchingKey?: Ref<any>
) => {

  return useAPI<any>(BASIC_SEARCH, "POST", {
    cache,
    body,
    options,
    dependantFetchingKey
  });
};


export const SearchBasic = {
  URL,
  Basic,
  BasicV2
};

