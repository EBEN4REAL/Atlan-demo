import { getAPIPath } from '~/api'

export const LIST_REQUESTS = 'LIST_REQUESTS'
export const ACT_ON_REQUEST = 'ACT_ON_REQUEST'

const requestsMap: Record<string, (...params: any) => string> = {
    [LIST_REQUESTS]: () => getAPIPath('auth', '/requests'),
    [ACT_ON_REQUEST]: ({ id }) => getAPIPath('auth', `/requests/${id}/action`),
}

export default requestsMap
