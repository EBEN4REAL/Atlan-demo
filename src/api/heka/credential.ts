import { AxiosRequestConfig } from "axios";
import { getAPIPath, getAxiosClient } from "~/api";

const serviceAlias = "query";

const TestCredential = (body?: any, options?: AxiosRequestConfig) => getAxiosClient().post(
    getAPIPath(serviceAlias, "/credential/test"),
    body,
    options
  );

export const Credential = {
  TestCredential,
};
