import { AxiosRequestConfig } from "axios";
import { getAPIPath, getAxiosClient } from "~/api";
import { Components } from "./client";

const serviceAlias = "auth";

const TestNetwork = (
  body?: Components.Schemas.ConnectionTest,
  options?: AxiosRequestConfig
) => getAxiosClient().post(
    getAPIPath(serviceAlias, "/connections/test"),
    body,
    options
  );

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
