import { AxiosRequestConfig } from "axios";
import { getAPIPath, getAxiosClient } from "~/api";

const serviceAlias = "auth/argo";

export const URL = {
  WorkflowList: "/workflows/default",
  ArchiveList: "/archived-workflows"
}


const List = (params?: any, options?: AxiosRequestConfig) => getAxiosClient().get(getAPIPath(serviceAlias, URL.WorkflowList), {
    params,
    ...options,
  });

const ArchivedList = (params?: any, options?: AxiosRequestConfig) => getAxiosClient().get(getAPIPath(serviceAlias, URL.ArchiveList), {
    params,
    ...options,
  });


export const Workflows = {
  URL,
  List,
  ArchivedList,
};
