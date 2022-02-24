import { Ref } from 'vue'
import { map, UPDATE_SLACK_CONFIG } from './key'
import { useAPI } from '~/services/api/useAPI'
import { useOptions } from '~/services/api/common'
import { JiraListProjectsResponse } from '~/types/integrations/jira.types';

// Integration & IntegrationTypes
const List = (params: Ref, options = {}) => useAPI(map.LIST_INTEGRATIONS, 'GET', { params }, options);
const ListConfigs = (params: Ref, options = {}) => useAPI(map.LIST_INTEGRATIONS_CONFIG, 'GET', { params }, options);
const getIntegrationById = (pathVariables: Ref) => useAPI(map.GET_INTEGRATION, 'GET', { pathVariables }, {});
const UpdateIntegration = (pathVariables: Ref, body, options: useOptions) => useAPI(map.UPDATE_INTEGRATION, 'POST', { pathVariables, body }, options);
const archiveIntegration = (pathVariables: Ref, options: useOptions) => useAPI(map.ARCHIVE_INTEGRATION, 'POST', { pathVariables }, options);

// Slack
const ShareSlack = (body: Ref, options: useOptions) => useAPI(map.SHARE_SLACK, 'POST', { body }, options);
const UnfurlSlackMessage = (body, options: useOptions) => useAPI(map.UNFURL_SLACK_MESSAGE, 'POST', { body }, options);
const CreateSlackApp = (body: Ref, options) => useAPI(map.CREATE_SLACK_APP, 'POST', { body }, options);
const UpdateSlackConfig = (pathVariables: Ref, body, options: useOptions) => useAPI(map.UPDATE_SLACK_CONFIG, 'POST', { pathVariables, body }, options);

// Jira
const jiraListProjects = (options = {}) =>
    useAPI<JiraListProjectsResponse>(map.JIRA_LIST_PROJECTS, 'GET', {}, options);
const jiraListIssueTypes = <T>(options = {}) =>
    useAPI<T>(map.JIRA_LIST_ISSUE_TYPES, 'GET', {}, options);
const jiraGetIssueProperty = (params: Ref<{ issue: string, property: string }>, options = {}) =>
    useAPI(map.JIRA_GET_ISSUE_PROPERTY, 'GET', { params }, options);
const jiraGetIssueConfigurations = (pathVariables: Ref<{ projectKey: string }>, options = {}) =>
    useAPI(map.JIRA_GET_ISSUE_CONFIGURATIONS, 'GET', { pathVariables }, options);
const jiraSearch = <T>(body: Ref, options = {}) =>
    useAPI<T>(map.JIRA_SEARCH, 'POST', { body }, options);
const jiraLinkIssue = (body: Ref, params: Ref<{ id: string }>, options = {}) =>
    useAPI(map.JIRA_LINK_ISSUE, 'POST', { body, params }, options);
const jiraUnlinkIssue = (body: Ref, params: Ref<{ id: string }>, options = {}) =>
    useAPI(map.JIRA_UNLINK_ISSUE, 'POST', { body, params }, options);
const jiraCreateIssue = (body: Ref, options = {}) =>
    useAPI(map.JIRA_CREATE_ISSUE, 'POST', { body }, options);

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
    jiraGetIssueConfigurations,
    jiraSearch,
    jiraLinkIssue,
    jiraUnlinkIssue,
    jiraCreateIssue
}
