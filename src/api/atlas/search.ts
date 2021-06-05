import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import { Components } from "./client";

const serviceAlias = "auth/atlas";

const Basic = (
  body?: Components.Schemas.SearchParameters,
  options?: AxiosRequestConfig
) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, "/search/basic"),
    body,
    options
  );
};

export const Search = {
  Basic,
};
