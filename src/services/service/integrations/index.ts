import { Ref } from 'vue'
import { map, UPDATE_SLACK_CONFIG } from './key'
import { useAPI } from '~/services/api/useAPI'
import { useOptions } from '~/services/api/common'
import { JiraListProjectsResponse } from '~/types/integrations/jira.types'

// Integration & IntegrationTypes
const List = (params: Ref, options = {}) =>
    useAPI(map.LIST_INTEGRATIONS, 'GET', { params }, options)
const ListConfigs = (params: Ref, options = {}) =>
    useAPI(map.LIST_INTEGRATIONS_CONFIG, 'GET', { params }, options)
const getIntegrationById = (pathVariables: Ref) =>
    useAPI(map.GET_INTEGRATION, 'GET', { pathVariables }, {})
const UpdateIntegration = (pathVariables: Ref, body, options: useOptions) =>
    useAPI(map.UPDATE_INTEGRATION, 'POST', { pathVariables, body }, options)
const archiveIntegration = (pathVariables: Ref, options: useOptions) =>
    useAPI(map.ARCHIVE_INTEGRATION, 'POST', { pathVariables }, options)

// Slack
const ShareSlack = (body: Ref, options: useOptions) =>
    useAPI(map.SHARE_SLACK, 'POST', { body }, options)
const UnfurlSlackMessage = (body, options: useOptions) =>
    useAPI(map.UNFURL_SLACK_MESSAGE, 'POST', { body }, options)
const CreateSlackApp = (body: Ref, options) =>
    useAPI(map.CREATE_SLACK_APP, 'POST', { body }, options)
const UpdateSlackConfig = (pathVariables: Ref, body, options: useOptions) =>
    useAPI(map.UPDATE_SLACK_CONFIG, 'POST', { pathVariables, body }, options)
const AskQuestionSlack = (body: Ref, options: useOptions) =>
    useAPI(map.ASK_QUESTION_SLACK, 'POST', { body }, options)
const AtlanBotCheckInChannels = (body: Ref, options: useOptions) =>
    useAPI(map.ATLAN_BOT_CHECK, 'POST', { body }, options)

// Jira
const jiraListProjects = (params, options = {}) =>
    useAPI<JiraListProjectsResponse>(
        map.JIRA_LIST_PROJECTS,
        'GET',
        { params },
        options
    )
const jiraListIssueTypes = <T>(options = {}) =>
    useAPI<T>(map.JIRA_LIST_ISSUE_TYPES, 'GET', {}, options)
const jiraGetIssueProperty = (
    params: Ref<{ issue: string; property: string }>,
    options = {}
) => useAPI(map.JIRA_GET_ISSUE_PROPERTY, 'GET', { params }, options)
const jiraGetProjectConfigurations = (
    params: Ref<{ projectKey: string }>,
    options = {}
) => useAPI(map.JIRA_GET_ISSUE_CONFIGURATIONS, 'GET', { params }, options)
const jiraSearch = <T>(body: Ref, options = {}) =>
    useAPI<T>(map.JIRA_SEARCH, 'POST', { body }, options)
const jiraLinkIssue = (
    body: Ref,
    pathVariables: Ref<{ id: string }>,
    options = {}
) => useAPI(map.JIRA_LINK_ISSUE, 'POST', { body, pathVariables }, options)
const jiraUnlinkIssue = (
    body: Ref,
    pathVariables: Ref<{ id: string }>,
    options = {}
) => useAPI(map.JIRA_UNLINK_ISSUE, 'POST', { body, pathVariables }, options)
const jiraCreateIssue = (body: Ref, options = {}) =>
    useAPI(map.JIRA_CREATE_ISSUE, 'POST', { body }, options)

export const Integrations = {
    List,
    getIntegrationById,
    UpdateIntegration,
    archiveIntegration,
    ShareSlack,
    UnfurlSlackMessage,
    UpdateSlackConfig,
    ListConfigs,
    CreateSlackApp,
    jiraListProjects,
    jiraListIssueTypes,
    jiraGetIssueProperty,
    jiraGetProjectConfigurations,
    jiraSearch,
    jiraLinkIssue,
    jiraUnlinkIssue,
    jiraCreateIssue,
    AskQuestionSlack,
    AtlanBotCheckInChannels,
}
