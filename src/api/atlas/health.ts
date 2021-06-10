import { fetcher, getAPIPath } from "~/api";
import { AxiosRequestConfig } from "axios";
import useSWRV, { IConfig } from "swrv";
import { ref, Ref, toRefs } from "vue";

const serviceAlias = "auth/atlas";

const ping = (
  path: string,
  params?: any,
  options?: AxiosRequestConfig,
  config?: IConfig
) => {
  const { data, error } = useSWRV([path, params, options], fetcher, config);
  return {
    data,
    error,
  };
};

export const Health = {
  ping,
};
