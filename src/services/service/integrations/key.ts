import { getAPIPath, PathParams } from '~/services/api/common'
import { BASE_PATH } from '..'

export const LIST_INTEGRATIONS_TYPES = 'LIST_INTEGRATIONS_TYPES'
export const LIST_INTEGRATIONS = 'LIST_INTEGRATIONS'
export const GET_INTEGRATION = 'GET_INTEGRATION'
export const ARCHIVE_INTEGRATION = 'ARCHIVE_INTEGRATION'
export const UPDATE_INTEGRATION = 'UPDATE_INTEGRATION'

export const map = {
    [LIST_INTEGRATIONS_TYPES]: () => getAPIPath(BASE_PATH, '/integration-types'),
    [LIST_INTEGRATIONS]: () => getAPIPath(BASE_PATH, '/integrations'),
    [GET_INTEGRATION]: ({ id }: PathParams) => getAPIPath(BASE_PATH, `/integrations/${id}`),
    [ARCHIVE_INTEGRATION]: ({ id }: PathParams) => getAPIPath(BASE_PATH, `/integrations/${id}/archive`),
    [UPDATE_INTEGRATION]: ({ id }: PathParams) => getAPIPath(BASE_PATH, `/integrations/${id}`),
}
