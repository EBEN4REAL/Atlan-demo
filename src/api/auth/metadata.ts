import { AxiosRequestConfig } from "axios";
import { getAPIPath, getAxiosClient } from "~/api";

const serviceAlias = "auth";

const List = (body?: any, options?: AxiosRequestConfig) => getAxiosClient().post(
    getAPIPath(serviceAlias, "/metadata"),
    body,
    options
  );

export const Metadata = {
  List,
};
