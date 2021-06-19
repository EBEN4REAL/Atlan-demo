import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import { Components } from "./client";
const serviceAlias = "auth";

export const URL = {
  UPDATECRDENTIAL: "/credentials",
  TESTCREDENTIAL: "/credentials/test",
  TESTCREDENTIALBYGUID: "/credentials"
}

const UpdateCredential = (
  id: String,
  body?: any,
  options?: AxiosRequestConfig
) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `${URL.UPDATECRDENTIAL}/${id}`),
    body,
    options
  );
};

const TestCredential = (
  body?: any,
  options?: AxiosRequestConfig
) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `${URL.TESTCREDENTIAL}`),
    body,
    options
  );
};

const TestCredentialByID = (
  id?: any,
  options?: AxiosRequestConfig
) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `${URL.TESTCREDENTIALBYGUID}/${id}/test`),
    options
  );
};



export const Credential = {
  UpdateCredential,
  TestCredential,
  TestCredentialByID,
};
