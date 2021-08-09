import { AxiosRequestConfig } from "axios";
import { getHealthPath, getAxiosClient } from "~/api";

const serviceAlias = "heka/api/query";
const health = (params?: any, options?: AxiosRequestConfig) => (
    getAxiosClient().get(getHealthPath(serviceAlias, "/debug/health")),
    {
      params,
      ...options,
    }
  );
export const Query = {
  health,
};
