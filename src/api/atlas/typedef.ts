import { AxiosRequestConfig } from "axios";
import { getAPIPath, getAxiosClient } from "~/api";
import {} from "./client";

const serviceAlias = "auth/atlas";

const List = (params?: any, options?: AxiosRequestConfig) => getAxiosClient().get(getAPIPath(serviceAlias, "/types/typedefs"), {
    params,
    ...options,
  });

export const Typedef = {
  List,
};
