import { AxiosRequestConfig } from "axios";
import { Ref } from "vue";

import { getAPIPath, getAxiosClient } from "~/api";
import { Components } from "./client";

import { useAPIPromise } from "../useAPI";
import { KeyMaps } from '../keyMap';

const serviceAlias = "auth";

/*
const TestNetwork = (
  body?: Ref<Components.Schemas.ConnectionTest>,
  options?: IConfig & AxiosRequestConfig,
  dependantFetchingKey?: Ref<any>
) => useAPI<any>(CONNECTION_TEST_NETWORK, "POST", {
  body,
  options,
  dependantFetchingKey
});
*/

const TestNetwork = (
  body?: Ref<Components.Schemas.ConnectionTest>,
  options?: AxiosRequestConfig,
) => useAPIPromise(KeyMaps.connection.CONNECTION_TEST_NETWORK(), "POST", {
  body,
  options,
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
