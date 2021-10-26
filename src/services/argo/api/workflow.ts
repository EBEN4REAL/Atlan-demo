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
        KeyMaps.workflow.WORKFLOW_TEMPLATE,
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

const getRunList = (labelSelector, { immediate, options }) =>
    useAPISWRV(
        KeyMaps.workflow.WORKFLOW_RUN,
        'GET',
        `getRunList${Math.random().toString(36).substring(2, 15)}`,
        {
            options,
            pathVariables: {
                labelSelector,
            },
        }
        // { immediate }
    )

const getArchivedRunList = (filter, { immediate, options }) =>
    useAPIAsyncState(
        KeyMaps.workflow.ARCHIVED_WORKFLOW_RUN,
        'GET',
        {
            options,
            pathVariables: {
                filter,
            },
        },
        { immediate }
    )

const runWorkflowByName = ({ body, immediate, options }) =>
    useAPIAsyncState(
        KeyMaps.workflow.RUN_WORKFLOW,
        'POST',
        {
            body,
            options,
        },
        { immediate }
    )

const createWorkflow = ({ body, immediate, options }) =>
    useAPIAsyncState(
        KeyMaps.workflow.CREATE_WORKFLOW,
        'POST',
        {
            body,
            options,
        },
        { immediate }
    )

export const Workflows = {
    URL,
    List,
    getRunList,
    getArchivedRunList,
    updateWorkflowByName,
    getWorkflowByName,
    getWorkflows,
    createWorkflow,
    runWorkflowByName,
    getWorkflowTemplates,
    getWorkflowConfigMap,
    getWorkflowTemplateByName,
}
