import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
const serviceAlias = "auth";

const ListV2 = (params?: any, options?: AxiosRequestConfig) => {
  //   params.limit = QUERY_MAX_LIMIT;
  return getAxiosClient().get(getAPIPath(serviceAlias, "/groups/v2"), {
    params,
    ...options,
  });
};

export const Group = {
  ListV2,
};
