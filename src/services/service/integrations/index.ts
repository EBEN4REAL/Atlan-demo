import { Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'
import { useAPIPromise } from '~/services/api/useAPIPromise'
import { useOptions } from '~/services/api/common'

// Integration & IntegrationTypes
const ListTypes = (params: Ref) => useAPI(map.LIST_INTEGRATIONS_TYPES, 'GET', { params }, {});
const List = (params: Ref) => useAPI(map.LIST_INTEGRATIONS, 'GET', { params }, {});
const getIntegrationById = (pathVariables: Ref) => useAPI(map.GET_INTEGRATION, 'GET', { pathVariables }, {});
const UpdateIntegration = (pathVariables: Ref, body, options: useOptions) => useAPI(map.UPDATE_INTEGRATION, 'POST', { pathVariables, body }, options);
const archiveIntegration = (pathVariables: Ref, options: useOptions) => useAPI(map.ARCHIVE_INTEGRATION, 'POST', { pathVariables }, options);

// Slack
const ShareSlack = (body: Ref, options: useOptions) => useAPI(map.SHARE_SLACK, 'POST', { body }, options);
const UnfurlSlackMessage = (pathVariables: Ref, body, options: useOptions) => useAPI(map.UNFURL_SLACK_MESSAGE, 'POST', { pathVariables, body }, options);
const CreateSlackApp = (body: Ref) => useAPIPromise(map.CREATE_SLACK_APP(), 'POST', { body });
// const CreateSlackApp = (body: Ref, options: useOptions) => useAPI(map.CREATE_SLACK_APP, 'POST', { body }, options);


export const Integrations = {
    ListTypes, List, getIntegrationById, UpdateIntegration, archiveIntegration, ShareSlack, UnfurlSlackMessage,
    CreateSlackApp
}
