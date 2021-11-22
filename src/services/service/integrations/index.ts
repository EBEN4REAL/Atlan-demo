import { Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'
import { useOptions } from '~/services/api/common'

const ListTypes = (params: Ref) => useAPI(map.LIST_INTEGRATIONS_TYPES, 'GET', { params }, {});
const List = (params: Ref) => useAPI(map.LIST_INTEGRATIONS, 'GET', { params }, {});
const getIntegrationById = (pathVariables: Ref) => useAPI(map.GET_INTEGRATION, 'GET', { pathVariables }, {});
const UpdateIntegration = (pathVariables: Ref, body, options: useOptions) => useAPI(map.GET_INTEGRATION, 'POST', { pathVariables, body }, options);
const archiveIntegration = (pathVariables: Ref, options: useOptions) => useAPI(map.ARCHIVE_INTEGRATION, 'POST', { pathVariables }, options);


export const Integrations = {
    ListTypes, List, getIntegrationById, UpdateIntegration, archiveIntegration
}
