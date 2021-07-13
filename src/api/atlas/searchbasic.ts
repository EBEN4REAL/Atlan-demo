import { getAPIPath, getAxiosClient } from "~/api";
import axios, { AxiosRequestConfig } from "axios";
import { SearchParameters } from "~/types/atlas/attributes";
import { useAPI } from "../useAPI";

import { BASIC_SEARCH, SAVED_SEARCH } from "~/api/keyMaps/search"
import { Ref } from "vue";
import { IConfig } from "swrv";
import { Components } from "./client";
import { AsyncStateOptions } from "@vueuse/core";







//DEPRECATE
const Basic = (
  body?: SearchParameters,
  options?: AxiosRequestConfig,
) => {


  return;
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

const CreateSavedSearch = (
  cache?: string,
  body?: Ref<Components.Schemas.AtlasUserSavedSearch>,
  options?: Ref<IConfig & AxiosRequestConfig & AsyncStateOptions>,
  dependantFetchingKey?: Ref<any>
) => {

  return useAPI<any>(SAVED_SEARCH, "POST", {
    cache,
    body,
    options,
    dependantFetchingKey
  });
};


export const SearchBasic = {
  Basic,
  BasicV2,
  CreateSavedSearch
};

