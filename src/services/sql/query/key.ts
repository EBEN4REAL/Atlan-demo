import { getAPIPath, PathParams } from '~/services/api/common'

import { BASE_PATH } from '..'

export const GET_AUTO_SUGGESTIONS = 'GET_AUTO_SUGGESTIONS'
export const ABORT_QUERY = 'ABORT_QUERY'
export const RUN_QUERY = 'RUN_QUERY'
export const PREVIEW_TABLE = 'PREVIEW_TABLE'
export const TEST_QUERY = 'TEST_QUERY'

export const map = {
    insights: {
        [GET_AUTO_SUGGESTIONS]: () => getAPIPath('sql/info/suggest', ''),
        [ABORT_QUERY]: () => getAPIPath('sql/query/abort', ''),
        [RUN_QUERY]: ({ params }: PathParams) =>
            getAPIPath('api/sql/query', `/stream?${params}`),

        [TEST_QUERY]: () => getAPIPath(BASE_PATH, '/query/test'),
    },
    asset: {
        [PREVIEW_TABLE]: () => getAPIPath('sql', '/query/preview'),
    },
}
