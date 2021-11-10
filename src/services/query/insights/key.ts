import { getAPIPath, PathParams } from '~/services/api/common'
import { BASE_PATH } from '..'

export const GET_AUTO_SUGGESTIONS = 'GET_AUTO_SUGGESTIONS'
export const ABORT_QUERY = 'ABORT_QUERY'
export const RUN_QUERY = 'RUN_QUERY'

export const map = {
    [GET_AUTO_SUGGESTIONS]: () => getAPIPath(BASE_PATH, '/info/suggest'),
    [ABORT_QUERY]: () => getAPIPath(BASE_PATH, '/query/abort'),
    [RUN_QUERY]: ({ params }: PathParams) =>
        getAPIPath(`api/${BASE_PATH}`, `/query/stream?${params}`),
}
