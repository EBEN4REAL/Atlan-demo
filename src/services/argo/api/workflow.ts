import { AxiosRequestConfig } from 'axios'
import { getAPIPath, getAxiosClient } from '~/api'
import { KeyMaps } from '~/api/keyMap'
import { useAPISWRV, useAPIAsyncState } from '~/api/useAPI'

const serviceAlias = 'auth/argo'

export const URL = {
    WorkflowList: '/workflows/default',
    ArchiveList: '/archived-workflows',
}

const List = (params?: any, options?: AxiosRequestConfig) =>
    getAxiosClient().get(getAPIPath(serviceAlias, URL.WorkflowList), {
        params,
        ...options,
    })

const getWorkflows = ({ immediate, options, params }) =>
    useAPIAsyncState(
        KeyMaps.workflow.WORKFLOW,
        'GET',
        {
            options,
            params,
            pathVariables: {},
        },
        { immediate }
    )

const getWorkflowTemplates = ({ immediate, options, params }) =>
    useAPIAsyncState(
        KeyMaps.workflow.WORKFLOW_TEMPLATE,
        'GET',
        {
            options,
            params
        },
        { immediate }
    )

const getWorkflowConfigMap = (pathVariables, { immediate, options, params }) =>
    useAPIAsyncState(
        KeyMaps.workflow.WORKFLOW_CONFIG_MAP,
        'GET',
        {
            options,
            pathVariables
        },
        { immediate }
    )

const getWorkflowByName = (name, { immediate, options }) =>
    useAPIAsyncState(
        KeyMaps.workflow.WORKFLOW_BY_NAME,
        'GET',
        {
            options,
            pathVariables: {
                name,
            },
        },
        { immediate }
    )

const getWorkflowTemplateByName = (name, { immediate, options }) =>
    useAPIAsyncState(
        KeyMaps.workflow.WORKFLOW_TEMPLATE_NAME,
        'GET',
        {
            options,
            pathVariables: {
                name,
            },
        },
        { immediate }
    )

const getArchivedWorkflowList = (params, { immediate, options }) =>
    useAPIAsyncState(
        KeyMaps.workflow.ARCHIVED_WORKFLOW,
        'GET',
        {
            options,
            params,
        },
        { immediate }
    )

const getArchivedWorkflowRun = (guid, { immediate, options }) =>
    useAPIAsyncState(
        KeyMaps.workflow.ARCHIVED_WORKFLOW_RUN,
        'GET',
        {
            options,
            pathVariables: {
                guid,
            },
        },
        { immediate }
    )

const createWorkflow = ({ body, immediate, options }) =>
    useAPIAsyncState(
        KeyMaps.workflow.CREATE_WORKFLOW,
        'POST',
        {
            body,
            options
        },
        { immediate }
    )

export const Workflows = {
    URL,
    List,
    getArchivedWorkflowList,
    getWorkflowByName,
    getWorkflows,
    createWorkflow,
    getArchivedWorkflowRun,
    getWorkflowTemplates,
    getWorkflowConfigMap,
    getWorkflowTemplateByName
}
