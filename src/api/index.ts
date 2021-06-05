import { getEnv } from "~/modules/__env";
import { axiosClient } from "~/modules/_axios";


export const getAPIPath = (serviceName: string, path = "") => {
  const realm = getEnv().DEFAULT_REALM;
  return `${serviceName}/tenants/${realm}${path}`;
};

export const getAxiosClient = () => {
  return axiosClient;
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
