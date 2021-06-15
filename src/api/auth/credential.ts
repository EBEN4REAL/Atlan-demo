import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import { Components } from "./client";
const serviceAlias = "auth";

export const URL = {
  UPDATECRDENTIAL: "/credential"
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


export const Credential = {
  UpdateCredential,
};
