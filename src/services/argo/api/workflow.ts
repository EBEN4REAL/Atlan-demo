import { AxiosRequestConfig } from "axios";
import { getAPIPath, getAxiosClient } from "~/api";
import { KeyMaps } from '~/api/keyMap';
import { useAPISWRV, useAPIAsyncState } from '~/api/useAPI';

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

const getWorkflowTemplates = (tenant, { immediate, options }) => useAPIAsyncState(KeyMaps.workflow.WORKFLOW_TEMPLATES, 'GET', {
  options,
  pathVariables: {
    tenant
  }
}, { immediate })

export const Workflows = {
  URL,
  List,
  ArchivedList,
  getWorkflowTemplates
};
