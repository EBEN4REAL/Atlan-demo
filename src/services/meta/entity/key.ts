import { getAPIPath, PathParams } from '~/services/api/common'

import { BASE_PATH } from '..'

export const ENTITY_BULK_UPDATE = 'ENTITY_BULK_UPDATE'
export const ENTITY_UPDATE = 'ENTITY_UPDATE'
export const GET_ASSET_AUDIT = 'GET_ASSET_AUDIT'
export const ENTITY_SET_CLASSIFICATIONS = 'ENTITY_SET_CLASSIFICATIONS'
export const GET_ENTITY = 'GET_ENTITY'
export const GET_ASSET_RELATIONSHIP = 'GET_ASSET_RELATIONSHIP'
export const GET_ASSET_AUDIT_SEARCH = 'GET_ASSET_AUDIT_SEARCH'

export const map = {
    [ENTITY_BULK_UPDATE]: () => getAPIPath(BASE_PATH, '/entity/bulk'),
    [ENTITY_UPDATE]: () => getAPIPath(BASE_PATH, '/entity'),
    [GET_ASSET_AUDIT]: ({ guid }: PathParams) =>
        getAPIPath('meta', `/entity/${guid}/audit`),
    [GET_ASSET_AUDIT_SEARCH]: ({ guid }: PathParams) =>
        getAPIPath('meta', `/entity/${guid}/auditSearch`),
    [ENTITY_SET_CLASSIFICATIONS]: () =>
        getAPIPath(BASE_PATH, '/entity/bulk/setClassifications'),
    [GET_ENTITY]: ({ guid }: PathParams) =>
        getAPIPath(BASE_PATH, `/entity/guid/${guid}`),
    [GET_ASSET_RELATIONSHIP]: () =>
        getAPIPath(BASE_PATH, '/search/relationship'),
}
