import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import { Components } from "./client";
const serviceAlias = "auth";

const TestNetwork = (
  body?: Components.Schemas.ConnectionTest,
  options?: AxiosRequestConfig
) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, "/connections/test"),
    body,
    options
  );
};

const Setup = (
  body?: Components.Schemas.ConnectionSetup,
  options?: AxiosRequestConfig
) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `/connections`),
    body,
    options
  );
};

const Archive = (id: string, body?: Components.Schemas.ConnectionSetup, options?: AxiosRequestConfig) => {

  return getAxiosClient().post(
    getAPIPath(serviceAlias, `/connections/${id}/archive`),
    {
      deleteAssets: true,
      deleteType: "HARD",
    },
    {
      timeout: 10000
    }
  );
}



// const Basic = (
//   body?: Components.Schemas.SearchParameters,
//   options?: AxiosRequestConfig
// ) => {
//   return getAxiosClient().post(
//     getAPIPath(serviceAlias, "/search/basic"),
//     body,
//     options
//   );
// };



// const Setup = ($axios, body) => {
//   return $axios.$post(
//     ServiceURL(resourceName, $axios.defaults.tenant, `/connections`),
//     body,
//     {
//       timeout: 10000,
//       validateStatus(status) {
//         return status >= 200 && status < 300;
//       },
//     }
//   );
// };

// const Query = ($axios, body) => {
//   return $axios.$post(
//     ServiceURL(resourceName, $axios.defaults.tenant, `/connections/query`),
//     body,
//     {
//       timeout: 10000,
//       validateStatus(status) {
//         return status >= 200 && status < 300;
//       },
//     }
//   );
// };

export const Connection = {
  TestNetwork,
  Setup,
  Archive
};
