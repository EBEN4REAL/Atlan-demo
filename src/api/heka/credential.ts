import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
const serviceAlias = "query";

const TestCredential = (body?: any, options?: AxiosRequestConfig) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, "/credential/test"),
    body,
    options
  );
};

export const Credential = {
  TestCredential,
};
