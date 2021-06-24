import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import { useAPI } from "~/api/useAPI";
import { getEnv } from "~/modules/__env";

const serviceAlias = "auth";

const Get = (params?: any, options?: AxiosRequestConfig) => {
  return getAxiosClient().get(getAPIPath(serviceAlias, ""), {
    params,
    ...options,
  });
};

const TestSmtpConfig = (body) => {
  console.log(body, "test");
  return useAPI("TEST_SMTP_CONFIG", "POST", {
    cache: false,
    body,
  });
};

const Update = ({ cache, body }) => {
  return useAPI("UPDATE_SMTP", "POST", {
    cache,
    body: { ...body, realm: getEnv().DEFAULT_REALM },
  });
};

export const Tenant = {
  Get,
  TestSmtpConfig,
  Update,
};
