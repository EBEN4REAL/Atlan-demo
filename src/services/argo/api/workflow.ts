import { AxiosRequestConfig } from 'axios'
import { getAPIPath, getAxiosClient } from '~/api'
import { KeyMaps } from '~/api/keyMap'
import { useAPISWRV, useAPIAsyncState } from '~/services/api/useAPI'

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
        KeyMaps.workflow.WORKFLOW_CONFIG_MAP,
        'GET',
        {
            options,
            params,
        },
        { immediate }
    )

const getWorkflowConfigMap = ({ immediate, options, params }) =>
    useAPIAsyncState(
        KeyMaps.workflow.WORKFLOW_CONFIG_MAP,
        'GET',
        {
            options,
            params,
        },
        { immediate }
    )

const getWorkflowByName = (filter, { immediate, options }) =>
    useAPIAsyncState(
        KeyMaps.workflow.WORKFLOW_BY_NAME,
        'GET',
        {
            options,
            pathVariables: {
                filter,
            },
        },
        { immediate }
    )

const updateWorkflowByName = (name, body, { immediate, options }) =>
    useAPIAsyncState(
        KeyMaps.workflow.WORKFLOW_UPDATE_BY_NAME,
        'POST',
        {
            options,
            body,
            pathVariables: {
                name,
            },
        },
        { immediate }
    )

const getWorkflowTemplateByName = (filter, { immediate, options }) =>
    useAPIAsyncState(
        KeyMaps.workflow.WORKFLOW_TEMPLATE_NAME,
        'GET',
        {
            options,
            pathVariables: {
                filter,
            },
        },
        { immediate }
    )

const getArchivedRunList = (pathVariables, { immediate, options }) =>
    useAPIAsyncState(
        KeyMaps.workflow.ARCHIVED_WORKFLOW_RUN,
        'GET',
        {
            options,
            pathVariables
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

const createWorkflow = ({ params, body, immediate, options }) =>
    useAPIAsyncState(
        KeyMaps.workflow.CREATE_WORKFLOW,
        'POST',
        {
            params,
            body,
            options,
        },
        { immediate }
    )

export const Workflows = {
    URL,
    List,
    getArchivedRunList,
    updateWorkflowByName,
    getWorkflowByName,
    getWorkflows,
    createWorkflow,
    getArchivedWorkflowRun,
    getWorkflowTemplates,
    getWorkflowConfigMap,
    getWorkflowTemplateByName,
}
