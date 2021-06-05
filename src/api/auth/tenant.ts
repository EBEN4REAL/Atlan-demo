import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";

const serviceAlias = "auth";

const Get = (params?: any, options?: AxiosRequestConfig) => {
  return getAxiosClient().get(getAPIPath(serviceAlias, ""), {
    params,
    ...options,
  });
};

export const Tenant = {
  Get,
};
