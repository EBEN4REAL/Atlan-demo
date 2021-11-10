import { getAPIPath, PathParams } from '~/services/api/common'

import { BASE_PATH } from '..'

export const SCHEDULES = 'SCHEDULES'
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
export const ARCHIVED_WORKFLOW_RUN_LOGS = 'ARCHIVED_WORKFLOW_RUN_LOGS'

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
    [WORKFLOW]: () => getAPIPath(BASE_PATH, '/workflows'),
    [RUN_WORKFLOW]: () => getAPIPath(BASE_PATH, '/workflows/submit'),
    [DELETE_WORKFLOW]: ({ name }: PathParams) =>
        getAPIPath(BASE_PATH, `/workflows/${name}/archive`),
    [WORKFLOW_UPDATE_BY_NAME]: ({ name }: PathParams) =>
        getAPIPath(BASE_PATH, `/workflows/${name}`),
    [WORKFLOW_RUN]: () => getAPIPath(BASE_PATH, '/runs'),
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
    [ARCHIVED_WORKFLOW_RUN_LOGS]: ({ id, params }: PathParams) =>
        getAPIPath(BASE_PATH, `/runs/archived/${id}/logs?${params || ''}`),
}
