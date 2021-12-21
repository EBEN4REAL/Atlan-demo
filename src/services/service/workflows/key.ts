import { getAPIPath, PathParams } from '~/services/api/common'

import { BASE_PATH } from '..'

export const SCHEDULES = 'SCHEDULES'
export const CREATE_WORKFLOW = 'CREATE_WORKFLOW'
export const UPDATE_SCHEDULE = 'UPDATE_SCHEDULE'
export const DELETE_SCHEDULE = 'DELETE_SCHEDULE'
export const RETRY_RUN = 'RETRY_RUN'
export const STOP_RUN = 'STOP_RUN'
export const WORKFLOW = 'WORKFLOW'
export const RUN_WORKFLOW = 'RUN_WORKFLOW'
export const DELETE_WORKFLOW = 'DELETE_WORKFLOW'
export const WORKFLOW_UPDATE_BY_NAME = 'WORKFLOW_UPDATE_BY_NAME'
export const WORKFLOW_RUN = 'WORKFLOW_RUN'
export const ARCHIVED_WORKFLOW_RUN = 'ARCHIVED_WORKFLOW_RUN'
export const LIVE_WORKFLOW_RUN = 'LIVE_WORKFLOW_RUN'
export const WORKFLOW_TEMPLATE_NAME = 'WORKFLOW_TEMPLATE_NAME'
export const WORKFLOW_TEMPLATE = 'WORKFLOW_TEMPLATE'
export const WORKFLOW_CONFIG_MAP = 'WORKFLOW_CONFIG_MAP'
export const WORKFLOW_CONFIG_MAP_NAME = 'WORKFLOW_CONFIG_MAP_NAME'
export const ARCHIVED_WORKFLOW_RUN_LOGS = 'ARCHIVED_WORKFLOW_RUN_LOGS'
export const GET_ARTIFACTS = 'GET_ARTIFACTS'

export const WORKFLOW_TEMPLATE_INDEX = 'WORKFLOW_TEMPLATE_INDEX'
export const WORKFLOW_RUN_INDEX = 'WORKFLOW_RUN_INDEX'

export const map = {
    [SCHEDULES]: () => getAPIPath(BASE_PATH, '/workflows/schedules'),
    [UPDATE_SCHEDULE]: ({ name }: PathParams) =>
        getAPIPath(BASE_PATH, `/workflows/schedules/${name}`),
    [DELETE_SCHEDULE]: ({ name }: PathParams) =>
        getAPIPath(BASE_PATH, `/workflows/schedules/${name}/archive`),
    [RETRY_RUN]: ({ name }: PathParams) =>
        getAPIPath(BASE_PATH, `/runs/${name}/retry`),
    [STOP_RUN]: ({ name }: PathParams) =>
        getAPIPath(BASE_PATH, `/runs/${name}/stop`),
    [CREATE_WORKFLOW]: () => getAPIPath('/service', `/workflows`),
    [WORKFLOW]: () => getAPIPath(BASE_PATH, '/workflows'),
    [RUN_WORKFLOW]: () => getAPIPath(BASE_PATH, '/workflows/submit'),
    [DELETE_WORKFLOW]: ({ name }: PathParams) =>
        getAPIPath(BASE_PATH, `/workflows/${name}/archive`),
    [WORKFLOW_UPDATE_BY_NAME]: ({ name }: PathParams) =>
        getAPIPath(BASE_PATH, `/workflows/${name}`),
    [WORKFLOW_RUN]: () => getAPIPath(BASE_PATH, '/runs'),
    [GET_ARTIFACTS]: ({ workflowName, nodeName, outputName }: PathParams) =>
        getAPIPath(
            BASE_PATH,
            `/runs/${workflowName}/${nodeName}/artifacts/${outputName}?contentDisposition=inline`
        ),
    [ARCHIVED_WORKFLOW_RUN]: () => getAPIPath(BASE_PATH, `/runs/archived`),
    [LIVE_WORKFLOW_RUN]: ({ workflowTemplate }: PathParams) =>
        getAPIPath(
            BASE_PATH,
            `runs?limit=10&labelSelector=workflows.argoproj.io/workflow-template=${workflowTemplate}`
        ),
    [WORKFLOW_TEMPLATE_NAME]: ({ name }: PathParams) =>
        getAPIPath(BASE_PATH, `/workflowtemplates/${name}`),
    [WORKFLOW_TEMPLATE]: () => getAPIPath(BASE_PATH, '/workflowtemplates'),
    [WORKFLOW_CONFIG_MAP]: () => getAPIPath(BASE_PATH, '/configmaps'),
    [WORKFLOW_CONFIG_MAP_NAME]: ({ name }: PathParams) =>
        getAPIPath(BASE_PATH, `/configmaps/${name}`),
    [ARCHIVED_WORKFLOW_RUN_LOGS]: ({ id, params }: PathParams) =>
        getAPIPath(BASE_PATH, `/runs/archived/${id}/logs?${params || ''}`),

    [WORKFLOW_TEMPLATE_INDEX]: () =>
        getAPIPath(BASE_PATH, `/workflowtemplates/index`),
    [WORKFLOW_RUN_INDEX]: () => getAPIPath(BASE_PATH, `/runs/index`),
}
