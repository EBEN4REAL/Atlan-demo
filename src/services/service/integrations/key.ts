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
    [LIST_INTEGRATIONS_TYPES]: () => getAPIPath("http://localhost:5008", '/integrationtypes'),
    [LIST_INTEGRATIONS]: () => getAPIPath("http://localhost:5008", '/integrations'),
    [SHARE_SLACK]: ({ id }: PathParams) => getAPIPath("http://localhost:5008", `integrations/${id}/action/ShareLinkOnSlack`),
    [GET_INTEGRATION]: ({ id }: PathParams) => getAPIPath("http://localhost:5008", `/integrations/${id}`),
    [ARCHIVE_INTEGRATION]: ({ id }: PathParams) => getAPIPath("http://localhost:5008", `/integrations/${id}/archive`),
    [UPDATE_INTEGRATION]: ({ id }: PathParams) => getAPIPath("http://localhost:5008", `/integrations/${id}`),
    [UNFURL_SLACK_MESSAGE]: ({ id }: PathParams) => getAPIPath("http://localhost:5008", `/integrations/${id}/action/UnfurlSlackMessageLink`),
    [CREATE_SLACK_APP]: () => getAPIPath("http://localhost:5008", `/slack/createapp`),
}
