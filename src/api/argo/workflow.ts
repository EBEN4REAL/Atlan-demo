import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";

const serviceAlias = "auth/argo";

export const URL = {
  WorkflowList: "/workflows/default"
}


const List = (params?: any, options?: AxiosRequestConfig) => {
  return getAxiosClient().get(getAPIPath(serviceAlias, URL.WorkflowList), {
    params,
    ...options,
  });
};

export const Workflows = {
  URL,
  List,
};
