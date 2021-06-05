import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";

const serviceAlias = "auth/argo";

const List = (params?: any, options?: AxiosRequestConfig) => {
  return getAxiosClient().get(getAPIPath(serviceAlias, "/workflows/default"), {
    params,
    ...options,
  });
};

export const Workflows = {
  List,
};
