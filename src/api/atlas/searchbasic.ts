import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import { SearchParameters } from "~/types/atlas/attributes";

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

export const SearchBasic = {
  URL,
  Basic,
};

