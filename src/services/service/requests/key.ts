import { getAPIPath, PathParams } from '~/services/api/common'
import { BASE_PATH } from '..'

export const map = {
    LIST_REQUESTS: () => getAPIPath(BASE_PATH, '/requests'),
    CREATE_REQUESTS_BULK: () => getAPIPath(BASE_PATH, '/requests/bulk'),
    ACT_ON_REQUEST: ({ id }: PathParams) =>
        getAPIPath(BASE_PATH, `/requests/${id}/action`),
}
