import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
const serviceAlias = "query";

const List = (body?: any, options?: AxiosRequestConfig) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, "/metadata"),
    body,
    options
  );
};

export const Metadata = {
  List,
};
