import { getAPIPath } from '~/api'

export const GET_ASSET_AUDIT = 'GET_ASSET_AUDIT'
export const BASIC_SEARCH = 'BASIC_SEARCH'
export const GET_ASSET_RELATIONSHIP = 'GET_ASSET_RELATIONSHIP'
export const PREVIEW_TABLE = 'PREVIEW_TABLE'
export const GET_ENTITY = 'GET_ENTITY'

const groupsMap: Record<string, (...params: any) => string> = {
    [GET_ASSET_AUDIT]: ({ guid }: Record<string, string>) =>
        getAPIPath('meta', `/entity/${guid}/audit`),
    [BASIC_SEARCH]: () => getAPIPath('meta', '/search/basic'),
    [GET_ASSET_RELATIONSHIP]: () => getAPIPath('meta', '/search/relationship'),
    [PREVIEW_TABLE]: () => getAPIPath('query', '/preview'),
    [GET_ENTITY]: ({ guid }) => getAPIPath('meta', `/entity/guid/${guid}`),
}

export default groupsMap
