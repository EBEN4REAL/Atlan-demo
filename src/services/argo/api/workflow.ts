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

const getWorkflowTemplates = (tenant, { immediate, options }) => useAPIAsyncState(KeyMaps.workflow.WORKFLOW_TEMPLATES, 'GET', {
  options,
  pathVariables: {
    tenant
  }
}, { immediate })

const getWorkflowTemplateByName = (tenant, name, { immediate, options }) => useAPIAsyncState(KeyMaps.workflow.WORKFLOW_TEMPLATES_BY_NAME, 'GET', {
  options,
  pathVariables: {
    tenant,
    name
  }
}, { immediate })

const getArchivedWorkflowList = (labelSelector, { immediate, options }) => useAPIAsyncState(KeyMaps.workflow.ARCHIVED_WORKFLOW, 'GET', {
  options,
  params: {
    "listOptions.labelSelector": labelSelector,
    "listOptions.limit": 100
  }

}, { immediate })

export const Workflows = {
  URL,
  List,
  getArchivedWorkflowList,
  getWorkflowTemplateByName,
  getWorkflowTemplates
};
