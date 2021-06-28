import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";

const serviceAlias = "auth/argo";

export const URL = {
  WorkflowList: "/workflows/default",
  ArchiveList: "/archived-workflows"
}


const List = (params?: any, options?: AxiosRequestConfig) => {
  return getAxiosClient().get(getAPIPath(serviceAlias, URL.WorkflowList), {
    params,
    ...options,
  });
};

const ArchivedList = (params?: any, options?: AxiosRequestConfig) => {
  return getAxiosClient().get(getAPIPath(serviceAlias, URL.ArchiveList), {
    params,
    ...options,
  });
};


export const Workflows = {
  URL,
  List,
  ArchivedList,
};
