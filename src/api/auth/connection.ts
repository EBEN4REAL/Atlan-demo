import { AxiosRequestConfig } from "axios";
import { Ref } from "vue";

import { AsyncStateOptions } from "@vueuse/core";
import { getAPIPath, getAxiosClient } from "~/api";
import { Components } from "./client";

import { useAPIAsyncState, useAPIPromise } from "../useAPI";
import { KeyMaps } from '../keyMap';

const serviceAlias = "auth";


const TestNetwork = (
  body?: Ref<Components.Schemas.ConnectionTest>,
  options?: object,
  asyncOpts?: AsyncStateOptions | undefined,

) => useAPIAsyncState<any>(KeyMaps.connection.CONNECTION_TEST_NETWORK, "POST", {
  body,
  options
}, asyncOpts);

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
