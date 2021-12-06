import { getAPIPath } from '~/services/api/common'

import { BASE_PATH } from '..'

export const TEST_CREDENTIAL = 'TEST_CREDENTIAL'
export const QUERY_CREDENTIAL = 'QUERY_CREDENTIAL'

export const map = {
    [TEST_CREDENTIAL]: () => getAPIPath(BASE_PATH, '/credentials/test'),
    [QUERY_CREDENTIAL]: () => getAPIPath(BASE_PATH, '/credentials/query'),
}
