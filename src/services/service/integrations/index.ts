import { Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'
import { useOptions } from '~/services/api/common'

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
// const CreateSlackApp = (body: Ref, options: useOptions) => useAPI(map.CREATE_SLACK_APP, 'POST', { body }, options);


export const Integrations = {
    List, getIntegrationById, UpdateIntegration, archiveIntegration, ShareSlack, UnfurlSlackMessage, ListConfigs, CreateSlackApp
}
