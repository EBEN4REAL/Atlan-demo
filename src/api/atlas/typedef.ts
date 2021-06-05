import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import {} from "./client";

const serviceAlias = "auth/atlas";

const List = (params?: any, options?: AxiosRequestConfig) => {
  return getAxiosClient().get(getAPIPath(serviceAlias, "/types/typedefs"), {
    params,
    ...options,
  });
};

export const Typedef = {
  List,
};
