
import { useAPI } from '~/services/api/useAPI'
import { map } from './key'

export const URL = {
    WorkflowList: '/workflows/default',
    ArchiveList: '/archived-workflows',
}

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

const updateWorkflowByName = (name, body, { immediate, options }) =>
    useAPI(
        map.WORKFLOW_UPDATE_BY_NAME,
        'POST',
        {
            options,
            body,
            pathVariables: {
                name,
            },
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
            options,
        },
        { asyncOptions: { immediate } }
    )

const retryRun = (pathVariables) =>
    useAPI(
        map.RETRY_RUN,
        'POST',
        {
            pathVariables,
        },
        {}
    )

const stopRun = (pathVariables) =>
    useAPI(
        map.STOP_RUN,
        'POST',
        {
            pathVariables,
        },
        {}
    )

const getRunList = (reqOptions) =>
    useAPI(map.WORKFLOW_RUN, 'GET', reqOptions, {})

const getArchivedRunList = (reqOptions) =>
    useAPI(map.ARCHIVED_WORKFLOW_RUN, 'GET', reqOptions, {})

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
    useAPI(map.DELETE_SCHEDULE, 'POST', {
        pathVariables,
    }, {})

const updateSchedule = ({ body, pathVariables }) =>
    useAPI(map.UPDATE_SCHEDULE, 'POST', {
        body,
        pathVariables,
    }, {})

const addSchedule = ({ body }) => useAPI(map.SCHEDULES, 'POST', { body }, {})

const getSchedules = ({ params }) =>
    useAPI(map.SCHEDULES, 'GET', { params }, {})

const getArchivedRunLogs = (id, { immediate, options, params }) =>
    useAPI(
        map.ARCHIVED_WORKFLOW_RUN_LOGS,
        'GET',
        {
            options,
            params,
            pathVariables: {
                id,
                isArchived: true, // TODO
            },
        },
        { asyncOptions: { immediate } }
    )

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
    getWorkflowConfigMap,
    getWorkflowTemplateByName,
    deleteSchedule,
    updateSchedule,
    addSchedule,
    getSchedules,
    getArchivedRunLogs,
}
