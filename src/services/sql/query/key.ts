import { getAPIPath, PathParams } from '~/services/api/common'

export const GET_AUTO_SUGGESTIONS = 'GET_AUTO_SUGGESTIONS'
export const ABORT_QUERY = 'ABORT_QUERY'
export const RUN_QUERY = 'RUN_QUERY'
export const PREVIEW_TABLE = 'PREVIEW_TABLE'

export const map = {
    insights: {
        [GET_AUTO_SUGGESTIONS]: () => getAPIPath('sql/info/suggest', ''),
        [ABORT_QUERY]: () => getAPIPath('sql/query/abort', ''),
        [RUN_QUERY]: ({ params }: PathParams) => getAPIPath('api/sql/query', `/stream?${params}`),
    },
    asset: {
        [PREVIEW_TABLE]: () => getAPIPath('sql', '/query/preview'),
    },
}
