import { getAPIPath } from '~/services/api/common'
import { BASE_PATH } from '..'

export const LIST_QUERY_LOGS = 'LIST_QUERY_LOGS'

export const map = {
    GET_FILE: ({ id, name = '' }) =>
        getAPIPath(
            BASE_PATH,
            `/files/${id}?contentDisposition=attachment&name=${name}`
        ),
    CREATE_FILE: () =>
        getAPIPath(
            BASE_PATH,
            `/files`
        ),
     UPDATE_FILE: ({id}: any) =>
        getAPIPath(
            BASE_PATH,
        `/files/${id}`
        ),
}
