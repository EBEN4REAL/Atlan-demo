import { getAPIPath, PathParams } from '~/services/api/common'
import { BASE_PATH } from '..'

// Integration & Integration types
export const LIST_INTEGRATIONS_TYPES = 'LIST_INTEGRATIONS_TYPES'
export const LIST_INTEGRATIONS = 'LIST_INTEGRATIONS'
export const GET_INTEGRATION = 'GET_INTEGRATION'
export const ARCHIVE_INTEGRATION = 'ARCHIVE_INTEGRATION'
export const UPDATE_INTEGRATION = 'UPDATE_INTEGRATION'

// Slack
export const SHARE_SLACK = 'SHARE_SLACK'
export const UNFURL_SLACK_MESSAGE = 'UNFURL_SLACK_MESSAGE'
export const CREATE_SLACK_APP = 'CREATE_SLACK_APP'

export const map = {
    [LIST_INTEGRATIONS]: () => getAPIPath('/service', '/integrations'),
    [SHARE_SLACK]: () => getAPIPath('/service', `/slack/share`),
    [GET_INTEGRATION]: ({ id }: PathParams) =>
        getAPIPath('/service', `/integrations/${id}`),
    [ARCHIVE_INTEGRATION]: ({ id }: PathParams) =>
        getAPIPath('/service', `/integrations/${id}/archive`),
    [UPDATE_INTEGRATION]: ({ id }: PathParams) =>
        getAPIPath('/service', `/slack/${id}/config`),
    [UNFURL_SLACK_MESSAGE]: ({ id }: PathParams) =>
        getAPIPath('/service', `/slack/unfurl`),
    [CREATE_SLACK_APP]: () => getAPIPath('/service', `/slack/createapp`),
}
