import { getAPIPath } from '~/services/api/common'
import { BASE_PATH } from '..'

export const LIST_QUERY_LOGS = 'LIST_QUERY_LOGS'

export const map = {
    GET_FILE: ({ id, name }) =>
        getAPIPath(
            BASE_PATH,
            `/files/${'ad418b87-1f7f-4ff7-9627-345bc0d0bd55'}?contentDisposition=attachment&name=${'test-md'}`
        ),
}
