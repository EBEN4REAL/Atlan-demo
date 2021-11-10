// import { AxiosRequestConfig } from 'axios'
// import { getAPIPath, getAxiosClient } from '~/api'
// import { KeyMaps } from '~/api/keyMap'
import { useAPI } from '~/services/api/useAPI'
import { map } from './key'

// const serviceAlias = 'auth/argo'

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
            params,
        },
        { options, asyncOptions: {immediate} }
    )

// const getWorkflowTemplates = ({ pathVariables, immediate, options, params }) =>
//     useAPIAsyncState(
//         KeyMaps.workflow.WORKFLOW_TEMPLATE,
//         'GET',
//         {
//             options,
//             pathVariables,
//             params,
//         },
//         { immediate }
//     )

// const getWorkflowConfigMap = ({ pathVariables, immediate, options, params }) =>
//     useAPIAsyncState(
//         KeyMaps.workflow.WORKFLOW_CONFIG_MAP,
//         'GET',
//         {
//             pathVariables,
//             options,
//             params,
//         },
//         { immediate }
//     )

// const updateWorkflowByName = (name, body, { immediate, options }) =>
//     useAPIAsyncState(
//         KeyMaps.workflow.WORKFLOW_UPDATE_BY_NAME,
//         'POST',
//         {
//             options,
//             body,
//             pathVariables: {
//                 name,
//             },
//         },
//         { immediate }
//     )

// // ! depreciated, use filter on /workflowtemplate
// const getWorkflowTemplateByName = ({ immediate, options, pathVariables }) =>
//     useAPIAsyncState(
//         KeyMaps.workflow.WORKFLOW_TEMPLATE_NAME,
//         'GET',
//         {
//             pathVariables,
//             options,
//         },
//         { immediate }
//     )

// const retryRun = (pathVariables) =>
//     useAPIAsyncState(KeyMaps.workflow.RETRY_RUN, 'POST', {
//         pathVariables,
//     })

// const stopRun = (pathVariables) =>
//     useAPIAsyncState(KeyMaps.workflow.STOP_RUN, 'POST', {
//         pathVariables,
//     })

// const getRunList = (pathVariables, { options, params }) =>
//     useAPISWRV(KeyMaps.workflow.WORKFLOW_RUN, 'GET', 'getRunList', {
//         params,
//         options,
//         pathVariables,
//     })

// const getArchivedRunList = (pathVariables, { options, params }) =>
//     useAPISWRV(
//         KeyMaps.workflow.ARCHIVED_WORKFLOW_RUN,
//         'GET',
//         'getArchivedRunList',
//         {
//             params,
//             options,
//             pathVariables,
//         }
//     )

// const deleteWorkflowByName = ({ pathVariables, immediate, options }) =>
//     useAPIAsyncState(
//         KeyMaps.workflow.DELETE_WORKFLOW,
//         'POST',
//         {
//             options,
//             pathVariables,
//         },
//         { immediate }
//     )

// const runWorkflowByName = ({ body, immediate, options }) =>
//     useAPIAsyncState(
//         KeyMaps.workflow.RUN_WORKFLOW,
//         'POST',
//         {
//             body,
//             options,
//         },
//         { immediate }
//     )

// const createWorkflow = ({ params, body, immediate, options }) =>
//     useAPIAsyncState(
//         KeyMaps.workflow.CREATE_WORKFLOW,
//         'POST',
//         {
//             params,
//             body,
//             options,
//         },
//         { immediate }
//     )

// const deleteSchedule = ({ pathVariables }) =>
//     useAPIAsyncState(KeyMaps.workflow.DELETE_SCHEDULE, 'POST', {
//         pathVariables,
//     })

// const updateSchedule = ({ body, pathVariables }) =>
//     useAPIAsyncState(KeyMaps.workflow.UPDATE_SCHEDULE, 'POST', {
//         body,
//         pathVariables,
//     })

// const addSchedule = ({ body }) =>
//     useAPIAsyncState(KeyMaps.workflow.SCHEDULES, 'POST', { body })

// const getSchedules = ({ params }) =>
//     useAPISWRV(KeyMaps.workflow.SCHEDULES, 'GET', 'getSchedules', { params })

// const getArchivedRunLogs = (id, { immediate, options, params }) =>
//     useAPIAsyncState(
//         KeyMaps.workflow.ARCHIVED_WORKFLOW_RUN_LOGS,
//         'GET',
//         {
//             options,
//             params,
//             pathVariables: {
//                 id,
//                 isArchived: true, // TODO
//             },
//         },
//         { immediate }
//     )

export const Workflows = {
    URL,
    // List,
    // retryRun,
    // stopRun,
    // getRunList,
    // getArchivedRunList,
    // updateWorkflowByName,
    getWorkflows,
    // createWorkflow,
    // deleteWorkflowByName,
    // runWorkflowByName,
    // getWorkflowTemplates,
    // getWorkflowConfigMap,
    // getWorkflowTemplateByName,
    // deleteSchedule,
    // updateSchedule,
    // addSchedule,
    // getSchedules,
    // getArchivedRunLogs,
}
