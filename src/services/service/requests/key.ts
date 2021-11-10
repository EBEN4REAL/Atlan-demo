import { getAPIPath, PathParams } from '~/services/api/common'
import { BASE_PATH } from '..'

export const map = {
    LIST_REQUESTS: () => getAPIPath(BASE_PATH, '/requests'),
    ACT_ON_REQUEST: ({ id }: PathParams) =>
        getAPIPath(BASE_PATH, `/requests/${id}/action`),
}
