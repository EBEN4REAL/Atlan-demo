import { AxiosRequestConfig } from "axios";
import { IConfig } from "swrv";
import { Ref } from "vue";

import { getAPIPath, getAxiosClient } from "~/api";
import { Components } from "./client";

import { useAPI } from "../useAPI";
import { CONNECTION_TEST_NETWORK } from "../keyMaps/auth/connection";

const serviceAlias = "auth";

const TestNetwork = (
  body?: Ref<Components.Schemas.ConnectionTest>,
  options?: IConfig & AxiosRequestConfig,
  dependantFetchingKey?: Ref<any>
) => useAPI<any>(CONNECTION_TEST_NETWORK, "POST", {
  body,
  options,
  dependantFetchingKey
});

const Setup = (
  body?: Components.Schemas.ConnectionSetup,
  options?: AxiosRequestConfig
) => getAxiosClient().post(
  getAPIPath(serviceAlias, `/connections`),
  body,
  options
);

const Archive = (id: string, body?: Components.Schemas.ConnectionSetup, options?: AxiosRequestConfig) => getAxiosClient().post(
  getAPIPath(serviceAlias, `/connections/${id}/archive`),
  {
    deleteAssets: true,
    deleteType: "HARD",
  },
  {
    timeout: 10000
  }
)

export const Connection = {
  TestNetwork,
  Setup,
  Archive
};
