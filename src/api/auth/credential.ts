import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import { Components } from "./client";
const serviceAlias = "auth";

export const URL = {
  UPDATECRDENTIAL: "/credential",
  TESTCREDENTIAL: "/credentials/test"
}

const UpdateCredential = (
  id: String,
  body?: Components.Schemas.Credential,
  options?: AxiosRequestConfig
) => {
  return getAxiosClient().put(
    getAPIPath(serviceAlias, `${URL.UPDATECRDENTIAL}/${id}`),
    body,
    options
  );
};

const TestCredential = (
  body?: Components.Schemas.Credential,
  options?: AxiosRequestConfig
) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `${URL.TESTCREDENTIAL}`),
    body,
    options
  );
};


export const Credential = {
  UpdateCredential,
  TestCredential,
};
