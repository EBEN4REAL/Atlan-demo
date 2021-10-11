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

const getWorkflows = ({ immediate, options }) =>
    useAPIAsyncState(
        KeyMaps.workflow.WORKFLOW,
        'GET',
        {
            options,
            pathVariables: {},
        },
        { immediate }
    )

const getWorkflowTemplates = ({ immediate, options }) =>
    useAPIAsyncState(
        KeyMaps.workflow.WORKFLOW_TEMPLATE,
        'GET',
        {
            options,
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

export const Workflows = {
    URL,
    List,
    getArchivedWorkflowList,
    getWorkflowByName,
    getWorkflows,
    getArchivedWorkflowRun,
    getWorkflowTemplates
}
