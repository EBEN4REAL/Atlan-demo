import { getEnv } from "~/modules/__env";
import { axiosClient } from "~/modules/_axios";
import { AxiosResponse } from "axios";

export const getAPIPath = (serviceName: string, path = "") => {
  const realm = getEnv().DEFAULT_REALM;
  return `${serviceName}/tenants/${realm}${path}`;
};

export const getHealthPath = (serviceName: string, path = "") => {
  return `${serviceName}${path}`;
};

export const getAxiosClient = () => {
  return axiosClient;
};

export const fetcher = (
  url,
  params,
  options
): Promise<AxiosResponse["data"]> => {
  return getAxiosClient().get(url, { params, ...options });
};

export const fetcherPost = (
  url,
  body,
  options
): Promise<AxiosResponse["data"]> => {
  console.log("fetcher", options);
  return getAxiosClient().post(url, body, options);
};

export const updater = (url, body, options): Promise<AxiosResponse["data"]> => {
  return getAxiosClient().put(url, body, options);
};

export const deleter = (url, options): Promise<AxiosResponse["data"]> => {
  return getAxiosClient().delete(url, options);
};

// export const ServiceURLWithoutTenant = (serviceName, path = "") => {
//   return `${getApiPath(serviceName)}${path}`;
// };

// export const getSSRApiPath = (domain, apiPath) => {
//   const env = process.env.NODE_ENV;
//   switch (env) {
//     case "development":
//       return `${DEV_PREFIX_URL}/api/${apiPath}`;
//     default:
//       return `${domain}/api/${apiPath}`;
//   }
// };
