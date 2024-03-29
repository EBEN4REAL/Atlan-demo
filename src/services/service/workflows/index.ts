import { useAPI } from '~/services/api/useAPI'
import { map } from './key'
import {
    ArchivedRunsResponse,
    LiveRunsResponse,
} from '~/types/workflow/runs.interface'
import { useOptions } from '~/services/api/common'

export const URL = {
    WorkflowList: '/workflows/default',
    ArchiveList: '/archived-workflows',
}

const worfklowPackageIndex = (body?, options?: useOptions) =>
    useAPI(
        map.WORKFLOW_TEMPLATE_INDEX,
        'POST',
        {
            body,
        },
        options || {}
    )

const worfklowRunIndex = (pathVariables?, body?, options?: useOptions) =>
    useAPI(
        map.WORKFLOW_RUN_INDEX,
        'POST',
        {
            pathVariables,
            body,
        },
        options || {}
    )

const worfklowIndex = (pathVariables?, body?, options?: useOptions) =>
    useAPI(
        map.WORKFLOW_INDEX,
        'POST',
        {
            pathVariables,
            body,
        },
        options || {}
    )

const updateWorkflowByName = (pathVariables?, body?, options?: useOptions) =>
    useAPI(
        map.WORKFLOW_UPDATE_BY_NAME,
        'POST',
        { pathVariables, body },
        options || {}
    )

const retryRun = (pathVariables, options?: useOptions) =>
    useAPI(
        map.RETRY_RUN,
        'POST',
        {
            pathVariables,
        },
        options || {}
    )
const stopRun = (pathVariables, options?: useOptions) =>
    useAPI(
        map.STOP_RUN,
        'POST',
        {
            pathVariables,
        },
        options || {}
    )

const getArchivedRunLogs = (pathVariables, params, options?: useOptions) =>
    useAPI(
        map.RUN_LOGS,
        'GET',
        {
            params,
            pathVariables,
        },
        options || {}
    )

// const List = (params?: any, options?: AxiosRequestConfig) =>
//     getAxiosClient().get(getAPIPath(serviceAlias, URL.WorkflowList), {
//         params,
//         ...options,
//     })

const getWorkflows = ({ immediate, options, params }) =>
    useAPI(
        map.WORKFLOW,
        'GET',
        {
            options,
            params,
        },
        { options, asyncOptions: { immediate } }
    )

const getWorkflowPackages = ({ pathVariables, options, params }) =>
    useAPI(
        map.WORKFLOW_TEMPLATE,
        'GET',
        {
            pathVariables,
            params,
        },
        options || {}
    )

const getWorkflowPackagesByName = ({ pathVariables, options }) => {
    console.log('getWorkflowPackagesByName', pathVariables, options)
    return useAPI(
        map.WORKFLOW_TEMPLATE_NAME,
        'GET',
        {
            pathVariables,
        },
        options || {}
    )
}

const createWorkflowPackage = ({ params, body, options }) =>
    useAPI(
        map.CREATE_WORKFLOW,
        'POST',
        {
            params,
            body,
        },
        options || {}
    )

const getWorkflowPackagesConfigMap = ({ params, options }) =>
    useAPI(
        map.WORKFLOW_CONFIG_MAP,
        'GET',
        {
            params,
        },
        options || {}
    )

const getWorkflowPackagesConfigMapByName = ({ pathVariables, options }) => {
    console.log('getWorkflowPackagesConfigMapByName', pathVariables)
    return useAPI(
        map.WORKFLOW_CONFIG_MAP_NAME,
        'GET',
        {
            pathVariables,
        },
        options || {}
    )
}

const getWorkflowTemplates = ({ pathVariables, immediate, options, params }) =>
    useAPI(
        map.WORKFLOW_TEMPLATE,
        'GET',
        {
            options,
            pathVariables,
            params,
        },
        { options, asyncOptions: { immediate } }
    )

const getWorkflowConfigMap = ({ pathVariables, immediate, options, params }) =>
    useAPI(
        map.WORKFLOW_CONFIG_MAP,
        'GET',
        {
            pathVariables,
            options,
            params,
        },
        { options, asyncOptions: { immediate } }
    )

// ! depreciated, use filter on /workflowtemplate
const getWorkflowTemplateByName = ({ immediate, options, pathVariables }) =>
    useAPI(
        map.WORKFLOW_TEMPLATE_NAME,
        'GET',
        {
            pathVariables,
        },
        { asyncOptions: { immediate } }
    )

const getRunList = (reqOptions) =>
    useAPI<LiveRunsResponse>(map.WORKFLOW_RUN, 'GET', reqOptions, {})

const getArtifacts = (reqOptions) =>
    useAPI(map.GET_ARTIFACTS, 'GET', reqOptions, {})

const getArchivedRunList = (reqOptions) =>
    useAPI<ArchivedRunsResponse>(
        map.ARCHIVED_WORKFLOW_RUN,
        'GET',
        reqOptions,
        {}
    )

const deleteWorkflowByName = ({ pathVariables, immediate, options }) =>
    useAPI(
        map.DELETE_WORKFLOW,
        'POST',
        {
            options,
            pathVariables,
        },
        { asyncOptions: { immediate } }
    )

const runWorkflowByName = ({ body, immediate, options }) =>
    useAPI(
        map.RUN_WORKFLOW,
        'POST',
        {
            body,
            options,
        },
        { asyncOptions: { immediate } }
    )

const createWorkflow = ({ params, body, immediate, options }) =>
    useAPI(
        map.CREATE_WORKFLOW,
        'POST',
        {
            params,
            body,
            options,
        },
        { asyncOptions: { immediate } }
    )

const deleteSchedule = ({ pathVariables }) =>
    useAPI(
        map.DELETE_SCHEDULE,
        'POST',
        {
            pathVariables,
        },
        {}
    )

const updateSchedule = ({ body, pathVariables }) =>
    useAPI(
        map.UPDATE_SCHEDULE,
        'POST',
        {
            body,
            pathVariables,
        },
        {}
    )

const addSchedule = ({ body }) => useAPI(map.SCHEDULES, 'POST', { body }, {})

const getSchedules = ({ params }) =>
    useAPI(map.SCHEDULES, 'GET', { params }, {})

export const Workflows = {
    URL,
    // List,
    retryRun,
    stopRun,
    getRunList,
    getArchivedRunList,
    updateWorkflowByName,
    getWorkflows,
    createWorkflow,
    deleteWorkflowByName,
    runWorkflowByName,
    getWorkflowTemplates,
    getWorkflowPackages,
    getWorkflowPackagesByName,
    getWorkflowPackagesConfigMap,
    getWorkflowConfigMap,
    getWorkflowTemplateByName,
    deleteSchedule,
    updateSchedule,
    addSchedule,
    getSchedules,
    getArchivedRunLogs,
    getArtifacts,
    createWorkflowPackage,
    getWorkflowPackagesConfigMapByName,
    worfklowPackageIndex,
    worfklowRunIndex,
    worfklowIndex,
}
