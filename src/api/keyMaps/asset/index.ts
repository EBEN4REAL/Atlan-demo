import { getAPIPath } from '~/api'

export const GET_ASSET_AUDIT = 'GET_ASSET_AUDIT'
export const BASIC_SEARCH = 'BASIC_SEARCH'
export const GET_ASSET_RELATIONSHIP = 'GET_ASSET_RELATIONSHIP'
export const PREVIEW_TABLE = 'PREVIEW_TABLE'

const groupsMap: Record<string, (...params: any) => string> = {
    [GET_ASSET_AUDIT]: ({ guid }: Record<string, string>) =>
        getAPIPath('auth/atlas', `/entity/${guid}/audit`),
    [BASIC_SEARCH]: () => getAPIPath('auth/atlas', '/search/basic'),
    [GET_ASSET_RELATIONSHIP]: () =>
        getAPIPath('auth/atlas', '/search/relationship'),
    [PREVIEW_TABLE]: () => getAPIPath('query', '/preview'),
}

export default groupsMap
