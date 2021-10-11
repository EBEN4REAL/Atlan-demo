import { getAPIPath } from '~/api'

export const CONNECTION_SETUP = 'CONNECTION_SETUP'
export const CONNECTION_TEST_NETWORK = 'CONNECTION_TEST_NETWORK'
export const CONNECTION_ARCHIVE = 'CONNECTION_ARCHIVE'

const connectionmap: Record<string, (...params: any) => string> = {
    [CONNECTION_SETUP]: () => getAPIPath('meta', `/connections/setup`),
    [CONNECTION_TEST_NETWORK]: () => getAPIPath('service', `/connections/test`),
    [CONNECTION_ARCHIVE]: ({ id }) =>
        getAPIPath('service', `/connections/${id}/archive`),
}

export default connectionmap
