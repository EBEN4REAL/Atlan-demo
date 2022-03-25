import { getAPIPath, PathParams } from '~/services/api/common'
import { BASE_PATH } from '..'

// Integration & Integration types
export const LIST_INTEGRATIONS_TYPES = 'LIST_INTEGRATIONS_TYPES'
export const LIST_INTEGRATIONS = 'LIST_INTEGRATIONS'
export const LIST_INTEGRATIONS_CONFIG = 'LIST_INTEGRATIONS_CONFIG'
export const GET_INTEGRATION = 'GET_INTEGRATION'
export const ARCHIVE_INTEGRATION = 'ARCHIVE_INTEGRATION'
export const UPDATE_INTEGRATION = 'UPDATE_INTEGRATION'

// Slack
export const SHARE_SLACK = 'SHARE_SLACK'
export const UPDATE_SLACK_CONFIG = 'UPDATE_SLACK_CONFIG'
export const UNFURL_SLACK_MESSAGE = 'UNFURL_SLACK_MESSAGE'
export const CREATE_SLACK_APP = 'CREATE_SLACK_APP'
export const ASK_QUESTION_SLACK = 'ASK_QUESTION_SLACK'

// Jira
export const JIRA_LIST_PROJECTS = 'JIRA_LIST_PROJECTS'
export const JIRA_LIST_ISSUE_TYPES = 'JIRA_LIST_ISSUE_TYPES'
export const JIRA_GET_ISSUE_PROPERTY = 'JIRA_GET_ISSUE_PROPERTY'
export const JIRA_GET_ISSUE_CONFIGURATIONS = 'JIRA_GET_ISSUE_CONFIGURATIONS'
export const JIRA_SEARCH = 'JIRA_SEARCH'
export const JIRA_LINK_ISSUE = 'JIRA_LINK_ISSUE'
export const JIRA_UNLINK_ISSUE = 'JIRA_UNLINK_ISSUE'
export const JIRA_CREATE_ISSUE = 'JIRA_CREATE_ISSUE'



export const map = {
    [LIST_INTEGRATIONS]: () => getAPIPath('/service', '/integrations'),
    [LIST_INTEGRATIONS_CONFIG]: () => getAPIPath('/service', '/integrationtypes/configs'),
    [SHARE_SLACK]: () => getAPIPath('/service', `/slack/share`),
    [ASK_QUESTION_SLACK]: () => getAPIPath('/service', `/slack/question`),
    [GET_INTEGRATION]: ({ id }: PathParams) =>
        getAPIPath('/service', `/integrations/${id}`),
    [ARCHIVE_INTEGRATION]: ({ id }: PathParams) =>
        getAPIPath('/service', `/integrations/${id}/archive`),
    [UPDATE_INTEGRATION]: ({ id }: PathParams) =>
        getAPIPath('/service', `/integrations/${id}`),
    [UPDATE_SLACK_CONFIG]: ({ id }: PathParams) =>
        getAPIPath('/service', `/slack/${id}/config`),
    [UNFURL_SLACK_MESSAGE]: ({ id }: PathParams) =>
        getAPIPath('/service', `/slack/unfurl`),
    [CREATE_SLACK_APP]: () => getAPIPath('/service', `/slack/createapp`),
    [JIRA_LIST_PROJECTS]: () => getAPIPath('/service', `/jira/projects`),
    [JIRA_LIST_ISSUE_TYPES]: () => getAPIPath('/service', `/jira/issueType`),
    [JIRA_GET_ISSUE_PROPERTY]: ({ issue, property }: PathParams) => getAPIPath('/service', `/jira/issue/${issue}/properties/${property}`),
    [JIRA_GET_ISSUE_CONFIGURATIONS]: () => getAPIPath('/service', `/jira/issue/configurations`),
    [JIRA_SEARCH]: () => getAPIPath('/service', `/jira/search`),
    [JIRA_LINK_ISSUE]: ({ id }: PathParams) => getAPIPath('/service', `/jira/issue/link/${id}`),
    [JIRA_UNLINK_ISSUE]: ({ id }: PathParams) => getAPIPath('/service', `/jira/issue/unlink/${id}`),
    [JIRA_CREATE_ISSUE]: () => getAPIPath('/service', `/jira/issue`),
}
