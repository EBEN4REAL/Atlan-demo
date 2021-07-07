import { getHealthPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";

const serviceAlias = "heka/api/query";
const health = (params?: any, options?: AxiosRequestConfig) => {
  return (
    getAxiosClient().get(getHealthPath(serviceAlias, "/debug/health")),
    {
      params,
      ...options,
    }
  );
};
export const Query = {
  health,
};
