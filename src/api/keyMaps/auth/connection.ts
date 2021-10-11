import { getAPIPath } from '~/api'

export const TEST_NETWORK = 'LIST_GROUPS'
export const Setup = 'Setup'

export const CONNECTION_SETUP = 'CONNECTION_SETUP'
export const CONNECTION_TEST_NETWORK = 'CONNECTION_TEST_NETWORK'
export const CONNECTION_ARCHIVE = 'CONNECTION_ARCHIVE'

const groupsMap: Record<string, (...params: any) => string> = {
    [TEST_NETWORK]: () => getAPIPath('service', '/connections/test'),
    [Setup]: () => getAPIPath('service', '/connections'),
    [CONNECTION_SETUP]: () => getAPIPath('meta', `/connections/setup`),
    [CONNECTION_TEST_NETWORK]: () => getAPIPath('service', `/connections/test`),
    [CONNECTION_ARCHIVE]: ({ id }) =>
        getAPIPath('service', `/connections/${id}/archive`),
}

export default groupsMap
