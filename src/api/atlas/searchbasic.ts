import { fetcherPost, getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import { Components } from "./client";
import useSWRV, { IConfig, } from "swrv";
import { reactive, ref, Ref, toRef, toRefs } from "vue";

const serviceAlias = "auth/atlas";


export const URL = {
  SEARCHBASIC: "/search/basic"
}

const Basic = (
  body?: Components.Schemas.SearchParameters,
  options?: AxiosRequestConfig,
) => {
  console.log("fetch");
  return getAxiosClient().post(
    getAPIPath(serviceAlias, URL.SEARCHBASIC),
    body,
    options
  );
};

export const SearchBasic = {
  URL,
  Basic,
};

