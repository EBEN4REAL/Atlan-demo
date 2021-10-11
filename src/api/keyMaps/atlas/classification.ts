import { getAPIPath } from '~/api'

export const GET_CLASSIFICATION_LIST = 'GET_CLASSIFICATION_LIST'
export const CREATE_CLASSIFICATION = 'CREATE_CLASSIFICATION'
export const BASIC_SEARCH = 'BASIC_SEARCH'
export const UPDATE_CLASSIFICATION = 'UPDATE_CLASSIFICATION'
export const ARCHIVE_CLASSIFICATION = 'ARCHIVE_CLASSIFICATION'
export const LINK_CLASSIFICATION = 'LINK_CLASSIFICATION'

const classificationMap: Record<string, (...params: any) => string> = {
    [GET_CLASSIFICATION_LIST]: () =>
        getAPIPath('meta', '/types/typedefs?type=classification'),
    [CREATE_CLASSIFICATION]: () => getAPIPath('meta', '/types/typedefs'),
    [BASIC_SEARCH]: () => getAPIPath('meta', '/search/basic'),
    [UPDATE_CLASSIFICATION]: () => getAPIPath('meta', '/types/typedefs'),
    [ARCHIVE_CLASSIFICATION]: ({
        typeName,
        entityGuid,
    }: Record<string, string>) =>
        getAPIPath(
            'meta',
            `/entity/guid/${entityGuid}/classification/${typeName}`
        ),
    [LINK_CLASSIFICATION]: ({ entityGuid }: Record<string, string>) =>
        getAPIPath('meta', `/entity/guid/${entityGuid}/classifications`),
}

export default classificationMap
