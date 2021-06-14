import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import { useAPI } from "~/api/useAPI";

const serviceAlias = "auth";

const Get = (params?: any, options?: AxiosRequestConfig) => {
  return getAxiosClient().get((serviceAlias, ""), {
    params,
    ...options,
  });
};

const TestSmtpConfig = ($axios, cancelToken, params) => {
  return useAPI("TEST_SMTP_CONFIG", "POST", {
    cache: false,
    body: {
      cancelToken,
      ...params,
      validateStatus(status) {
        return status >= 200 && status < 300;
      },
    },
  });
};

const Update = (fetcherPost, realm, body) => {
  return useAPI("UPDATE_SMTP", "POST", {
    cache: false,
    body,
  });
};

export const Tenant = {
  Get,
  TestSmtpConfig,
  Update,
};
